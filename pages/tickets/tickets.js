/* ════════════════════════════════════════════════════════════════════════════
   CLT · TICKETS — page script (/tickets)
   ────────────────────────────────────────────────────────────────────────────
   · Showtimes come from the Performances CMS (one item per showtime), rendered
     as hidden rows ([data-tk-row]) inside #performances. This script groups
     them production → month → date and renders the picker ([data-tk-picker]).
     Without JS the rows stay visible as plain checkout links.
   · Choosing a time loads that showtime's Ticket Tailor checkout (from
     tickets.commonwealthlyrictheater.com) into the stage panel ([data-tk-mount]).
     Phones (< 48rem): the panel shows the choice + "Choose seats", which opens
     the checkout full-screen in #tk-sheet.
   · URL: /tickets?date=YYYY-MM-DD[&time=4pm] preselects; the URL follows choices.
   · The checkout gets ref=<first-touch campaign> so Ticket Tailor orders show
     which ad or site sent the buyer (first touch from clt-form-tracking).
   Needs window.CLT_PERF (pages/shared/performances.js, site footer).
   Under Node it only exports the pure helpers (tests/tickets.test.mjs).
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var CLOSED = { "sold-out": 1, cancelled: 1, postponed: 1 };
  var LABELS = { "few-seats-left": "Few left", "sold-out": "Sold out", cancelled: "Cancelled", postponed: "Postponed" };
  var WIDGET = "https://cdn.tickettailor.com/js/widgets/min/widget.js";
  var COLORS = { background: "#131315", text: "#EFE4CF", "button-bg": "#C79A5E", "button-text": "#1C130B",
    "header-bg": "#131315", "header-text": "#EFE4CF" };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  // Rows (plain objects of the CMS text) → showtimes, sorted, past ones dropped.
  // perf = { parseDate, parseTime, timeSlug } (CLT_PERF); today = Date at local midnight.
  function buildShows(rows, perf, today) {
    var shows = [];
    rows.forEach(function (r) {
      var d = perf.parseDate(r.date || "");
      if (!d) return;
      var day = new Date(d.y, d.m, d.d);
      if (day < today) return;
      var hm = perf.parseTime(r.time || "") || [0, 0];
      var sales = r.sales ? perf.parseDate(r.sales) : null;
      var salesDay = sales ? new Date(sales.y, sales.m, sales.d) : null;
      var key = slug(r.status);
      shows.push({
        ymd: d.y + "-" + pad(d.m + 1) + "-" + pad(d.d),
        y: d.y, m: d.m, d: d.d, wd: day.getDay(),
        start: day.getTime() + (hm[0] * 60 + hm[1]) * 6e4,
        time: r.time || "",
        tslug: perf.timeSlug(r.time || ""),
        key: key,
        status: r.status || "",
        closed: !!CLOSED[key],
        presale: salesDay && salesDay > today ? MONTHS[salesDay.getMonth()].slice(0, 3) + " " + salesDay.getDate() : "",
        id: r.id || "",
        checkout: r.checkout || "",
        override: /^https?:\/\//i.test(r.override || "") ? r.override : "",
        production: r.production || "Pinocchio: The Musical",
        note: r.note || ""
      });
    });
    return shows.sort(function (a, b) { return a.start - b.start; });
  }

  // Showtimes → [{ production, months: [{ label, dates: [{ ymd, ..., shows: [] }] }] }]
  function groupShows(shows) {
    var prods = [];
    var byProd = {};
    shows.forEach(function (s) {
      var p = byProd[s.production];
      if (!p) { p = byProd[s.production] = { production: s.production, months: [], byMonth: {} }; prods.push(p); }
      var mk = s.y + "-" + s.m;
      var mo = p.byMonth[mk];
      if (!mo) { mo = p.byMonth[mk] = { label: MONTHS[s.m] + " " + s.y, dates: [], byDate: {} }; p.months.push(mo); }
      var dt = mo.byDate[s.ymd];
      if (!dt) {
        dt = mo.byDate[s.ymd] = { ymd: s.ymd, y: s.y, m: s.m, d: s.d, wd: s.wd,
          title: DAYS_LONG[s.wd] + ", " + MONTHS[s.m] + " " + s.d, shows: [] };
        mo.dates.push(dt);
      }
      dt.shows.push(s);
    });
    return prods;
  }

  // Bookable = has somewhere to buy, not closed, not before sales open.
  function bookable(s) { return !s.closed && !s.presale && !!(s.checkout || s.override); }

  // "?date=2026-11-07&time=4pm" → { date, time }
  function parseQuery(search) {
    var out = { date: "", time: "" };
    String(search || "").replace(/^\?/, "").split("&").forEach(function (kv) {
      var p = kv.split("=");
      var k = decodeURIComponent(p[0] || "");
      var v = decodeURIComponent((p[1] || "").replace(/\+/g, " "));
      if (k === "date" && /^\d{4}-\d{2}-\d{2}$/.test(v)) out.date = v;
      if (k === "time") out.time = v.toLowerCase().replace(/[^0-9apm]/g, "");
    });
    return out;
  }

  // First touch (clt-form-tracking) → Ticket Tailor ref, e.g. "fb-pinocchio-nov".
  function refFromTouch(touch) {
    if (!touch) return "website";
    var utm = {};
    String(touch.utm || "").split(/,\s*/).forEach(function (kv) {
      var i = kv.indexOf("=");
      if (i > 0) utm[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
    });
    var ref = "";
    if (utm.source) ref = [utm.source, utm.campaign].filter(Boolean).join("-");
    else if (touch.ref && touch.ref !== "(direct)") {
      var host = String(touch.ref).replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
      ref = "ref-" + host;
    }
    ref = slug(ref).slice(0, 50).replace(/-$/, "");
    return ref || "website";
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { buildShows: buildShows, groupShows: groupShows, bookable: bookable,
      parseQuery: parseQuery, refFromTouch: refFromTouch };
    return;
  }

  // ── Browser ────────────────────────────────────────────────────────────────
  if (window.__cltTicketsReady) return;
  window.__cltTicketsReady = true;

  var section = document.querySelector("[data-tk-pick]");
  var picker = document.querySelector("[data-tk-picker]");
  var perf = window.CLT_PERF;
  if (!section || !picker || !perf) return;

  var stage = document.querySelector("[data-tk-stage]");
  var mount = document.querySelector("[data-tk-mount]");
  var chosen = document.querySelector("[data-tk-chosen]");
  var newtab = document.querySelector("[data-tk-newtab]");
  var openSheet = document.querySelector("[data-tk-open-sheet]");
  var sheet = document.getElementById("tk-sheet");
  var sheetMount = document.querySelector("[data-tk-sheet-mount]");
  var sheetShow = document.querySelector("[data-tk-sheet-show]");
  var phone = window.matchMedia("(max-width: 47.999rem)");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function text(el, sel) {
    var n = el.querySelector(sel);
    return n ? (n.textContent || "").trim() : "";
  }
  function href(el, sel) {
    var n = el.querySelector(sel);
    var h = n ? n.getAttribute("href") || "" : "";
    return /^https?:\/\//i.test(h) ? h : "";
  }

  var rows = Array.prototype.map.call(section.querySelectorAll("[data-tk-row]"), function (row) {
    return {
      date: text(row, "[data-tk-date]"), time: text(row, "[data-tk-time]"), status: text(row, "[data-tk-status]"),
      id: text(row, "[data-tk-id]"), production: text(row, "[data-tk-production]"), sales: text(row, "[data-tk-sales]"),
      note: text(row, "[data-tk-note]"), override: text(row, "[data-tk-override]"), checkout: href(row, "[data-tk-checkout]")
    };
  });
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var shows = buildShows(rows, perf, today);
  var groups = groupShows(shows);

  var touch = null;
  try { touch = JSON.parse(sessionStorage.getItem("clt-first-touch") || "null"); } catch (e) {}
  var REF = refFromTouch(touch);

  var current = null;
  var buttons = [];

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  // ── Picker ─────────────────────────────────────────────────────────────────
  function render() {
    picker.textContent = "";
    if (!shows.length) {
      var empty = el("div", "tk-picker__empty");
      empty.appendChild(el("p", "", "There are no upcoming performances right now."));
      var a = el("a", "clt-link", "Write to us to hear about the next one");
      a.href = "/events#reserve";
      empty.appendChild(a);
      picker.appendChild(empty);
      return;
    }
    var next = shows.filter(bookable)[0];
    groups.forEach(function (g) {
      var wrap = el("div", "tk-production");
      if (groups.length > 1) wrap.appendChild(el("h3", "tk-production__title", g.production));
      g.months.forEach(function (mo) {
        var month = el("div", "tk-month");
        month.appendChild(el("p", "tk-month__label", mo.label));
        var list = el("div", "tk-dates");
        list.setAttribute("role", "list");
        mo.dates.forEach(function (dt) {
          var card = el("div", "tk-date");
          card.setAttribute("role", "listitem");
          card.setAttribute("data-ymd", dt.ymd);
          if (!dt.shows.some(bookable)) card.classList.add("is-closed");
          if (next && next.ymd === dt.ymd) card.classList.add("is-next");

          var badge = el("div", "clt-list-row__date tk-date__badge");
          badge.setAttribute("aria-hidden", "true");
          badge.appendChild(el("span", "clt-list-row__day", String(dt.d)));
          badge.appendChild(el("span", "clt-list-row__mon", MONTHS[dt.m].slice(0, 3)));
          badge.appendChild(el("span", "clt-list-row__weekday", DAYS[dt.wd]));
          card.appendChild(badge);

          var body = el("div", "tk-date__body");
          var title = el("p", "tk-date__title", dt.title);
          title.id = "tk-d-" + dt.ymd;
          body.appendChild(title);
          var notes = dt.shows.filter(function (s) { return s.note; })
            .map(function (s) { return (dt.shows.length > 1 ? s.time + " — " : "") + s.note; });
          if (notes.length) body.appendChild(el("p", "tk-date__note", notes.join(" · ")));

          var times = el("div", "tk-times");
          times.setAttribute("role", "group");
          times.setAttribute("aria-labelledby", title.id);
          dt.shows.forEach(function (s) {
            var b = el("button", "tk-time");
            b.type = "button";
            b.appendChild(el("span", "tk-time__clock", s.time));
            var tag = s.presale ? "On sale " + s.presale : (LABELS[s.key] || "");
            if (tag) b.appendChild(el("span", "tk-time__tag", tag));
            if (s.closed) b.classList.add("is-closed");
            if (!bookable(s)) {
              b.disabled = true;
              b.setAttribute("aria-disabled", "true");
            } else {
              b.setAttribute("aria-pressed", "false");
              b.addEventListener("click", function () { choose(s, true); });
            }
            b.__show = s;
            buttons.push(b);
            times.appendChild(b);
          });
          body.appendChild(times);
          card.appendChild(body);
          list.appendChild(card);
        });
        month.appendChild(list);
        wrap.appendChild(month);
      });
      picker.appendChild(wrap);
    });
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  function checkoutUrl(s) {
    var u = s.override || s.checkout;
    return u + (u.indexOf("?") > -1 ? "&" : "?") + "ref=" + encodeURIComponent(REF);
  }

  function label(s) {
    return DAYS_LONG[s.wd] + ", " + MONTHS[s.m] + " " + s.d + " · " + s.time;
  }

  // Inline Ticket Tailor widget; falls back to a link if it hasn't drawn after ~8 s.
  function embed(target, s) {
    target.textContent = "";
    var url = checkoutUrl(s);
    if (s.override) { // sold elsewhere: link out
      target.appendChild(fallback(url, "Tickets for this performance are sold by our partner."));
      return;
    }
    var holder = el("div", "tk-checkout");
    var w = el("div", "tt-widget");
    var fb = el("div", "tt-widget-fallback");
    var fa = el("a", "", "Open the checkout");
    fa.href = url;
    fa.target = "_blank";
    fa.rel = "noopener";
    fb.appendChild(fa);
    w.appendChild(fb);
    var sc = document.createElement("script");
    sc.src = WIDGET;
    sc.setAttribute("data-url", s.checkout);
    sc.setAttribute("data-type", "inline");
    sc.setAttribute("data-inline-minimal", "true");
    sc.setAttribute("data-inline-show-logo", "false");
    sc.setAttribute("data-inline-bg-fill", "true");
    sc.setAttribute("data-inline-ref", REF);
    Object.keys(COLORS).forEach(function (k) { sc.setAttribute("data-inline-color-" + k, COLORS[k]); });
    w.appendChild(sc);
    holder.appendChild(w);
    var loading = el("div", "tk-checkout__loading", "Raising the curtain on the seat map…");
    loading.setAttribute("role", "status");
    target.appendChild(loading);
    target.appendChild(holder);

    var done = false;
    function ready() {
      if (done) return;
      var f = holder.querySelector("iframe");
      if (f && f.getBoundingClientRect().height > 120) {
        done = true;
        target.classList.add("is-loaded");
        if (loading.parentNode) loading.parentNode.removeChild(loading);
      }
    }
    var poll = setInterval(ready, 250);
    setTimeout(function () {
      clearInterval(poll);
      ready();
      if (!done) {
        if (loading.parentNode) loading.parentNode.removeChild(loading);
        target.appendChild(fallback(url, "The seat map is taking a while to load."));
      }
    }, 8000);
  }

  function fallback(url, why) {
    var box = el("div", "tk-fallback");
    box.appendChild(el("p", "", why));
    var a = el("a", "clt-button is-primary");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.appendChild(el("span", "clt-button__text", "Open secure checkout"));
    box.appendChild(a);
    return box;
  }

  function choose(s, fromClick) {
    current = s;
    buttons.forEach(function (b) {
      if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", String(b.__show === s));
    });
    Array.prototype.forEach.call(picker.querySelectorAll(".tk-date"), function (c) {
      c.classList.toggle("is-selected", c.getAttribute("data-ymd") === s.ymd);
    });
    if (chosen) chosen.textContent = label(s);
    if (newtab) newtab.href = checkoutUrl(s);
    if (stage) stage.classList.add("is-lit");
    var url = location.pathname + "?date=" + s.ymd + "&time=" + s.tslug + location.hash.replace(/^#(performances|seats)$/, "");
    try { history.replaceState(null, "", url); } catch (e) {}
    if (window.CLT && typeof window.CLT.track === "function") {
      window.CLT.track("InitiateCheckout", { content_ids: [s.id], content_name: s.production, content_category: "Tickets" });
    }

    if (phone.matches) {
      if (stage) stage.classList.add("is-phone-ready");
      if (mount) mount.textContent = "";
      if (fromClick && openSheet) openSheet.focus({ preventScroll: true });
    } else {
      if (stage) stage.classList.remove("is-phone-ready");
      embed(mount, s);
      if (fromClick) scrollToSeats();
    }
  }

  function scrollToSeats() {
    var target = document.getElementById("seats");
    if (!target) return;
    var y = 0;
    for (var n = target; n; n = n.offsetParent) y += n.offsetTop;
    y = Math.max(0, y - 24);
    if (window.CLT && typeof window.CLT.scrollTo === "function") window.CLT.scrollTo(y, reduced ? { immediate: true } : {});
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    if (mount) setTimeout(function () { mount.focus({ preventScroll: true }); }, reduced ? 0 : 900);
  }

  if (openSheet && sheet) {
    openSheet.addEventListener("click", function () {
      if (!current) return;
      if (sheetShow) sheetShow.textContent = label(current);
      embed(sheetMount, current);
      if (window.CLT && CLT.dialogs) CLT.dialogs.open(sheet);
      else if (sheet.showModal) sheet.showModal();
    });
    sheet.addEventListener("close", function () { if (sheetMount) sheetMount.textContent = ""; });
  }

  // Desktop ↔ phone switch with a choice made: move the checkout.
  function onMedia() {
    if (!current) return;
    if (phone.matches) {
      if (mount) mount.textContent = "";
      if (stage) stage.classList.add("is-phone-ready");
    } else {
      if (sheet && sheet.open && window.CLT && CLT.dialogs) CLT.dialogs.close(sheet);
      if (stage) stage.classList.remove("is-phone-ready");
      embed(mount, current);
    }
  }
  if (phone.addEventListener) phone.addEventListener("change", onMedia);

  render();
  section.classList.add("is-hydrated");

  // Deep link: ?date=…&time=…
  var q = parseQuery(location.search);
  if (q.date) {
    var onDate = shows.filter(function (s) { return s.ymd === q.date && bookable(s); });
    var pick = onDate.filter(function (s) { return q.time && s.tslug === q.time; })[0] || (onDate.length === 1 ? onDate[0] : null);
    var card = picker.querySelector('.tk-date[data-ymd="' + q.date + '"]');
    if (card) card.classList.add("is-selected");
    if (pick) {
      choose(pick, false);
      // Wait for the curtain/Lenis before moving the page.
      setTimeout(function () { if (!phone.matches) scrollToSeats(); }, 1200);
    } else if (card) {
      setTimeout(function () { card.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }); }, 1200);
    }
  }
})();
