/* ════════════════════════════════════════════════════════════════════════════
   CLT · PRESS — page script
   ────────────────────────────────────────────────────────────────────────────
   Owns the press wall: how it moves, and the coverflow depth on top of it.

   TWO MODES, PICKED BY gsap.matchMedia()

     DECK   phones, and anything with a coarse pointer. No pinning at all. One
            card at ~86vw with its neighbours peeking in at the edges, dragged
            directly with Draggable, thrown with InertiaPlugin and snapped one
            card per swipe. The page scrolls vertically past it like any other
            section — no hijacking, nothing to fight a thumb.

     PIN    wide screens with a fine pointer. ScrollTrigger pins the stage and
            scrubs the row sideways as the page scrolls. Draggable is a second
            way in: grabbing the row drives the page's SCROLL POSITION rather
            than the row itself, so the two inputs are the same number and can
            never disagree.

   ONE OWNER OF x, ALWAYS
     This is the rule the whole file is built around. The track's x is written
     by the scrub tween in PIN mode and by Draggable in DECK mode, and never by
     both — two writers on one transform fight every frame and the row judders.
     It is also why this page does NOT use the design system's promenade
     component: that would add a third writer, with a fixed scrub lag long
     enough to make a drag feel detached from the pointer. The stage still
     wears .clt-promenade and this file still lights the design system's own
     progress filament through --promenade, so nothing the design system
     already draws is drawn again here.

   MEASURING WITHOUT A FEEDBACK LOOP
     The obvious way to write a coverflow is to read each card's
     getBoundingClientRect and derive that card's rotation from it. That is a
     loop: the rect it reads is the rect the previous frame's own rotation
     produced, so the value fed back in is never the card's real position and
     the row wobbles as it settles.

     The reference here is the TRACK's rect instead. The track only ever
     carries a plain x translation, so its rect is exact, and each card's
     offset inside it is pure layout that no transform can disturb. Those
     offsets are measured once per refresh and cached, so the per-frame cost is
     one rect read for the whole wall, whatever the card count. It also means
     the depth pass reads the RESULT of the movement rather than its cause, and
     is therefore identical in both modes — scrub, drag, throw or snap.

   CONTRACT WITH THE SITE-WIDE CODE
     · Loads AFTER gsap, ScrollTrigger, Draggable and clt-core.js. InertiaPlugin
       is optional: with it, a release throws and settles; without it, a release
       snaps on an eased tween instead.
     · Reads clt-core only through its public surface: CLT.ready, CLT.motion,
       CLT.scrollTo and CLT._addTick. Nothing is patched or overridden.
     · Eases come from CLT.motion, which clt-core has already registered as
       CustomEases matching the CSS tokens, so this file's motion speaks the
       same vocabulary as the rest of the site rather than inventing curves.
     · Uses its own data-pr-* hooks throughout, so no core initialiser and no
       other page script can bind the same elements twice.
     · Does NOT put [data-clt-reveal] on the cards: core's reveal parks a
       transform on the element and this file writes transforms to the same
       element every frame. The entrance is core's reveal on the section
       heading; the cards arrive already in formation.
     · Degrades completely. No GSAP, no Draggable, or prefers-reduced-motion,
       and this file returns before binding anything — the stage stays the
       ordinary horizontally scrollable row its markup makes it.

   ADDING OR REMOVING ARTICLES
     Nothing here counts the cards and no size is hard-coded. Add or delete a
     .clt-promenade__panel and everything — the end padding, the cached
     offsets, the scrub distance, the snap step, the counter's denominator —
     re-measures itself. If cards are injected after load (a Webflow CMS
     collection list rendering late, say), call CLT_PRESS.refresh(). Motion can
     be retuned by setting window.CLT_PRESS_CONFIG before this file loads.
   ════════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  if (window.__cltPressReady) return; // idempotent — safe if injected twice
  window.__cltPressReady = true;

  var WALL = "[data-pr-wall]";
  var STAGE = "[data-pr-stage]";
  var TRACK = "[data-pr-track]";
  var PANEL = ".clt-promenade__panel";
  var CARD = "[data-pr-card]";
  var COUNTER = "[data-pr-counter]";

  /* The query that decides which mode a visitor gets. It is deliberately the
     same string as the one guarding the desktop card sizes in the stylesheet:
     the two must agree, or the row would be measured for one layout and shown
     in the other. */
  var PIN_QUERY = "(min-width: 48rem) and (pointer: fine)";

  /* Tunables. Set window.CLT_PRESS_CONFIG before this script to override.
     The depth block is the whole look; everything else is plumbing. */
  var DEFAULTS = {
    /* ── depth · PIN ──────────────────────────────────────────────────────
       The reference values: a card at the edge of the row is turned a full
       45°, shrunk to 0.7 and pushed well back. Dramatic, because on a wide
       screen there is room for six cards to fall away behind the one you are
       reading. */
    pin: {
      maxRotation: 45,
      minScale: 0.7,
      depth: 0.4,
      spread: 0.5,
      scaleFalloff: 1.8,
      dimReach: 0.62,
    },
    /* ── depth · DECK ─────────────────────────────────────────────────────
       Much gentler. A phone only ever shows the centred card and a sliver of
       its neighbours, and the reference numbers turn those slivers into
       unreadable slivers of nothing. Softening the rotation and holding the
       scale up keeps them legible as cards — a peek, not a vanishing. */
    deck: {
      maxRotation: 26,
      minScale: 0.84,
      depth: 0.2,
      spread: 0.62,
      scaleFalloff: 2.8,
      dimReach: 0.85,
    },
    /* ── feel ─────────────────────────────────────────────────────────────── */
    scrub: 0.45, // PIN: scroll-to-row lag. Short, so a drag stays under the
    //              pointer; the design system's promenade uses 1, which reads
    //              beautifully for pure scrolling and badly for dragging.
    throwResistance: 2200, // how quickly a flung row gives up its speed
    edgeResistance: 0.9, // DECK: rubber-banding past the first and last card
    snapDuration: 0.5, // fallback snap, when InertiaPlugin is absent
    deckStride: 1, // DECK: cards a single swipe may travel. 1 = a deck.
    /* ── idle drift · the attract loop ────────────────────────────────────
       Left alone, the wall walks itself along the row, reaches the far end,
       rests a moment and walks back — forever, or until someone touches it.
       speed is in pixels of row travel per second; at the default a card
       passes roughly every six seconds, which is slow enough to read a
       headline off and far too slow to feel like a slideshow. */
    idle: {
      enabled: true,
      delay: 5, // seconds of stillness before it starts
      speed: 58, // px of row travel per second
      turnPause: 0.9, // seconds it rests at each end before turning back
    },
    dim: true, // sink the far cards into the house dark (--pr-dim)
    counter: true, // keep the NN / NN readout under the wall in sync
    drag: true, // bind Draggable at all
  };

  var CONFIG = (function () {
    var user = window.CLT_PRESS_CONFIG || {};
    var out = {};
    for (var k in DEFAULTS) {
      if (k === "pin" || k === "deck" || k === "idle") {
        out[k] = {};
        for (var d in DEFAULTS[k]) {
          out[k][d] =
            user[k] && d in user[k] ? user[k][d] : DEFAULTS[k][d];
        }
      } else {
        out[k] = k in user ? user[k] : DEFAULTS[k];
      }
    }
    return out;
  })();

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }
  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function init(CLT) {
    var wall = document.querySelector(WALL);
    var stage = document.querySelector(STAGE);
    var track = stage && stage.querySelector(TRACK);
    if (!wall || !stage || !track) return;

    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var Draggable = window.Draggable;
    var hasInertia = !!(window.InertiaPlugin || window.ThrowPropsPlugin);
    var reduced =
      (CLT && CLT.env && CLT.env.reducedMotion) ||
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Nothing to enhance with: leave the markup's own scrollable row alone.
    if (reduced || !gsap || !ST) return;

    gsap.registerPlugin(ST);
    if (Draggable) gsap.registerPlugin(Draggable);
    if (window.InertiaPlugin) gsap.registerPlugin(window.InertiaPlugin);

    /* Clipping the stage is what stops the browser from ALSO scrolling it
       natively while Draggable or the scrub is moving the track — two
       scrollers over one row. The design system already has the class for
       exactly this state, and it is what lights the progress filament. */
    stage.classList.add("is-pinned");

    var counterEl = CONFIG.counter ? wall.querySelector(COUNTER) : null;
    var ease = (CLT && CLT.motion && CLT.motion.ease) || "power3.out";
    var easeStage = (CLT && CLT.motion && CLT.motion.easeStage) || "expo.out";

    /* ── measurement cache ──────────────────────────────────────────────────
       Rebuilt on refresh, never during a frame. Each entry holds a card, its
       centre's offset inside the track and a quickSetter bound to it, so the
       hot loop does no querying, no property lookup and no layout reads beyond
       the single track rect. */
    var cards = [];
    var total = 0;
    var stageWidth = 0;
    var travel = 0; // px the track slides from first card centred to last
    var step = 0; // px between adjacent card centres
    var centred = -1;
    var depth = CONFIG.pin; // swapped per mode
    var mode = null; // "pin" | "deck" | null
    var setFilament = gsap.quickSetter(stage, "--promenade");

    var padding = -1; // the value currently written, so changes can be detected

    /* Exact end padding, replacing the stylesheet's vw approximation — this is
       what lets the first and last cards reach the middle of the screen.

       ORDER MATTERS, and getting it wrong is not a subtle bug. The padding is
       part of the track's width, and the track's width is what becomes the
       scrub distance and the drag bounds. Written after those have been
       measured, the row and its range of movement disagree by however much the
       padding moved: the last card never reaches the middle. So this hangs off
       `refreshInit`, which ScrollTrigger fires before any trigger recalculates,
       and the offset cache below hangs off `refresh`, which it fires after. One
       measurement each side of the recalculation, in dependency order.

       Only the panel width is read, and it depends on --pr-card-w alone, so
       nothing here is circular. Returns true when the figure actually moved. */
    function applyPadding() {
      var panel = track.querySelector(PANEL);
      if (!panel) return false;
      var cardWidth = panel.getBoundingClientRect().width;
      if (!cardWidth) return false;
      var width = stage.clientWidth || window.innerWidth;
      var gutter =
        parseFloat(getComputedStyle(stage).getPropertyValue("--pad-gutter")) || 16;
      var value = Math.max(gutter, (width - cardWidth) / 2);
      var moved = Math.abs(value - padding) > 1;

      padding = value;
      stage.style.setProperty("--pr-pad", value + "px");
      return moved;
    }

    /* Writing the padding on refreshInit gets the order right but does not, on
       its own, guarantee the number is right: when the viewport has just
       changed size the stage may still be pinned and fixed at that moment, so
       the width read here can be the one it had a moment ago.

       So when the figure moves, ask for one more refresh. This converges — the
       padding is derived from the stage and card widths and neither depends on
       the padding, so the second pass reads the settled layout and reports no
       change. The counter is belt and braces for the one case that could
       oscillate: pinning changes the page height, which on some platforms adds
       or removes a scrollbar, which changes the stage width back again. Two
       corrections is plenty for a real settle and stops a ping-pong dead. */
    var corrections = 0;
    var correctionTimer = 0;
    function correctPadding() {
      if (!applyPadding()) return;
      if (corrections >= 2) return;
      corrections++;
      clearTimeout(correctionTimer);
      correctionTimer = setTimeout(function () {
        corrections = 0;
      }, 600);
      requestAnimationFrame(function () {
        ST.refresh();
      });
    }

    function measure() {
      var panels = all(PANEL, track);
      var trackLeft = track.getBoundingClientRect().left;

      cards = [];
      panels.forEach(function (panel) {
        var card = panel.querySelector(CARD);
        if (!card) return;
        // Measured from the PANEL, never from the card. The card is mid-
        // transform on any refresh after the first — a resize fires while it
        // is rotated and scaled — so its rect is the projected box, not the
        // layout one. The panel is never transformed, so its rect is the truth.
        var rect = panel.getBoundingClientRect();
        cards.push({
          el: card,
          offset: rect.left - trackLeft + rect.width / 2,
          set: gsap.quickSetter(card, "css"),
        });
      });

      total = cards.length;
      stageWidth = stage.clientWidth || window.innerWidth;
      // The distance between the first and last card centres. Derived from the
      // cards themselves rather than from scrollWidth, so it stays correct
      // however the track is padded.
      travel = total > 1 ? cards[total - 1].offset - cards[0].offset : 0;
      step = total > 1 ? travel / (total - 1) : 0;

      /* Reset the spotlight rather than just forgetting which card had it. The
         next frame re-applies .is-center, but it only ever removes the class
         from the card this variable names — so dropping the name without
         clearing the class would leave the old card lit for good. */
      cards.forEach(function (c) {
        c.el.classList.remove("is-center");
      });
      centred = -1;

      if (counterEl && total) {
        counterEl.textContent = "01 / " + pad2(total);
      }
    }

    /* ── the depth pass ─────────────────────────────────────────────────────
       One rect read, then pure arithmetic per card. Runs on clt-core's shared
       ticker, which already stands itself down when the tab is hidden, and is
       unsubscribed entirely whenever the wall is off screen. */
    function frame() {
      if (!total) return;

      var trackLeft = track.getBoundingClientRect().left;
      var stageLeft = stage.getBoundingClientRect().left;
      var middle = stageLeft + stageWidth / 2;
      var reach = stageWidth * depth.spread || 1;
      var nearest = 0;
      var nearestDist = Infinity;

      for (var i = 0; i < total; i++) {
        var card = cards[i];
        var distance = trackLeft + card.offset - middle;
        var away = Math.abs(distance);

        // Turn away from the middle, clamped so the outer cards do not spin.
        var rotation = clamp(
          (distance / reach) * depth.maxRotation,
          -depth.maxRotation,
          depth.maxRotation,
        );
        // Shrink and recede with distance — the two together read as depth far
        // more convincingly than either on its own.
        var scale = clamp(
          1 - away / (stageWidth * depth.scaleFalloff),
          depth.minScale,
          1,
        );

        card.set({
          rotationY: rotation,
          scale: scale,
          z: -away * depth.depth,
          // Cards nearer the middle paint over their neighbours, so the row
          // overlaps the way a real stack of covers would. Floored at 1: on a
          // wide screen `away` passes 1000px for the outermost cards, and a
          // negative z-index would drop them behind their own panel.
          zIndex: Math.max(1, 1000 - Math.round(away)),
        });

        if (CONFIG.dim) {
          card.el.style.setProperty(
            "--pr-dim",
            clamp(away / (stageWidth * depth.dimReach), 0, 1).toFixed(3),
          );
        }

        if (away < nearestDist) {
          nearestDist = away;
          nearest = i;
        }
      }

      /* The design system's progress filament, lit from the row's real
         position rather than from whichever input caused it — so it is correct
         under a scrub, a drag, a throw and a snap without knowing about any of
         them. The track's untransformed left edge sits at the stage's, so the
         difference between the two IS the track's current x. */
      if (travel) {
        setFilament(clamp((stageLeft - trackLeft) / travel, 0, 1));
      }

      // Spotlight and counter change only when the centred card changes, so
      // neither touches the DOM on a frame where nothing crossed the middle.
      if (nearest !== centred) {
        if (centred > -1 && cards[centred]) {
          cards[centred].el.classList.remove("is-center");
        }
        cards[nearest].el.classList.add("is-center");
        centred = nearest;
        if (counterEl) {
          counterEl.textContent = pad2(nearest + 1) + " / " + pad2(total);
        }
      }
    }

    /* ══ IDLE DRIFT · the attract loop ═══════════════════════════════════════
       Left alone, the wall walks itself to the far end of the row, rests, and
       walks back. Forever — there is no state in which it has "finished".

       IT MOVES THE SAME NUMBER EVERY OTHER INPUT MOVES. That is the whole
       reason this is only a few lines. In DECK mode that number is the track's
       x; in PIN mode it is the page's scroll position, and creeping the scroll
       is not a compromise there but the correct move: while the section is
       pinned, scrolling changes nothing on screen EXCEPT the row, so the page
       appears perfectly still and only the carousel turns. Nothing is being
       animated behind the scroll's back, so there is no desync to resolve when
       a visitor takes over — their wheel or their drag simply continues from
       where the drift left off. (The one visible tell is the scrollbar thumb
       creeping through the pinned range, which is the honest price of keeping
       one coordinate system.)

       Each mode hands over the two verbs it needs: how to move, and whether it
       is safe to move right now. */
    var motion = null; // { advance(px) -> "start"|"end"|null, active() }
    var idleDir = 1; // +1 walks towards the last card, -1 back
    var idleUntil = 0; // nothing drifts before this tick time
    var dwellUntil = 0; // the pause at each end of the row
    var hovering = false;
    var lastTime = 0;

    /* Any sign of life defers the drift. Called on hover out, on focus, and on
       every raw input on the page — a visitor reading the wall with their hand
       on the wheel should never have to fight it. */
    function poke() {
      // gsap.ticker.time, not lastTime: a poke can arrive while the wall is
      // off screen and the tick unsubscribed, when lastTime is stale or zero.
      // Deferring from a stale clock would put the deadline in the past and
      // the wall would start walking the instant it scrolled into view.
      idleUntil = gsap.ticker.time + CONFIG.idle.delay;
      dwellUntil = 0;
    }

    function drift(dt, time) {
      var cfg = CONFIG.idle;
      if (!cfg.enabled || !motion) return;
      if (hovering || time < idleUntil || time < dwellUntil) return;
      if (!motion.active()) return;
      // A tab that was hidden, or a frame the browser skipped, arrives with a
      // huge dt. Spending it would teleport the row; dropping it costs one
      // frame of drift that nobody was watching anyway.
      if (dt <= 0 || dt > 0.2) return;

      var hit = motion.advance(cfg.speed * dt * idleDir);
      if (hit) {
        idleDir = hit === "end" ? -1 : 1;
        dwellUntil = time + cfg.turnPause;
      }
    }

    // Hover only counts from a real mouse. On a touch screen pointerenter
    // fires on tap and there is no reliable pointerleave to clear it, so
    // trusting it there would stop the drift on a phone for good.
    stage.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") hovering = true;
    });
    stage.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse") hovering = false;
      poke();
    });
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (type) {
      window.addEventListener(type, poke, { passive: true });
    });

    /* ── run the pass only while the wall is on screen ──────────────────────
       The wall is one section of a long page; there is no reason to spend a
       frame on it — or to drift it — while the visitor is reading the
       enquiries panel. */
    var stopTick = null;
    function tick(time) {
      var dt = lastTime ? time - lastTime : 0;
      lastTime = time;
      drift(dt, time); // move first…
      frame(); // …then draw where things ended up
    }
    function startTicking() {
      if (stopTick || !CLT || typeof CLT._addTick !== "function") return;
      lastTime = 0; // the first frame back gets no dt to spend
      poke(); // and the wall gets a moment before it starts walking
      stopTick = CLT._addTick(tick);
    }
    function stopTicking() {
      if (!stopTick) return;
      stopTick();
      stopTick = null;
      lastTime = 0;
    }
    if (window.IntersectionObserver) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) startTicking();
            else stopTicking();
          });
        },
        { rootMargin: "20% 0px" },
      ).observe(stage);
    } else {
      startTicking();
    }

    /* ── index ↔ position ───────────────────────────────────────────────────
       Card centres are evenly spaced, so the whole row is addressable by index
       with nothing more than a multiplication. Both modes use these; only the
       quantity being set differs — a scroll position in PIN, a track x in DECK.

       In PIN mode the pinned distance is set to `travel`, which makes the two
       the same number: one pixel of scroll is one pixel of row. */
    function indexToX(i) {
      return -clamp(i, 0, total - 1) * step;
    }
    function xToIndex(x) {
      return step ? clamp(Math.round(-x / step), 0, total - 1) : 0;
    }

    // ══════════════════════════════════════════════════════════════════════
    // PIN MODE
    // ══════════════════════════════════════════════════════════════════════
    function setupPin() {
      mode = "pin";
      depth = CONFIG.pin;
      wall.setAttribute("data-pr-mode", "pin");
      stage.setAttribute("data-pr-mode", "pin");

      var trigger = gsap.to(track, {
        x: function () {
          return -travel;
        },
        ease: "none", // required: scroll and row position must map 1:1
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: function () {
            return "+=" + travel;
          },
          pin: true,
          scrub: CONFIG.scrub,
          invalidateOnRefresh: true,
        },
      }).scrollTrigger;

      /* Shared by the drag and the idle drift, because they move the same
         thing. immediate: Lenis must not add its own easing on top — the
         scrub already supplies the only smoothing this wants, and a second
         one is what makes a dragged carousel feel like it is on elastic. */
      var scrollNow = function () {
        return CLT && CLT.lenis && typeof CLT.lenis.scroll === "number"
          ? CLT.lenis.scroll
          : window.pageYOffset || document.documentElement.scrollTop || 0;
      };
      var scrollSet = function (y) {
        y = clamp(y, trigger.start, trigger.end);
        if (CLT && CLT.lenis && typeof CLT.lenis.scrollTo === "function") {
          CLT.lenis.scrollTo(y, { immediate: true, force: true });
        } else {
          window.scrollTo(0, y);
        }
      };

      var drag = null;
      var proxy = null;
      if (CONFIG.drag && Draggable) {
        /* Draggable drives the SCROLL, not the row.

           This is the part worth understanding. The row is already a pure
           function of the scroll position, and putting Draggable on the track
           itself would make it a function of two things that immediately
           disagree. So the drag happens on a detached proxy — an element that
           is never rendered and exists only to be a number — and every pixel
           it moves is applied to the page's scroll instead. The scrub then
           moves the row, exactly as it would for a wheel. Both inputs are the
           same number, so they cannot fight, and letting go mid-drag leaves
           the scroll somewhere completely valid. */
        proxy = document.createElement("div");
        /* Parked inside the stage rather than left detached. A detached
           element has no box for Draggable to measure, and its idea of where
           the drag started then comes out of a rect that is all zeros while
           the pointer is hundreds of pixels across the screen. One invisible
           pixel costs nothing and removes the whole question. */
        proxy.setAttribute("aria-hidden", "true");
        proxy.style.cssText =
          "position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
        stage.appendChild(proxy);

        var pressScroll = 0;
        var follow = function () {
          scrollSet(pressScroll - this.x);
        };

        drag = Draggable.create(proxy, {
          type: "x",
          trigger: stage,
          // Every card is a link, and Draggable refuses to start on a
          // clickable unless told otherwise. It still suppresses the click
          // afterwards if the pointer actually travelled, so a plain click
          // opens the article and a drag does not.
          dragClickables: true,
          cursor: "grab",
          activeCursor: "grabbing",
          inertia: hasInertia,
          throwResistance: CONFIG.throwResistance,
          /* onPressInit, not onPress. Draggable records where the drag began
             between the two, so zeroing the proxy in onPress moves the goal
             posts after the measurement has been taken: every drag then
             starts with a jump equal to wherever the proxy happened to be
             left by the previous one. Here the proxy is guaranteed to be at
             zero before anything is recorded, which is what makes `this.x`
             the pointer's travel and nothing else. */
          onPressInit: function () {
            gsap.set(proxy, { x: 0 });
          },
          onPress: function () {
            pressScroll = scrollNow();
            stage.classList.add("is-dragging");
          },
          onDrag: follow,
          onThrowUpdate: follow,
          onRelease: function () {
            stage.classList.remove("is-dragging");
            // Without InertiaPlugin there is no throw to snap the end of, so
            // settle by hand from wherever the pointer left the row.
            if (!hasInertia) settle(pressScroll - this.x);
          },
          /* Where a throw comes to rest, in the proxy's own coordinates. The
             row is only ever "right" with a card in the middle, so the landing
             scroll is rounded to one and converted back. */
          snap: {
            x: function (value) {
              var landing = pressScroll - value;
              var i = xToIndex(-(landing - trigger.start));
              return pressScroll - (trigger.start + -indexToX(i));
            },
          },
        })[0];

        function settle(from) {
          var i = xToIndex(-(clamp(from, trigger.start, trigger.end) - trigger.start));
          var to = trigger.start + -indexToX(i);
          gsap.to(
            { y: from },
            {
              y: to,
              duration: CONFIG.snapDuration,
              ease: ease,
              overwrite: true,
              onUpdate: function () {
                scrollSet(this.targets()[0].y);
              },
            },
          );
        }
      }

      /* The idle drift, in PIN terms: creep the scroll, and only while the
         section is actually pinned — outside that range the wall is not on
         screen and moving the scroll would carry the page off on its own. */
      motion = {
        /* A range check, NOT trigger.isActive. ScrollTrigger counts a trigger
           as active over [start, end) — the end itself is excluded — so the
           moment the drift walks the scroll onto trigger.end the trigger goes
           inactive, and a drift gated on isActive would be frozen out of the
           very frame in which it was about to turn around. It would reach the
           last card and stop there for good. An inclusive range with a pixel
           of slack at each side keeps the turn reachable, and still refuses to
           move the page while the wall is merely approaching rather than
           pinned. */
        active: function () {
          if (drag && (drag.isDragging || drag.isThrowing)) return false;
          var y = scrollNow();
          return y >= trigger.start - 2 && y <= trigger.end + 2;
        },
        advance: function (px) {
          var y = scrollNow() + px;
          if (y >= trigger.end) {
            scrollSet(trigger.end);
            return "end";
          }
          if (y <= trigger.start) {
            scrollSet(trigger.start);
            return "start";
          }
          scrollSet(y);
          return null;
        },
      };

      return function cleanup() {
        motion = null;
        if (drag) drag.kill();
        if (proxy && proxy.parentNode) proxy.parentNode.removeChild(proxy);
        wall.removeAttribute("data-pr-mode");
        stage.removeAttribute("data-pr-mode");
        // The scrub tween and its ScrollTrigger were created inside the
        // matchMedia context, so GSAP reverts those itself — including the x
        // it left on the track.
      };
    }

    // ══════════════════════════════════════════════════════════════════════
    // DECK MODE
    // ══════════════════════════════════════════════════════════════════════
    function setupDeck() {
      mode = "deck";
      depth = CONFIG.deck;
      wall.setAttribute("data-pr-mode", "deck");
      stage.setAttribute("data-pr-mode", "deck");

      if (!CONFIG.drag || !Draggable) {
        // No Draggable means no way to move the row, and a clipped stage with
        // no way to move it is a trap. Hand the scrolling back to the browser.
        stage.classList.remove("is-pinned");
        mode = null; // nothing bound: clicks and keys stay native
        wall.removeAttribute("data-pr-mode");
        stage.removeAttribute("data-pr-mode");
        return function () {};
      }

      var pressIndex = 0;

      var drag = Draggable.create(track, {
        type: "x",
        // The track is out of hit-testing (see .pr-track in the page CSS), so
        // a press in the gap between cards lands on the stage, not on it.
        trigger: stage,
        bounds: { minX: -travel, maxX: 0 },
        edgeResistance: CONFIG.edgeResistance,
        dragClickables: true,
        // Leaves vertical gestures to the page, so a swipe down the article
        // still scrolls past the wall instead of being swallowed by it.
        allowNativeTouchScrolling: true,
        inertia: hasInertia,
        throwResistance: CONFIG.throwResistance,
        cursor: "grab",
        activeCursor: "grabbing",
        /* The idle drift writes the track's x straight out from under
           Draggable, so by the time a finger lands its cached x can be stale
           by however far the wall has walked. Re-reading the element here —
           before Draggable records where this press began — is what stops the
           row jumping back to where the last gesture left it. */
        onPressInit: function () {
          this.update();
        },
        onPress: function () {
          pressIndex = xToIndex(this.x);
          stage.classList.add("is-dragging");
        },
        onRelease: function () {
          stage.classList.remove("is-dragging");
          if (!hasInertia) {
            // No throw to land: tween to the neighbour the swipe was heading
            // for, using the design system's own entrance curve.
            var i = clamp(
              xToIndex(this.x),
              pressIndex - CONFIG.deckStride,
              pressIndex + CONFIG.deckStride,
            );
            gsap.to(track, {
              x: indexToX(i),
              duration: CONFIG.snapDuration,
              ease: easeStage,
              overwrite: true,
            });
          }
        },
        /* A deck moves a card at a time. Left to itself a hard flick would
           sail through four of them and land on whatever happened to be
           nearest, which reads as a carousel that got away from you; clamping
           the landing to one card either side of where the finger went down is
           what makes it feel like pages rather than a conveyor. */
        snap: {
          x: function (value) {
            var i = clamp(
              xToIndex(value),
              pressIndex - CONFIG.deckStride,
              pressIndex + CONFIG.deckStride,
            );
            return indexToX(i);
          },
        },
      })[0];

      /* The idle drift, in DECK terms: nudge the track's x, which is the same
         property the finger moves. Positive px walks towards the last card,
         and x decreases as the row advances — hence the subtraction. */
      motion = {
        active: function () {
          return !(drag.isDragging || drag.isThrowing);
        },
        advance: function (px) {
          var x = gsap.getProperty(track, "x") - px;
          if (x <= -travel) {
            gsap.set(track, { x: -travel });
            return "end";
          }
          if (x >= 0) {
            gsap.set(track, { x: 0 });
            return "start";
          }
          gsap.set(track, { x: x });
          return null;
        },
      };

      return function cleanup() {
        motion = null;
        drag.kill();
        gsap.set(track, { x: 0 });
        wall.removeAttribute("data-pr-mode");
        stage.removeAttribute("data-pr-mode");
      };
    }

    /* ── go to a card, whichever mode is bound ──────────────────────────────
       The only place that has to know the difference, so the difference is
       written down once. */
    function goToIndex(i, animate) {
      i = clamp(i, 0, total - 1);
      if (mode === "deck") {
        gsap.to(track, {
          x: indexToX(i),
          duration: animate === false ? 0 : CONFIG.snapDuration,
          ease: easeStage,
          overwrite: true,
        });
        return;
      }
      var trigger = ST.getAll().filter(function (t) {
        return t.trigger === stage && t.pin;
      })[0];
      if (!trigger) return;
      var y = trigger.start + -indexToX(i);
      if (CLT && typeof CLT.scrollTo === "function") CLT.scrollTo(y);
      else window.scrollTo(0, y);
    }

    /* ── keyboard ───────────────────────────────────────────────────────────
       The stage is clipped, so tabbing to an off-screen card makes the browser
       scroll the PAGE to try to reveal it — which in PIN mode moves the scrub
       by an arbitrary amount and lands the card somewhere other than the
       middle, and in DECK mode does nothing at all. Either way the job has to
       be finished properly: put the focused card where it belongs. */
    function indexOfCard(el) {
      var card = el && el.closest ? el.closest(CARD) : null;
      if (!card) return -1;
      for (var i = 0; i < total; i++) {
        if (cards[i].el === card) return i;
      }
      return -1;
    }

    stage.addEventListener("focusin", function (event) {
      poke(); // someone is navigating the wall; stop walking it for them
      /* Keyboard focus only. A mouse press focuses the link too, and chasing
         that focus would start a scroll animation under the very drag the
         press is about to begin. Clicks are handled below instead. */
      var target = event.target;
      try {
        if (target && target.matches && !target.matches(":focus-visible")) return;
      } catch (e) {} // very old engines: no :focus-visible, keep the old behaviour
      var i = indexOfCard(target);
      if (i > -1) goToIndex(i);
    });

    /* ── click: centre first, open second ────────────────────────────────────
       A side card is turned away, shrunk and dimmed, so opening its article
       from a click is rarely what was meant. The first click brings it to the
       middle; a click on the centred card opens the article. Keyboard
       activation (detail 0) always opens — focus has already centred it — and
       modified clicks (new tab/window) are left to the browser. Draggable still
       swallows the click that ends a real drag, before this ever sees it. */
    stage.addEventListener("click", function (event) {
      if (!mode || event.detail === 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var i = indexOfCard(event.target);
      if (i < 0 || i === centred) return;
      event.preventDefault();
      poke();
      goToIndex(i);
    });

    // Arrow keys on the region itself, which is the other thing a keyboard
    // user will reach for once the row has focus.
    stage.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.target !== stage) return; // let the cards' own focus win
      event.preventDefault();
      goToIndex(centred + (event.key === "ArrowRight" ? 1 : -1));
    });

    /* ── refresh ────────────────────────────────────────────────────────────
       ScrollTrigger refreshes on resize, on font load and whenever clt-core
       re-measures the page. Sitting on both ends of that pass keeps the
       padding, the cached offsets and whichever mode is bound all describing
       the same row. */
    function refresh() {
      measure();
      var d = Draggable && Draggable.get(track);
      if (d) d.applyBounds({ minX: -travel, maxX: 0 });
      frame();
    }

    ST.addEventListener("refreshInit", correctPadding);
    ST.addEventListener("refresh", refresh);

    /* No ResizeObserver on the stage, deliberately. It looks like the obvious
       safety net — watch the box, re-measure when it changes — but in PIN mode
       the stage is the pinned element, so while the pin is engaged it is
       position:fixed and its width is whatever ScrollTrigger last set it to,
       which is not always the width it has in flow. An observer comparing
       those two numbers never sees them agree, asks for a refresh, is woken by
       the refresh, and asks again: the page then creeps down the screen on its
       own, forever. ScrollTrigger's own resize handling covers the real case;
       anything outside it should call CLT_PRESS.refresh(). */

    applyPadding();
    measure();

    /* ── bind a mode ────────────────────────────────────────────────────────
       matchMedia is what makes this safe to switch at runtime: everything a
       branch creates is recorded in its context and reverted when the query
       stops matching, so rotating a tablet swaps pin for deck without leaving
       a pinned spacer or a dead Draggable behind. */
    var mm = gsap.matchMedia();
    mm.add(PIN_QUERY, function () {
      var cleanup = setupPin();
      refresh();
      return cleanup;
    });
    mm.add("not all and " + PIN_QUERY, function () {
      var cleanup = setupDeck();
      refresh();
      return cleanup;
    });

    /* The modes are bound after this file's first measurement, and binding one
       changes the page's height. One refresh now settles the padding, the
       scrub distance and the drag bounds against the real layout; from here on
       refreshInit keeps them in step by itself. Deferred a frame so it lands
       after the arrival sequence. */
    requestAnimationFrame(function () {
      ST.refresh();
    });

    // Web fonts change the cards' height, not their width, so this is belt and
    // braces rather than a correction — but it costs one measurement.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(function () {});
    }

    window.CLT_PRESS = {
      /* The public escape hatch, for cards that arrive after load. It goes the
         long way round on purpose — re-deriving the padding and refreshing
         ScrollTrigger, not just re-caching offsets — because a card added or
         removed changes the track's width, and therefore the scrub distance
         and the drag bounds, which only a refresh can put right. */
      refresh: function () {
        applyPadding();
        ST.refresh();
      },
      goTo: goToIndex,
      config: CONFIG,
      mode: function () {
        return mode;
      },
      cards: function () {
        return cards.map(function (c) {
          return c.el;
        });
      },
    };
  }

  if (window.CLT && typeof window.CLT.ready === "function") {
    window.CLT.ready(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init(window.CLT);
    });
  } else {
    init(window.CLT);
  }
})();
