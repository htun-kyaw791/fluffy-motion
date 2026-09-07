/**
 * Packs each stance's frames into one horizontal sprite sheet.
 *
 * Why: as separate files a frame's <img> only entered the DOM at the moment it
 * was shown, so its download started ~one frame ahead of display. That is free
 * off local disk and ~1s of TTFB off a CDN, which is why frames were missing in
 * production and not in dev. One sheet is one request, issued at mount, and
 * frame stepping becomes a transform.
 *
 * Output is committed. Re-run only when a frame list in scene.ts changes:
 *   npm run sprites
 */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { STANCES } from "../src/lib/scene.ts";

/** Cell height in sheet user units. Cell width follows each stance's aspect. */
const CELL_H = 1000;

const ROOT = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/;

function cell(src: string, x: number, w: number): string {
  const file = `public${src}`;
  const root = readFileSync(file, "utf8").match(ROOT);
  if (!root) throw new Error(`${src}: expected a single <svg> root`);

  const viewBox = root[1].match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${src}: no viewBox to map into the cell`);

  // xMidYMax meet is the SVG spelling of `object-contain object-bottom`, which
  // is how each frame was fitted back when it was its own <img>. Nested <svg>
  // clips to its own bounds, so frames cannot bleed into neighbouring cells.
  return (
    `<svg x="${x}" width="${w}" height="${CELL_H}" viewBox="${viewBox}"` +
    ` preserveAspectRatio="xMidYMax meet">${root[2].trim()}</svg>`
  );
}

for (const stance of STANCES) {
  const w = Math.round(CELL_H * stance.aspect);
  const n = stance.frames.length;

  const body = stance.frames.map((src, i) => cell(src, i * w, w)).join("");
  const sheet =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w * n}" height="${CELL_H}"` +
    ` viewBox="0 0 ${w * n} ${CELL_H}">${body}</svg>`;

  const out = `public${stance.sheet}`;
  writeFileSync(out, sheet);

  const before = stance.frames.reduce((t, s) => t + statSync(`public${s}`).size, 0);
  console.log(
    `${stance.sheet}  ${n} frames  ${w}x${CELL_H} cells  ` +
      `${(statSync(out).size / 1024).toFixed(0)}KB (was ${(before / 1024).toFixed(0)}KB in ${n} requests)`,
  );
}
