/* ════════════════════════════════════════════════════════════════════════════
   CLT · PERFORMANCES — CMS row hydrator (Home + Events)
   ────────────────────────────────────────────────────────────────────────────
   The "Performances" CMS collection has one item per SHOWTIME. Each renders a
   Collection List row ([data-ev-row]) carrying its data as text; this script
   merges rows that share a date into the first one and turns it into the
   finished row:

     [data-ev-title] or [data-ev-date]  Date field  → data-date="YYYY-MM-DD",
                                                      day / month / weekday badge
     [data-ev-times]                    Time        → "1:00 pm · 4:00 pm" (Home)
                                                      or Add-to-calendar chips (Events)
     [data-ev-meta]                     Venue       → "2026 · Venue" (Home)
     [data-ev-status]                   Status      → per showtime; the date is closed
                                                      only when every showtime is
     [data-ev-ticket]                   Ticket link → override href (tickets sold elsewhere)

   Tickets buttons go to window.CLT_TICKETS_URL (the /tickets page) when it is
   set, else prefill the reservation form. Runs before home.js / events.js,
   which read data-date for past / next / countdown. Idempotent.
   Under Node it only exports the pure helpers (tests/performances.test.mjs).
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var CLOSED = { "sold-out": 1, cancelled: 1, postponed: 1 };
  var LABELS = { "on-sale": "On sale", "few-seats-left": "Few seats left", "sold-out": "Sold out",
    cancelled: "Cancelled", postponed: "Postponed" };

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

  // "1:00 pm" → "1pm", "7:30 pm" → "730pm" (the /tickets ?time= token)
  function timeSlug(s) {
    var hm = parseTime(s);
    if (!hm) return "";
    return (hm[0] % 12 || 12) + (hm[1] ? pad(hm[1]) : "") + (hm[0] >= 12 ? "pm" : "am");
  }

  // Showtime status keys → the date's status. Closed only when every showtime is.
  function dateStatus(keys) {
    if (!keys.length) return "";
    var open = keys.filter(function (k) { return !CLOSED[k]; });
    if (!open.length) return keys.every(function (k) { return k === keys[0]; }) ? keys[0] : "sold-out";
    if (open.indexOf("few-seats-left") > -1) return "few-seats-left";
    return open.some(function (k) { return k; }) ? "on-sale" : "";
  }

  function ticketsHref(base, ymd, openTimes) {
    if (!base) return "";
    return base + "?date=" + ymd + (openTimes.length === 1 ? "&time=" + timeSlug(openTimes[0]) : "");
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { parseDate: parseDate, parseTime: parseTime, timeSlug: timeSlug,
      dateStatus: dateStatus, ticketsHref: ticketsHref };
    return;
  }

  // Shared with pages/tickets/tickets.js (loads after this file).
  window.CLT_PERF = { parseDate: parseDate, parseTime: parseTime, timeSlug: timeSlug,
    dateStatus: dateStatus, ticketsHref: ticketsHref };

  function text(row, sel) {
    var el = row.querySelector(sel);
    return el ? (el.textContent || "").trim() : "";
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

  // One row's own data. A legacy per-date row ("1:00 pm, 4:00 pm") yields several times.
  function read(row) {
    var status = text(row, "[data-ev-status]");
    var key = slug(status);
    return {
      date: parseDate(text(row, "[data-ev-date]") || text(row, "[data-ev-title]")),
      times: text(row, "[data-ev-times]").split(/\s*[,;·|]\s*/).filter(Boolean)
        .map(function (t) { return { label: t, key: key, status: status }; }),
      note: text(row, "[data-ev-note]"),
      ticket: text(row, "[data-ev-ticket]"),
      venue: text(row, "[data-ev-venue]") || text(row, "[data-ev-meta]"),
      address: text(row, "[data-ev-address]"),
      production: text(row, "[data-ev-production]") || "Pinocchio: The Musical"
    };
  }

  // Rows sharing a date (same list) merge into the first; the others leave the DOM.
  function group(rows) {
    var firsts = [];
    var byKey = {};
    rows.forEach(function (row) {
      var d = read(row);
      var key = d.date ? d.date.y + "-" + pad(d.date.m + 1) + "-" + pad(d.date.d) : "";
      var first = key && byKey[key];
      if (first && first.parentNode === row.parentNode) {
        var f = first.__perf;
        f.times = f.times.concat(d.times);
        if (d.note) f.notes.push({ time: d.times[0] ? d.times[0].label : "", note: d.note });
        if (!f.ticket) f.ticket = d.ticket;
        row.parentNode.removeChild(row);
        return;
      }
      d.ymd = key;
      d.notes = d.note ? [{ time: d.times[0] ? d.times[0].label : "", note: d.note }] : [];
      row.__perf = d;
      if (key) byKey[key] = row;
      firsts.push(row);
    });
    return firsts;
  }

  function render(row) {
    var d = row.__perf;
    var date = d.date;
    var label = "";
    var set = function (sel, v) { var el = row.querySelector(sel); if (el) el.textContent = v; };

    if (date) {
      var js = new Date(date.y, date.m, date.d);
      row.setAttribute("data-date", d.ymd);
      set("[data-ev-day]", String(date.d));
      set("[data-ev-mon]", MONTHS[date.m].slice(0, 3));
      set("[data-ev-wd]", DAYS[js.getDay()]);
      set("[data-ev-title]", MONTHS[date.m] + " " + date.d + ", " + date.y);
      label = DAYS_LONG[js.getDay()] + ", " + MONTHS[date.m] + " " + date.d + ", " + date.y;
    }

    var meta = row.querySelector("[data-ev-meta]");
    var timesEl = row.querySelector("[data-ev-times]");
    if (meta) {
      // Home: showtimes are the row title, venue the meta line.
      meta.textContent = "";
      [date ? String(date.y) : "", d.venue].filter(Boolean).forEach(function (v) {
        var s = document.createElement("span");
        s.textContent = v;
        meta.appendChild(s);
      });
      if (timesEl && d.times.length) {
        timesEl.textContent = "";
        d.times.forEach(function (t, i) {
          if (i) timesEl.appendChild(document.createTextNode(" · "));
          var s = document.createElement("span");
          s.className = "clt-perf-time" + (CLOSED[t.key] ? " is-closed" : "");
          s.textContent = t.label;
          if (CLOSED[t.key]) s.setAttribute("aria-label", t.label + ", " + t.status.toLowerCase());
          timesEl.appendChild(s);
        });
      }
    } else if (timesEl && d.times.length && date) {
      // Events: one Add-to-calendar chip per showtime.
      var wrap = document.createElement("div");
      wrap.className = "clt-events-show__times";
      d.times.forEach(function (t) {
        var href = t.key === "cancelled" ? "" :
          calendarUrl(d.production, date, t.label, [d.venue, d.address].filter(Boolean).join(", "));
        var a = document.createElement(href ? "a" : "span");
        a.className = "clt-events-show__time" + (CLOSED[t.key] ? " is-closed" : "");
        a.textContent = t.label;
        if (href) {
          a.href = href;
          a.target = "_blank";
          a.rel = "noopener";
          a.setAttribute("aria-label", "Add the " + t.label + " show on " + label + " to Google Calendar" +
            (CLOSED[t.key] ? " (" + t.status.toLowerCase() + ")" : ""));
        }
        wrap.appendChild(a);
      });
      timesEl.hidden = true;
      timesEl.parentNode.insertBefore(wrap, timesEl.nextSibling);
    }

    var note = row.querySelector("[data-ev-note]");
    if (note) {
      var notes = d.notes.length > 1 || (d.notes.length && d.times.length > 1)
        ? d.notes.map(function (n) { return (n.time ? n.time + " — " : "") + n.note; }) : d.notes.map(function (n) { return n.note; });
      note.textContent = notes.join(" · ");
      if (!notes.length) note.hidden = true;
    }

    var statusKey = dateStatus(d.times.map(function (t) { return t.key; }));
    var statusText = LABELS[statusKey] || (d.times[0] && d.times[0].status) || "";
    if (statusKey) row.setAttribute("data-status", statusKey);
    if (statusKey && statusKey !== "on-sale") {
      var pill = document.createElement("span");
      pill.className = "clt-perf-status";
      pill.textContent = statusText;
      var body = row.querySelector(".clt-list-row__body");
      if (body) body.insertBefore(pill, body.firstChild);
    }

    var btn = row.querySelector("[data-ev-tickets]");
    if (!btn) return;
    var open = d.times.filter(function (t) { return !CLOSED[t.key]; }).map(function (t) { return t.label; });
    var page = ticketsHref(window.CLT_TICKETS_URL || "", d.ymd, open);
    if (CLOSED[statusKey]) {
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.classList.add("is-disabled");
      var bt = btn.querySelector(".clt-button__text");
      if (bt) bt.textContent = statusText;
    } else if (/^https?:\/\//i.test(d.ticket)) {
      btn.href = d.ticket; // tickets sold elsewhere
      btn.setAttribute("data-ticket-external", "");
    } else if (page && d.ymd) {
      btn.href = page;
      btn.setAttribute("data-ticket-page", "");
    } else if (label) {
      btn.setAttribute("data-events-ticket", label); // prefills the reservation form
    }
  }

  function hydrate(root) {
    var rows = Array.prototype.slice.call((root || document).querySelectorAll("[data-ev-row]:not([data-ev-ready])"));
    rows.forEach(function (row) { row.setAttribute("data-ev-ready", ""); });
    group(rows).forEach(render);
  }

  window.cltHydratePerformances = hydrate;
  hydrate(document);
})();
