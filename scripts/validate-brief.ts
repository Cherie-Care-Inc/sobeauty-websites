#!/usr/bin/env bun
/**
 * Validates a brief JSON file against the SoBeauty brief schema.
 * Run before starting a build to catch missing fields early.
 *
 * Usage: bun scripts/validate-brief.ts <path-to-brief.json>
 */

import { readFileSync } from "fs";
import { join } from "path";

const briefPath = process.argv[2];
if (!briefPath) {
  console.error("Usage: bun scripts/validate-brief.ts <path-to-brief.json>");
  process.exit(1);
}

const brief = JSON.parse(readFileSync(briefPath, "utf-8"));
const schema = JSON.parse(
  readFileSync(join(import.meta.dir, "../_schema/brief-schema.json"), "utf-8")
);

const required: string[] = schema.required ?? [];
const missing = required.filter((k: string) => !(k in brief));

const warnings: string[] = [];

// Slug format check
if (brief.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(brief.slug)) {
  warnings.push(`slug "${brief.slug}" must be kebab-case (lowercase, hyphens only)`);
}

// Phone format
if (brief.phone && !/^\+?[0-9 ()-]{7,20}$/.test(brief.phone)) {
  warnings.push(`phone "${brief.phone}" — recommended format: +33XXXXXXXXX`);
}

// Primary services vs media library
const validCategories = ["locs","braiding","makeup","nails","barber","coloring","wigs","skincare"];
if (brief.primary_services) {
  const unknown = (brief.primary_services as string[]).filter(s => !validCategories.includes(s));
  if (unknown.length) {
    warnings.push(`primary_services contains unknown categories: ${unknown.join(", ")} — no images will be found in _media/`);
  }
}

// Print results
if (missing.length === 0 && warnings.length === 0) {
  console.log(`✅  Brief is valid: ${brief.brand_name} (${brief.slug})`);
  process.exit(0);
}

if (missing.length > 0) {
  console.error("❌  Missing required fields:");
  for (const f of missing) console.error(`     • ${f}`);
}

if (warnings.length > 0) {
  console.warn("\n⚠️   Warnings:");
  for (const w of warnings) console.warn(`     • ${w}`);
}

process.exit(missing.length > 0 ? 1 : 0);
