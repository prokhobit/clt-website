/* ════════════════════════════════════════════════════════════════════════════
   CLT · PERFORMANCES — CMS row hydrator (Home + Events)
   ────────────────────────────────────────────────────────────────────────────
   The "Performances" CMS collection renders one Collection List item per date
   ([data-ev-row]). Webflow can only bind CMS fields to text, so each row carries
   its data as text and this script turns it into the finished row:

     [data-ev-title] or [data-ev-date]  Date field  → data-date="YYYY-MM-DD",
                                                      day / month / weekday badge
     [data-ev-times]                    Showtimes   → "1:00 pm · 4:00 pm" (Home)
                                                      or Add-to-calendar chips (Events)
     [data-ev-meta]                     Venue       → "2026 · Venue" (Home)
     [data-ev-status]                   Status      → data-status + pill; Sold out /
                                                      Cancelled / Postponed disable Tickets
     [data-ev-ticket]                   Ticket link → Tickets href (else the reservation form)

   Runs inline before home.js / events.js, which read data-date for past /
   next / countdown. Idempotent.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var CLOSED = { "sold-out": 1, cancelled: 1, postponed: 1 };

  function text(row, sel) {
    var el = row.querySelector(sel);
    return el ? (el.textContent || "").trim() : "";
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  // "2026-11-07…", "November 7, 2026", "Nov 7 2026", "11/07/2026" → {y, m (0-11), d}
  function parseDate(s) {
    var m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { y: +m[1], m: +m[2] - 1, d: +m[3] };
    m = s.match(/([A-Za-z]{3,})\.?\s+(\d{1,2}),?\s+(\d{4})/);
    if (m) {
      var mi = MONTHS.map(function (x) { return x.slice(0, 3).toLowerCase(); })
        .indexOf(m[1].slice(0, 3).toLowerCase());
      if (mi > -1) return { y: +m[3], m: mi, d: +m[2] };
    }
    m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { y: +m[3], m: +m[1] - 1, d: +m[2] };
    var t = Date.parse(s);
    if (!isNaN(t)) { var x = new Date(t); return { y: x.getFullYear(), m: x.getMonth(), d: x.getDate() }; }
    return null;
  }

  // "1:00 pm" → [13, 0]
  function parseTime(s) {
    var m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(a|p)\.?m?/i);
    if (!m) return null;
    var h = +m[1] % 12 + (m[3].toLowerCase() === "p" ? 12 : 0);
    return [h, +(m[2] || 0)];
  }

  function calendarUrl(title, date, time, where) {
    var hm = parseTime(time);
    if (!hm) return "";
    var ymd = date.y + pad(date.m + 1) + pad(date.d);
    var start = ymd + "T" + pad(hm[0]) + pad(hm[1]) + "00";
    var end = ymd + "T" + pad(hm[0] + 1) + pad(hm[1]) + "00"; // shows run ~60 min
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + start + "/" + end + "&ctz=America/New_York" +
      "&location=" + encodeURIComponent(where) +
      "&details=" + encodeURIComponent("Commonwealth Lyric Theater · Tickets: " + location.origin + "/events#performances");
  }

  function hydrate(root) {
    (root || document).querySelectorAll("[data-ev-row]:not([data-ev-ready])").forEach(function (row) {
      row.setAttribute("data-ev-ready", "");
      var date = parseDate(text(row, "[data-ev-date]") || text(row, "[data-ev-title]"));
      var times = text(row, "[data-ev-times]").split(/\s*[,;·|]\s*/).filter(Boolean);
      var status = text(row, "[data-ev-status]");
      var statusKey = slug(status);
      var ticket = text(row, "[data-ev-ticket]");
      var venue = text(row, "[data-ev-venue]") || text(row, "[data-ev-meta]");
      var address = text(row, "[data-ev-address]");
      var production = text(row, "[data-ev-production]") || "Pinocchio: The Musical";

      if (date) {
        var js = new Date(date.y, date.m, date.d);
        row.setAttribute("data-date", date.y + "-" + pad(date.m + 1) + "-" + pad(date.d));
        var set = function (sel, v) { var el = row.querySelector(sel); if (el) el.textContent = v; };
        set("[data-ev-day]", String(date.d));
        set("[data-ev-mon]", MONTHS[date.m].slice(0, 3));
        set("[data-ev-wd]", DAYS[js.getDay()]);
        set("[data-ev-title]", MONTHS[date.m] + " " + date.d + ", " + date.y);
        var label = DAYS_LONG[js.getDay()] + ", " + MONTHS[date.m] + " " + date.d + ", " + date.y;
      }

      // Home: showtimes are the row title, venue the meta line.
      var meta = row.querySelector("[data-ev-meta]");
      var timesEl = row.querySelector("[data-ev-times]");
      if (meta) {
        meta.textContent = "";
        [date ? String(date.y) : "", venue].filter(Boolean).forEach(function (v) {
          var s = document.createElement("span");
          s.textContent = v;
          meta.appendChild(s);
        });
        if (timesEl && times.length) timesEl.textContent = times.join(" · ");
      } else if (timesEl && times.length && date) {
        // Events: one Add-to-calendar chip per showtime.
        var wrap = document.createElement("div");
        wrap.className = "clt-events-show__times";
        times.forEach(function (t) {
          var href = calendarUrl(production, date, t, [venue, address].filter(Boolean).join(", "));
          var a = document.createElement(href ? "a" : "span");
          a.className = "clt-events-show__time";
          a.textContent = t;
          if (href) {
            a.href = href;
            a.target = "_blank";
            a.rel = "noopener";
            a.setAttribute("aria-label", "Add the " + t + " show on " + label + " to Google Calendar");
          }
          wrap.appendChild(a);
        });
        timesEl.hidden = true;
        timesEl.parentNode.insertBefore(wrap, timesEl.nextSibling);
      }
      var note = row.querySelector("[data-ev-note]");
      if (note && !(note.textContent || "").trim()) note.hidden = true;

      if (statusKey) row.setAttribute("data-status", statusKey);
      if (statusKey && statusKey !== "on-sale") {
        var pill = document.createElement("span");
        pill.className = "clt-perf-status";
        pill.textContent = status;
        var body = row.querySelector(".clt-list-row__body");
        if (body) body.insertBefore(pill, body.firstChild);
      }

      var btn = row.querySelector("[data-ev-tickets]");
      if (!btn) return;
      if (CLOSED[statusKey]) {
        btn.removeAttribute("href");
        btn.setAttribute("aria-disabled", "true");
        btn.classList.add("is-disabled");
        var bt = btn.querySelector(".clt-button__text");
        if (bt) bt.textContent = status;
      } else if (/^https?:\/\//i.test(ticket)) {
        btn.href = ticket; // Stripe Payment Link / ticketing checkout
        btn.setAttribute("data-ticket-external", "");
      } else if (label) {
        btn.setAttribute("data-events-ticket", label); // prefills the reservation form
      }
    });
  }

  window.cltHydratePerformances = hydrate;
  hydrate(document);
})();
