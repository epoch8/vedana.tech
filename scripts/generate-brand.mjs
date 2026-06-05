// scripts/generate-brand.mjs
//
// Generates the static marketing logo pack into public/brand/ from the SAME
// procedural math the live site uses (polar rose r = a·cos(k·t), k=2 — the
// four-petal clover). Single source of truth stays the geometry: this script
// reuses cloverPath() verbatim from the site components, bakes the 360-point
// polyline + Inter Bold wordmark into self-contained SVGs, and rasterises each
// PNG size individually with sharp (no downscaling).
//
// Run: npm run brand
//
// Output (16 files): icon / icon-inverse / horizontal / horizontal-inverse,
// each as 256/512/1024 PNG + one scalable SVG. See the design doc:
// "2026-06-05 Marketing logo pack — design".

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "brand");
const FONT_PATH = path.join(__dirname, "fonts", "Inter-Bold.woff");

/* ======================================================
   CANONICAL BRAND CONSTANTS (must match src/styles/tokens.css
   and the logo components)
====================================================== */

const PRIMARY = "#2A5BFF"; // --color-primary (reasoning blue)
const TEXT = "#0c1426"; // --color-text (deep ink)
const WHITE = "#ffffff";

const STROKE = 28; // canonical stroke-width, round caps/joins
const SIZES = [256, 512, 1024]; // px (height for horizontal; side for square)

/* ======================================================
   CLOVER MATH — copied verbatim from
   src/components/products/vedana/logo/BrandLogo.astro
====================================================== */

function cloverPath({ a = 120, k = 2, steps = 360, cx = 200, cy = 200 }) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = a * Math.cos(k * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    pts.push([x, y]);
  }
  return (
    pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(3)} ${y.toFixed(3)}`).join(" ") + " Z"
  );
}

// Baked k=2 clover, identical discretisation to BrandLogoStatic.astro.
const CLOVER_D = cloverPath({});

// The clover lives in a 400×400 box centred at (200,200). Petal centre-lines
// span 80…320; adding stroke/2 (=14) gives the VISUAL bounds 66…334, i.e. a
// 268-unit visible square. We frame everything against that visible box.
const BOX = 400;
const CENTER = 200;
const VIS = 268; // visible clover size (incl. stroke), in 400-space units

/* ======================================================
   LOCKUP PROPORTIONS (horizontal) — design-doc proposal,
   tweak freely; everything below is relative to clover height.
====================================================== */

// Transparent horizontal: visible clover height = 0.78·H, 11% air top/bottom.
const H_CLOVER_FRAC = 0.78; // clover visible height as fraction of canvas H
const H_AIR_FRAC = (1 - H_CLOVER_FRAC) / 2; // 0.11 — also used as left/right air

// gap & cap-height are defined relative to clover height so the lockup looks
// identical no matter how it's framed (transparent vs inverse plate).
// Doc numbers (vs H): gap 0.12·H, cap-height 0.45·H — at clover = 0.78·H.
const GAP_PER_CLOVER = 0.12 / 0.78;
const CAP_PER_CLOVER = 0.45 / 0.78;

// Inverse plates.
const INV_ICON_CLOVER_FRAC = 0.7; // icon-inverse: clover visible height = 70% of side
const INV_PAD_FRAC = 0.12; // horizontal-inverse: padding = 12% of H
const INV_RADIUS_FRAC = 0.08; // horizontal-inverse: corner radius = 8% of H

/* ======================================================
   WORDMARK (Inter Bold → paths)
====================================================== */

const font = opentype.parse(readFileSync(FONT_PATH));
const CAP_RATIO = font.tables.os2.sCapHeight / font.unitsPerEm; // 2048/2816 ≈ 0.727

// Serialize opentype path commands to SVG path data ourselves. We avoid
// path.toPathData(): in opentype.js v2 its optimizer emits NaN for non-round
// font sizes, and it applies an unwanted Y-flip (upside-down glyphs). The raw
// command coords from getPath() are already SVG-ready (y-down, upright).
function commandsToPathData(commands, dp = 2) {
  const n = (x) => Number(x.toFixed(dp));
  let out = "";
  for (const c of commands) {
    if (c.type === "M") out += `M${n(c.x)} ${n(c.y)}`;
    else if (c.type === "L") out += `L${n(c.x)} ${n(c.y)}`;
    else if (c.type === "C") out += `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === "Q") out += `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === "Z") out += "Z";
  }
  return out;
}

// Returns { d, width, color-less } for "Vedana" with a given cap-height (px),
// whose VISUAL left edge sits at x0 and baseline at baselineY.
function wordmark(capHeightPx, x0, baselineY) {
  const fontSize = capHeightPx / CAP_RATIO;
  const p = font.getPath("Vedana", 0, baselineY, fontSize);
  const bb = p.getBoundingBox(); // baseline already applied to y
  const visualWidth = bb.x2 - bb.x1;
  const dx = x0 - bb.x1; // shift so visual-left aligns to x0
  const d = commandsToPathData(p.commands, 2);
  return { d, dx, visualWidth };
}

/* ======================================================
   SVG ASSEMBLY
====================================================== */

function svgWrap({ vbW, vbH, pxH, inner }) {
  // pxH = output pixel height; width scales with the viewBox aspect ratio.
  const pxW = Math.round((vbW / vbH) * pxH);
  return {
    pxW,
    pxH,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${pxW}" height="${pxH}" viewBox="0 0 ${vbW} ${vbH}" fill="none">${inner}</svg>`,
  };
}

