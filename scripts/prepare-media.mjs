// Copies the selected ARC screenshots into public/media/arc/ as WEBP at a few widths, and records their sizes in
// src/data/media.json so every <img> gets width/height and a srcset. Sources are read from the ARC project, which is
// never modified. Run: npm run media
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARC = path.resolve(ROOT, "../gaming-controller-website");
const OUT = path.join(ROOT, "public/media/arc");

// id: [source inside the ARC project, output widths, optional crop {top, height} in source pixels]
const MEDIA = {
  // Final version (docs/screenshots and the live-site checks of 24-25 Nov 2026)
  experience: ["docs/screenshots/desktop-0-stage.png", [1440, 960, 640]],
  "experience-phone": ["docs/screenshots/phone-0-stage.png", [390, 260]],
  layers: ["docs/screenshots/layers-desktop.png", [1440, 960, 640]],
  configurator: ["docs/screenshots/desktop-4-config.png", [1440, 960, 640]],
  "macro-after": ["qa/screenshots/live/desktop-1-stage.png", [1440, 960, 640]],
  controls: ["qa/screenshots/live/desktop-2-stage.png", [960, 640]],
  shoulders: ["qa/screenshots/live/desktop-3-stage.png", [960, 640]],
  "config-phone": ["qa/screenshots/live/phone-4-config.png", [390, 260]],
  cart: ["qa/screenshots/interactions/desktop-cart.png", [1440, 960, 640]],
  // Earlier versions, kept in ARC's qa/screenshots
  "v1-opening": ["qa/screenshots/before-redesign/desktop-0-stage.png", [1440, 960, 640]],
  "macro-before": ["qa/screenshots/v5/desktop-1-stage.png", [1440, 960, 640]],
};

await mkdir(OUT, { recursive: true });
const record = {};
for (const [id, [src, widths]] of Object.entries(MEDIA)) {
  const input = sharp(path.join(ARC, src));
  const meta = await input.metadata();
  // Phone screenshots were taken at DPR 2; desktop ones at DPR 1.
  const files = [];
  for (const w of widths.filter((w) => w <= meta.width)) {
    const file = `${id}-${w}.webp`;
    const info = await sharp(path.join(ARC, src))
      .resize({ width: w })
      .webp({ quality: w <= 400 ? 82 : 80, effort: 6 })
      .toFile(path.join(OUT, file));
    files.push({ w, file: `/media/arc/${file}`, kb: Math.round(info.size / 1024) });
  }
  record[id] = { source: src, width: meta.width, height: meta.height, files };
  console.log(id.padEnd(18), `${meta.width}x${meta.height}`, files.map((f) => `${f.w}:${f.kb}KB`).join("  "));
}
await mkdir(path.join(ROOT, "src/data"), { recursive: true });
await writeFile(path.join(ROOT, "src/data/media.json"), JSON.stringify(record, null, 2) + "\n");
