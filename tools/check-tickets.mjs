// node tools/check-tickets.mjs [baseUrl] [--cdn] [--shots <dir>]
// Loads staging /tickets with every clt-website@<tag> file served from this repo (so an unreleased
// tag never hits jsDelivr), then checks the picker, a desktop choice, a deep link and the phone sheet.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv.find((a) => a.startsWith("http")) || "https://commonwealth-lyric-theater.webflow.io";
const shotsAt = process.argv.indexOf("--shots");
const shotDir = shotsAt > -1 ? process.argv[shotsAt + 1] : "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function local(url) {
  const m = url.match(/clt-website@v[\d.]+\/(.+?)(\?|$)/);
  if (!m) return null;
  const file = join(root, m[1].replace(/\.min\.js$/, ".js"));
  return existsSync(file) ? file : null;
}

const port = 9300 + Math.floor(Math.random() * 300);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank"], { stdio: "ignore" });
let page;
for (let i = 0; i < 40 && !page; i++) {
  await sleep(250);
  try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errors = []; const missing = [];
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); return; }
  if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === "Fetch.requestPaused") {
    const file = local(d.params.request.url);
    if (!file) { missing.push(d.params.request.url); return send("Fetch.failRequest", { requestId: d.params.requestId, errorReason: "BlockedByClient" }); }
    send("Fetch.fulfillRequest", { requestId: d.params.requestId, responseCode: 200,
      responseHeaders: [{ name: "Content-Type", value: file.endsWith(".css") ? "text/css" : "application/javascript" }, { name: "Access-Control-Allow-Origin", value: "*" }],
      body: Buffer.from(readFileSync(file)).toString("base64") });
  }
};
await send("Runtime.enable");
await send("Page.enable");
if (!process.argv.includes("--cdn")) await send("Fetch.enable", { patterns: [{ urlPattern: "*cdn.jsdelivr.net/gh/prokhobit/clt-website@*" }] });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
async function shot(name) {
  if (!shotDir) return;
  const s = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(shotDir, `tickets-${name}.png`), Buffer.from(s.data, "base64"));
  console.log("shot:", name);
}
async function shotEl(name, selector) {
  if (!shotDir) return;
  const box = await evaluate(`(async () => { const el = document.querySelector('${selector}'); const y = el.getBoundingClientRect().top + scrollY - 40;
    (window.CLT && CLT.scrollTo) ? CLT.scrollTo(y, { immediate: true }) : scrollTo(0, y); await new Promise((r) => setTimeout(r, 1500));
    const b = el.getBoundingClientRect(); return { x: 0, y: b.top + scrollY - 20, width: innerWidth, height: Math.min(b.height + 40, 2400) }; })()`);
  const s = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...box, scale: 1 } });
  writeFileSync(join(shotDir, `tickets-${name}.png`), Buffer.from(s.data, "base64"));
  console.log("shot:", name);
}
const state = `(() => {
  const q = (s) => document.querySelector(s);
  const mount = q('[data-tk-mount]');
  const script = mount && mount.querySelector('.tt-widget script');
  return {
    url: location.pathname + location.search,
    hydrated: q('[data-tk-pick]').classList.contains('is-hydrated'),
    months: [...document.querySelectorAll('.tk-month__label')].map((n) => n.textContent),
    dates: [...document.querySelectorAll('.tk-date')].map((c) => c.querySelector('.tk-date__title').textContent + (c.classList.contains('is-next') ? ' [next]' : '') + (c.classList.contains('is-selected') ? ' [selected]' : '') + ' — ' + [...c.querySelectorAll('.tk-time')].map((b) => b.textContent + (b.disabled ? ' (off)' : '') + (b.getAttribute('aria-pressed') === 'true' ? ' (on)' : '')).join(', ')),
    chosen: (q('[data-tk-chosen]') || {}).textContent,
    lit: q('[data-tk-stage]').classList.contains('is-lit'),
    widgetUrl: script ? script.getAttribute('data-url') : null,
    widgetRef: script ? script.getAttribute('data-inline-ref') : null,
    iframe: mount ? (mount.querySelector('iframe') || {}).src || null : null,
    fallback: !!(mount && mount.querySelector('.tk-fallback')),
    newtab: (q('[data-tk-newtab]') || {}).href,
    phoneReady: q('[data-tk-stage]').classList.contains('is-phone-ready'),
    sheetOpen: !!(q('#tk-sheet') || {}).open,
    sheetWidget: !!document.querySelector('[data-tk-sheet-mount] .tt-widget')
  };
})()`;

async function load(path, width, height, mobile) {
  errors.length = 0;
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  await send("Page.navigate", { url: base + path + (path.includes("?") ? "&" : "?") + "cb=" + Date.now() });
  await sleep(7000);
}

console.log("== desktop /tickets");
await load("/tickets", 1440, 900, false);
console.log(JSON.stringify(await evaluate(state), null, 1));
await shot("desktop-initial");
await shotEl("desktop-picker", "#performances");
await shotEl("desktop-venue", "#venue");
await shotEl("desktop-faq", "#faq");
await evaluate(`document.querySelector('.tk-time:not(:disabled)').click()`);
await sleep(4000);
console.log("-- after choosing the first time:\n" + JSON.stringify(await evaluate(state), null, 1));
await shot("desktop-chosen");
console.log("errors:", errors.length ? errors.join(" | ") : "none");

console.log("== deep link /tickets?date=2026-11-08&time=4pm");
await load("/tickets?date=2026-11-08&time=4pm", 1440, 900, false);
await sleep(2000);
const deep = await evaluate(state);
console.log(JSON.stringify({ url: deep.url, chosen: deep.chosen, widgetUrl: deep.widgetUrl, selected: deep.dates.filter((d) => d.includes("[selected]")) }, null, 1));
console.log("errors:", errors.length ? errors.join(" | ") : "none");

console.log("== phone 390x844");
await load("/tickets", 390, 844, true);
await evaluate(`document.querySelector('.tk-time:not(:disabled)').click()`);
await sleep(800);
const p1 = await evaluate(state);
console.log(JSON.stringify({ chosen: p1.chosen, phoneReady: p1.phoneReady, inlineWidget: !!p1.widgetUrl }, null, 1));
await evaluate(`document.querySelector('[data-tk-open-sheet]').click()`);
await sleep(2500);
const p2 = await evaluate(state);
console.log(JSON.stringify({ sheetOpen: p2.sheetOpen, sheetWidget: p2.sheetWidget }, null, 1));
await shot("phone-sheet");
await evaluate(`window.CLT && CLT.dialogs && CLT.dialogs.close('#tk-sheet')`);
await sleep(800);
await shotEl("phone-picker", "#performances");
console.log("errors:", errors.length ? errors.join(" | ") : "none");
console.log("unserved clt-website files:", missing.length ? missing.join(" ") : "none");
chrome.kill();
process.exit(0);
