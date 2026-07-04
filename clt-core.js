(function () {
  "use strict";
  if (window.CLT && window.CLT.__booted) return; // idempotent

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
        behavior: opts.immediate ? "auto" : opts.behavior || "smooth",
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

  var ticks = [];
  function addTick(fn) {
    ticks.push(fn);
  }
  function runTicks(time) {
    for (var i = 0; i < ticks.length; i++) ticks[i](time);
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
      ".lenis.lenis-smooth iframe{pointer-events:none;}",
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

    if (gsap && Lenis && !env.isTouch && !env.reducedMotion) {
      ensureLenisCss();
      var lenis = new Lenis(config.lenis);
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

    // Prefer the GSAP ticker.
    if (gsap) {
      gsap.ticker.add(runTicks);
      gsap.ticker.lagSmoothing(0);
    } else {
      (function loop(now) {
        runTicks(now / 1000);
        requestAnimationFrame(loop);
      })(performance.now());
    }

    // Resize / layout shifts).
    if (ST) {
      var doRefresh = debounce(function () {
        if (CLT.lenis && typeof CLT.lenis.resize === "function")
          CLT.lenis.resize();
        ST.refresh();
        if (CLT.lenis && typeof CLT.lenis.resize === "function")
          CLT.lenis.resize();
      }, 200);
      window.addEventListener("resize", doRefresh, { passive: true });
      CLT.refresh = doRefresh;
    }
  }

  function initLayoutRefresh() {
    var ST = window.ScrollTrigger;
    if (!ST) return;

    function refreshLater(delay) {
      window.setTimeout(function () {
        if (typeof CLT.refresh === "function") CLT.refresh();
        else ST.refresh();
      }, delay || 0);
    }

    window.addEventListener(
      "load",
      function () {
        refreshLater(0);
        refreshLater(250);
        refreshLater(900);
      },
      { once: true },
    );

    window.addEventListener(
      "pageshow",
      function () {
        refreshLater(0);
      },
      { passive: true },
    );

    window.addEventListener(
      "orientationchange",
      function () {
        refreshLater(350);
      },
      { passive: true },
    );

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(function () {
          refreshLater(0);
        })
        .catch(function () {});
    }
  }
  CLT._addTick = addTick; // used by later modules (components, scrollX, dust)

  // ── horizontal-scroll hook: pages call CLT.scrollX(px); we lerp it on the
  //    ticker. Consumers (dust in Plan 2, ambient optionally) read CLT._scrollX.
  var scrollXTarget = 0;
  CLT._scrollX = 0;
  function initScrollX() {
    addTick(function () {
      CLT._scrollX = lerp(CLT._scrollX, scrollXTarget, 0.1);
    });
  }
  CLT.scrollX = function (px) {
    scrollXTarget = +px || 0;
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
        var state = Flip.getState(targets);

        card.setAttribute("data-expanded", next);
        syncLabel();

        Flip.from(state, {
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
      var max = 1;
      function measure() {
        max = document.documentElement.scrollHeight - window.innerHeight || 1;
      }
      function update() {
        var y =
          CLT.lenis && typeof CLT.lenis.scroll === "number"
            ? CLT.lenis.scroll
            : window.scrollY || 0;
        var frac = clamp(0, 1, y / max);
        nav.style.setProperty("--progress", frac.toFixed(3));
        var idx = Math.min(links.length - 1, Math.floor(frac * links.length));
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
      window.addEventListener("resize", onResize);
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
      cs = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true },
    );
    addTick(function () {
      cx = lerp(cx, tx, 0.05);
      cy = lerp(cy, ty, 0.05);
      var ts = window.scrollY || 0;
      cs = lerp(cs, ts, 0.045);
      var ax = cx.toFixed(3),
        ay = cy.toFixed(3),
        scr = cs.toFixed(1) + "px";
      for (var i = 0; i < layers.length; i++) {
        layers[i].style.setProperty("--ax", ax);
        layers[i].style.setProperty("--ay", ay);
        layers[i].style.setProperty("--scr", scr);
      }
    });
  }

  function initPanelOrb() {
    if (env.reducedMotion || env.isTouch) return;
    var active = null,
      pmx = 50,
      pmy = 50,
      cmx = 50,
      cmy = 50;
    $all(
      ".clt-panel:not(.is-carved):not(.is-marquee):not(.is-noir):not(.is-frame)",
    ).forEach(function (p) {
      p.addEventListener("pointerenter", function () {
        active = p;
        cmx = pmx;
        cmy = pmy;
        p.style.setProperty("--orb", "1");
      });
      p.addEventListener("pointerleave", function () {
        p.style.setProperty("--orb", "0");
        if (active === p) active = null;
      });
      p.addEventListener("pointermove", function (e) {
        var r = p.getBoundingClientRect();
        pmx = ((e.clientX - r.left) / r.width) * 100;
        pmy = ((e.clientY - r.top) / r.height) * 100;
      });
    });
    addTick(function () {
      if (!active) return;
      cmx = lerp(cmx, pmx, 0.16);
      cmy = lerp(cmy, pmy, 0.16);
      active.style.setProperty("--mx", cmx.toFixed(2) + "%");
      active.style.setProperty("--my", cmy.toFixed(2) + "%");
    });
  }

  // ── dust canopy (folded from clt-home-dust.js; consumes CLT.lenis + ticker)
  function initDust() {
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
        ? 0.7
        : config.density;
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
        el.style.willChange = "transform, opacity";
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
          gsap.to(star, {
            floatX: rnd(-18, 18) * depth,
            floatY: rnd(-22, 22) * depth,
            duration: rnd(18, 42),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
        stars.push(star);
      }
      container.appendChild(frag);
    }

    spawn(far, 46, 1.0, 2.0, 0.45);
    spawn(mid, 31, 1.3, 2.8, 0.78);
    spawn(near, 18, 1.8, 3.6, 1.15);

    if (reduced || !stars.length) return; // static texture only

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
    if (!document.body.hasAttribute("data-clt-curtain")) return;
    var gsap = window.gsap;
    var stage = $(".clt-curtain-stage");
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
      if (e.persisted) stage.hidden = true;
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
          // light fade + small recede the way it came
          for (var i = 0; i < batch.length; i++) {
            var el = batch[i],
              v = revealVariant(el);
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
          }
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
          replay && strike
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
          replay && strike
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
    if (!document.body || !document.body.hasAttribute("data-clt-arrival")) return;
    var gsap = window.gsap;
    var pendingCurtain = false;
    try {
      pendingCurtain = sessionStorage.getItem("clt-curtain") === "1";
    } catch (_) {}
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
    document.addEventListener("visibilitychange", function () {
      document.documentElement.classList.toggle("clt-hidden", document.hidden);
    });
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
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * strength);
        qy((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("mouseleave", function () {
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
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        qrx((0.5 - py) * max * 2);
        qry((px - 0.5) * max * 2);
      });
      el.addEventListener("mouseleave", function () {
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
