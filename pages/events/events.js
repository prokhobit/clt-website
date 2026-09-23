/* ════════════════════════════════════════════════════════════════════════════
   CLT · EVENTS — page script
   ────────────────────────────────────────────────────────────────────────────
   Replaces the inline <script> in the Events page's custom code. Owns the
   contact form's client-side check and the payment cards (copy / open).

   CONTRACT WITH clt-core.updated.js (site-wide)
     · The jump-nav is core's (initJumpNav): scroll-spy, docking and the
       click lock. The old inline script ran a second highlighter on every
       scroll that knew nothing about the click lock, so the pill flicked
       through sections mid-jump and fought core over .is-current. It is
       gone — nothing here touches .clt-jumpnav.
     · Scrolls through CLT.scrollTo, so Lenis owns the motion.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  if (window.__cltEventsReady) return; // idempotent — safe if injected twice
  window.__cltEventsReady = true;

  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function scrollToY(y) {
    y = Math.max(0, y);
    var CLT = window.CLT;
    if (CLT && typeof CLT.scrollTo === "function") CLT.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  /* ── Contact form ─────────────────────────────────────────────────────────
     NOTE: this form has no action and is not a Webflow Form Block, so there
     is nowhere for the message to go — it only validates and shows the
     success panel. Wire it to a Webflow form (or a form service) before
     relying on it. */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;
      form.querySelectorAll(".clt-field").forEach(function (f) {
        var inp = f.querySelector("[required]");
        if (!inp) {
          f.removeAttribute("data-state");
          return;
        }
        var value = (inp.value || "").trim();
        var valid = !!value && (inp.type !== "email" || EMAIL.test(value));
        if (valid) {
          f.removeAttribute("data-state");
        } else {
          f.setAttribute("data-state", "error");
          ok = false;
          if (!firstBad) firstBad = inp;
        }
      });
      if (!ok) {
        if (firstBad) firstBad.focus();
        return;
      }
      form.classList.add("is-sent");
      scrollToY(form.getBoundingClientRect().top + window.pageYOffset - 120);
    });
    // Clear a field's error as soon as it is fixed.
    form.addEventListener("input", function (e) {
      var f = e.target && e.target.closest ? e.target.closest(".clt-field") : null;
      if (f && f.getAttribute("data-state") === "error" && (e.target.value || "").trim()) {
        f.removeAttribute("data-state");
      }
    });
  }

  /* ── Payment cards: copy to clipboard / open mailto ─────────────────────── */
  function initPaymentCards() {
    document.querySelectorAll(".clt-events-payment-card").forEach(function (card) {
      var copyEl = card.querySelector(".clt-events-payment-card-copy");
      var original = copyEl ? copyEl.textContent : "";
      var timer = 0;
      card.addEventListener("click", function () {
        var text = card.getAttribute("data-copy");
        var href = card.getAttribute("data-href");
        if (text && navigator.clipboard) {
          navigator.clipboard.writeText(text).catch(function () {});
        }
        if (href) window.location.href = href;
        if (!copyEl) return;
        // Repeat clicks restart the timer instead of stacking them, which
        // left "Copied" stuck as the label once the first one restored it.
        clearTimeout(timer);
        card.classList.add("is-copied");
        copyEl.textContent = href ? "Opened" : "Copied";
        timer = setTimeout(function () {
          card.classList.remove("is-copied");
          copyEl.textContent = original;
        }, 1800);
      });
    });
  }

  function init() {
    initForm();
    initPaymentCards();
  }

  if (window.CLT && typeof window.CLT.ready === "function") window.CLT.ready(init);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
