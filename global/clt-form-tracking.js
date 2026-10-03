/* CLT · form source tracking — site footer. Adds hidden fields to every
   Webflow form so each submission records where the person came from:
   Source page, First referrer, First landing page, UTM. The first touch is kept
   for the browser session only when the visitor allows "Visit measurement"
   (clt-tracking consent); otherwise it covers the current page view only.
   Exposes window.CLT_TOUCH for the tickets page. */
(function () {
  "use strict";
  var KEY = "clt-first-touch";
  function measureAllowed() {
    if (navigator.globalPrivacyControl === true) return false;
    try {
      var c = JSON.parse(localStorage.getItem("clt-consent") || "null");
      return !!(c && c.v === 1 && c.measure && Date.now() - c.at < 365 * 864e5);
    } catch (e) { return false; }
  }
  var touch = null;
  try { touch = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}
  if (!touch) {
    var q = new URLSearchParams(location.search);
    var utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map(function (k) { return q.get(k) ? k.slice(4) + "=" + q.get(k) : ""; })
      .filter(Boolean).join(", ");
    var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer : "";
    touch = { ref: ref || "(direct)", landing: location.pathname, utm: utm || "(none)" };
  }
  window.CLT_TOUCH = touch;
  function persist() {
    try {
      if (measureAllowed()) sessionStorage.setItem(KEY, JSON.stringify(touch));
      else sessionStorage.removeItem(KEY);
    } catch (e) {}
  }
  persist();
  document.addEventListener("clt:consent", persist);
  function add(form, name, value) {
    var input = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.setAttribute("data-name", name);
      form.appendChild(input);
    }
    input.value = value;
  }
  function run() {
    document.querySelectorAll(".w-form form").forEach(function (form) {
      add(form, "Source page", location.pathname + location.hash);
      add(form, "First referrer", touch.ref);
      add(form, "First landing page", touch.landing);
      add(form, "UTM", touch.utm);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