function cloverEl(color, transform) {
  const t = transform ? ` transform="${transform}"` : "";
  return `<path d="${CLOVER_D}"${t} fill="none" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// Scale+centre the clover so its visible box becomes `visiblePx`, centred at (cx,cy).
function cloverScaled(color, visiblePx, cx, cy) {
  const s = visiblePx / VIS;
  // map clover centre (200,200) -> (cx,cy)
  const tx = cx - s * CENTER;
  const ty = cy - s * CENTER;
  return cloverEl(color, `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)})`);
}

/* ---------- ICON (primary) ---------- */
function iconInner() {
  // Natural 400-box clover — pixel-identical framing to the footer logo
  // (visible clover = 268/400 = 67%, symmetric air built into the viewBox).
  return cloverEl(PRIMARY);
}

/* ---------- ICON inverse ---------- */
function iconInverseInner() {
  const visible = INV_ICON_CLOVER_FRAC * BOX; // 70% of side
  return (
    `<rect x="0" y="0" width="${BOX}" height="${BOX}" fill="${PRIMARY}"/>` +
    cloverScaled(WHITE, visible, CENTER, CENTER)
  );
}

/* ---------- HORIZONTAL (shared geometry) ---------- */
// Builds the lockup in a nominal H-tall space. Returns { vbW, inner } where the
// clover is white/primary and the wordmark uses `inkColor`.
function horizontalLockup({ H, cloverVisH, cloverCenterX, leftEdge, cloverColor, inkColor, plate }) {
  const cloverRight = leftEdge + cloverVisH;
  const gap = GAP_PER_CLOVER * cloverVisH;
  const capH = CAP_PER_CLOVER * cloverVisH;
  const textX = cloverRight + gap;
  const baselineY = H / 2 + capH / 2; // optically centre cap-box on clover centre
  const wm = wordmark(capH, textX, baselineY);

  const cloverEls = cloverScaled(cloverColor, cloverVisH, cloverCenterX, H / 2);
  const textEl = `<path d="${wm.d}" transform="translate(${wm.dx.toFixed(3)} 0)" fill="${inkColor}"/>`;

  return { textRight: textX + wm.visualWidth, cloverEls, textEl, plate };
}

function horizontalInner() {
  const H = BOX; // nominal 400-tall geometry
  const cloverVisH = H_CLOVER_FRAC * H;
  const air = H_AIR_FRAC * H;
  const leftEdge = air;
  const cloverCenterX = leftEdge + cloverVisH / 2;

  const lk = horizontalLockup({
    H,
    cloverVisH,
    cloverCenterX,
    leftEdge,
    cloverColor: PRIMARY,
    inkColor: TEXT,
  });

  const vbW = lk.textRight + air; // trailing air mirrors leading air
  return { vbW, vbH: H, inner: lk.cloverEls + lk.textEl };
}

function horizontalInverseInner() {
  const H = BOX;
  const pad = INV_PAD_FRAC * H;
  const radius = INV_RADIUS_FRAC * H;
  const cloverVisH = H - 2 * pad; // clover fills the padded height
  const leftEdge = pad;
  const cloverCenterX = leftEdge + cloverVisH / 2;

  const lk = horizontalLockup({
    H,
    cloverVisH,
    cloverCenterX,
    leftEdge,
    cloverColor: WHITE,
    inkColor: WHITE,
  });

  const vbW = lk.textRight + pad;
  const plate = `<rect x="0" y="0" width="${vbW.toFixed(3)}" height="${H}" rx="${radius}" ry="${radius}" fill="${PRIMARY}"/>`;
  return { vbW, vbH: H, inner: plate + lk.cloverEls + lk.textEl };
}

/* ======================================================
   VARIANT REGISTRY
====================================================== */

const VARIANTS = [
  { name: "vedana-logo", square: true, build: () => ({ vbW: BOX, vbH: BOX, inner: iconInner() }) },
  { name: "vedana-logo-inverse", square: true, build: () => ({ vbW: BOX, vbH: BOX, inner: iconInverseInner() }) },
  { name: "vedana-logo-horizontal", square: false, build: horizontalInner },
  { name: "vedana-logo-horizontal-inverse", square: false, build: horizontalInverseInner },
];

/* ======================================================
   RENDER
====================================================== */

async function run() {
  mkdirSync(OUT, { recursive: true });
  let count = 0;

  for (const v of VARIANTS) {
    const { vbW, vbH, inner } = v.build();

    // Scalable SVG deliverable (viewBox-based, width/height = native units).
    const svgFile = svgWrap({ vbW, vbH, pxH: vbH, inner }).svg;
    writeFileSync(path.join(OUT, `${v.name}.svg`), svgFile);
    count++;
    console.log(`  ${v.name}.svg  (${vbW}×${vbH})`);

    // One PNG per size, each rasterised from a target-sized SVG (no downscale).
    for (const size of SIZES) {
      const { svg, pxW, pxH } = svgWrap({ vbW, vbH, pxH: size, inner });
      const file = path.join(OUT, `${v.name}-${size}.png`);
      await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
      count++;
      console.log(`  ${v.name}-${size}.png  (${pxW}×${pxH})`);
    }
  }

  console.log(`\n✓ ${count} files written to public/brand/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
