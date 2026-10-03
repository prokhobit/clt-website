/* ════════════════════════════════════════════════════════════════════════════
   CLT · TRACKING + COOKIE CONSENT — site footer (after clt-core)
   ────────────────────────────────────────────────────────────────────────────
   · Consent is opt-in, stored in localStorage "clt-consent" for 12 months:
       { v: 1, measure: bool, ads: bool, at: <ms> }
     A browser's Global Privacy Control signal counts as "Decline".
   · Banner (Accept / Decline / Choices) until a choice is made; the footer gets a
     "Cookie settings" button that reopens the choices.
   · Tools load only with consent. Config in site head:
       window.CLT_TRACKING = { meta: "<pixel id>", ga4: "<G-…>" (optional) }
   · Pages report events through CLT.track(name, data): Meta standard events
     (PageView, ViewContent, InitiateCheckout, Lead). Purchases are reported by
     Ticket Tailor's own pixel inside the checkout, never from here.
   · Fires "clt:consent" on document when the choice changes.
   Under Node it only exports the pure helpers (tests/tracking.test.mjs).
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var KEY = "clt-consent";
  var VERSION = 1;
  var MAX_AGE = 365 * 864e5;

  // Stored JSON → consent, or null when missing, unreadable, outdated or expired.
  function readConsent(raw, now) {
    var c;
    try { c = JSON.parse(raw || "null"); } catch (e) { return null; }
    if (!c || c.v !== VERSION || typeof c.at !== "number" || now - c.at > MAX_AGE) return null;
    return { v: VERSION, measure: !!c.measure, ads: !!c.ads, at: c.at };
  }

  function makeConsent(measure, ads, now) {
    return { v: VERSION, measure: !!measure, ads: !!ads, at: now };
  }

  // Which tools may run for a given consent (null = no choice yet).
  function allowed(consent, gpc) {
    if (!consent) return { measure: false, ads: false };
    return { measure: consent.measure && !gpc, ads: consent.ads && !gpc };
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { readConsent: readConsent, makeConsent: makeConsent, allowed: allowed, KEY: KEY };
    return;
  }

  // ── Browser ────────────────────────────────────────────────────────────────
  if (window.__cltTrackingReady) return;
  window.__cltTrackingReady = true;

  var CLT = (window.CLT = window.CLT || {});
  var config = window.CLT_TRACKING || {};
  var gpc = navigator.globalPrivacyControl === true;
  var consent = null;
  try { consent = readConsent(localStorage.getItem(KEY), Date.now()); } catch (e) {}
  var loaded = { meta: false, ga4: false };
  var pending = [];

  function save(c) {
    consent = c;
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    apply();
    try { document.dispatchEvent(new CustomEvent("clt:consent", { detail: allowed(c, gpc) })); } catch (e) {}
  }

  // ── Tools ──────────────────────────────────────────────────────────────────
  function loadMeta() {
    if (loaded.meta || !config.meta) return;
    loaded.meta = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", config.meta);
    window.fbq("track", "PageView");
  }

  function loadGa4() {
    if (loaded.ga4 || !config.ga4) return;
    loaded.ga4 = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", config.ga4, { anonymize_ip: true });
  }

  // Remove Meta's first-party cookies after a withdrawal.
  function clearMetaCookies() {
    var host = location.hostname.replace(/^www\./, "");
    ["_fbp", "_fbc"].forEach(function (name) {
      ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
      });
    });
  }

  function apply() {
    var a = allowed(consent, gpc);
    if (a.ads) {
      loadMeta();
      if (window.fbq) window.fbq("consent", "grant");
    } else if (loaded.meta && window.fbq) {
      window.fbq("consent", "revoke");
      clearMetaCookies();
    }
    if (a.measure) loadGa4();
    if (a.ads || a.measure) flush();
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  function send(name, data) {
    var a = allowed(consent, gpc);
    if (a.ads && window.fbq && name !== "PageView") window.fbq("track", name, data || {});
    if (a.measure && window.gtag) {
      var ga = { ViewContent: "view_item", InitiateCheckout: "begin_checkout", Lead: "generate_lead" }[name];
      if (ga) window.gtag("event", ga, data || {});
    }
  }

  function flush() {
    var q = pending;
    pending = [];
    q.forEach(function (e) { send(e[0], e[1]); });
  }

  // Events before a choice wait in memory for this page view only.
  CLT.track = function (name, data) {
    var a = allowed(consent, gpc);
    if (!consent) { pending.push([name, data]); return; }
    if (a.ads || a.measure) send(name, data);
  };
  CLT.consent = {
    get: function () { return allowed(consent, gpc); },
    set: function (measure, ads) { save(makeConsent(measure, ads, Date.now())); },
    open: function () { openChoices(); }
  };

  // ── Banner + choices ───────────────────────────────────────────────────────
  var banner = null;
  var dialog = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function button(cls, text, onClick) {
    var b = el("button", "clt-button is-small " + cls);
    b.type = "button";
    b.appendChild(el("span", "clt-button__text", text));
    b.addEventListener("click", onClick);
    return b;
  }

  function closeBanner() {
    if (!banner) return;
    banner.classList.remove("is-open");
    var b = banner;
    banner = null;
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 500);
  }

  function showBanner() {
    if (banner) return;
    banner = el("section", "clt-consent");
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie choices");
    var body = el("div", "clt-consent__body");
    body.appendChild(el("p", "clt-consent__title", "Cookies at the theater"));
    body.appendChild(el("p", "clt-consent__text",
      "We use a few essentials to run the site and the box office. With your OK, we'd also use Meta's pixel to learn which of our ads bring people to the show. You can change your mind any time under Cookie settings in the footer."));
    banner.appendChild(body);
    var actions = el("div", "clt-consent__actions");
    actions.appendChild(button("is-primary", "Accept", function () { save(makeConsent(true, true, Date.now())); closeBanner(); }));
    actions.appendChild(button("is-ghost", "Decline", function () { save(makeConsent(false, false, Date.now())); closeBanner(); }));
    actions.appendChild(button("is-ghost", "Choices", function () { openChoices(); }));
    banner.appendChild(actions);
    document.body.appendChild(banner);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (banner) banner.classList.add("is-open"); }); });
  }

  function toggle(id, label, text, checked, locked) {
    var row = el("label", "clt-consent__option");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.id = id;
    box.checked = checked;
    box.disabled = !!locked;
    row.appendChild(box);
    var copy = el("span", "clt-consent__option-copy");
    copy.appendChild(el("span", "clt-consent__option-title", label + (locked ? " · always on" : "")));
    copy.appendChild(el("span", "clt-consent__option-text", text));
    row.appendChild(copy);
    return row;
  }

  function buildDialog() {
    dialog = el("dialog", "clt-dialog clt-consent-dialog");
    dialog.id = "clt-consent-dialog";
    dialog.setAttribute("aria-labelledby", "clt-consent-dialog-title");
    var close = el("button", "clt-dialog__close");
    close.type = "button";
    close.setAttribute("data-close-dialog", "");
    close.setAttribute("aria-label", "Close cookie choices");
    close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    dialog.appendChild(close);
    var body = el("div", "clt-dialog__body");
    var title = el("h3", "clt-dialog__title", "Your cookie choices");
    title.id = "clt-consent-dialog-title";
    body.appendChild(title);
    var list = el("div", "clt-consent__options");
    var a = allowed(consent, gpc);
    list.appendChild(toggle("clt-c-essential", "Essential", "Keeps the site and the secure checkout working, and remembers this choice.", true, true));
    list.appendChild(toggle("clt-c-measure", "Visit measurement", "Notes how you found us (for example a search, a newsletter or an ad) so we know what works. Kept only until you close the browser.", a.measure, false));
    list.appendChild(toggle("clt-c-ads", "Advertising", "Meta's pixel tells Facebook and Instagram which of our ads led to a visit or a ticket purchase. Meta may use this under its own privacy policy.", a.ads, false));
    body.appendChild(list);
    if (gpc) body.appendChild(el("p", "clt-consent__note", "Your browser is sending a Global Privacy Control signal, so optional cookies stay off."));
    dialog.appendChild(body);
    var actions = el("div", "clt-dialog__actions");
    actions.appendChild(button("is-ghost", "Save choices", function () {
      save(makeConsent(dialog.querySelector("#clt-c-measure").checked, dialog.querySelector("#clt-c-ads").checked, Date.now()));
      closeBanner();
      closeChoices();
    }));
    actions.appendChild(button("is-primary", "Accept all", function () {
      save(makeConsent(true, true, Date.now()));
      closeBanner();
      closeChoices();
    }));
    dialog.appendChild(actions);
    document.body.appendChild(dialog);
    close.addEventListener("click", closeChoices);
  }

  function openChoices() {
    if (dialog && dialog.parentNode) dialog.parentNode.removeChild(dialog);
    buildDialog();
    if (CLT.dialogs && typeof CLT.dialogs.open === "function") CLT.dialogs.open(dialog);
    else if (dialog.showModal) dialog.showModal();
  }

  function closeChoices() {
    if (!dialog) return;
    if (CLT.dialogs && typeof CLT.dialogs.close === "function") CLT.dialogs.close(dialog);
    else if (dialog.close) dialog.close();
  }

  // Footer: "Cookie settings" next to Terms and Privacy.
  function addFooterLink() {
    document.querySelectorAll(".clt-footer__legal").forEach(function (row) {
      if (row.querySelector("[data-clt-cookie-settings]")) return;
      var b = button("is-ghost", "Cookie settings", function () { openChoices(); });
      b.setAttribute("data-clt-cookie-settings", "");
      b.setAttribute("aria-haspopup", "dialog");
      row.appendChild(b);
    });
  }

  // Webflow form success → Lead.
  function watchForms() {
    document.querySelectorAll(".w-form").forEach(function (wrap) {
      var done = wrap.querySelector(".w-form-done");
      var form = wrap.querySelector("form");
      if (!done || !form || wrap.__cltLead) return;
      wrap.__cltLead = true;
      new MutationObserver(function () {
        if (getComputedStyle(done).display !== "none" && !wrap.__cltLeadSent) {
          wrap.__cltLeadSent = true;
          CLT.track("Lead", { content_name: form.getAttribute("data-name") || form.getAttribute("name") || "Form" });
        }
      }).observe(done, { attributes: true, attributeFilter: ["style", "class"] });
    });
  }

  function start() {
    addFooterLink();
    watchForms();
    apply(); // load allowed tools before the first event
    var path = location.pathname.replace(/\/$/, "");
    if (path === "/tickets" || path === "/events") {
      CLT.track("ViewContent", { content_name: "Pinocchio: The Musical", content_category: path === "/tickets" ? "Tickets" : "Events" });
    }
    if (!consent && !gpc) setTimeout(showBanner, 1200); // after the curtain opens
    if (!consent && gpc) save(makeConsent(false, false, Date.now()));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
