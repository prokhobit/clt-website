/* CLT · Young Artist Program — hero overlay, interview player, student video lightbox. */
(function () {
  "use strict";

  if (window.__cltYapReady) return;
  window.__cltYapReady = true;

  var HERO_LEAD = 64; // px scrolled before the hero copy starts to hold
  var EMBED = "https://www.youtube-nocookie.com/embed/";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var inlineFrames = [];
  var booted = false;

  function all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function text(node) {
    return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function focusQuietly(el) {
    if (!el || typeof el.focus !== "function") return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }

  // YouTube refuses embeds that arrive without a referrer; enablejsapi lets us pause the interview.
  function player(id, start, title) {
    var q = "autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1";
    var s = parseInt(start, 10);
    if (s > 0) q += "&start=" + s;
    if (/^https?:/.test(window.location.origin)) q += "&origin=" + encodeURIComponent(window.location.origin);
    var f = document.createElement("iframe");
    f.src = EMBED + encodeURIComponent(id) + "?" + q;
    f.title = title || "YouTube video player";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("allowfullscreen", "");
    return f;
  }

  function pauseInline() {
    var msg = JSON.stringify({ event: "command", func: "pauseVideo", args: [] });
    inlineFrames.forEach(function (f) {
      try { f.contentWindow.postMessage(msg, "*"); } catch (e) {}
    });
  }

  var COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  var TONES = ["brass", "candle", "linen", "smoke", "velvet"];

  function youtubeId(href) {
    var m = /(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})/.exec(href || "");
    return m ? m[1] : "";
  }
  function youtubeStart(href) {
    var m = /[?&#](?:t|start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s?/.exec(href || "");
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + +m[3] : 0;
  }
  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }
  function tone(badge, scope) {
    var data = scope.querySelector("[data-yap-tone]");
    var t = text(data).toLowerCase();
    if (badge && TONES.indexOf(t) > -1) badge.classList.add("is-" + t);
  }

  // CMS roster: the collection list carries raw fields; fill in what Webflow can't bind.
  function hydrateRoster(page) {
    var n = 0;
    all(".yap-student", page).forEach(function (student) {
      var head = student.querySelector(".yap-student__id");
      var name = text(student.querySelector(".yap-student__name"));
      if (head) tone(head.querySelector(".clt-badge"), head);

      var cards = all(".yap-card", student);
      var count = student.querySelector(".yap-student__count");
      if (count && cards.length) {
        count.textContent = (COUNT_WORDS[cards.length] || cards.length) + (cards.length === 1 ? " performance" : " performances");
      }

      cards.forEach(function (card) {
        var index = card.querySelector(".yap-card__index");
        n += 1;
        if (index) index.textContent = pad(n);
        tone(card.querySelector(".yap-card__row .clt-badge"), card);

        var link = card.querySelector("a.yap-video");
        if (!link || link.hasAttribute("data-yt")) return;
        var href = link.getAttribute("href");
        var id = youtubeId(href);
        var piece = text(card.querySelector(".yap-card__piece"));
        link.setAttribute("aria-label", "Play " + [name, piece].filter(Boolean).join(" singing "));

        if (!id) {
          link.removeAttribute("data-open-dialog");
          link.target = "_blank";
          link.rel = "noopener";
          return;
        }
        link.setAttribute("data-yt", id);
        var start = parseInt(text(card.querySelector("[data-yap-start]")), 10) || youtubeStart(href);
        if (start > 0) link.setAttribute("data-start", start);

        var thumb = link.querySelector(".yap-video__thumb");
        if (thumb && (!thumb.getAttribute("src") || thumb.classList.contains("w-dyn-bind-empty"))) {
          thumb.classList.remove("w-dyn-bind-empty");
          thumb.removeAttribute("srcset");
          thumb.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
        }
      });
    });
  }

  // Hero: the copy holds while the photo rises under it (wide screens); the photo grows in elsewhere.
  function initHeroOverlay() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var copy = document.querySelector("[data-yap-hero-copy]");
    var media = document.querySelector("[data-yap-hero-media]");
    if (!copy || !media || !gsap || !ST || !gsap.matchMedia || reduced) return;
    gsap.registerPlugin(ST);
    var hero = copy.parentNode;

    function travel() {
      var copyMid = copy.offsetTop + copy.offsetHeight / 2;
      var mediaMid = media.offsetTop + media.offsetHeight / 2;
      return Math.max(0, mediaMid - copyMid);
    }

    var mm = gsap.matchMedia();
    mm.add("(min-width: 64rem)", function () {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top+=" + HERO_LEAD + " top",
          end: function () { return "+=" + travel(); },
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(copy, { y: 0 }, { y: function () { return travel(); }, duration: 1 }, 0)
        .fromTo(media, { scale: 0.92 }, { scale: 1, duration: 1, ease: "power1.out" }, 0)
        .fromTo(media, { "--yap-scrim": 0 }, { "--yap-scrim": 1, duration: 0.45, ease: "power1.out" }, 0.1);
      return function () { gsap.set([copy, media], { clearProps: "transform,--yap-scrim" }); };
    });
    mm.add("(max-width: 63.99rem)", function () {
      gsap.fromTo(media, { scale: 0.94 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "top 40%", scrub: true },
      });
      return function () { gsap.set(media, { clearProps: "transform" }); };
    });
  }

  // Interview: the iframe replaces the facade in place.
  function initInline(page) {
    all(".yap-video[data-yap-inline]", page).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var screen = btn.parentNode;
        var id = btn.getAttribute("data-yt");
        if (!id || btn.hidden) return;
        var f = player(id, btn.getAttribute("data-start"), btn.getAttribute("aria-label"));
        screen.appendChild(f);
        inlineFrames.push(f);
        btn.hidden = true;
        screen.classList.add("is-playing");
        focusQuietly(f);
      });
    });
  }

  // Student videos: clt-core opens the dialog (data-open-dialog); this fills it first.
  // Capture on window runs before core's capture on document.
  function initLightbox(page) {
    var dlg = document.getElementById("yap-lb");
    if (!dlg) return;
    var frame = dlg.querySelector("[data-yap-lb-frame]");
    var title = dlg.querySelector("[data-yap-lb-title]");
    var meta = dlg.querySelector("[data-yap-lb-meta]");
    if (!frame) return;

    var CLT = window.CLT;
    var viaCore = !!(CLT && CLT.dialogs && typeof CLT.dialogs.open === "function");

    function empty() {
      while (frame.firstChild) frame.removeChild(frame.firstChild);
    }

    function load(btn) {
      var id = btn.getAttribute("data-yt");
      if (!id || dlg.open) return false;
      var card = btn.closest(".yap-card");
      var student = btn.closest(".yap-student");
      var piece = text(card && card.querySelector(".yap-card__piece"));
      var name = text(student && student.querySelector(".yap-student__name"));
      var label = [name, piece].filter(Boolean).join(" · ") || btn.getAttribute("aria-label") || "Student performance";

      pauseInline();
      empty();
      frame.appendChild(player(id, btn.getAttribute("data-start"), label));
      if (title) title.textContent = piece || label;
      if (meta) meta.textContent = name;
      dlg.setAttribute("aria-label", label);
      return true;
    }

    // Every way out ends with `open` removed, so stop the video there.
    function onToggle() { if (!dlg.hasAttribute("open")) empty(); }
    if ("MutationObserver" in window) {
      new MutationObserver(onToggle).observe(dlg, { attributes: true, attributeFilter: ["open"] });
    }
    dlg.addEventListener("close", onToggle);

    window.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".yap-video[data-yt]:not([data-yap-inline])");
      if (!btn || !page.contains(btn) || !load(btn)) return;
      if (viaCore) return;
      e.preventDefault();
      focusQuietly(btn);
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    }, true);

    if (!viaCore) {
      dlg.addEventListener("click", function (e) {
        var closer = e.target.closest && e.target.closest("[data-close-dialog]");
        if (closer || e.target === dlg) {
          if (typeof dlg.close === "function") dlg.close();
          else { dlg.removeAttribute("open"); empty(); }
        }
      });
    }
  }

  function boot() {
    if (booted) return;
    booted = true;
    var page = document.querySelector(".yap-page");
    if (!page) return;
    [
      ["hero overlay", initHeroOverlay],
      ["interview", initInline],
      ["lightbox", initLightbox],
    ].forEach(function (part) {
      try { part[1](page); }
      catch (e) { console.warn("[CLT young-artist-program] " + part[0] + " failed", e); }
    });
  }

  // clt-core flushes CLT.ready at the end of its boot; the timer covers a core that never gets there.
  function start() {
    var page = document.querySelector(".yap-page");
    if (page) {
      try { hydrateRoster(page); }
      catch (e) { console.warn("[CLT young-artist-program] roster failed", e); }
    }
    if (window.CLT && typeof window.CLT.ready === "function") {
      window.CLT.ready(boot);
      setTimeout(boot, 3000);
    } else {
      boot();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
