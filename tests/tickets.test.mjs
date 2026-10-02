import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const perf = require("../pages/shared/performances.js");
const tk = require("../pages/tickets/tickets.js");

const today = new Date(2026, 9, 2); // Oct 2, 2026
const row = (date, time, extra = {}) => ({ date, time, status: "On sale", production: "Pinocchio: The Musical",
  checkout: "https://tickets.commonwealthlyrictheater.com/checkout/view-event/id/1/chk/a/", ...extra });

test("buildShows sorts by start, drops past dates, reads status and presale", () => {
  const shows = tk.buildShows([
    row("November 7, 2026", "4:00 pm", { id: "ev_2" }),
    row("November 7, 2026", "1:00 pm", { id: "ev_1", status: "Few seats left" }),
    row("September 1, 2026", "1:00 pm", { id: "ev_old" }),
    row("January 9, 2027", "1:00 pm", { id: "ev_3", status: "Sold out" }),
    row("January 10, 2027", "1:00 pm", { id: "ev_4", sales: "October 15, 2026" }),
  ], perf, today);
  assert.deepEqual(shows.map((s) => s.id), ["ev_1", "ev_2", "ev_3", "ev_4"]);
  assert.equal(shows[0].tslug, "1pm");
  assert.equal(shows[0].key, "few-seats-left");
  assert.equal(shows[2].closed, true);
  assert.equal(shows[3].presale, "Oct 15");
  assert.equal(tk.bookable(shows[0]), true);
  assert.equal(tk.bookable(shows[2]), false);
  assert.equal(tk.bookable(shows[3]), false);
});

test("groupShows nests production → month → date", () => {
  const shows = tk.buildShows([
    row("November 7, 2026", "1:00 pm"), row("November 7, 2026", "4:00 pm"),
    row("November 8, 2026", "1:00 pm"), row("January 9, 2027", "1:00 pm"),
  ], perf, today);
  const g = tk.groupShows(shows);
  assert.equal(g.length, 1);
  assert.deepEqual(g[0].months.map((m) => m.label), ["November 2026", "January 2027"]);
  assert.deepEqual(g[0].months[0].dates.map((d) => [d.title, d.shows.length]),
    [["Saturday, November 7", 2], ["Sunday, November 8", 1]]);
});

test("a showtime with no checkout link is not bookable", () => {
  const [s] = tk.buildShows([row("November 7, 2026", "1:00 pm", { checkout: "" })], perf, today);
  assert.equal(tk.bookable(s), false);
});

test("parseQuery reads date and time", () => {
  assert.deepEqual(tk.parseQuery("?date=2026-11-07&time=4pm"), { date: "2026-11-07", time: "4pm" });
  assert.deepEqual(tk.parseQuery("?date=nope&time=4:00 PM"), { date: "", time: "400pm" });
  assert.deepEqual(tk.parseQuery(""), { date: "", time: "" });
});

test("refFromTouch turns first touch into a Ticket Tailor ref", () => {
  assert.equal(tk.refFromTouch({ utm: "source=fb, medium=paid, campaign=Pinocchio Nov" }), "fb-pinocchio-nov");
  assert.equal(tk.refFromTouch({ utm: "(none)", ref: "https://www.instagram.com/p/x" }), "ref-instagram-com");
  assert.equal(tk.refFromTouch({ utm: "(none)", ref: "(direct)" }), "website");
  assert.equal(tk.refFromTouch(null), "website");
});
