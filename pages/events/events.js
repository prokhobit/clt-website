/* ════════════════════════════════════════════════════════════════════════════
   CLT · EVENTS — page script
   ────────────────────────────────────────────────────────────────────────────
   Runs from the Events page's "Before </body>" custom code (inline, after the
   deferred Lenis + clt-core scripts). This file is the source of truth.

   · Performances (#performances, [data-events-show]) — rows come from the
     Performances CMS collection, hydrated by pages/shared/performances.js
     (inlined just before this script). Hides past dates,
     marks the next one, writes the countdown, flips to the closed notice
     when the run is over, and plays the poster/details entrance.
   · Tickets buttons ([data-events-ticket]) — preselect "Pinocchio tickets"
     in the contact form and start the message with the chosen date.
   · Share ([data-events-share]) — native share sheet, else copy the link.
   · Payment cards — copy the handle / open mailto.

   The contact form is a native Webflow form (#events-contact-form); clt-core
   validates it (data-clt-validate) and Webflow stores the submission.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  if (window.__cltEventsReady) return;
  window.__cltEventsReady = true;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initShow() {
    var section = document.querySelector("[data-events-show]");
    if (!section) return;
    // CMS rows (Performances collection) → data-date, badges, calendar chips.
    if (window.cltHydratePerformances) window.cltHydratePerformances(section);

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var rows = Array.prototype.slice.call(section.querySelectorAll("[data-date]"));
    var upcoming = rows.filter(function (row) {
      var p = (row.getAttribute("data-date") || "").split("-").map(Number);
      if (p.length !== 3 || !p[0]) return true;
      row.__date = new Date(p[0], p[1] - 1, p[2]);
      var past = row.__date < today;
      row.classList.toggle("is-past", past);
      if (past) row.setAttribute("aria-hidden", "true");
      return !past;
    });

    var countdown = section.querySelector("[data-events-countdown]");
    var closed = section.querySelector("[data-events-closed]");
    if (upcoming.length) {
      var next = upcoming[0];
      next.classList.add("is-next");
      if (countdown && next.__date) {
        var days = Math.round((next.__date - today) / 864e5);
        countdown.textContent =
          days === 0 ? "Performing today" :
          days === 1 ? "Next performance tomorrow" :
          "Next performance in " + days + " days";
        countdown.hidden = false;
      }
    } else if (rows.length) {
      section.classList.add("is-closed");
      if (closed) closed.hidden = false;
    }

    // Entrance — poster rises into the lamp, details follow.
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var frame = section.querySelector(".clt-events-show__frame");
    var details = section.querySelectorAll(".clt-events-show__details > *:not([hidden])");
    if (reduced || !gsap || !ScrollTrigger || !frame) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(frame, { autoAlpha: 0, yPercent: 10, rotationX: 14, transformOrigin: "50% 100%" });
    gsap.set(details, { autoAlpha: 0, y: 18 });
    ScrollTrigger.create({
      trigger: section.querySelector(".clt-events-show__grid") || section,
      start: "top 80%",
      once: true,
      onEnter: function () {
        var ease = (window.CLT && window.CLT.motion && window.CLT.motion.easeStage) || "expo.out";
        var tl = gsap.timeline({ defaults: { ease: ease } });
        tl.to(frame, { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 1.25, clearProps: "all" }, 0);
        tl.to(details, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, clearProps: "transform,opacity,visibility" }, 0.15);
      },
    });
  }

  function initTickets() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-events-ticket]");
      if (!btn || btn.hasAttribute("data-ticket-external")) return;
      var topic = document.getElementById("ev-topic");
      var message = document.getElementById("ev-message");
      if (topic) topic.value = "Pinocchio tickets";
      if (message && !message.value.trim()) {
        var date = btn.getAttribute("data-events-ticket");
        message.value = date
          ? "Tickets for " + date + " — showtime (1:00 or 4:00 pm): , number of seats: "
          : "Tickets for Pinocchio: The Musical — date & showtime: , number of seats: ";
      }
    });
  }

  function initShare() {
    document.querySelectorAll("[data-events-share]").forEach(function (btn) {
      var label = btn.querySelector(".clt-button__text") || btn;
      var original = label.textContent;
      btn.addEventListener("click", function () {
        var url = location.origin + "/events#performances";
        var data = { title: "Pinocchio: The Musical", text: "Pinocchio: The Musical at the Embassy Theater, Waltham", url: url };
        if (navigator.share) {
          navigator.share(data).catch(function () {});
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            label.textContent = "Link copied";
            setTimeout(function () { label.textContent = original; }, 1800);
          }).catch(function () {});
        }
      });
    });
  }

  function initPaymentCards() {
    document.querySelectorAll(".clt-events-payment-card").forEach(function (card) {
      var copyEl = card.querySelector(".clt-events-payment-card-copy");
      var original = copyEl ? copyEl.textContent : "";
      var timer = 0;
      card.addEventListener("click", function () {
        var text = card.getAttribute("data-copy");
        var href = card.getAttribute("data-href");
        if (text && navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
        if (href) window.location.href = href;
        if (!copyEl) return;
        card.classList.add("is-copied");
        copyEl.textContent = href ? "Opened" : "Copied";
        clearTimeout(timer);
        timer = setTimeout(function () {
          card.classList.remove("is-copied");
          copyEl.textContent = original;
        }, 1800);
      });
    });
  }

  function init() {
    initShow();
    initTickets();
    initShare();
    initPaymentCards();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
