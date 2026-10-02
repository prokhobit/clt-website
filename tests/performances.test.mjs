import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const perf = require("../pages/shared/performances.js");

test("parseDate reads CMS date text and ISO values", () => {
  assert.deepEqual(perf.parseDate("November 7, 2026"), { y: 2026, m: 10, d: 7 });
  assert.deepEqual(perf.parseDate("2027-01-10T21:00:00.000Z"), { y: 2027, m: 0, d: 10 });
  assert.equal(perf.parseDate("soon"), null);
});

test("timeSlug turns a time label into a URL token", () => {
  assert.equal(perf.timeSlug("1:00 pm"), "1pm");
  assert.equal(perf.timeSlug("4:00 PM"), "4pm");
  assert.equal(perf.timeSlug("7:30 pm"), "730pm");
  assert.equal(perf.timeSlug("11:00 am"), "11am");
  assert.equal(perf.timeSlug("12:00 pm"), "12pm");
  assert.equal(perf.timeSlug("tba"), "");
});

test("dateStatus is closed only when every showtime is closed", () => {
  assert.equal(perf.dateStatus(["on-sale", "on-sale"]), "on-sale");
  assert.equal(perf.dateStatus(["on-sale", "sold-out"]), "on-sale");
  assert.equal(perf.dateStatus(["few-seats-left", "on-sale"]), "few-seats-left");
  assert.equal(perf.dateStatus(["sold-out", "sold-out"]), "sold-out");
  assert.equal(perf.dateStatus(["cancelled", "cancelled"]), "cancelled");
  assert.equal(perf.dateStatus(["sold-out", "cancelled"]), "sold-out");
  assert.equal(perf.dateStatus(["", ""]), "");
  assert.equal(perf.dateStatus([]), "");
});

test("ticketsHref deep-links to /tickets only when the page is switched on", () => {
  assert.equal(perf.ticketsHref("", "2026-11-07", ["1:00 pm"]), "");
  assert.equal(perf.ticketsHref("/tickets", "2026-11-07", ["1:00 pm", "4:00 pm"]), "/tickets?date=2026-11-07");
  assert.equal(perf.ticketsHref("/tickets", "2026-11-07", ["4:00 pm"]), "/tickets?date=2026-11-07&time=4pm");
});
