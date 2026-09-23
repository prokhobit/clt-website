/* CLT performance audit candidate. Standalone replacement; do not load with clt-core.js. */
(function () {
  "use strict";
  if (window.CLT && (window.CLT.__initialized || window.CLT.__booted)) return; // idempotent

  var mm = function (q) {
    return window.matchMedia(q).matches;
  };
  var env = {
    reducedMotion: mm("(prefers-reduced-motion: reduce)"),
    isTouch: mm("(pointer: coarse)"),
    isSmallViewport: mm("(max-width: 47.5rem)"),
  };

  // ── config (merge user CLT_CONFIG over defaults) ──────────────────────────
  var DEFAULTS = {
    density: 1.5,
    mobileDensity: 0.7,
    dust: true,
    smoothScroll: true,
    warp: 1.5,
    triggerSelector: ".clt-page",
    lenis: {
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
      prevent: function (node) {
        return !!(
          node &&
          node.closest &&
          node.closest(".clt-dialog, .clt-dialog__scroll, [data-lenis-prevent]")
        );
      },
    },
  };
  function mergeConfig(defaults, user) {
    var out = {},
      k;
    for (k in defaults) out[k] = defaults[k];
    if (user && typeof user === "object") {
      for (k in user) {
        if (k === "lenis" && user.lenis && typeof user.lenis === "object") {
          out.lenis = mergeConfig(defaults.lenis, user.lenis);
        } else {
          out[k] = user[k];
        }
      }
    }
    return out;
  }
  var config = mergeConfig(DEFAULTS, window.CLT_CONFIG);

  // ── utils ─────────────────────────────────────────────────────────────────
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function clamp(min, max, v) {
    return Math.min(max, Math.max(min, v));
  }
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments,
        c = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(c, a);
      }, ms);
    };
  }

  function framePointer(el, eventName, callback) {
    var pending = 0, x = 0, y = 0;
    el.addEventListener(eventName, function (event) {
      x = event.clientX; y = event.clientY;
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = 0;
        callback({ clientX: x, clientY: y });
      });
    }, { passive: true });
    el.addEventListener("pointerleave", function () {
      cancelAnimationFrame(pending); pending = 0;
    });
  }

  // ── ready queue ───────────────────────────────────────────────────────────
  var readyQueue = [],
    isReady = false;
  function ready(fn) {
    isReady ? fn(window.CLT) : readyQueue.push(fn);
  }
  function flushReady() {
    isReady = true;
    readyQueue.splice(0).forEach(function (fn) {
      try {
        fn(window.CLT);
      } catch (e) {
        console.warn("[CLT] ready cb", e);
      }
    });
  }

  // ── public surface (filled in by later tasks) ─────────────────────────────
  var CLT = (window.CLT = {
    __initialized: true,
    __booted: false,
    env: env,
    config: config,
    lenis: null,
    ready: ready,
    refresh: function () {},
    scrollX: function () {},
    scrollTo: function () {},
    stopScroll: function () {},
    startScroll: function () {},
    _util: { lerp: lerp, clamp: clamp, $: $, $all: $all, debounce: debounce },
  });

  function nativeScrollToTarget(target, opts) {
    opts = opts || {};
    var offset = parseFloat(opts.offset) || 0;
    var top = null;

    if (typeof target === "number") {
      top = target;
    } else if (typeof target === "string") {
      var node = null;
      try {
        node = document.querySelector(target);
      } catch (e) {}
      if (node) top = node.getBoundingClientRect().top + window.pageYOffset;
    } else if (target && typeof target.getBoundingClientRect === "function") {
      top = target.getBoundingClientRect().top + window.pageYOffset;
    } else if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView();
      return;
    }

    if (typeof top !== "number") return;

    try {
      window.scrollTo({
        top: Math.max(0, top + offset),
        left: 0,
        behavior: opts.immediate || env.reducedMotion ? "instant" : opts.behavior || "smooth",
      });
    } catch (e) {
      window.scrollTo(0, Math.max(0, top + offset));
    }
  }

  function publishLenisCompat(instance) {
    var api =
      instance ||
      (window.lenis && typeof window.lenis === "object" ? window.lenis : {});

    if (typeof api.scrollTo !== "function") {
      api.scrollTo = function (target, opts) {
        nativeScrollToTarget(target, opts);
      };
    }
    if (typeof api.resize !== "function") api.resize = function () {};
    if (typeof api.stop !== "function") api.stop = function () {};
    if (typeof api.start !== "function") api.start = function () {};
    if (!("scroll" in api)) {
      try {
        Object.defineProperty(api, "scroll", {
          configurable: true,
          get: function () {
            return window.pageYOffset || document.documentElement.scrollTop || 0;
          },
        });
      } catch (e) {}
    }
    if (!("velocity" in api)) api.velocity = 0;

    window.lenis = api;
    return api;
  }

  publishLenisCompat(null);

  function registerGsapPlugin(plugin) {
    var gsap = window.gsap;
    var register = gsap && gsap["register" + "Plugin"];
    if (plugin && typeof register === "function") register.call(gsap, plugin);
  }

  // Subscribe only while there is work; never change the shared GSAP ticker policy.
  var ticks = [], tickerActive = false, tickerGsap = null, frameId = 0;
  function syncTicker() {
    var needed = ticks.length > 0 && !document.hidden;
    if (needed === tickerActive) return;
    tickerActive = needed;
    if (needed) {
      tickerGsap = window.gsap || null;
      if (tickerGsap) tickerGsap.ticker.add(runTicks);
      else frameId = requestAnimationFrame(nativeTick);
    } else {
      if (tickerGsap) tickerGsap.ticker.remove(runTicks);
      else cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }
  function nativeTick(now) {
    frameId = 0;
    runTicks(now / 1000);
    if (tickerActive && !frameId) frameId = requestAnimationFrame(nativeTick);
  }
  function addTick(fn) {
    ticks.push(fn);
    syncTicker();
    return function () {
      var i = ticks.indexOf(fn);
      if (i !== -1) ticks.splice(i, 1);
      syncTicker();
    };
  }
  function runTicks(time) {
    ticks.slice().forEach(function (fn) {
      try { fn(time); }
      catch (error) {
        var i = ticks.indexOf(fn);
        if (i !== -1) ticks.splice(i, 1);
        console.warn("[CLT] disabled failing tick", error);
      }
    });
    syncTicker();
  }

  function ensureLenisCss() {
    if (document.getElementById("clt-lenis-css")) return;
    var style = document.createElement("style");
    style.id = "clt-lenis-css";
    style.textContent = [
      "html.lenis, html.lenis body{height:auto;}",
      ".lenis.lenis-smooth{scroll-behavior:auto!important;}",
      ".lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain;}",
      ".lenis.lenis-stopped{overflow:clip;}",
      ".lenis.lenis-stopped .clt-dialog[open]{overflow:hidden;}",
      ".lenis.lenis-smooth.lenis-scrolling iframe{pointer-events:none;}",
    ].join("");
    document.head.appendChild(style);
  }

  function ensureDialogCss() {
    if (document.getElementById("clt-dialog-css")) return;
    var style = document.createElement("style");
    style.id = "clt-dialog-css";
    style.textContent = [
      ".clt-dialog{max-height:min(92dvh,calc(100dvh - 2rem));overflow:hidden;}",
      ".clt-dialog[open]{overscroll-behavior:contain;}",
      ".clt-dialog.is-closing{pointer-events:none;}",
      ".clt-dialog::backdrop{opacity:0;background:rgb(0 0 0 / 0.72);transition:opacity .46s cubic-bezier(.16,1,.3,1);}",
      ".clt-dialog.is-open::backdrop{opacity:1;}",
      ".clt-dialog.is-closing::backdrop{opacity:0;}",
      ".clt-dialog__body{min-height:0;}",
      ".clt-dialog__scroll{max-height:min(62dvh,calc(100dvh - 15rem));overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}",
      ".clt-dialog__actions{flex-shrink:0;}",
      "html.clt-dialog-is-open,body.clt-dialog-is-open{overflow:hidden;overscroll-behavior:contain;}",
      "body.clt-dialog-is-fixed{position:fixed;left:0;right:0;width:100%;}",
    ].join("");
    document.head.appendChild(style);
  }

  // ── motion grammar · register the CSS easing curves as named GSAP eases ───
  // Mirrors the :root tokens in clt-master.css (--ease/--ease-stage/--ease-velvet)
  // so JS and CSS motion share one vocabulary. Fallbacks approximate the curves.
  function initMotion() {
    var gsap = window.gsap,
      CE = window.CustomEase;
    CLT.motion = {
      dur: { instant: 0.09, fast: 0.22, base: 0.38, slow: 0.7, curtain: 1.1 },
      ease: "power3.out",
      easeStage: "expo.out",
      easeVelvet: "power4.inOut",
    };
    if (!gsap || !CE) return;
    registerGsapPlugin(CE);
    CE.create("clt", "0.2,0.8,0.2,1");
    CE.create("clt-stage", "0.32,0.72,0,1");
    CE.create("clt-velvet", "0.65,0,0.05,1");
    CLT.motion.ease = "clt";
    CLT.motion.easeStage = "clt-stage";
    CLT.motion.easeVelvet = "clt-velvet";
  }

  function initScroll() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger,
      Lenis = window.Lenis;
    registerGsapPlugin(ST);

    if (config.smoothScroll && gsap && Lenis && !env.isTouch && !env.reducedMotion) {
      ensureLenisCss();
      var lenisOptions = mergeConfig(config.lenis, { autoRaf: false });
      var lenis = new Lenis(lenisOptions);
      CLT.lenis = lenis;
      publishLenisCompat(lenis);

      CLT.scrollTo = function (target, opts) {
        if (CLT.lenis && typeof CLT.lenis.scrollTo === "function") {
          CLT.lenis.scrollTo(target, opts || {});
        } else {
          nativeScrollToTarget(target, opts);
        }
      };
      CLT.stopScroll = function () {
        if (CLT.lenis && typeof CLT.lenis.stop === "function") CLT.lenis.stop();
      };
      CLT.startScroll = function () {
        if (CLT.lenis && typeof CLT.lenis.start === "function")
          CLT.lenis.start();
      };

      addTick(function (t) {
        lenis.raf(t * 1000);
      }); // ticker drives Lenis
      if (ST && typeof lenis.on === "function") lenis.on("scroll", ST.update);
    }

    if (!CLT.lenis) {
      publishLenisCompat(null);
      CLT.scrollTo = function (target, opts) {
        nativeScrollToTarget(target, opts);
      };
    }

    // ScrollTrigger already refreshes on resize/load. Keep explicit CLT requests
    // coalesced, including native-scroll pages without ScrollTrigger.
    CLT.refresh = debounce(function () {
      if (CLT.lenis) CLT.lenis.resize();
      if (ST) ST.refresh();
      document.dispatchEvent(new CustomEvent("clt:refresh"));
    }, 200);
    if (ST && typeof ST.addEventListener === "function") {
      ST.addEventListener("refresh", function () {
        if (CLT.lenis) CLT.lenis.resize();
        document.dispatchEvent(new CustomEvent("clt:refresh"));
      });
    }
  }

  function initLayoutRefresh() {
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) CLT.refresh();
    });
    // Capture late-loading images without observing every DOM mutation.
    // Only refresh when an image actually moved the layout: sized images
    // (Webflow writes width/height) load without changing the page height,
    // and a full ScrollTrigger refresh mid-scroll is a visible hitch.
    var lastHeight = document.documentElement.scrollHeight;
    var checkImageLayout = debounce(function () {
      var h = document.documentElement.scrollHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      CLT.refresh();
    }, 200);
    document.addEventListener("clt:refresh", function () {
      lastHeight = document.documentElement.scrollHeight;
    });
    document.addEventListener("load", function (event) {
      if (event.target.tagName === "IMG") checkImageLayout();
    }, true);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { CLT.refresh(); }).catch(function () {});
    }
  }
  CLT._addTick = addTick; // used by later modules (components, scrollX, dust)

  // ── horizontal-scroll hook: pages call CLT.scrollX(px); we lerp it on the
  //    ticker. Consumers (dust in Plan 2, ambient optionally) read CLT._scrollX.
  var scrollXTarget = 0;
  CLT._scrollX = 0;
  var stopScrollX = null;
  function initScrollX() {}
  CLT.scrollX = function (px) {
    scrollXTarget = Number.isFinite(+px) ? +px : 0;
    if (stopScrollX || CLT._scrollX === scrollXTarget) return;
    stopScrollX = addTick(function () {
      CLT._scrollX = lerp(CLT._scrollX, scrollXTarget, 0.1);
      if (Math.abs(CLT._scrollX - scrollXTarget) < 0.01) {
        CLT._scrollX = scrollXTarget;
        stopScrollX();
        stopScrollX = null;
      }
    });
  };

  // ── components ────────────────────────────────────────────────────────────

  function initDialogs(root) {
    root = root || document;
    ensureDialogCss();
    var pageLock = {
      active: false,
      y: 0,
      styles: null,
    };
    var dialogMotion = {
      durationIn: 0.68,
      durationOut: 0.34,
      easeIn: "expo.out",
      easeOut: "power3.inOut",
    };

    function getDialog(raw) {
      if (!raw) return null;
      raw = String(raw).trim();
      if (!raw) return null;
      if (raw.charAt(0) === "#") {
        try {
          return document.querySelector(raw);
        } catch (e) {
          return null;
        }
      }
      return document.getElementById(raw);
    }

    function getOpenDialogs() {
      return $all(".clt-dialog[open]");
    }

    function setPageDialogState(isOpen) {
      document.documentElement.classList.toggle("clt-dialog-is-open", isOpen);
      if (document.body)
        document.body.classList.toggle("clt-dialog-is-open", isOpen);
      if (isOpen) {
        CLT.stopScroll();
        lockPageScroll(arguments.length > 1 ? arguments[1] : undefined);
      } else if (!getOpenDialogs().length) {
        unlockPageScroll();
        CLT.startScroll();
      }
    }

    function getFocusTarget(d) {
      return d.querySelector(
        '[autofocus], [data-dialog-focus], [data-close-dialog], .clt-button, [href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
      );
    }

    function getScrollY() {
      if (CLT.lenis && typeof CLT.lenis.scroll === "number")
        return CLT.lenis.scroll;
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function lockPageScroll(y) {
      var html = document.documentElement;
      var body = document.body;
      if (!html || !body || pageLock.active) return;

      pageLock.y = typeof y === "number" ? y : getScrollY();
      pageLock.styles = {
        htmlOverflow: html.style.overflow,
        htmlOverscroll: html.style.overscrollBehavior,
        bodyPosition: body.style.position,
        bodyTop: body.style.top,
        bodyLeft: body.style.left,
        bodyRight: body.style.right,
        bodyWidth: body.style.width,
        bodyOverflow: body.style.overflow,
        bodyOverscroll: body.style.overscrollBehavior,
        bodyPaddingRight: body.style.paddingRight,
      };

      var gap = Math.max(0, window.innerWidth - html.clientWidth);
      var computedPadding =
        parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "contain";
      body.style.position = "fixed";
      body.style.top = "-" + pageLock.y + "px";
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "contain";
      if (gap > 0) body.style.paddingRight = computedPadding + gap + "px";
      body.classList.add("clt-dialog-is-fixed");
      pageLock.active = true;
    }

    function unlockPageScroll() {
      var html = document.documentElement;
      var body = document.body;
      if (!html || !body || !pageLock.active) return;

      var styles = pageLock.styles || {};
      var y = pageLock.y;
      html.style.overflow = styles.htmlOverflow || "";
      html.style.overscrollBehavior = styles.htmlOverscroll || "";
      body.style.position = styles.bodyPosition || "";
      body.style.top = styles.bodyTop || "";
      body.style.left = styles.bodyLeft || "";
      body.style.right = styles.bodyRight || "";
      body.style.width = styles.bodyWidth || "";
      body.style.overflow = styles.bodyOverflow || "";
      body.style.overscrollBehavior = styles.bodyOverscroll || "";
      body.style.paddingRight = styles.bodyPaddingRight || "";
      body.classList.remove("clt-dialog-is-fixed");
      pageLock.active = false;
      pageLock.styles = null;
      restoreScrollY(y);
    }

    function restoreScrollY(y) {
      if (typeof y !== "number") return;
      window.requestAnimationFrame(function () {
        var current =
          window.pageYOffset || document.documentElement.scrollTop || 0;
        if (Math.abs(current - y) < 3) return;

        if (CLT.lenis && typeof CLT.lenis.scrollTo === "function") {
          try {
            CLT.lenis.scrollTo(y, { immediate: true, force: true });
          } catch (e) {}
        }

        try {
          window.scrollTo({ top: y, left: 0, behavior: "auto" });
        } catch (e) {
          window.scrollTo(0, y);
        }
      });
    }

    function getDialogScroller(target, d) {
      if (!target || !target.closest) return null;
      var scroller = target.closest(
        ".clt-dialog__scroll, [data-lenis-prevent]",
      );
      if (!scroller || scroller === d || !d.contains(scroller)) return null;
      return scroller;
    }

    function stopScrollLeak(e) {
      if (e && e.cancelable) e.preventDefault();
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    }

    function containDialogScroll(e, d, deltaY) {
      if (!d || !d.open) return;
      var scroller = getDialogScroller(e.target, d);
      if (!scroller) {
        stopScrollLeak(e);
        return;
      }

      var max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) {
        stopScrollLeak(e);
        return;
      }

      var top = scroller.scrollTop;
      var atTop = top <= 0;
      var atBottom = top >= max - 1;
      if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
        stopScrollLeak(e);
      }
    }

    function focusDialog(d) {
      window.requestAnimationFrame(function () {
        var y = getScrollY();
        var target = getFocusTarget(d) || d;
        if (target === d && !d.hasAttribute("tabindex"))
          d.setAttribute("tabindex", "-1");
        if (target && typeof target.focus === "function") {
          try {
            target.focus({ preventScroll: true });
          } catch (e) {
            target.focus();
          }
        }
        restoreScrollY(y);
      });
    }

    function prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function getDialogMotionTargets(d) {
      return {
        close: d.querySelector(".clt-dialog__close"),
        body: d.querySelector(".clt-dialog__body"),
        actions: d.querySelector(".clt-dialog__actions"),
        scroller: d.querySelector(".clt-dialog__scroll"),
      };
    }

    function resetDialogMotion(d) {
      var gsap = window.gsap;
      if (!gsap || !d) return;
      var targets = getDialogMotionTargets(d);
      gsap.killTweensOf([
        d,
        targets.close,
        targets.body,
        targets.actions,
        targets.scroller,
      ]);
      gsap.set(
        [
          d,
          targets.close,
          targets.body,
          targets.actions,
          targets.scroller,
        ].filter(Boolean),
        { clearProps: "transform,opacity,visibility,filter,willChange" },
      );
    }

    function animateDialogOpen(d) {
      var gsap = window.gsap;
      if (!gsap || prefersReducedMotion()) {
        d.classList.remove("is-animating");
        return;
      }

      var targets = getDialogMotionTargets(d);
      d.classList.add("is-animating");
      gsap.killTweensOf(
        [
          d,
          targets.body,
          targets.actions,
          targets.close,
          targets.scroller,
        ].filter(Boolean),
      );
      gsap.set(d, {
        autoAlpha: 0,
        y: 30,
        scaleX: 0.958,
        scaleY: 0.972,
        filter: "blur(6px)",
        transformOrigin: "50% 50%",
        willChange: "transform, opacity, filter",
        force3D: true,
      });
      gsap.set([targets.body, targets.actions].filter(Boolean), {
        autoAlpha: 0,
        y: 14,
        willChange: "transform, opacity",
      });
      gsap.set(targets.close, {
        autoAlpha: 0,
        scaleX: 0.72,
        scaleY: 0.72,
        rotation: -24,
        willChange: "transform, opacity",
      });
      gsap.set(targets.scroller, { y: 8, willChange: "transform" });

      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete: function () {
            d.classList.remove("is-animating");
            resetDialogMotion(d);
          },
        })
        .to(
          d,
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            filter: "blur(0px)",
            duration: dialogMotion.durationIn,
            ease: dialogMotion.easeIn,
          },
          0,
        )
        .to(
          [targets.body, targets.actions].filter(Boolean),
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.12,
        )
        .to(targets.scroller, { y: 0, duration: 0.5, ease: "power3.out" }, 0.14)
        .to(
          targets.close,
          {
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            duration: 0.42,
            ease: "back.out(1.9)",
          },
          0.2,
        );
    }

    function animateDialogClose(d, done) {
      var gsap = window.gsap;
      if (!gsap || prefersReducedMotion()) {
        done();
        return;
      }

      var targets = getDialogMotionTargets(d);
      d.classList.add("is-animating");
      gsap.killTweensOf(
        [
          d,
          targets.body,
          targets.actions,
          targets.close,
          targets.scroller,
        ].filter(Boolean),
      );
      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete: function () {
            d.classList.remove("is-animating");
            done();
          },
        })
        .to(
          targets.close,
          {
            autoAlpha: 0,
            scaleX: 0.75,
            scaleY: 0.75,
            rotation: 18,
            duration: 0.18,
            ease: "power2.in",
          },
          0,
        )
        .to(
          [targets.actions, targets.body].filter(Boolean),
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.2,
            stagger: 0.025,
            ease: "power2.in",
          },
          0,
        )
        .to(
          d,
          {
            autoAlpha: 0,
            y: 20,
            scaleX: 0.982,
            scaleY: 0.986,
            filter: "blur(4px)",
            duration: dialogMotion.durationOut,
            ease: dialogMotion.easeOut,
          },
          0.03,
        );
    }

    function syncOpenButton(btn, d, isOpen) {
      if (!btn) return;
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (d && d.id) btn.setAttribute("aria-controls", d.id);
    }

    function isNativeDialogControl(node) {
      return !!(
        node &&
        ((window.HTMLButtonElement &&
          node instanceof window.HTMLButtonElement) ||
          (window.HTMLAnchorElement &&
            node instanceof window.HTMLAnchorElement) ||
          (window.HTMLInputElement && node instanceof window.HTMLInputElement))
      );
    }

    function prepareDialogControl(node) {
      if (!node) return;

      // Webflow buttons inside Forms can submit by default unless explicitly typed.
      if (
        window.HTMLButtonElement &&
        node instanceof window.HTMLButtonElement &&
        !node.hasAttribute("type")
      ) {
        node.setAttribute("type", "button");
      }

      // Allows Webflow Div Blocks to be used when necessary.
      if (!isNativeDialogControl(node)) {
        if (!node.hasAttribute("role")) node.setAttribute("role", "button");
        if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "0");
      }
    }

    function prepareDialog(d) {
      if (!d) return;
      d.setAttribute("data-lenis-prevent", "");
      if (!d.hasAttribute("aria-modal")) d.setAttribute("aria-modal", "true");

      $all(".clt-dialog__scroll", d).forEach(function (scroller) {
        scroller.setAttribute("data-lenis-prevent", "");
        if (!scroller.hasAttribute("tabindex"))
          scroller.setAttribute("tabindex", "0");
        if (
          !scroller.hasAttribute("aria-label") &&
          !scroller.hasAttribute("aria-labelledby")
        ) {
          scroller.setAttribute("aria-label", "Dialog details");
        }
      });

      $all("[data-close-dialog]", d).forEach(prepareDialogControl);
    }

    function stopCommandEvent(e) {
      if (e && e.cancelable) e.preventDefault();
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
      if (e && typeof e.stopImmediatePropagation === "function")
        e.stopImmediatePropagation();
    }

    function dispatchAgree(control, d) {
      if (!control || !control.hasAttribute("data-terms-agree")) return;
      try {
        control.dispatchEvent(
          new CustomEvent("clt:terms-agree", {
            bubbles: true,
            detail: { dialog: d, control: control },
          }),
        );
      } catch (e) {}
    }

    function openDialog(d, opener) {
      if (!d) return;
      var y = getScrollY();
      prepareDialog(d);
      d.__cltDialogOpener = opener || document.activeElement || null;
      setPageDialogState(true, y);

      if (d.open) {
        d.classList.add("is-open");
        syncOpenButton(opener, d, true);
        focusDialog(d);
        restoreScrollY(y);
        return;
      }

      try {
        if (typeof d.showModal === "function") {
          d.showModal();
          d.__cltDialogFallback = false;
        } else {
          d.setAttribute("open", "");
          d.__cltDialogFallback = true;
        }
      } catch (e) {
        d.setAttribute("open", "");
        d.__cltDialogFallback = true;
      }

      d.classList.add("is-open");
      d.setAttribute("aria-modal", "true");
      syncOpenButton(opener, d, true);
      animateDialogOpen(d);
      focusDialog(d);
      restoreScrollY(y);
    }

    function finishClose(d) {
      if (!d) return;
      d.classList.remove("is-open");
      d.classList.remove("is-closing", "is-animating");
      resetDialogMotion(d);

      var opener = d.__cltDialogOpener;
      if (opener && document.contains(opener)) {
        syncOpenButton(opener, d, false);
        if (typeof opener.focus === "function") {
          try {
            opener.focus({ preventScroll: true });
          } catch (e) {
            opener.focus();
          }
        }
      }

      d.__cltDialogOpener = null;
      setPageDialogState(!!getOpenDialogs().length);
      if (typeof CLT.refresh === "function") CLT.refresh();
    }

    function closeDialog(d, value) {
      if (!d) return;
      if (d.__cltDialogClosing) return;
      d.__cltDialogClosing = true;
      d.classList.add("is-closing");

      animateDialogClose(d, function () {
        d.__cltDialogClosing = false;
        d.classList.remove("is-closing");

        if (typeof d.close === "function" && d.open && !d.__cltDialogFallback) {
          d.close(value || "");
        } else {
          d.removeAttribute("open");
          finishClose(d);
        }
      });
    }

    function commandControlFromEvent(e, selector) {
      var target = e && e.target;
      if (!target || !target.closest) return null;
      var control = target.closest(selector);
      if (!control) return null;
      if (root !== document && !root.contains(control)) return null;
      return control;
    }

    function handleOpenCommand(e, control) {
      if (!control) return false;
      stopCommandEvent(e);
      prepareDialogControl(control);
      control.setAttribute("aria-haspopup", "dialog");
      control.setAttribute("aria-expanded", "false");
      openDialog(getDialog(control.getAttribute("data-open-dialog")), control);
      return true;
    }

    function handleCloseCommand(e, control) {
      if (!control) return false;
      stopCommandEvent(e);
      prepareDialogControl(control);

      var d =
        (control.closest && control.closest(".clt-dialog")) ||
        getDialog(control.getAttribute("data-close-dialog"));
      dispatchAgree(control, d);
      closeDialog(d, control.getAttribute("data-close-dialog") || "");
      return true;
    }

    CLT.dialogs = CLT.dialogs || {};
    CLT.dialogs.open = function (target) {
      openDialog(typeof target === "string" ? getDialog(target) : target);
    };
    CLT.dialogs.close = function (target, value) {
      closeDialog(
        typeof target === "string" ? getDialog(target) : target,
        value,
      );
    };

    $all("[data-open-dialog]", root).forEach(function (btn) {
      prepareDialogControl(btn);
      btn.setAttribute("aria-haspopup", "dialog");
      btn.setAttribute("aria-expanded", "false");

      var target = getDialog(btn.getAttribute("data-open-dialog"));
      if (target && target.id) btn.setAttribute("aria-controls", target.id);
    });

    $all(".clt-dialog", root).forEach(function (d) {
      prepareDialog(d);

      if (d.__cltDialogReady) return;
      d.__cltDialogReady = true;

      d.addEventListener("click", function (e) {
        if (e.target === d && !d.hasAttribute("data-dialog-static"))
          closeDialog(d, "dismiss");
      });

      d.addEventListener(
        "wheel",
        function (e) {
          containDialogScroll(e, d, e.deltaY || 0);
        },
        { passive: false },
      );

      var lastTouchY = 0;
      d.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches && e.touches.length) lastTouchY = e.touches[0].clientY;
        },
        { passive: true },
      );

      d.addEventListener(
        "touchmove",
        function (e) {
          if (!e.touches || !e.touches.length) return;
          var nextY = e.touches[0].clientY;
          var deltaY = lastTouchY - nextY;
          lastTouchY = nextY;
          containDialogScroll(e, d, deltaY);
        },
        { passive: false },
      );

      d.addEventListener("cancel", function (e) {
        if (d.hasAttribute("data-dialog-static")) e.preventDefault();
      });

      d.addEventListener("close", function () {
        finishClose(d);
      });
    });

    if (!CLT.__dialogDelegationReady) {
      CLT.__dialogDelegationReady = true;

      document.addEventListener(
        "click",
        function (e) {
          var closeControl = commandControlFromEvent(e, "[data-close-dialog]");
          if (closeControl) {
            handleCloseCommand(e, closeControl);
            return;
          }

          var openControl = commandControlFromEvent(e, "[data-open-dialog]");
          if (openControl) handleOpenCommand(e, openControl);
        },
        true,
      );

      document.addEventListener(
        "keydown",
        function (e) {
          if (e.key !== "Enter" && e.key !== " ") return;

          var closeControl = commandControlFromEvent(e, "[data-close-dialog]");
          if (closeControl && !isNativeDialogControl(closeControl)) {
            handleCloseCommand(e, closeControl);
            return;
          }

          var openControl = commandControlFromEvent(e, "[data-open-dialog]");
          if (openControl && !isNativeDialogControl(openControl))
            handleOpenCommand(e, openControl);
        },
        true,
      );

      document.addEventListener(
        "submit",
        function (e) {
          var submitter = e.submitter || document.activeElement;
          if (
            submitter &&
            submitter.closest &&
            submitter.closest("[data-open-dialog], [data-close-dialog]")
          ) {
            stopCommandEvent(e);
          }
        },
        true,
      );
    }
  }

  function initTabs(root) {
    $all("[data-clt-tabs]", root || document).forEach(function (tabs) {
      if (tabs.__cltTabsReady) return;
      tabs.__cltTabsReady = true;

      var btns = $all(".clt-tab", tabs);
      if (!btns.length) return;

      var scope =
        (tabs.closest && tabs.closest("[data-clt-tabs-scope]")) ||
        tabs.parentElement ||
        document;
      var panels = $all("[data-panel]", scope);
      if (!panels.length) panels = $all("[data-panel]");

      function panelMatches(panel, id, controls) {
        return (
          (controls && panel.id === controls) ||
          (id && panel.getAttribute("data-panel") === id)
        );
      }

      function move(active) {
        tabs.style.setProperty("--tab-x", active.offsetLeft + "px");
        tabs.style.setProperty("--tab-w", active.offsetWidth + "px");
        tabs.classList.add("is-ready");
      }

      function activate(active, focus) {
        var id = active.getAttribute("data-tab");
        var controls = active.getAttribute("aria-controls");

        btns.forEach(function (x) {
          var isActive = x === active;
          x.setAttribute("aria-selected", isActive ? "true" : "false");
          x.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        panels.forEach(function (panel) {
          var shouldShow = panelMatches(panel, id, controls);
          panel.hidden = !shouldShow;
        });

        move(active);
        if (focus && typeof active.focus === "function") active.focus();
      }

      btns.forEach(function (t, index) {
        t.addEventListener("click", function () {
          activate(t, false);
        });
        t.addEventListener("keydown", function (e) {
          var key = e.key;
          if (
            key !== "ArrowRight" &&
            key !== "ArrowDown" &&
            key !== "ArrowLeft" &&
            key !== "ArrowUp" &&
            key !== "Home" &&
            key !== "End"
          )
            return;
          e.preventDefault();

          var next = index;
          if (key === "ArrowRight" || key === "ArrowDown")
            next = (index + 1) % btns.length;
          if (key === "ArrowLeft" || key === "ArrowUp")
            next = (index - 1 + btns.length) % btns.length;
          if (key === "Home") next = 0;
          if (key === "End") next = btns.length - 1;
          activate(btns[next], true);
        });
      });

      var sel = tabs.querySelector('.clt-tab[aria-selected="true"]') || btns[0];
      if (sel)
        requestAnimationFrame(function () {
          activate(sel, false);
        });
      window.addEventListener(
        "resize",
        debounce(function () {
          var s = tabs.querySelector('.clt-tab[aria-selected="true"]');
          if (s) move(s);
        }, 150),
      );
    });
  }

  function initToggle(root) {
    $all("[data-clt-toggle]", root || document).forEach(function (tg) {
      if (tg.__cltToggleReady) return;
      tg.__cltToggleReady = true;

      var opts = $all(".clt-toggle-group__option", tg);
      if (!opts.length) return;

      function move(active) {
        tg.style.setProperty("--tg-x", active.offsetLeft + "px");
        tg.style.setProperty("--tg-w", active.offsetWidth + "px");
        tg.classList.add("is-ready");
      }

      function activate(active, focus) {
        opts.forEach(function (x) {
          var isActive = x === active;
          x.setAttribute("aria-pressed", isActive ? "true" : "false");
          x.setAttribute("tabindex", isActive ? "0" : "-1");
        });
        move(active);
        if (focus && typeof active.focus === "function") active.focus();
      }

      opts.forEach(function (o, index) {
        o.addEventListener("click", function () {
          activate(o, false);
        });
        o.addEventListener("keydown", function (e) {
          var key = e.key;
          if (
            key !== "ArrowRight" &&
            key !== "ArrowDown" &&
            key !== "ArrowLeft" &&
            key !== "ArrowUp" &&
            key !== "Home" &&
            key !== "End"
          )
            return;
          e.preventDefault();

          var next = index;
          if (key === "ArrowRight" || key === "ArrowDown")
            next = (index + 1) % opts.length;
          if (key === "ArrowLeft" || key === "ArrowUp")
            next = (index - 1 + opts.length) % opts.length;
          if (key === "Home") next = 0;
          if (key === "End") next = opts.length - 1;
          activate(opts[next], true);
        });
      });

      var sel = tg.querySelector('[aria-pressed="true"]') || opts[0];
      if (sel)
        requestAnimationFrame(function () {
          activate(sel, false);
        });
      window.addEventListener(
        "resize",
        debounce(function () {
          var s = tg.querySelector('[aria-pressed="true"]');
          if (s) move(s);
        }, 150),
      );
    });
  }

  // ── Person-card flip: horizontal collapsed ⇄ expanded vertical (GSAP Flip) ──
  function initCardFlip(root) {
    var gsap = window.gsap,
      Flip = window.Flip;
    if (gsap && Flip && !initCardFlip.__reg) {
      gsap.registerPlugin(Flip);
      initCardFlip.__reg = true;
    }
    $all("[data-clt-cardflip]", root || document).forEach(function (card) {
      if (card.__cltCardFlipReady) return;
      card.__cltCardFlipReady = true;

      var toggle = card.querySelector("[data-card-toggle]");
      if (!toggle) return;
      if (!card.hasAttribute("data-expanded"))
        card.setAttribute("data-expanded", "false");

      function syncLabel() {
        var expanded = card.getAttribute("data-expanded") === "true";
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        var lbl = toggle.querySelector(".label");
        if (lbl) lbl.textContent = expanded ? "Hide bio" : "Read bio";
      }
      syncLabel();

      toggle.addEventListener("click", function () {
        var next =
          card.getAttribute("data-expanded") === "true" ? "false" : "true";

        // No GSAP/Flip or reduced motion → instant, accessible toggle.
        if (
          !gsap ||
          !Flip ||
          (window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        ) {
          card.setAttribute("data-expanded", next);
          syncLabel();
          return;
        }

        // FLIP: measure the whole grid + the nested parts that resize/move, so the
        // avatar scales, text repositions, and sibling cards reflow without jumps.
        var expanding = next === "true";
        var grid = card.parentElement || card;
        var targets = $all(
          ".clt-person-card, .clt-person-card .avatar, .clt-person-card .seal, " +
            ".clt-person-card .body, .clt-person-card .role, .clt-person-card .name, " +
            ".clt-person-card .bio, .clt-person-card .socials, .clt-person-card .flip-toggle",
          grid,
        );
        // A second click mid-morph: land the running one first, so the new
        // measurement starts from a settled layout, not a half-built one.
        if (grid.__cltFlip) {
          grid.__cltFlip.progress(1).kill();
          grid.__cltFlip = null;
        }
        var state = Flip.getState(targets);
        var cards = $all(".clt-person-card", grid);
        // .clt-panel transitions transform/box-shadow in CSS; left on, it
        // chases every frame Flip writes and the cards lag and snap back.
        cards.forEach(function (c) { c.style.transition = "none"; });

        card.setAttribute("data-expanded", next);
        syncLabel();

        grid.__cltFlip = Flip.from(state, {
          // ease-out + longer to open, ease-in + faster to close (exit < enter)
          duration: expanding ? 0.6 : 0.44,
          ease: expanding ? "power3.out" : "power3.in",
          absolute: true, // take movers out of flow → siblings don't jump mid-tween
          nested: true, // correctly handle nested transforms (avatar inside card)
          prune: true, // skip targets that didn't actually change
          onEnter: function (els) {
            return gsap.fromTo(
              els,
              { opacity: 0, scale: 0.92 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                delay: expanding ? 0.1 : 0,
                ease: "power2.out",
              },
            );
          },
          onLeave: function (els) {
            return gsap.to(els, {
              opacity: 0,
              scale: 0.95,
              duration: 0.22,
              ease: "power1.in",
            });
          },
          onComplete: function () {
            var self = grid.__cltFlip;
            // Transitions back on only after Flip's own cleanup has been
            // resolved — same tick, and the snap from its last transform to
            // none becomes a CSS transition of its own.
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                if (grid.__cltFlip && grid.__cltFlip !== self) return; // newer flip
                grid.__cltFlip = null;
                void grid.offsetWidth;
                cards.forEach(function (c) { c.style.transition = ""; });
              });
            });
            CLT.refresh(); // card height changed → re-measure triggers below
          },
        });
      });
    });
  }

  function initSectionNav(root) {
    $all("[data-clt-sectionnav]", root || document).forEach(function (nav) {
      var links = $all(".clt-sectionnav__link", nav);
      if (!links.length) return;
      // Cache the scroll range so we don't force a layout (scrollHeight read)
      // on every scroll event — only on init and resize.
      var max = 1, lastIndex = -1, lastProgress = null;
      function measure() {
        max = document.documentElement.scrollHeight - window.innerHeight || 1;
      }
      function update() {
        var y =
          CLT.lenis && typeof CLT.lenis.scroll === "number"
            ? CLT.lenis.scroll
            : window.scrollY || 0;
        var frac = clamp(0, 1, y / max);
        var progress = frac.toFixed(3);
        if (progress !== lastProgress) nav.style.setProperty("--progress", progress);
        lastProgress = progress;
        var idx = Math.min(links.length - 1, Math.floor(frac * links.length));
        if (idx === lastIndex) return;
        lastIndex = idx;
        links.forEach(function (l, i) {
          l.classList.toggle("is-passed", i < idx);
          l.classList.toggle("is-current", i === idx);
          if (i === idx) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      }
      // rAF-throttle scroll so update runs at most once per frame.
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          update();
        });
      }
      function onResize() {
        measure();
        update();
      }
      measure();
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", debounce(onResize, 150));
      document.addEventListener("clt:refresh", onResize);
    });
  }

  // ── Jump-nav (.clt-jumpnav) — scroll-spy + docking ────────────────────────
  // Spy: lights the link whose section is under the reading line (38% down
  // the viewport). At the very bottom of the page the last link wins, so a
  // short closing section can still light. A click lights its link at once
  // and the spy stays out of the way until that scroll settles, so the pill
  // doesn't flick through every section in between.
  // Dock: once the nav scrolls up under the site navbar it pins there
  // (.is-docked) and follows the reader down the page — always beneath the
  // Glass Nav (see dockOffset); a spacer holds its
  // old place so nothing below jumps. It is moved to <body> while docked,
  // because position:fixed inside a transformed ancestor (reveals, parallax)
  // would pin to that ancestor instead of the viewport.
  // Opt out: data-clt-jumpnav="static" (no spy, no dock) or
  // data-clt-jumpnav-dock="off" (spy only). data-clt-jumpnav-offset="<px>"
  // overrides the gap measured under the navbar.
  function initJumpNav(root) {
    $all(".clt-jumpnav", root || document).forEach(function (nav) {
      if (nav.__cltJumpNav || nav.getAttribute("data-clt-jumpnav") === "static") return;
      var items = [];
      $all('a[href^="#"]', nav).forEach(function (link) {
        var id = link.getAttribute("href").slice(1);
        var target = null;
        try { target = id && document.getElementById(decodeURIComponent(id)); } catch (e) {}
        if (target) items.push({ link: link, target: target });
      });
      if (!items.length) return;
      nav.__cltJumpNav = true;

      var current = -1;
      function revealCurrent() {
        if (current < 0 || nav.scrollWidth <= nav.clientWidth + 1) return;
        var nr = nav.getBoundingClientRect();
        var lr = items[current].link.getBoundingClientRect();
        nav.scrollTo({
          left: nav.scrollLeft + (lr.left - nr.left) - (nav.clientWidth - lr.width) / 2,
          behavior: env.reducedMotion ? "auto" : "smooth",
        });
      }
      function setCurrent(idx) {
        if (idx === current) return;
        current = idx;
        items.forEach(function (it, i) {
          it.link.classList.toggle("is-current", i === idx);
          if (i === idx) it.link.setAttribute("aria-current", "true");
          else it.link.removeAttribute("aria-current");
        });
        revealCurrent(); // the pill scrolls sideways when it overflows
      }

      function spy() {
        var vh = window.innerHeight;
        var doc = document.documentElement;
        var y = window.scrollY || window.pageYOffset || 0;
        if (y > 0 && y + vh >= doc.scrollHeight - 2) return setCurrent(items.length - 1);
        var line = vh * 0.38, idx = 0, best = -Infinity;
        items.forEach(function (it, i) {
          var top = it.target.getBoundingClientRect().top;
          if (top <= line && top > best) { best = top; idx = i; }
        });
        setCurrent(idx);
      }

      // ── docking
      var canDock = nav.getAttribute("data-clt-jumpnav-dock") !== "off";
      var docked = false, spacer = null, home = null, homeNext = null;
      function dockOffset() {
        var fixed = parseFloat(nav.getAttribute("data-clt-jumpnav-offset"));
        if (!isNaN(fixed)) return fixed;
        // The site's Glass Nav (Webflow shared-footer component, shadow DOM)
        // publishes its clearance on <html> as --clt-nav-offset: bar + current-
        // page strip + 16px on desktop, just 16px below 1024px where the bar
        // moves to the bottom of the screen. Read the inline value first — it
        // costs no style recalc on every scroll frame.
        var root = document.documentElement;
        var navOffset = parseFloat(
          root.style.getPropertyValue("--clt-nav-offset") ||
          getComputedStyle(root).getPropertyValue("--clt-nav-offset")
        );
        if (!isNaN(navOffset)) return navOffset;
        // Fallback: a design-system .clt-navbar stuck to the top.
        var bottom = 0;
        $all(".clt-navbar-shell, .clt-navbar").forEach(function (bar) {
          var pos = getComputedStyle(bar).position;
          if (pos !== "fixed" && pos !== "sticky") return;
          var r = bar.getBoundingClientRect();
          if (r.top <= 1 && r.bottom > bottom) bottom = r.bottom;
        });
        return bottom + 10;
      }
      function dock(on, offset) {
        if (on === docked) return;
        docked = on;
        if (on) {
          var cs = getComputedStyle(nav);
          spacer = spacer || document.createElement("div");
          spacer.className = "clt-jumpnav-spacer";
          spacer.setAttribute("aria-hidden", "true");
          spacer.style.height = nav.offsetHeight + "px";
          spacer.style.marginTop = cs.marginTop;
          spacer.style.marginBottom = cs.marginBottom;
          home = nav.parentNode;
          homeNext = nav.nextSibling;
          home.insertBefore(spacer, nav);
          nav.style.setProperty("--clt-jumpnav-top", offset + "px");
          document.body.appendChild(nav);
          nav.classList.add("is-docked");
          // A docked nav is always shown. If a reveal ([data-clt-reveal] on
          // the nav) hadn't played yet — page reloaded mid-scroll, or opened
          // on a #section link — its hidden start state would otherwise
          // follow the nav into the dock and it would never appear.
          if (window.gsap) {
            window.gsap.killTweensOf(nav);
            window.gsap.set(nav, { clearProps: "opacity,visibility,transform,willChange" });
          }
        } else {
          nav.classList.remove("is-docked");
          nav.style.removeProperty("--clt-jumpnav-top");
          if (home) home.insertBefore(nav, spacer && spacer.parentNode === home ? spacer : homeNext);
          if (spacer && spacer.parentNode) spacer.parentNode.removeChild(spacer);
        }
        revealCurrent();
      }
      function checkDock() {
        if (!canDock) return;
        var offset = dockOffset();
        var anchor = docked ? spacer : nav;
        var shouldDock = anchor.getBoundingClientRect().top < offset;
        if (docked && shouldDock) nav.style.setProperty("--clt-jumpnav-top", offset + "px");
        dock(shouldDock, offset);
      }

      // Jump targets clear the docked nav as well as the Glass Nav: the
      // html scroll-padding covers the Glass Nav, scroll-margin (honoured by
      // native anchors and Lenis alike) adds the docked row plus a 12px gap.
      // Measured as one row of links — the docked form — even while the nav
      // is still wrapped over two rows in the hero.
      function setClearance() {
        if (!canDock) return;
        var cs = getComputedStyle(nav);
        var row = items[0].link.offsetHeight +
          parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) +
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        items.forEach(function (it) { it.target.style.scrollMarginTop = Math.ceil(row + 12) + "px"; });
      }

      // Click lock — released 160ms after the last scroll event of the jump.
      var locked = false, unlockTimer = 0;
      function relock() {
        clearTimeout(unlockTimer);
        unlockTimer = setTimeout(function () { locked = false; spy(); }, 160);
      }
      items.forEach(function (it, i) {
        it.link.addEventListener("click", function () {
          setCurrent(i);
          locked = true;
          relock();
        });
      });

      var ticking = false;
      function frame() {
        ticking = false;
        checkDock();
        if (!locked) spy();
      }
      function onScroll() {
        if (locked) relock();
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(frame);
      }
      // Undock only when the width changed: that is what can re-wrap the nav
      // and change the height its spacer must hold. Height-only resizes (the
      // mobile URL bar) and layout refreshes (fonts, lazy images, pinning)
      // keep it docked — pulling it back into the page and re-docking on
      // every refresh made it blink.
      var lastWidth = window.innerWidth;
      function onResize() {
        var w = window.innerWidth;
        if (docked && w !== lastWidth) dock(false);
        lastWidth = w;
        setClearance();
        frame();
      }
      function onRefresh() {
        setClearance();
        frame();
      }
      setClearance();
      frame();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", debounce(onResize, 150));
      document.addEventListener("clt:refresh", onRefresh);
    });
  }

  // ── Button arrow → treble clef (.clt-button__arrow) ────────────────────────
  // Upgrades a plain "→" arrow to an inline SVG carrying both strokes. With
  // GSAP MorphSVGPlugin loaded the arrow morphs into the clef on hover/focus
  // and back on leave; without it, clt-master.css un-draws the arrow and pens
  // the clef in. The arrow path retraces its shaft so it is one subpath, like
  // the clef — that is what keeps the morph clean. Opt out with
  // data-clt-clef="off" on the button or any ancestor.
  var CLEF_ARROW_D = "M13.5 6.5L19 12L4 12L19 12L13.5 17.5";
  var CLEF_D =
    "M12.9 15.4C12.2 15.6 11.3 15.1 11.4 14.2C11.5 13.2 12.5 12.6 13.5 12.8" +
    "C14.7 13 15.4 14.1 15.3 15.3C15.2 16.9 13.9 18.2 12.1 18.2" +
    "C9.9 18.2 8.3 16.6 8.4 14.6C8.5 12.4 10.2 10.9 12 9.4" +
    "C13.8 7.9 15.1 6.3 14.9 4.2C14.8 2.8 14.1 1.7 13.4 1.7" +
    "C12.4 1.7 11.7 3.3 11.7 5.3C11.7 7.6 12.4 11 13 14.6L13.4 20.3" +
    "C13.5 21.9 12.8 22.8 11.7 22.8C10.8 22.8 10.2 22.2 10.3 21.5";

  function initButtonClef(root) {
    var gsap = window.gsap;
    var Morph = window.MorphSVGPlugin;
    var canMorph = !!(gsap && Morph) && !env.reducedMotion;
    if (canMorph) gsap.registerPlugin(Morph);
    var NS = "http://www.w3.org/2000/svg";

    function makePath(d, cls) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", cls);
      p.setAttribute("pathLength", "1");
      return p;
    }

    $all(".clt-button__arrow", root || document).forEach(function (el) {
      if (el.classList.contains("is-clef")) return;
      var btn = el.closest(".clt-button");
      if (!btn || btn.closest('[data-clt-clef="off"]')) return;
      if (el.children.length || el.textContent.trim() !== "→") return;

      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      var arrow = makePath(CLEF_ARROW_D, "clt-clef__arrow");
      arrow.setAttribute("stroke-width", "2.1"); // explicit, so the morph tweens from it
      var clef = makePath(CLEF_D, "clt-clef__clef");
      svg.appendChild(arrow);
      svg.appendChild(clef);
      el.textContent = "";
      el.appendChild(svg);
      el.classList.add("is-clef");

      if (!canMorph) return; // CSS draw-swap fallback handles it
      el.classList.add("is-morph");
      var tween = gsap.to(arrow, {
        morphSVG: { shape: clef, type: "rotational" },
        attr: { "stroke-width": 1.7 },
        duration: 0.6,
        ease: "power2.inOut",
        paused: true,
      });
      var play = function () { tween.timeScale(1).play(); };
      var back = function () { tween.timeScale(1.25).reverse(); };
      btn.addEventListener("pointerenter", play);
      btn.addEventListener("pointerleave", back);
      btn.addEventListener("focus", play);
      btn.addEventListener("blur", back);
    });
  }

  function initAmbientParallax() {
    var layers = $all(".clt-ambient");
    if (!layers.length) return; // base + any Acts buffer
    if (env.reducedMotion || env.isTouch) return; // pointer-driven; skip on touch
    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      cs = 0, lastValues = "", stopAmbient = null;
    function wakeAmbient() {
      if (!stopAmbient) stopAmbient = addTick(updateAmbient);
    }
    window.addEventListener("scroll", wakeAmbient, { passive: true });
    window.addEventListener(
      "pointermove",
      function (e) {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        wakeAmbient();
      },
      { passive: true },
    );
    function updateAmbient() {
      cx = lerp(cx, tx, 0.05);
      cy = lerp(cy, ty, 0.05);
      var ts = window.scrollY || 0;
      cs = lerp(cs, ts, 0.045);
      var ax = cx.toFixed(3),
        ay = cy.toFixed(3),
        scr = cs.toFixed(1) + "px";
      var values = ax + "," + ay + "," + scr;
      if (Math.abs(cx - tx) < 0.0005 && Math.abs(cy - ty) < 0.0005 && Math.abs(cs - ts) < 0.05) {
        if (stopAmbient) stopAmbient();
        stopAmbient = null;
      }
      if (values === lastValues) return;
      lastValues = values;
      for (var i = 0; i < layers.length; i++) {
        layers[i].style.setProperty("--ax", ax);
        layers[i].style.setProperty("--ay", ay);
        layers[i].style.setProperty("--scr", scr);
      }
    }
    wakeAmbient();
  }

  function initPanelOrb() {
    if (env.reducedMotion || env.isTouch) return;
    var active = null,
      pmx = 50,
      pmy = 50,
      cmx = 50,
      cmy = 50, stopOrb = null;
    var panels = $all(
      ".clt-panel:not(.is-carved):not(.is-marquee):not(.is-noir):not(.is-frame)",
    );
    if (!panels.length) return;
    panels.forEach(function (p) {
      p.addEventListener("pointerenter", function () {
        active = p;
        if (!stopOrb) stopOrb = addTick(updateOrb);
        cmx = pmx;
        cmy = pmy;
        p.style.setProperty("--orb", "1");
      });
      p.addEventListener("pointerleave", function () {
        p.style.setProperty("--orb", "0");
        if (active === p) {
          active = null;
          if (stopOrb) stopOrb();
          stopOrb = null;
        }
      });
      framePointer(p, "pointermove", function (e) {
        var r = p.getBoundingClientRect();
        pmx = ((e.clientX - r.left) / r.width) * 100;
        pmy = ((e.clientY - r.top) / r.height) * 100;
      });
    });
    function updateOrb() {
      if (!active) return;
      cmx = lerp(cmx, pmx, 0.16);
      cmy = lerp(cmy, pmy, 0.16);
      active.style.setProperty("--mx", cmx.toFixed(2) + "%");
      active.style.setProperty("--my", cmy.toFixed(2) + "%");
    }
  }

  // ── dust canopy (folded from clt-home-dust.js; consumes CLT.lenis + ticker)
  function initDust() {
    if (!config.dust) return;
    var gsap = window.gsap;
    if (!gsap) return; // needs gsap.quickSetter
    var far = $("#dust-far"),
      mid = $("#dust-mid"),
      near = $("#dust-near");
    var containers = [far, mid, near].filter(Boolean);
    if (!containers.length) return;

    var ST = window.ScrollTrigger,
      reduced = env.reducedMotion;
    var warp = typeof config.warp === "number" ? config.warp : 1;
    var density = reduced
      ? 0.35
      : env.isTouch || env.isSmallViewport
        ? config.mobileDensity
        : config.density;
    density = clamp(0, 2, Number.isFinite(+density) ? +density : 1);
    var dustTweens = [];
    var tones = ["warm", "warm", "warm", "brass", "brass", "cool"];
    var stars = [];
    function rnd(a, b) {
      return a + Math.random() * (b - a);
    }

    containers.forEach(function (c) {
      var prev = c.querySelectorAll(".clt-home-dust.is-particle");
      for (var i = 0; i < prev.length; i++) prev[i].remove();
    });

    function spawn(container, count, minSize, maxSize, depth) {
      if (!container) return;
      var frag = document.createDocumentFragment();
      var total = Math.round(count * density);
      for (var i = 0; i < total; i++) {
        var el = document.createElement("div");
        var tone = tones[Math.floor(Math.random() * tones.length)];
        var size = rnd(minSize, maxSize);
        el.className = "clt-home-dust is-particle is-" + tone;
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.left = rnd(0, 100) + "%";
        el.style.top = rnd(0, 100) + "%";
        // Let the browser allocate compositing layers rather than forcing each particle.
        el.style.setProperty("--twinkle-dur", rnd(2.4, 7.2) + "s");
        el.style.setProperty("--twinkle-delay", rnd(0, 5.5) + "s");
        el.style.setProperty("--twinkle-lo", rnd(0.15, 0.36).toFixed(2));
        el.style.setProperty("--twinkle-hi", rnd(0.72, 1).toFixed(2));
        frag.appendChild(el);
        var star = {
          element: el,
          depth: depth,
          floatX: 0,
          floatY: 0,
          inertiaX: 0,
          inertiaY: 0,
          pointerY: 0,
          setCss: gsap.quickSetter(el, "css"),
        };
        if (!reduced) {
          dustTweens.push(gsap.to(star, {
            floatX: rnd(-18, 18) * depth,
            floatY: rnd(-22, 22) * depth,
            duration: rnd(18, 42),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }));
        }
        stars.push(star);
      }
      container.appendChild(frag);
    }

    spawn(far, 46, 1.0, 2.0, 0.45);
    spawn(mid, 31, 1.3, 2.8, 0.78);
    spawn(near, 18, 1.8, 3.6, 1.15);

    if (reduced || !stars.length) return; // static texture only
    function pauseDust() {
      dustTweens.forEach(function (tween) { tween.paused(document.hidden); });
    }
    document.addEventListener("visibilitychange", pauseDust);
    pauseDust();

    function getScrollY() {
      return CLT.lenis && typeof CLT.lenis.scroll === "number"
        ? CLT.lenis.scroll
        : window.scrollY || 0;
    }
    var lastScroll = getScrollY(),
      scrollImpulse = 0,
      pImX = 0,
      pImY = 0,
      lastPX = 0,
      lastPY = 0,
      hasP = false;

    if (!env.isTouch) {
      window.addEventListener(
        "pointermove",
        function (e) {
          if (!hasP) {
            lastPX = e.clientX;
            lastPY = e.clientY;
            hasP = true;
            return;
          }
          pImX += clamp(-30, 30, e.clientX - lastPX) * 0.22;
          pImY += clamp(-30, 30, e.clientY - lastPY) * 0.16;
          lastPX = e.clientX;
          lastPY = e.clientY;
        },
        { passive: true },
      );
    }

    addTick(function () {
      var scroll = getScrollY();
      var scrollDelta = scroll - lastScroll;
      var velocity =
        CLT.lenis && typeof CLT.lenis.velocity === "number"
          ? CLT.lenis.velocity * 1000
          : scrollDelta * 60;
      lastScroll = scroll;
      scrollImpulse += clamp(-90, 90, scrollDelta);
      var sx = CLT._scrollX || 0;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var parallaxY = -scroll * 0.065 * s.depth;
        var targetInertiaY = -scrollImpulse * 0.085 * s.depth;
        var targetInertiaX = pImX * 0.08 * s.depth;
        var targetPointerY = pImY * 0.035 * s.depth;
        s.inertiaY += (targetInertiaY + targetPointerY - s.inertiaY) * 0.11;
        s.inertiaX += (targetInertiaX - s.inertiaX) * 0.09;
        s.pointerY += (targetPointerY - s.pointerY) * 0.08;
        var stretch = clamp(
          1,
          1 + 0.72 * warp,
          1 + (Math.abs(velocity) / 4200) * 0.48 * warp * s.depth,
        );
        var rotate = clamp(
          -14,
          14,
          (scrollDelta * 0.08 + pImX * 0.05) * s.depth,
        );
        s.setCss({
          x: s.floatX + s.inertiaX + -sx * s.depth * 0.03, // lateral scrollX parallax
          y: parallaxY + s.floatY + s.inertiaY + s.pointerY,
          scaleY: stretch,
          rotation: rotate,
          force3D: true,
        });
      }
      scrollImpulse *= 0.9;
      pImX *= 0.86;
      pImY *= 0.86;
    });

    if (ST) {
      var trigger = $(config.triggerSelector) || document.body;
      var st = function (target, yShift, scrub) {
        if (!target) return;
        gsap.to(target, {
          y: yShift,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            start: "top top",
            end: "bottom bottom",
            scrub: scrub,
            invalidateOnRefresh: true,
          },
        });
      };
      st(far, 70, 1.3);
      st(mid, -130, 1.5);
      st(near, -260, 1.8);
    }
  }

  // ── curtain — first-load raise + internal-nav transitions (opt-in) ─────────
  function initCurtain() {
    var gsap = window.gsap;
    var stage = $(".clt-curtain-stage");
    // Opt in with data-clt-curtain on <body>, or simply by authoring the
    // stage. A stage in the markup (e.g. from a shared Webflow component) is
    // drawn closed by CSS, so on a page whose <body> lacks the attribute it
    // used to stay shut over the whole page, forever.
    if (!document.body.hasAttribute("data-clt-curtain") && !stage) return;
    if (!stage) {
      // inject if not authored (minor flash)
      stage = document.createElement("div");
      stage.className = "clt-curtain-stage";
      stage.setAttribute("aria-hidden", "true");
      stage.innerHTML =
        '<div class="clt-curtain-stage__panel is-left"></div><div class="clt-curtain-stage__panel is-right"></div>';
      document.body.appendChild(stage);
    }
    var ps = $all(".clt-curtain-stage__panel", stage),
      left = ps[0],
      right = ps[1];
    var cfg = config.curtain || {},
      dur = cfg.duration || 1.25;
    var navigated = false;

    function raise() {
      // part + reveal — flowy, top-pivot sway
      stage.hidden = false;
      if (env.reducedMotion || !gsap) {
        stage.hidden = true;
        return;
      }
      gsap.set([left, right], {
        xPercent: 0,
        rotation: 0,
        transformOrigin: "50% 0%",
      });
      gsap
        .timeline({
          onComplete: function () {
            stage.hidden = true;
          },
        })
        .to(
          left,
          { xPercent: -104, rotation: -2, duration: dur, ease: "power2.inOut" },
          0,
        )
        .to(
          right,
          { xPercent: 104, rotation: 2, duration: dur, ease: "power2.inOut" },
          0.06,
        );
    }
    function fall(done) {
      // cover, then run done()
      stage.hidden = false;
      if (env.reducedMotion || !gsap) {
        if (done) done();
        return;
      }
      gsap.set(left, {
        xPercent: -104,
        rotation: -2,
        transformOrigin: "50% 0%",
      });
      gsap.set(right, {
        xPercent: 104,
        rotation: 2,
        transformOrigin: "50% 0%",
      });
      gsap
        .timeline({
          onComplete: function () {
            if (done) done();
          },
        })
        .to(
          left,
          {
            xPercent: 0,
            rotation: 0,
            duration: dur * 0.9,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          right,
          {
            xPercent: 0,
            rotation: 0,
            duration: dur * 0.9,
            ease: "power2.inOut",
          },
          0.06,
        );
    }

    requestAnimationFrame(raise); // raise on load

    function go(href) {
      if (navigated) return;
      navigated = true;
      window.location.assign(href);
    }
    function shouldIntercept(a, e) {
      if (
        !a ||
        !a.href ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return false;
      if (a.target && a.target !== "_self") return false;
      if (a.hasAttribute("download")) return false;
      var href = a.getAttribute("href");
      if (
        !href ||
        href.charAt(0) === "#" ||
        href.indexOf("mailto:") === 0 ||
        href.indexOf("tel:") === 0
      )
        return false;
      var url;
      try {
        url = new URL(a.href, location.href);
      } catch (_) {
        return false;
      }
      if (url.origin !== location.origin) return false;
      if (url.pathname === location.pathname && url.hash) return false; // in-page anchor
      return true;
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("[href]") : null;
      if (!shouldIntercept(a, e)) return;
      e.preventDefault();
      try {
        sessionStorage.setItem("clt-curtain", "1");
      } catch (_) {}
      fall(function () {
        go(a.href);
      });
      setTimeout(
        function () {
          go(a.href);
        },
        dur * 1000 + 500,
      ); // fail-open
    });
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) { navigated = false; stage.hidden = true; }
    });

    CLT.curtain = {
      fall: function (href) {
        fall(function () {
          go(href || location.href);
        });
      },
      rise: function () {
        navigated = false;
        raise();
      },
      _shouldIntercept: shouldIntercept,
    };
  }

  // ── reveal-on-scroll · "stage assembly" (GSAP-driven, opt-in) ──────────────
  function revealVariant(el) {
    var raw = el.getAttribute("data-clt-reveal");
    if (raw === null) raw = el.getAttribute("data-reveal") || "";
    var v = " " + raw + " ";
    if (v.indexOf(" fly ") >= 0) return "fly";
    if (v.indexOf(" wing-left ") >= 0) return "wing-left";
    if (v.indexOf(" wing-right ") >= 0) return "wing-right";
    if (v.indexOf(" fade ") >= 0) return "fade";
    if (v.indexOf(" curtain ") >= 0) return "curtain";
    return "rise";
  }
  function revealFrom(variant, distance) {
    if (variant === "fly") return { x: 0, y: "-2.5rem", yPercent: 0 };
    if (variant === "wing-left") return { x: "-3rem", y: 0, yPercent: 0 };
    if (variant === "wing-right") return { x: "3rem", y: 0, yPercent: 0 };
    if (variant === "fade") return { x: 0, y: 0, yPercent: 0 };
    if (variant === "curtain") return { x: 0, y: 0, yPercent: 100 };
    return { x: 0, y: distance, yPercent: 0 }; // rise (default)
  }

  function initReveal() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    var cfg = config.reveal || {};
    var start = cfg.start || "top 85%";
    var stagger = typeof cfg.stagger === "number" ? cfg.stagger : 0.09;
    var duration = typeof cfg.duration === "number" ? cfg.duration : 1.05;
    var distance = cfg.distance || "2.25rem";
    var ease = cfg.ease || CLT.motion.easeStage;
    var strike = cfg.strike !== false;
    var replay = cfg.replay !== false;

    var els = $all(
      '[data-clt-reveal], [data-reveal], [data-gsap~="clt-reveal"], [data-gsap~="clt-rise"]',
    );

    if (els.length) {
      if (env.reducedMotion || !gsap || !ST) {
        els.forEach(function (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }); // instant
      } else {
        els.forEach(function (el) {
          var f = revealFrom(revealVariant(el), distance);
          gsap.set(el, {
            autoAlpha: 0,
            x: f.x,
            y: f.y,
            yPercent: f.yPercent,
            willChange: "transform, opacity",
            force3D: true,
          });
        });

        var assemble = function (batch) {
          // staggered rise/fly/wing into place
          for (var i = 0; i < batch.length; i++) {
            (function (el, idx) {
              gsap.to(el, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                yPercent: 0,
                duration: duration,
                ease: ease,
                delay: idx * stagger,
                overwrite: "auto",
                onComplete: function () {
                  gsap.set(el, { clearProps: "willChange" });
                },
              });
            })(batch[i], i);
          }
        };
        var strikeOut = function (batch) {
          // Never strike a jump-nav: once docked it lives on <body>, pinned
          // under the navbar, while its trigger is still measured from its
          // old slot in the hero — so "left the viewport" fires while the
          // nav is on screen and in use.
          batch = batch.filter(function (el) {
            return !el.closest("[data-clt-keep-lit], .clt-jumpnav");
          });
          // light fade + small recede the way it came
          batch.forEach(function (el) {
            var v = revealVariant(el);
            var to = {
              autoAlpha: 0,
              duration: 0.38,
              ease: "power2.out",
              overwrite: "auto",
              willChange: "transform, opacity",
              onComplete: function () {
                gsap.set(el, { clearProps: "willChange" });
              },
            };
            if (v === "wing-left") to.x = "-0.6rem";
            else if (v === "wing-right") to.x = "0.6rem";
            else if (v === "fly") to.y = "-0.6rem";
            else if (v === "curtain") to.yPercent = 40;
            else if (v !== "fade") to.y = "0.6rem";
            gsap.to(el, to);
          });
        };

        var batchCfg = { start: start, onEnter: assemble, once: !replay };
        if (replay) {
          batchCfg.onEnterBack = assemble;
          if (strike) {
            batchCfg.onLeave = strikeOut;
            batchCfg.onLeaveBack = strikeOut;
          }
        }
        ST.batch(els, batchCfg);
      }
    }

    initSplit(gsap, ST, start, stagger, duration, ease, strike, replay);
  }

  function initSplit(gsap, ST, start, stagger, duration, ease, strike, replay) {
    var els = $all("[data-clt-split]");
    if (!els.length) return;
    var Split = window.SplitText;

    // Fallback: no SplitText (or no gsap/ScrollTrigger) → plain fade-in (no word split).
    if (!Split || !gsap || !ST) {
      els.forEach(function (el) {
        if (env.reducedMotion || !gsap || !ST) {
          el.style.opacity = "1";
          return;
        }
        gsap.set(el, { opacity: 0 });
        ST.create({
          trigger: el,
          start: start,
          once: !replay,
          onEnter: function () {
            gsap.to(el, {
              opacity: 1,
              duration: duration,
              ease: ease,
              overwrite: "auto",
            });
          },
        });
      });
      return;
    }
    if (env.reducedMotion) {
      els.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    registerGsapPlugin(Split);
    els.forEach(function (el) {
      var type = el.getAttribute("data-clt-split") || "lines,words";
      if (!type) type = "lines,words";
      // chars = curtain-call sweep: tighter stagger, slightly quicker rise
      var isChars = type.indexOf("chars") >= 0;
      var split = null,
        assembled = false,
        // Inside [data-clt-keep-lit] the text never strikes out on leave —
        // for copy a page holds on screen with a transform (e.g. a hero
        // overlay), which a trigger measured on layout would think had gone.
        keepLit = !!el.closest("[data-clt-keep-lit]"),
        lastW = window.innerWidth;

      function units() {
        // chars requested → animate chars (wrap "words,chars" so words still
        // wrap as units); otherwise words, then lines.
        if (isChars && split.chars && split.chars.length) return split.chars;
        return split.words && split.words.length
          ? split.words
          : split.chars && split.chars.length
            ? split.chars
            : split.lines;
      }
      function build() {
        if (split) split.revert();
        split = Split.create(el, { type: type, linesClass: "clt-split-line" });
        // background-clip:text doesn't survive SplitText's transformed char
        // wrappers (glyphs go transparent) — re-apply the foil clip on every
        // wrapper inside a foil span; the vertical gradient makes the per-char
        // clip seamless.
        $all(".clt-text-foil div", el).forEach(function (d) {
          d.classList.add("clt-text-foil");
        });
        var u = units();
        if (!u || !u.length) return;
        gsap.set(
          u,
          assembled
            ? { yPercent: 0, opacity: 1 }
            : { yPercent: 100, opacity: 0 },
        );
      }
      build();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready
          .then(function () {
            build();
            if (typeof CLT.refresh === "function") CLT.refresh();
          })
          .catch(function () {});
      }

      ST.create({
        trigger: el,
        start: start,
        onEnter: function () {
          gsap.killTweensOf(el);
          if (!assembled) {
            assembled = true;
            gsap.set(el, { opacity: 1 });
            gsap.to(units(), {
              yPercent: 0,
              opacity: 1,
              duration: isChars ? duration * 0.75 : duration,
              ease: ease,
              stagger: isChars ? Math.min(0.022, stagger * 0.25) : stagger * 0.5,
              overwrite: "auto",
            });
          } else {
            gsap.to(el, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        },
        onEnterBack: replay
          ? function () {
              gsap.killTweensOf(el);
              gsap.to(el, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          : undefined,
        onLeave:
          replay && strike && !keepLit
            ? function () {
                gsap.to(el, {
                  opacity: 0,
                  duration: 0.4,
                  ease: "power2.in",
                  overwrite: "auto",
                });
              }
            : undefined,
        onLeaveBack:
          replay && strike && !keepLit
            ? function () {
                gsap.to(el, {
                  opacity: 0,
                  duration: 0.4,
                  ease: "power2.in",
                  overwrite: "auto",
                });
              }
            : undefined,
      });

      window.addEventListener(
        "resize",
        debounce(function () {
          if (window.innerWidth === lastW) return;
          lastW = window.innerWidth;
          build();
        }, 200),
      );
    });
  }

  // ── lamp · lights when scrolled into view (opt-in [data-clt-lamp]) ─────────
  function initLamp() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    var els = $all("[data-clt-lamp]");
    if (!els.length) return;

    function getLampTrigger(el) {
      return (
        el.closest("[data-clt-lamp-trigger]") ||
        el.closest(".clt-footer, .clt-panel, section") ||
        el.parentElement ||
        el
      );
    }

    if (env.reducedMotion || !gsap || !ST) {
      // show lit, no scroll behaviour
      els.forEach(function (el) {
        el.classList.add("is-lit");
      });
      return;
    }
    els.forEach(function (el) {
      var trigger = getLampTrigger(el);
      ST.create({
        trigger: trigger,
        start: "top 92%",
        end: "bottom top",
        toggleClass: { targets: el, className: "is-lit" },
        invalidateOnRefresh: true,
      });
    });

    window.setTimeout(function () {
      if (ST && typeof ST.refresh === "function") ST.refresh();
    }, 0);
  }

  // ── arrival · house lights up on load (opt-in data-clt-arrival on <body>) ─
  // A black scrim fades out over ~1.2s — the room lights coming up. Skipped
  // when a curtain rise is pending (that IS the arrival), reduced motion, or
  // no GSAP.
  function initArrival() {
    // Read AND clear the flag the curtain leaves when it navigates. It means
    // "this load was reached through the curtain" — one load only. Left in
    // place, every later load in the session skipped the arrival fade.
    var pendingCurtain = false;
    try {
      pendingCurtain = sessionStorage.getItem("clt-curtain") === "1";
      sessionStorage.removeItem("clt-curtain");
    } catch (_) {}
    if (!document.body || !document.body.hasAttribute("data-clt-arrival")) return;
    var gsap = window.gsap;
    if (env.reducedMotion || !gsap || pendingCurtain) return;
    var dim = document.createElement("div");
    dim.setAttribute("aria-hidden", "true");
    dim.style.cssText =
      "position:fixed;inset:0;z-index:9000;pointer-events:none;background:#000;opacity:0.94;";
    document.body.appendChild(dim);
    gsap.to(dim, {
      opacity: 0,
      duration: 1.2,
      ease: CLT.motion.easeVelvet,
      delay: 0.1,
      onComplete: function () {
        if (dim.parentNode) dim.parentNode.removeChild(dim);
      },
    });
  }

  // ── navbar condense (opt-in data-clt-navbar-condense on .clt-navbar-shell) ─
  function initNavbarCondense() {
    var ST = window.ScrollTrigger;
    var els = $all("[data-clt-navbar-condense]");
    if (!els.length) return;
    els.forEach(function (shell) {
      if (ST) {
        ST.create({
          start: 90,
          end: "max",
          toggleClass: { targets: shell, className: "is-condensed" },
        });
      } else {
        var onS = function () {
          shell.classList.toggle("is-condensed", window.scrollY > 90);
        };
        window.addEventListener("scroll", onS, { passive: true });
        onS();
      }
    });
  }

  // ── promenade · pinned horizontal scroll (opt-in data-clt-promenade) ──────
  // Desktop fine-pointer: pin the section and scrub the track sideways
  // (--promenade 0→1 feeds the progress filament). Touch / reduced motion /
  // no GSAP: the CSS native horizontal scroll with snap takes over.
  function initPromenade() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    var els = $all("[data-clt-promenade]");
    if (!els.length) return;
    if (env.reducedMotion || env.isTouch || !gsap || !ST) return;
    els.forEach(function (sec) {
      var track = $(".clt-promenade__track", sec);
      if (!track) return;
      sec.classList.add("is-pinned");
      var set = gsap.quickSetter(sec, "--promenade");
      var dist = function () {
        return Math.max(0, track.scrollWidth - sec.clientWidth);
      };
      gsap.to(track, {
        x: function () {
          return -dist();
        },
        ease: "none", // required: scroll and position must map 1:1
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: function () {
            return "+=" + dist();
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            set(self.progress);
          },
        },
      });
    });
  }

  // ── form validation (opt-in data-clt-validate on <form>) ──────────────────
  // Invalid submit: each bad .clt-field gets data-state="error" + message
  // (data-error attr, else the native validationMessage); first bad field is
  // focused. Errors clear per-field as the visitor types.
  function initFieldValidation() {
    $all("form[data-clt-validate]").forEach(function (form) {
      form.setAttribute("novalidate", "");
      form.addEventListener("submit", function (e) {
        var bad = [];
        $all(".clt-field", form).forEach(function (field) {
          var input = field.querySelector("input, select, textarea");
          if (!input) return;
          if (input.checkValidity()) {
            field.removeAttribute("data-state");
          } else {
            field.setAttribute("data-state", "error");
            var err = field.querySelector(".clt-field__error, .clt-field__error-text");
            if (err) {
              err.textContent =
                field.getAttribute("data-error") || input.validationMessage;
            }
            bad.push(input);
          }
        });
        if (bad.length) {
          e.preventDefault();
          bad[0].focus();
        }
      });
      form.addEventListener("input", function (e) {
        var field = e.target && e.target.closest ? e.target.closest(".clt-field") : null;
        if (field && e.target.checkValidity && e.target.checkValidity()) {
          field.removeAttribute("data-state");
        }
      });
    });
  }

  // ── idle-tab hygiene · pause ambience while the tab is hidden ─────────────
  function initIdlePause() {
    function updateVisibility() {
      document.documentElement.classList.toggle("clt-hidden", document.hidden);
      syncTicker();
    }
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();
  }

  // ── magnetic CTAs (opt-in [data-gsap~="clt-magnetic"]) ────────────────────
  // Element leans toward the cursor (data-clt-magnet tunes pull, default 0.32),
  // settles back on an elastic when the cursor leaves. Fine pointers only.
  function initMagnetic() {
    var gsap = window.gsap;
    if (env.reducedMotion || env.isTouch || !gsap) return;
    $all('[data-gsap~="clt-magnetic"]').forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-clt-magnet")) || 0.32;
      var qx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      var qy = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      framePointer(el, "pointermove", function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * strength);
        qy((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.45)",
          overwrite: "auto",
        });
      });
    });
  }

  // ── 3D tilt (opt-in [data-gsap~="clt-tilt"]) ──────────────────────────────
  // Panel leans toward the cursor (data-clt-tilt-max degrees, default 6). Pairs
  // with the panel cursor-orb sheen, which already tracks --mx/--my.
  function initTilt() {
    var gsap = window.gsap;
    if (env.reducedMotion || env.isTouch || !gsap) return;
    $all('[data-gsap~="clt-tilt"]').forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-clt-tilt-max")) || 6;
      var qrx = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power2.out" });
      var qry = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power2.out" });
      gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
      framePointer(el, "pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        qrx((0.5 - py) * max * 2);
        qry((px - 0.5) * max * 2);
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          overwrite: "auto",
        });
      });
    });
  }

  // ── scramble-in text (opt-in [data-clt-scramble]) ─────────────────────────
  // Playbill flipboard for dates/counts: text scrambles into place once on
  // enter. Needs ScrambleTextPlugin; without it the text simply stays put.
  function initScramble() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger,
      SP = window.ScrambleTextPlugin;
    var els = $all("[data-clt-scramble]");
    if (!els.length) return;
    if (env.reducedMotion || !gsap || !ST || !SP) return;
    registerGsapPlugin(SP);
    els.forEach(function (el) {
      var original = el.textContent;
      ST.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            duration: 0.9,
            scrambleText: { text: original, chars: "IVXLCDM0123456789·", speed: 0.8 },
            ease: "none",
          });
        },
      });
    });
  }

  // ── parallax drift (opt-in data-clt-parallax="<percent>") ─────────────────
  // Element drifts vertically by ±percent/2 as its parent traverses the
  // viewport. Negative = rises against scroll (feels lifted), positive = lags.
  function initParallax() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    var els = $all("[data-clt-parallax]");
    if (!els.length) return;
    if (env.reducedMotion || !gsap || !ST) return;
    els.forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-clt-parallax")) || -10;
      gsap.fromTo(
        el,
        { yPercent: -amt / 2 },
        {
          yPercent: amt / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  }

  // ── house lights · scroll-scrubbed --house dial (opt-in data-clt-house) ───
  // Drives --house 0→1→0 as the section crosses the viewport (peak at center);
  // clt-master.css maps it onto the section's candle pool / lamps / spot glow.
  function initHouseLights() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    var els = $all("[data-clt-house]");
    if (!els.length) return;
    if (env.reducedMotion || !gsap || !ST) {
      els.forEach(function (el) {
        el.style.setProperty("--house", "1");
      });
      return;
    }
    els.forEach(function (el) {
      var set = gsap.quickSetter(el, "--house");
      var dial = function (self) {
        // triangle peak at viewport center, smoothed to a sine crest
        var t = 1 - Math.abs(self.progress - 0.5) * 2;
        set(Math.sin((t * Math.PI) / 2));
      };
      ST.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: dial,
        onRefresh: dial,
        invalidateOnRefresh: true,
      });
    });
  }

  // ── ambient "Acts" — per-section variant crossfade (opt-in) ────────────────
  function initAmbient() {
    var amb = $(".clt-ambient");
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    if (!amb) {
      CLT.ambient = { to: function () {} };
      return;
    } // no ambient → no-op API

    var ac = config.ambientActs || {};
    var crossfade = typeof ac.crossfade === "number" ? ac.crossfade : 0.9;
    var current = amb.getAttribute("data-variant") || "";

    // Double-buffer: a second stacked layer the crossfade fades in over the base.
    var layerB = $(".clt-ambient.is-act-buffer");
    if (!layerB) {
      layerB = amb.cloneNode(true); // deep: carry variant child blobs (aurora)
      layerB.removeAttribute("id");
      layerB.classList.add("is-act-buffer");
      layerB.setAttribute("aria-hidden", "true");
      if (gsap) gsap.set(layerB, { opacity: 0 });
      else layerB.style.opacity = "0";
      amb.parentNode.insertBefore(layerB, amb.nextSibling); // same z, later in DOM → paints on top
    }

    function to(variant) {
      if (!variant || variant === current) return;
      if (env.reducedMotion || !gsap) {
        // instant swap — no crossfade
        amb.setAttribute("data-variant", variant);
        current = variant;
        return;
      }
      current = variant; // lock target → repeat cues no-op
      layerB.setAttribute("data-variant", variant);
      gsap.killTweensOf(layerB);
      gsap.fromTo(
        layerB,
        { opacity: 0 },
        {
          opacity: 1,
          duration: crossfade,
          ease: "power1.inOut",
          onComplete: function () {
            amb.setAttribute("data-variant", variant); // promote base under the opaque buffer
            gsap.set(layerB, { opacity: 0 }); // reset buffer (base shows through, no flash)
          },
        },
      );
    }
    CLT.ambient = { to: to };

    // Acts: wire per-section cues only when opted in.
    if (!document.body.hasAttribute("data-clt-ambient-acts")) return;
    var sections = $all("[data-ambient]");
    if (!sections.length) return;

    if (gsap && ST) {
      sections.forEach(function (sec) {
        var v = sec.getAttribute("data-ambient");
        ST.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onEnter: function () {
            to(v);
          },
          onEnterBack: function () {
            to(v);
          },
        });
      });
    } else if (window.IntersectionObserver) {
      // no ScrollTrigger → instant swaps near centre
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) to(e.target.getAttribute("data-ambient"));
          });
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      sections.forEach(function (sec) {
        io.observe(sec);
      });
    }
  }

  // ── boot ────────────────────────────────────────────────────────────────
  function boot() {
    if (CLT.__booted) return;
    CLT.__booted = true;
    initMotion();
    initArrival(); // must read the curtain flag before initCurtain consumes it
    initCurtain();
    initScroll();
    initLayoutRefresh();
    initScrollX();
    initDust();
    initDialogs();
    initTabs();
    initToggle();
    initFieldValidation();
    initCardFlip();
    initSectionNav();
    initJumpNav();
    initButtonClef();
    initNavbarCondense();
    initAmbient();
    initAmbientParallax();
    initPanelOrb();
    initMagnetic();
    initTilt();
    initScramble();
    initReveal();
    initLamp();
    initHouseLights();
    initParallax();
    initPromenade();
    initIdlePause();
    flushReady();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
