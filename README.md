# sobeauty-websites

All SoBeauty member websites, built by the website agent from the member's
app data, plus the hand-made sites that came before it.

```
sobeauty-websites/
├── _schema/            site-content.ts (the data contract), templates.ts (the 12 layouts and their tokens)
├── _template-base/     the one app every site is built from (TanStack Start on Cloudflare Workers)
│   └── src/layouts/    one folder per layout; README.md is the spec for writing one
├── _briefs/            demo-<key>.json: one demo brief per layout (the gallery demos), plus references
├── scripts/            build-from-brief.ts (the builder), color.ts (contrast), labels.ts (chrome labels)
├── .github/workflows/  build-site.yml: repository_dispatch build-site (preview) / promote-site (live)
└── <client-slug>/      one generated or hand-made site per member
```

## How a site is made

1. The Studio `website` edge agent (cherie_backend) collects the member's facts
   (menu, team, products, reviews, hours, photos), asks the model for the prose,
   picks the template (her choice in the gallery, else the suggestion rule) and
   archives a **brief** (`website/<job>/brief.json`).
2. The expert reviews and edits the content in the back office, then builds.
3. GitHub Actions runs `bun scripts/build-from-brief.ts brief.json --deploy --preview`
   → `<slug>-preview.sobeauty.business`. Approval runs the same without
   `--preview` → `<slug>.sobeauty.business`, and tears the preview down.

The builder is deterministic: template tokens + the member's brand colour
(contrast-checked), structural labels, copy hygiene (no em dash, no placeholder:
a missing required text fails the build), images downloaded in their real format,
`src/content.ts` + `src/layout.ts` written, Cloudflare names set.

At request time the site refetches the facts from the member's public page
(`src/lib/live.ts`), so the menu, team, products and reviews stay current without
a rebuild; the snapshot in `content.ts` is the fallback.

## Demos and the gallery

```bash
bun scripts/build-from-brief.ts _briefs/demo-atelier.json --out /tmp/demo-atelier
cd /tmp/demo-atelier && bun install && bun run build && npx wrangler deploy   # → demo-atelier.sobeauty.business
```

Each layout has a demo at `https://demo-<key>.sobeauty.business`, linked from
the template gallery in the back office (`studio_templates`, job_type `website`).

## Hand-made sites

The folders without `src/content.ts` were written by hand before the builder
(2025-2026). They are linked to their member's file as imported jobs; changes go
through the web team, never through the builder.
