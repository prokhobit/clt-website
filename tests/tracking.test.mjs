import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const t = require("../global/clt-tracking.js");
const now = Date.UTC(2026, 9, 3);

test("readConsent accepts a fresh choice and rejects stale, broken or old-version data", () => {
  const fresh = JSON.stringify({ v: 1, measure: true, ads: false, at: now - 864e5 });
  assert.deepEqual(t.readConsent(fresh, now), { v: 1, measure: true, ads: false, at: now - 864e5 });
  assert.equal(t.readConsent(JSON.stringify({ v: 1, measure: true, ads: true, at: now - 400 * 864e5 }), now), null);
  assert.equal(t.readConsent(JSON.stringify({ v: 0, measure: true, ads: true, at: now }), now), null);
  assert.equal(t.readConsent("{oops", now), null);
  assert.equal(t.readConsent(null, now), null);
});

test("allowed: nothing before a choice; Global Privacy Control overrides an accept", () => {
  assert.deepEqual(t.allowed(null, false), { measure: false, ads: false });
  const yes = t.makeConsent(true, true, now);
  assert.deepEqual(t.allowed(yes, false), { measure: true, ads: true });
  assert.deepEqual(t.allowed(yes, true), { measure: false, ads: false });
  assert.deepEqual(t.allowed(t.makeConsent(true, false, now), false), { measure: true, ads: false });
});
