/* CLT · form source tracking — site footer (inline). Adds hidden fields to every
   Webflow form so each submission records where the person came from:
   Source page, First referrer, First landing page, UTM (first touch, kept for
   the browser session). Works with Webflow Forms and any CRM synced from them. */
(function () {
  "use strict";
  var KEY = "clt-first-touch";
  var touch = null;
  try { touch = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}
  if (!touch) {
    var q = new URLSearchParams(location.search);
    var utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map(function (k) { return q.get(k) ? k.slice(4) + "=" + q.get(k) : ""; })
      .filter(Boolean).join(", ");
    var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer : "";
    touch = { ref: ref || "(direct)", landing: location.pathname, utm: utm || "(none)" };
    try { sessionStorage.setItem(KEY, JSON.stringify(touch)); } catch (e) {}
  }
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
