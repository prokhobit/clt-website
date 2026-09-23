/* ════════════════════════════════════════════════════════════════════════════
   CLT · ABOUT US — page script
   ────────────────────────────────────────────────────────────────────────────
   Owns two things: the "Our Team" roster (.au-member), and the hero overlay
   (initHeroOverlay, near the end — the copy comes to rest over the media).

   HOW THE EXPANSION WORKS
     The roster is a twelve-column grid. Opening a card gives it .is-active —
     spanning all twelve and placed at row 1, so it becomes a featured band at
     the top — and gives every other card .is-inactive, shrinking one step so
     more fit per row and those rows get shorter. GSAP Flip animates the whole
     re-sort in one pass. CSS owns the end states; this file only decides which
     is in force.

   WHY THE PAGE NEVER MOVES
     Two things, together:
       1. The grid is pinned to its resting height for the length of the
          interaction. The opened arrangement always needs the same rows or
          fewer, and shrunken rows are shorter, so the content is never taller
          than the lock — the page below the roster cannot move either way.
       2. Flip runs with absolute: true, which lifts every card out of flow
          while it travels so no sibling jumps mid-tween. That is also why the
          height lock has to stay on during the tween: without it the grid
          would briefly have nothing in flow and collapse to nothing.

   ADDING CARDS LATER
     Nothing here counts or caches the cards. Clicks are handled by delegation
     on the grid and the card list is read live, so markup added afterwards —
     by hand, by Webflow, or by a CMS collection list — works with no code
     change at all. If cards are injected after load and you want them to keep
     the scroll-in entrance, call CLT_ABOUT.refresh(). Motion can be retuned by
     setting window.CLT_ABOUT_CONFIG before this file loads.

   CONTRACT WITH THE SITE-WIDE CODE
     · Loads AFTER gsap, ScrollTrigger, Flip, Lenis and clt-core.js.
     · Reads clt-core only through its public surface: CLT.ready, CLT.scrollTo,
       CLT.refresh.
       Nothing is patched or overridden.
     · Uses its own data-au-* hooks, so clt-core's initCardFlip (which binds
       [data-clt-cardflip]) never touches these cards — no double binding.
     · Uses its own entrance tween instead of [data-clt-reveal] on the cards:
       core's reveal leaves a transform/opacity on the element, which would be
       baked into Flip's measurements. Everything is cleared on completion so
       Flip always measures a clean layout.
     · Degrades completely: with no GSAP, no Flip, or prefers-reduced-motion
       the cards still open and close, just without the tween.
   ════════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  if (window.__cltAboutUsReady) return; // idempotent — safe if injected twice
  window.__cltAboutUsReady = true;

  var ROSTER = "[data-au-roster]";
  var MEMBER = "[data-au-member]";
  var TOGGLE = "[data-au-toggle]";
  var CLOSE = "[data-au-close]";

  /* Tunables. Set window.CLT_ABOUT_CONFIG before this script to override. */
  var DEFAULTS = {
    duration: 0.9, // opening morph, seconds
    closeDuration: 0.6, // closing morph
    ease: "expo.out", // long, heavily decelerated — the card arrives and settles
    closeEase: "power3.inOut",
    scrollIntoView: true, // nudge the opened band into view when it would not be
    scrollOffset: 88, // px of clearance above it when that happens
    entrance: true, // staggered assemble as the roster scrolls in
  };

  var CONFIG = (function () {
    var user = window.CLT_ABOUT_CONFIG || {};
    var out = {};
    for (var k in DEFAULTS) out[k] = k in user ? user[k] : DEFAULTS[k];
    return out;
  })();

  /* Flip measures the card boxes and the two things inside that genuinely
     transform — the headshot, and the story as it enters or leaves. The rest
     of the contents reflow with their parent, which is both cheaper and
     smoother than writing to a hundred elements every frame. */
  var FLIP_PARTS = [
    MEMBER,
    ".au-member__portrait",
    ".au-member__line", // leaves the shrunken cards — fades instead of vanishing
    ".au-member__detail",
    ".au-member__close",
  ].join(", ");

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function reducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /* The cards are .clt-panel, which transitions transform and box-shadow in
     CSS. GSAP writes both every frame during the morph and the entrance, and
     a CSS transition on the same property turns each write into a fresh
     320ms ease — the cards trail behind Flip, overshoot, then slide back
     once it lets go. That lag is the "jumpy" open/close. While GSAP owns a
     card, CSS transitions on it are off. */
  function ensureMotionCss() {
    if (document.getElementById("au-motion-css")) return;
    var style = document.createElement("style");
    style.id = "au-motion-css";
    style.textContent =
      MEMBER + ".is-morphing," +
      MEMBER + ".is-morphing .au-member__portrait," +
      MEMBER + ".is-morphing .au-member__close," +
      MEMBER + ".is-entering{transition:none!important;}";
    document.head.appendChild(style);
  }

  /* ── The roster ─────────────────────────────────────────────────────────── */
  function initRoster(grid) {
    if (grid.__auRosterReady) return;
    grid.__auRosterReady = true;

    var gsap = window.gsap;
    var Flip = window.Flip;
    var canFlip = !!(gsap && Flip);

    if (canFlip && !initRoster.__registered) {
      gsap.registerPlugin(Flip);
      initRoster.__registered = true;
    }
    ensureMotionCss();

    var open = null; // the card currently expanded, or null
    var restingHeight = 0; // the grid's height with nothing open
    var running = []; // animations in flight, so a new click can interrupt them
    var pendingScroll = null; // the delayed bring-into-view, kept apart: see settle()
    var morphGen = 0; // bumped per morph, so a late cleanup can't end a newer one

    /* Read live every time — that is what lets cards be added later. */
    function cards() {
      return all(MEMBER, grid);
    }

    /* ── Animation bookkeeping ────────────────────────────────────────────────
       Snap everything in flight to its end before measuring again, so a rapid
       second click always starts from a settled layout. */
    function settle() {
      /* The pending scroll is killed, never completed: completing a delayed
         call runs it, and a quick close after an open would then scroll the
         page to the card that is closing. */
      if (pendingScroll) {
        pendingScroll.kill();
        pendingScroll = null;
      }
      running.splice(0).forEach(function (anim) {
        try {
          anim.progress(1).kill();
        } catch (e) {
          try { anim.kill(); } catch (e2) {}
        }
      });
    }

    /* The first click reveals any card still waiting for its scroll-in
       entrance. Opening a card re-sorts the grid, so a card parked at
       opacity 0 further down can move up into view while its entrance
       trigger still points at where it used to be — it stayed invisible.
       Flip must also never measure a half-assembled card. */
    function finishEntrance(list) {
      if (!gsap) return;
      var pending = list.filter(function (c) {
        return c.__auEntrance && !c.__auEntered;
      });
      if (!pending.length) return;
      pending.forEach(function (c) {
        c.__auEntered = true;
        c.classList.remove("is-entering");
      });
      gsap.killTweensOf(pending);
      gsap.set(pending, { clearProps: "transform,opacity,visibility,willChange" });
    }

    function track(anim) {
      if (anim) running.push(anim);
      return anim;
    }

    function syncAria(card) {
      var isOpen = card === open;
      var toggle = card.querySelector(TOGGLE);
      if (!toggle) return;
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      var name = card.querySelector(".au-member__name");
      var who = name ? name.textContent.trim() : "this profile";
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close " + who + "'s profile" : "Read " + who + "'s profile",
      );
    }

    /* The three end states, as plain classes. */
    function applyState(next, list) {
      list.forEach(function (card) {
        var isOpen = card === next;
        card.classList.toggle("is-active", isOpen);
        card.classList.toggle("is-inactive", !!next && !isOpen);
      });
      open = next;
      list.forEach(syncAria);
    }

    /* ── Holding the grid still ───────────────────────────────────────────── */
    function measureResting(list) {
      if (open) return; // only meaningful when nothing is expanded
      /* Fractional, not offsetHeight: a rounded lock leaves the page a pixel
         out, which is visible as a twitch on the content below. */
      restingHeight = grid.getBoundingClientRect().height;
      if (!list) return;
    }

    function lockGrid() {
      if (restingHeight) grid.style.minHeight = restingHeight + "px";
    }

    function unlockGrid() {
      grid.style.minHeight = "";
    }

    /* ── The one state change ─────────────────────────────────────────────── */
    function setOpen(next) {
      if (next === open) return;
      settle();

      var list = cards();
      var expanding = !!next;
      var duration = expanding ? CONFIG.duration : CONFIG.closeDuration;
      var ease = expanding ? CONFIG.ease : CONFIG.closeEase;
      var animate = canFlip && !reducedMotion();

      finishEntrance(list);

      /* Measure the resting height while the grid is genuinely at rest — i.e.
         only when opening from fully closed, never mid-swap. */
      if (!open) measureResting(list);
      var heightBefore = grid.getBoundingClientRect().height;

      var state = animate
        ? Flip.getState(all(FLIP_PARTS, grid), {
            props: "borderRadius,boxShadow,opacity",
          })
        : null;

      /* Transitions off BEFORE the classes change, so the border/shadow swap
         to .is-active is not handed to CSS as well as to Flip. */
      var gen = ++morphGen;
      if (animate) {
        list.forEach(function (c) {
          c.classList.add("is-morphing");
        });
      }

      applyState(next, list);
      lockGrid();

      if (!animate) {
        if (!next) unlockGrid();
        if (next) bringIntoView(next, 0);
        refreshIfMoved(heightBefore);
        emit(next);
        return;
      }

      track(
        Flip.from(state, {
          duration: duration,
          ease: ease,
          absolute: true, // nothing jumps while the grid re-sorts
          nested: true,
          prune: true,
          onEnter: function (els) {
            return gsap.fromTo(
              els,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1, duration: 0.45, delay: 0.12, ease: "power2.out" },
            );
          },
          onLeave: function (els) {
            return gsap.to(els, {
              opacity: 0,
              scale: 0.97,
              duration: 0.24,
              ease: "power1.in",
            });
          },
          onComplete: function () {
            endMorph(list, gen);
            /* The lock comes off only once nothing is expanded — during a
               tween the cards are out of flow and the grid needs it. */
            if (!open) unlockGrid();
            /* The story column has no settled height until now, so this is the
               only honest moment to ask whether it overflows. */
            if (open) {
              var od = open.querySelector(".au-member__detail");
              if (od && od.__auRecheck) od.__auRecheck();
            }
            refreshIfMoved(heightBefore);
          },
        }),
      );

      if (next) {
        revealStory(next, duration);
        bringIntoView(next, duration * 0.25);
        markOverflow(next);
      }
      emit(next);
    }

    /* CSS transitions come back on only once Flip has put every inline style
       away AND the browser has resolved the result. Re-enabled in the same
       tick, the jump from Flip's last written transform to none is itself
       handed to CSS as a transition, and the cards glide in from wherever
       the previous frame left them. */
    function endMorph(list, gen) {
      var raf = window.requestAnimationFrame;
      raf(function () {
        raf(function () {
          if (gen !== morphGen) return; // a newer morph owns the cards now
          void grid.offsetWidth; // resolve styles with transitions still off
          list.forEach(function (c) {
            c.classList.remove("is-morphing");
          });
        });
      });
    }

    /* The lock keeps the page still in the normal case. If an opened story
       ever outgrows it (a very long bio on a narrow screen) everything below
       the roster has moved, so ScrollTrigger re-measures — only then. */
    function refreshIfMoved(before) {
      var after = grid.getBoundingClientRect().height;
      if (Math.abs(after - before) < 1) return;
      var CLT = window.CLT;
      if (CLT && typeof CLT.refresh === "function") CLT.refresh();
      else if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }

    /* The story is held back until the band has nearly finished growing, then
       arrives a paragraph at a time. Two reasons: the copy re-wraps at every
       intermediate width of the morph and watching that is most of what reads
       as jank, and letting the band land first gives the thing a beat — the
       card arrives, then it speaks. */
    function revealStory(card, morphDuration) {
      if (!gsap || reducedMotion()) return;
      var detail = card.querySelector(".au-member__detail");
      var bits = all(
        ".au-member__bio > p, .au-member__socials > a",
        card,
      );
      var lead = Math.max(0, (morphDuration || CONFIG.duration) * 0.55);
      if (detail) {
        gsap.killTweensOf(detail);
        track(
          gsap.fromTo(
            detail,
            { opacity: 0 },
            { opacity: 1, duration: 0.36, ease: "power2.out", delay: lead },
          ),
        );
      }
      if (!bits.length) return;
      gsap.killTweensOf(bits);
      track(
        gsap.fromTo(
          bits,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            ease: "power2.out",
            stagger: 0.032,
            delay: lead + 0.04,
            clearProps: "transform,opacity",
          },
        ),
      );
    }

    /* Says whether the story still has copy below the fold, so the stylesheet
       can fade its bottom edge — and stops saying so once you have read to the
       end. Re-checked after the morph, because the column has no settled height
       until the band has finished growing. */
    function markOverflow(card) {
      var detail = card.querySelector(".au-member__detail");
      if (!detail) return;
      var update = function () {
        var more = detail.scrollHeight - detail.clientHeight - detail.scrollTop > 4;
        detail.classList.toggle("has-more", more);
      };
      if (!detail.__auOverflowBound) {
        detail.__auOverflowBound = true;
        detail.addEventListener("scroll", update, { passive: true });
      }
      update();
      detail.__auRecheck = update;
    }

    /* Only ever moves the page when the opened band would otherwise be partly
       out of sight, and then smoothly, through Lenis. Set scrollIntoView false
       in the config to leave the scroll position strictly alone. */
    function bringIntoView(card, delay) {
      if (!CONFIG.scrollIntoView) return;
      var run = function () {
        var rect = card.getBoundingClientRect();
        var fitsAbove = rect.top >= 0;
        var fitsBelow = rect.bottom <= window.innerHeight;
        if (fitsAbove && fitsBelow) return;
        var y =
          (window.pageYOffset || document.documentElement.scrollTop || 0) +
          rect.top -
          CONFIG.scrollOffset;
        var CLT = window.CLT;
        if (CLT && typeof CLT.scrollTo === "function") CLT.scrollTo(Math.max(0, y));
        else window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      };
      if (delay && gsap) {
        pendingScroll = gsap.delayedCall(delay, function () {
          pendingScroll = null;
          run();
        });
      } else run();
    }

    function emit(card) {
      try {
        grid.dispatchEvent(
          new CustomEvent("clt:about:toggle", {
            bubbles: true,
            detail: { card: card, open: !!card },
          }),
        );
      } catch (e) {}
    }

    /* ── Wiring · delegated, so cards added later need no rebinding ───────── */
    grid.addEventListener("click", function (e) {
      var closer = e.target.closest ? e.target.closest(CLOSE) : null;
      if (closer && grid.contains(closer)) {
        e.preventDefault();
        setOpen(null);
        var card = closer.closest(MEMBER);
        if (card) {
          var t = card.querySelector(TOGGLE);
          if (t) try { t.focus({ preventScroll: true }); } catch (err) { t.focus(); }
        }
        return;
      }

      /* Placeholder social links: a click inside a card must not toggle it. */
      var link = e.target.closest ? e.target.closest(".au-member__socials a") : null;
      if (link && grid.contains(link)) {
        if (link.getAttribute("href") === "#") e.preventDefault();
        return;
      }

      var toggle = e.target.closest ? e.target.closest(TOGGLE) : null;
      if (!toggle || !grid.contains(toggle)) return;
      var member = toggle.closest(MEMBER);
      if (!member) return;
      /* The toggles are Webflow link blocks (href="#"). Webflow's own script
         happens to cancel the jump today; don't depend on it — a followed
         "#" scrolls the page to the top mid-morph. */
      e.preventDefault();
      setOpen(member === open ? null : member);
    });

    /* Link-block toggles answer Enter natively but not Space, which is what a
       keyboard user expects of something announced as a button. */
    all(TOGGLE, grid).forEach(function (t) {
      if (t.tagName === "A" && !t.hasAttribute("role")) t.setAttribute("role", "button");
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== " " && e.key !== "Spacebar") return;
      var toggle = e.target.closest ? e.target.closest(TOGGLE) : null;
      if (!toggle || toggle.tagName !== "A" || !grid.contains(toggle)) return;
      e.preventDefault();
      toggle.click();
    });

    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key !== "Escape" && e.key !== "Esc") return;
      // A dialog open over the page owns Escape.
      if (e.defaultPrevented || document.querySelector(".clt-dialog[open]")) return;
      e.preventDefault();
      var toggle = open.querySelector(TOGGLE);
      setOpen(null);
      if (toggle) try { toggle.focus({ preventScroll: true }); } catch (err) { toggle.focus(); }
    });

    /* The resting height is viewport-dependent; refresh it whenever the grid
       is at rest. While a card is open the lock is min-height, so content can
       always grow past a stale value rather than being clipped by it. */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (open) return;
        unlockGrid();
        measureResting(cards());
      }, 180);
    });

    /* ── Entrance · tiles assemble as the roster arrives ──────────────────── */
    function setupEntrance(list) {
      var ST = window.ScrollTrigger;
      if (!CONFIG.entrance || !gsap || !ST || reducedMotion()) return false;
      var fresh = list.filter(function (c) {
        return !c.__auEntrance;
      });
      if (!fresh.length) return true;
      fresh.forEach(function (c) {
        c.__auEntrance = true;
        c.classList.add("is-entering");
      });
      gsap.set(fresh, { autoAlpha: 0, y: 26, scale: 0.97, force3D: true });
      ST.batch(fresh, {
        start: "top 88%",
        once: true,
        onEnter: function (batch) {
          // Cards a click has already revealed (finishEntrance) stay put.
          batch = batch.filter(function (c) {
            return !c.__auEntered;
          });
          if (!batch.length) return;
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: "auto",
            /* Clear everything: Flip must measure an untransformed layout. */
            clearProps: "transform,opacity,visibility,willChange",
            onComplete: function () {
              batch.forEach(function (c) {
                c.__auEntered = true;
                c.classList.remove("is-entering");
              });
            },
          });
        },
      });
      return true;
    }

    var entranceOn = setupEntrance(cards());

    /* Deep link: /about-us#au-richard-barrett opens that profile on arrival. */
    (function openFromHash() {
      var hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      var target = null;
      try {
        target = grid.querySelector(hash);
      } catch (e) {
        return;
      }
      if (!target || target.getAttribute("data-au-member") === null) return;
      if (entranceOn) finishEntrance(cards());
      window.requestAnimationFrame(function () {
        setOpen(target);
      });
    })();

    /* ── Public surface ──────────────────────────────────────────────────────
       CLT_ABOUT.refresh() re-runs the entrance setup over any cards added since
       load. Clicks already work on new cards without it — they are delegated. */
    return {
      config: CONFIG,
      grid: grid,
      open: function (cardOrId) {
        var el =
          typeof cardOrId === "string" ? grid.querySelector(cardOrId) : cardOrId;
        if (el) setOpen(el);
      },
      close: function () {
        setOpen(null);
      },
      current: function () {
        return open;
      },
      refresh: function () {
        entranceOn = setupEntrance(cards()) || entranceOn;
        if (!open) {
          unlockGrid();
          measureResting(cards());
        }
      },
    };
  }

  /* ══ HERO · the copy comes to rest over the media ══════════════════════════
     After a short lead-in scroll the hero copy (eyebrow → jump-nav, in
     [data-au-hero-copy]) holds its place on screen while the media
     ([data-au-hero-media]) keeps scrolling up beneath it, growing from 92% to
     full size and gathering a dark scrim, until the two centres meet. From
     there they scroll on together as one block.

     "Holding its place" is a y-translate equal to the distance scrolled —
     scrub: true, no pin — so there is no pin-spacer, no layout shift and no
     jump when it ends: the copy simply keeps its final offset. clt-core's
     Lenis already smooths the scroll, so any extra scrub lag would only make
     the copy drift. Distances are read from offsetTop/offsetHeight, which
     ignore transforms, and re-read on every ScrollTrigger refresh.

     Wide screens only: on a phone the 16:9 media is far shorter than the
     copy, so the copy would bury it. There the media just grows in as it
     arrives. Reduced motion or no GSAP → the static stacked hero. */
  var HERO_LEAD = 64; // px scrolled before the copy starts to hold

  function initHeroOverlay() {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var copy = document.querySelector("[data-au-hero-copy]");
    var media = document.querySelector("[data-au-hero-media]");
    if (!copy || !media || !gsap || !ST || !gsap.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ST);
    var hero = copy.parentNode;

    // How far the copy has to hold for its centre to land on the media's.
    function travel() {
      var copyMid = copy.offsetTop + copy.offsetHeight / 2;
      var mediaMid = media.offsetTop + media.offsetHeight / 2;
      return Math.max(0, mediaMid - copyMid);
    }

    var mm = gsap.matchMedia();

    mm.add("(min-width: 48rem)", function () {
      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top+=" + HERO_LEAD + " top",
          end: function () { return "+=" + travel(); },
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(copy, { y: 0 }, { y: function () { return travel(); }, duration: 1 }, 0)
        .fromTo(media, { scale: 0.92 }, { scale: 1, duration: 1, ease: "power1.out" }, 0)
        .fromTo(media, { "--au-scrim": 0 }, { "--au-scrim": 1, duration: 0.55, ease: "power1.in" }, 0.45);
      return function () { gsap.set([copy, media], { clearProps: "transform,--au-scrim" }); };
    });

    mm.add("(max-width: 47.99rem)", function () {
      gsap.fromTo(media, { scale: 0.94 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "top 40%", scrub: true },
      });
      return function () { gsap.set(media, { clearProps: "transform" }); };
    });
  }

  function init() {
    try {
      var apis = all(ROSTER).map(initRoster).filter(Boolean);
      window.CLT_ABOUT = apis.length === 1 ? apis[0] : apis;
    } catch (e) {
      /* clt-core swallows anything thrown from its ready queue, so surface
         our own failures rather than dying silently. */
      console.warn("[CLT about-us] roster init failed", e);
    }
    try {
      initHeroOverlay();
    } catch (e) {
      console.warn("[CLT about-us] hero overlay init failed", e);
    }
  }

  /* clt-core flushes its ready queue at the end of boot, so this runs after
     Lenis, the curtain and the reveal system are live. */
  if (window.CLT && typeof window.CLT.ready === "function") {
    window.CLT.ready(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
