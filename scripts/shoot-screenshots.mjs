#!/usr/bin/env node
/**
 * Snap PH-ready media screenshots from the /media/screenshots/<id> pages.
 *
 * Reads ids from src/content/screenshots/*.md (data-driven: drop a file,
 * it gets shot), opens each page on the running dev server, freezes the
 * floating-doc animation for a deterministic frame, and captures the
 * .stage node (exactly 1270×760; at dpr 2 → 2540×1520).
 *
 * Prereqs (one-time):
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   npm run dev               # in another terminal (Astro on :4321)
 *   node scripts/shoot-screenshots.mjs
 *
 * Options (env vars):
 *   BASE=http://localhost:4321   dev server origin
 *   OUT=./media-shots            output folder
 *   DPR=2                        device pixel ratio (2 → 2540×1520, 1 → 1270×760)
 *   ANIM=0                       set ANIM=1 to keep doc animation live
 */
import { chromium } from "playwright";
import { readdir, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:4321";
const OUT = process.env.OUT ?? "./media-shots";
const DPR = Number(process.env.DPR ?? 2);
const FREEZE = process.env.ANIM !== "1";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "src/content/screenshots");
const outDir = path.resolve(root, OUT);

const ids = (await readdir(contentDir))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""))
  .sort();

if (ids.length === 0) {
  console.error("No screenshot entries found in", contentDir);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1400, height: 900 }, // larger than stage so it's never clipped
  deviceScaleFactor: DPR,
});
const page = await context.newPage();

// Deterministic frame: kill animations/transitions so docs sit at rest.
if (FREEZE) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }`,
  }).catch(() => {});
}

console.log(`Shooting ${ids.length} screens from ${BASE} (dpr ${DPR})\n`);

for (const id of ids) {
  const url = `${BASE}/media/screenshots/${id}`;
  await page.goto(url, { waitUntil: "networkidle" });

  if (FREEZE) {
    // re-apply after navigation (addStyleTag is per-document)
    await page.addStyleTag({
      content: `*, *::before, *::after {
        animation: none !important; transition: none !important;
      }`,
    }).catch(() => {});
  }

  await page.evaluate(() => document.fonts && document.fonts.ready);
  const stage = page.locator(".stage").first();
  await stage.waitFor({ state: "visible" });
  await page.waitForTimeout(250); // let images decode

  const file = path.join(outDir, `${id}.png`);
  await stage.screenshot({ path: file });
  console.log("  ✓", path.relative(root, file));
}

await browser.close();
console.log(`\nDone → ${path.relative(root, outDir)}/`);
