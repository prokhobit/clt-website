/* ==========================================================================
   CLT · PINOCCHIO FOR SCHOOLS 
   ========================================================================== */
(function () {
  "use strict";

  var win = window;
  var doc = document;
  if (win.__cltPfsLoaded) return;
  win.__cltPfsLoaded = true;

  var state = { gsap: null, CLT: null, reduced: false };

  function query(selector, root) {
    return (root || doc).querySelector(selector);
  }
  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }
  function plugin(name) {
    var gsap = state.gsap;
    var p =
      win[name] ||
      (gsap && gsap.core && gsap.core.globals && gsap.core.globals()[name]);
    if (p && gsap) gsap.registerPlugin(p);
    return p || null;
  }
  function ease(name, fallback) {
    var m = state.CLT && state.CLT.motion;
    return (m && m[name]) || fallback;
  }

  // ── Eases ───────────────────────────────────────────────────────────────
  var eases = { focus: "expo.out", reveal: "expo.out", drift: "none" };
  function defineEases() {
    var CustomEase = plugin("CustomEase");
    if (!CustomEase) return;
    CustomEase.create("pfs-focus", "M0,0 C0.12,0.62 0.2,0.92 0.42,0.98 0.62,1.01 0.8,1 1,1");
    CustomEase.create("pfs-reveal", "M0,0 C0.18,0.72 0.3,0.96 0.52,0.99 0.72,1.01 0.86,1 1,1");
    CustomEase.create("pfs-drift", "M0,0 C0.25,0.08 0.55,0.62 1,1");
    eases = { focus: "pfs-focus", reveal: "pfs-reveal", drift: "pfs-drift" };
  }

  // ── Hero reveal ─────────────────────────────────────────────────────────
  function initHeroReveal() {
    var gsap = state.gsap;
    var hero = query("[data-pfs-hero]");
    if (!hero) return null;

    var screen = query("[data-pfs-screen]", hero);
    var legacy = queryAll(".pfs-hero__drape, .pfs-hero__valance", hero);
    if (legacy.length) gsap.set(legacy, { display: "none" }); // drapes retired
    var spot = query(".pfs-hero__spot", hero);
    var eyebrow = query(".pfs-hero__eyebrow", hero);
    var eyebrowText = query("[data-pfs-eyebrow]", hero);
    var title = query("[data-pfs-title]", hero);
    var lede = query("[data-pfs-lede]", hero);
    var actions = queryAll("[data-pfs-actions] > *", hero);

    if (state.reduced) {
      hero.classList.add("is-ready");
      return null;
    }

    var SplitText = plugin("SplitText");
    var focusEase = eases.focus;

    gsap.set([spot, eyebrow, title, lede].concat(actions), { autoAlpha: 0 });
    gsap.set(actions, { y: 16 });
    gsap.set(screen, { scale: 1.12, autoAlpha: 0 });
    hero.classList.add("is-ready");

    var words = [title],
      chars = [eyebrowText || eyebrow];
    if (SplitText) {
      words = SplitText.create(title, {
        type: "words",
        wordsClass: "pfs-word",
      }).words;
      queryAll(".clt-text-foil .pfs-word", title).forEach(function (w) {
        w.classList.add("clt-text-foil");
      });
      if (eyebrowText)
        chars = SplitText.create(eyebrowText, {
          type: "chars",
          charsClass: "pfs-char",
        }).chars;
    }
    // Touch devices get the same rise without the blur (45 blurred layers at once is too much for a phone).
    var soft = !win.matchMedia("(pointer: coarse)").matches;
    function blur(px) { return soft ? "blur(" + px + "px)" : "none"; }
    var blurIn = { autoAlpha: 0, filter: blur(14), yPercent: 22 };

    var tl = gsap.timeline({
      paused: true,
      defaults: { ease: ease("easeStage", "expo.out") },
      onComplete: function () {
        gsap.set(screen, { clearProps: "transform,opacity,visibility" });
        gsap.set(words.concat(chars, [lede]), {
          clearProps: "filter,willChange",
        });
      },
    });
    tl.to(spot, { autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 0)
      .to(screen, { scale: 1, autoAlpha: 1, duration: 1.9, ease: eases.reveal }, 0.1)
      .set([eyebrow, title], { autoAlpha: 1 }, 0.7)
      .fromTo(
        chars,
        blurIn,
        {
          autoAlpha: 1,
          filter: blur(0),
          yPercent: 0,
          duration: 0.9,
          stagger: 0.022,
          ease: focusEase,
        },
        0.7,
      )
      .fromTo(
        words,
        blurIn,
        {
          autoAlpha: 1,
          filter: blur(0),
          yPercent: 0,
          duration: 1.25,
          stagger: 0.07,
          ease: focusEase,
        },
        0.9,
      )
      .fromTo(
        lede,
        { autoAlpha: 0, filter: blur(10), y: 14 },
        {
          autoAlpha: 1,
          filter: blur(0),
          y: 0,
          duration: 1.1,
          ease: focusEase,
        },
        1.35,
      )
      .to(
        actions,
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: focusEase },
        1.55,
      );

    var delay = doc.querySelector(".clt-curtain-stage") ? 0.55 : 0.12; // let the curtain open first
    gsap.delayedCall(delay, function () {
      tl.play();
    });
    return tl;
  }

  // ── Hero scroll ─────────────────────────────────────────────────────────
  // The framed stage stays still; only the video drifts inside it and the
  // copy lifts away, so the rounded clip is never re-rasterised on scroll.
  function initHeroScroll() {
    var gsap = state.gsap;
    var ST = plugin("ScrollTrigger");
    var hero = query("[data-pfs-hero]");
    if (!hero || !ST || state.reduced) return;
    var video = query(".pfs-hero__video", hero);
    var copy = query(".pfs-hero__copy", hero);
    gsap.set(video, { scale: 1.08, transformOrigin: "50% 50%" }); // overscan for the drift
    gsap
      .timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: eases.drift },
      })
      .to(video, { yPercent: 3.5 }, 0)
      .to(copy, { yPercent: -18, autoAlpha: 0.15 }, 0);
  }

  // ── Film popup ──────────────────────────────────────────────────────────
  function initFilm(teaserControl) {
    var gsap = state.gsap;
    var CLT = state.CLT;
    var play = query("[data-pfs-play]");
    var dialog = doc.getElementById("pfs-film");
    if (!play || !dialog || !CLT || !CLT.dialogs) return;
    var film = query("[data-pfs-film]", dialog);

    function warm() {
      if (film && film.preload !== "auto") film.preload = "auto";
    }
    play.addEventListener("pointerenter", warm, { passive: true });
    play.addEventListener("focus", warm);
    play.addEventListener("touchstart", warm, { passive: true });

    dialog.__cltMotion = {
      open: function () {
        gsap.killTweensOf(dialog);
        if (state.reduced) return;
        gsap.fromTo(
          dialog,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            clearProps: "opacity,visibility",
          },
        );
      },
      close: function (d, done) {
        if (film) film.pause();
        gsap.killTweensOf(dialog);
        if (state.reduced) {
          done();
          return;
        }
        gsap.to(dialog, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: done,
        });
      },
    };

    play.addEventListener("click", function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      e.preventDefault();
      if (film) {
        warm();
        film.muted = false;
        if (film.ended) film.currentTime = 0;
        var started = film.play();
        if (started && typeof started.catch === "function")
          started.catch(function () {});
      }
      if (teaserControl) teaserControl.hold(true);
      CLT.dialogs.open(dialog);
    });

    dialog.addEventListener("cancel", function (e) {
      e.preventDefault();
      CLT.dialogs.close(dialog, "dismiss");
    });
    dialog.addEventListener("close", function () {
      if (film) film.pause();
      gsap.set(dialog, { clearProps: "opacity,visibility" });
      if (teaserControl) teaserControl.hold(false);
    });

    var book = query("[data-pfs-book]", dialog);
    if (book) {
      book.addEventListener("click", function (e) {
        e.preventDefault();
        var target = book.getAttribute("href");
        dialog.addEventListener(
          "close",
          function () {
            CLT.scrollTo(target, { offset: -24 });
          },
          { once: true },
        );
        CLT.dialogs.close(dialog);
      });
    }
  }

  // ── Section nav bar (below 992px) ───────────────────────────────────────
  function initSectionNavBar() {
    var nav = query(".pfs-rail .clt-sectionnav");
    if (!nav || !("MutationObserver" in win)) return;
    var pending = 0;
    function reveal() {
      pending = 0;
      if (nav.scrollWidth <= nav.clientWidth + 1) return;
      var current = query(".clt-sectionnav__link.is-current", nav);
      if (!current) return;
      nav.scrollTo({
        left: current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2,
        behavior: state.reduced ? "auto" : "smooth",
      });
    }
    new MutationObserver(function () {
      if (!pending) pending = win.requestAnimationFrame(reveal);
    }).observe(nav, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });
  }

  // ── Teaser power-saving ────────────────────────────────────────────────
  function initTeaser() {
    var video = query("[data-pfs-teaser]");
    if (!video) return null;
    var conn = navigator.connection;
    var still = state.reduced || !!(conn && conn.saveData);
    var visible = true,
      held = false;
    function sync() {
      if (still || held || !visible || doc.hidden) {
        if (!video.paused) video.pause();
        return;
      }
      if (video.paused) {
        var p = video.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      }
    }
    if (still) {
      video.removeAttribute("autoplay");
      video.pause();
      video.preload = "none";
    }
    if ("IntersectionObserver" in win) {
      new IntersectionObserver(
        function (entries) {
          visible = entries[entries.length - 1].isIntersecting;
          sync();
        },
        { rootMargin: "10% 0px" },
      ).observe(video);
    }
    doc.addEventListener("visibilitychange", sync);
    return {
      hold: function (on) {
        held = on;
        sync();
      },
    };
  }

  // ── Grant deadlines ─────────────────────────────────────────────────────

  function initGrantDeadlines() {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    queryAll("[data-deadline]").forEach(function (grant) {
      var parts = (grant.getAttribute("data-deadline") || "")
        .split("-")
        .map(Number);
      if (parts.length !== 3 || !parts[0]) return;
      if (new Date(parts[0], parts[1] - 1, parts[2]) >= today) return;
      grant.classList.add("is-closed");
      var label = query("[data-pfs-deadline-label]", grant);
      if (label) label.textContent = "Deadline passed —";
    });
  }

  function unstage() {
    var hero = query("[data-pfs-hero]");
    if (!hero) return;
    hero.classList.add("is-ready");
    if (!state.gsap) return;
    state.gsap.set(
      queryAll(".pfs-hero__copy > *, .pfs-hero__spot, .pfs-hero__title", hero),
      { clearProps: "opacity,visibility,transform" },
    );
    state.gsap.set(query("[data-pfs-screen]", hero), {
      clearProps: "transform,opacity,visibility",
    });
  }

  function init(CLT) {
    state.CLT = CLT || win.CLT || {};
    state.gsap = win.gsap;
    state.reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    initGrantDeadlines();
    if (!state.gsap) {
      var hero = query("[data-pfs-hero]");
      if (hero) hero.classList.add("is-ready");
      return;
    }
    var teaser = null;
    defineEases();
    [
      ["Hero reveal", initHeroReveal],
      ["Hero scroll", initHeroScroll],
      [
        "Teaser",
        function () {
          teaser = initTeaser();
        },
      ],
      [
        "Film",
        function () {
          initFilm(teaser);
        },
      ],
      ["Section nav bar", initSectionNavBar],
    ].forEach(function (m) {
      try {
        m[1]();
      } catch (error) {
        unstage();
        win.console.warn("[CLT schools] " + m[0] + " failed.", error);
      }
    });
  }

  function start() {
    var tries = 0;
    (function wait() {
      if (win.gsap && win.CLT && typeof win.CLT.ready === "function") {
        win.CLT.ready(init);
      } else if (++tries < 90) {
        win.setTimeout(wait, 50);
      } else {
        init(win.CLT || {});
      }
    })();
  }
  if (doc.readyState === "loading")
    doc.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
