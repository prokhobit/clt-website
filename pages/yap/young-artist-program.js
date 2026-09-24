/* ════════════════════════════════════════════════════════════════════════════
   CLT · YOUNG ARTIST PROGRAM 
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var CLT = window.CLT || null;

  function init() {
    if (!document.querySelector(".yap")) return;
    var lenis = initScroll();
    initMotion();
    initPanels();
    initInterview();
    initLightbox(lenis);
  }

  function initScroll() {
    if (CLT) return CLT.lenis || null;
    if (reduced || typeof window.Lenis === "undefined") return null;
    var lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
    });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
      })();
    }
    return lenis;
  }

  function initMotion() {
    var gsap = window.gsap,
      ST = window.ScrollTrigger;
    if (!gsap || !ST || reduced) {
      document.querySelectorAll(".yap [data-yr]").forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    gsap.registerPlugin(ST);

    var heroBits = gsap.utils.toArray(".yap-hero [data-yr]");
    gsap.to(heroBits, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.05,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.15,
      clearProps: "filter",
      onStart: function () {
        heroBits.forEach(function (el) {
          el.classList.add("is-in");
        });
      },
    });

    gsap.utils
      .toArray(".yap section, .yap .yap-student")
      .forEach(function (sec) {
        var items = gsap.utils.toArray("[data-yr]", sec);
        if (!items.length) return;
        ST.create({
          trigger: sec,
          start: "top 82%",
          once: true,
          onEnter: function () {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              clearProps: "filter",
              onStart: function () {
                items.forEach(function (el) {
                  el.classList.add("is-in");
                });
              },
            });
          },
        });
      });

    gsap.to(".yap-hero__media", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".yap-hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.fromTo(
      ".yap-director__media img",
      { scale: 1.12, yPercent: -4 },
      {
        scale: 1,
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: ".yap-director",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      ".yap-stage-panel",
      { scale: 0.97 },
      {
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".yap-stage-panel",
          start: "top 90%",
          end: "top 50%",
          scrub: 0.6,
        },
      },
    );
  }

  function initPanels() {
    if (!fine || reduced) return;
    document.querySelectorAll(".yap .clt-panel").forEach(function (p) {
      var tilt = p.hasAttribute("data-tilt");
      var orb = !CLT || p.classList.contains("is-carved");
      if (!tilt && !orb) return;
      var raf = null,
        tx = 0,
        ty = 0;
      p.addEventListener("pointermove", function (e) {
        var r = p.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        if (orb) {
          p.style.setProperty("--mx", px * 100 + "%");
          p.style.setProperty("--my", py * 100 + "%");
          p.style.setProperty("--orb", "1");
        }
        if (tilt) {
          tx = (py - 0.5) * -5;
          ty = (px - 0.5) * 6;
          if (!raf)
            raf = requestAnimationFrame(function () {
              raf = null;
              if (window.gsap && window.gsap.isTweening(p)) return;
              p.style.transform =
                "perspective(900px) rotateX(" +
                tx.toFixed(2) +
                "deg) rotateY(" +
                ty.toFixed(2) +
                "deg) translateY(-3px)";
            });
        }
      });
      p.addEventListener("pointerleave", function () {
        if (orb) p.style.setProperty("--orb", "0");
        if (tilt && !(window.gsap && window.gsap.isTweening(p)))
          p.style.transform = "";
      });
    });
  }

  /* ── YouTube iframe ───────────────────────────────────────────────────── */
  function youtube(id, start) {
    var iframe = document.createElement("iframe");
    start = parseInt(start, 10);
    iframe.src =
      "https://www.youtube.com/embed/" +
      encodeURIComponent(id || "") +
      "?autoplay=1&rel=0&modestbranding=1&playsinline=1" +
      (start > 0 ? "&start=" + start : "");
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    return iframe;
  }

  /* ── Director interview: plays in place ───────────────────────────────── */
  function initInterview() {
    var interview = document.querySelector(".yap .is-spotlit .yap-video");
    if (!interview) return;
    interview.addEventListener("click", function () {
      if (interview.classList.contains("is-playing")) return;
      interview.classList.add("is-playing");
      interview.appendChild(
        youtube(
          interview.getAttribute("data-yt"),
          interview.getAttribute("data-start"),
        ),
      );
    });
  }

  /* ── Student videos: lightbox ─────────────────────────────────────────── */
  function initLightbox(lenis) {
    var lb = document.getElementById("yap-lb");
    var frame = document.getElementById("yap-lb-frame");
    var close = document.getElementById("yap-lb-close");
    if (!lb || !frame || !close) return;
    var opener = null;
    var removeTimer = 0;

    function dropIframe() {
      clearTimeout(removeTimer);
      removeTimer = 0;
      var f = document.getElementById("yap-lb-iframe");
      if (f) f.remove();
    }

    function stopScroll() {
      if (CLT && typeof CLT.stopScroll === "function") CLT.stopScroll();
      else if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    }
    function startScroll() {
      if (CLT && typeof CLT.startScroll === "function") CLT.startScroll();
      else if (lenis) lenis.start();
      document.body.style.overflow = "";
    }
    function open(btn) {
      dropIframe();
      opener = btn;
      var iframe = youtube(btn.getAttribute("data-yt"));
      iframe.id = "yap-lb-iframe";
      frame.appendChild(iframe);
      lb.classList.add("is-open");
      stopScroll();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          close.focus({ preventScroll: true });
        });
      });
    }
    function shut() {
      if (!lb.classList.contains("is-open")) return;
      lb.classList.remove("is-open");
      startScroll();
      removeTimer = setTimeout(dropIframe, 380);
      if (opener) opener.focus({ preventScroll: true });
      opener = null;
    }

    document.querySelectorAll(".yap-card .yap-video").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn);
      });
    });
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) shut();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") shut();
    });
  }

  if (CLT && typeof CLT.ready === "function") CLT.ready(init);
  else if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
