#!/usr/bin/env node
/**
 * Snap media images from the native /media/ render pages.
 *
 * Two targets, both data-driven off src/content/screenshots/*.md (drop a file,
 * it gets shot). The script opens each page on the running dev server, freezes
 * the floating-doc animation for a deterministic frame, and captures the
 * `.stage` node:
 *
 *   screenshots → /media/screenshots/<id>  → 1270×760  (PH gallery; dpr 2 = 2540×1520)
 *   stories     → /media/stories/<id>      → 1080×1920 (Instagram Stories; dpr 1)
 *
 * Prereqs (one-time):
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   npm run dev               # in another terminal (Astro on :4321)
 *   npm run shots                       # horizontal screenshots
 *   npm run shots TARGET=stories        # Instagram Stories
 *   npm run shots TARGET=both           # both
 *
 * Options (env vars):
 *   TARGET=screenshots           screenshots | stories | both (default screenshots)
 *   BASE=http://localhost:4321   dev server origin
 *   OUT=./media-shots            output folder (per-target subfolder added)
 *   DPR=                         device pixel ratio; defaults per target
 *                                (screenshots → 2, stories → 1)
 *   ANIM=0                       set ANIM=1 to keep doc animation live
 */
import { chromium } from "playwright";
import { readdir, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Accept both `KEY=VALUE` CLI args (so `npm run shots TARGET=stories` works) and
// env vars; CLI args win.
const argv = {};
for (const a of process.argv.slice(2)) {
  const m = a.match(/^([A-Z_]+)=(.*)$/);
  if (m) argv[m[1]] = m[2];
}
const opt = (k, d) => argv[k] ?? process.env[k] ?? d;

const BASE = opt("BASE", "http://localhost:4321");
const OUT = opt("OUT", "./media-shots");
const TARGET = opt("TARGET", "screenshots");
const FREEZE = opt("ANIM", "0") !== "1";

const TARGETS = {
  screenshots: { route: "screenshots", subdir: "screenshots", dpr: 2 },
  stories: { route: "stories", subdir: "stories", dpr: 1 },
};

const selected =
  TARGET === "both" ? ["screenshots", "stories"] : [TARGET];

for (const t of selected) {
  if (!TARGETS[t]) {
    console.error(`Unknown TARGET "${t}". Use screenshots | stories | both.`);
    process.exit(1);
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "src/content/screenshots");

const ids = (await readdir(contentDir))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""))
  .sort();

if (ids.length === 0) {
  console.error("No screenshot entries found in", contentDir);
  process.exit(1);
}

const FREEZE_CSS = `*, *::before, *::after {
  animation: none !important; transition: none !important;
}`;

const browser = await chromium.launch();

for (const t of selected) {
  const { route, subdir, dpr: defaultDpr } = TARGETS[t];
  const dpr = Number(opt("DPR", defaultDpr));
  const outDir = path.resolve(root, OUT, subdir);
  await mkdir(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 2000 }, // larger than any stage
    deviceScaleFactor: dpr,
  });
  const page = await context.newPage();

  console.log(`\n[${t}] shooting ${ids.length} frames from ${BASE} (dpr ${dpr})`);

  for (const id of ids) {
    await page.goto(`${BASE}/media/${route}/${id}`, { waitUntil: "networkidle" });

    if (FREEZE) {
      // re-applied per navigation (addStyleTag is per-document)
      await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
    }

    await page.evaluate(() => document.fonts && document.fonts.ready);
    const stage = page.locator(".stage").first();
    await stage.waitFor({ state: "visible" });
    await page.waitForTimeout(250); // let images decode

    const file = path.join(outDir, `${id}.png`);
    await stage.screenshot({ path: file });
    console.log("  ✓", path.relative(root, file));
  }

  await context.close();
}

await browser.close();
console.log(`\nDone → ${path.relative(root, path.resolve(root, OUT))}/`);
