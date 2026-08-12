#!/usr/bin/env bun
/**
 * Updates only the services page and homepage service cards from a new brief.
 * Does NOT touch design (colors, fonts, layout). Safe to run on a live site.
 *
 * Usage: bun scripts/update-services.ts <client-slug> <path-to-brief.json>
 *
 * After running, redeploy with: ./deploy.sh <client-slug>
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const [slug, briefPath] = process.argv.slice(2);
if (!slug || !briefPath) {
  console.error("Usage: bun scripts/update-services.ts <client-slug> <path-to-brief.json>");
  process.exit(1);
}

const brief = JSON.parse(readFileSync(briefPath, "utf-8"));
const servicesFile = join(import.meta.dir, "..", slug, "src/routes/services.tsx");

if (!brief.services || brief.services.length === 0) {
  console.error("Brief has no 'services' array — nothing to update.");
  process.exit(1);
}

// Build the new groups object for both languages
const frGroups = brief.services.map((g: any) => ({
  title: g.group_title_fr,
  items: g.items.map((it: any) => ({
    name: it.name_fr,
    duration: it.duration ?? "—",
    price: it.price,
    ...(it.notes_fr ? { notes: it.notes_fr } : {}),
  })),
}));

const enGroups = brief.services.map((g: any) => ({
  title: g.group_title_en ?? g.group_title_fr,
  items: g.items.map((it: any) => ({
    name: it.name_en ?? it.name_fr,
    duration: it.duration ?? "—",
    price: it.price.replace(/^(\d)/, "€$1").replace(/€+/, "€"),
    ...(it.notes_en ?? it.notes_fr ? { notes: it.notes_en ?? it.notes_fr } : {}),
  })),
}));

const depositFr = brief.deposit_percent
  ? `Acompte obligatoire de ${brief.deposit_percent}% du total de la prestation à la réservation.`
  : "";
const depositEn = brief.deposit_percent
  ? `A ${brief.deposit_percent}% deposit of the total service amount is required at booking.`
  : "";

// Read the current file and replace the groups const block
let src = readFileSync(servicesFile, "utf-8");

const frGroupsStr = JSON.stringify(frGroups, null, 2).replace(/"([^"]+)":/g, "$1:");
const enGroupsStr = JSON.stringify(enGroups, null, 2).replace(/"([^"]+)":/g, "$1:");

// Replace fr.groups
src = src.replace(
  /(?<=fr:\s*\{[\s\S]*?groups:\s*)(\[[\s\S]*?\]) as Group\[\]/,
  `${frGroupsStr} as Group[]`
);

// Replace en.groups
src = src.replace(
  /(?<=en:\s*\{[\s\S]*?groups:\s*)(\[[\s\S]*?\]) as Group\[\]/,
  `${enGroupsStr} as Group[]`
);

// Replace deposit lines if present
if (depositFr) {
  src = src.replace(/deposit: ".*?"(,\s*\/\/ fr)/g, `deposit: "${depositFr}"$1`);
  src = src.replace(/(en[\s\S]*?deposit: )".*?"/g, `$1"${depositEn}"`);
}

writeFileSync(servicesFile, src);
console.log(`✅  Updated services for ${slug}`);
console.log(`   Groups: ${frGroups.length} (${frGroups.map((g: any) => g.title).join(", ")})`);
console.log(`   Run ./deploy.sh ${slug} to publish.`);
