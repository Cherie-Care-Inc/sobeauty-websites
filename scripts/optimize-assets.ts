#!/usr/bin/env bun
/**
 * Converts all JPG/PNG images in a client's src/assets/ to WebP.
 * Generates three sizes for responsive srcset: 400w, 800w, 1200w.
 * Run before vite build — deploy.sh calls this automatically.
 *
 * Usage: bun scripts/optimize-assets.ts <client-slug>
 */

import sharp from "sharp";
import { readdirSync, existsSync } from "fs";
import { join, basename, extname } from "path";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: bun scripts/optimize-assets.ts <client-slug>");
  process.exit(1);
}

const assetsDir = join(import.meta.dir, "..", slug, "src", "assets");
if (!existsSync(assetsDir)) {
  console.error(`Assets dir not found: ${assetsDir}`);
  process.exit(1);
}

const SOURCE_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const SIZES = [400, 800, 1200];

const files = readdirSync(assetsDir).filter((f) =>
  SOURCE_EXTS.has(extname(f).toLowerCase())
);

if (files.length === 0) {
  console.log("No images to optimize.");
  process.exit(0);
}

console.log(`Optimizing ${files.length} image(s) in ${assetsDir}…`);

for (const file of files) {
  const input = join(assetsDir, file);
  const stem = basename(file, extname(file));

  // Full-size WebP
  const outputFull = join(assetsDir, `${stem}.webp`);
  await sharp(input).webp({ quality: 82 }).toFile(outputFull);

  // Responsive sizes
  for (const w of SIZES) {
    const outputSized = join(assetsDir, `${stem}-${w}w.webp`);
    await sharp(input).resize(w).webp({ quality: 82 }).toFile(outputSized);
  }

  console.log(`  ✓ ${file} → ${stem}.webp (+${SIZES.join("w, ")}w)`);
}

console.log("Done.");
