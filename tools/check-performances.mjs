// node tools/check-performances.mjs [baseUrl] [--tickets]
// Loads Home + Events with the local performances.js / clt-master.css swapped in.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv.find((a) => a.startsWith("http")) || "https://commonwealth-lyric-theater.webflow.io";
const ticketsOn = process.argv.includes("--tickets");
const swap = {
  "performances.min.js": ["application/javascript", readFileSync(join(root, "pages/shared/performances.js"), "utf8")],
  "clt-master.css": ["text/css", readFileSync(join(root, "global/clt-master.css"), "utf8")],
};
const port = 9600 + Math.floor(Math.random() * 300);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let i = 0; i < 40 && !page; i++) {
  await sleep(250);
  try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errors = [];
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); return; }
  if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === "Fetch.requestPaused") {
    const hit = Object.keys(swap).find((k) => d.params.request.url.includes(k));
    if (!hit) return send("Fetch.continueRequest", { requestId: d.params.requestId });
    send("Fetch.fulfillRequest", { requestId: d.params.requestId, responseCode: 200,
      responseHeaders: [{ name: "Content-Type", value: swap[hit][0] }, { name: "Access-Control-Allow-Origin", value: "*" }],
      body: Buffer.from(swap[hit][1]).toString("base64") });
  }
};
await send("Runtime.enable");
await send("Fetch.enable", { patterns: Object.keys(swap).map((k) => ({ urlPattern: `*${k}*` })) });
if (ticketsOn) await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.CLT_TICKETS_URL='/tickets';" });
const summary = `JSON.stringify([...document.querySelectorAll('[data-ev-row]')].map(r => ({
  date: r.getAttribute('data-date'), status: r.getAttribute('data-status'),
  past: r.classList.contains('is-past'), next: r.classList.contains('is-next'),
  times: [...r.querySelectorAll('.clt-perf-time, .clt-events-show__time')].map(t => t.textContent + (t.classList.contains('is-closed') ? ' (closed)' : '')),
  pill: (r.querySelector('.clt-perf-status') || {}).textContent || '',
  button: (() => { const b = r.querySelector('[data-ev-tickets]'); return b ? (b.getAttribute('href') || 'disabled') + ' ' + b.textContent.trim() : ''; })()
})), null, 1)`;
for (const path of ["/", "/events"]) {
  errors.length = 0;
  await send("Page.navigate", { url: base + path + "?cb=" + Date.now() });
  await sleep(7000);
  const r = await send("Runtime.evaluate", { expression: summary, returnByValue: true });
  console.log(`== ${path}\n${r.result.value}\nerrors: ${errors.length ? errors.join(" | ") : "none"}`);
}
chrome.kill();
process.exit(0);
