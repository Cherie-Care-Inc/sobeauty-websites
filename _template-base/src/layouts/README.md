# Layouts: how a template is written

One generated site = `_template-base` + `src/content.ts` (data) + `src/layout.ts`
(re-export of one folder here). Every layout consumes the same `SiteData` and
renders it in its own order and style. Read, in this order:

1. `../site-content.ts` (the data contract) and `../lib/site-data.ts` (`SiteData`
   plus the `hasX()` helpers).
2. `registry.ts` (per-template tokens, fonts, radius, scheme).
3. `../blocks/` (shared sections) and `atelier/index.tsx` (the reference layout).

## Contract

```ts
import type { Layout } from "../types";
const layout: Layout = { Home, Services, Contact };
export default layout;
```

Each page receives `{ data, setLang }` and must render `Nav` (or its own header
using `Logo`, `LangToggle` and the Book button) and `Footer` (the SoBeauty credit
lives there, never remove it).

## Rules (founder, 10 October 2026)

- A block renders only when its data exists: use `hasMenu`, `hasTeam`,
  `hasReviews`, `hasGallery`, `hasFaq`, `hasHours`, `hasProducts`, `hasStats`,
  `hasOffer`, `hasAbout`, `hasAddress`. Never render an empty frame, a sample
  photo, a "coming soon", a fake number or a fake quote. The shared blocks already
  return `null` without data; your own sections must do the same.
- The page must look complete with the minimum set: hero, about, menu (or
  products), contact, footer. Check it by building the demo brief with
  `team`, `reviews`, `faq`, `gallery_urls`, `offer`, `hours` removed.
- Everything paints immediately: no scroll-triggered reveal, no opacity-0 on
  load, no JS-gated content. CSS hover and the marquee are fine.
- Style with the tokens only (`bg-bg`, `text-fg`, `bg-surface`, `bg-surface-2`,
  `text-muted-fg`, `border-line`, `bg-accent`, `text-accent-fg`, `bg-accent-soft`,
  `bg-hero`, `text-hero-fg`, `text-hero-muted`, `font-display`, `rounded-[var(--radius)]`).
  No hard-coded colours except pure white or black overlays on photos. The builder
  swaps the accent for the member's brand colour and checks the contrast.
- Logos are big and readable (the `Logo` block renders 48 to 56 px high).
- Mobile first: no horizontal scroll at 375 px, 16 px side gutters
  (`container-site`), tap targets 44 px.
- Copy comes from `data.t` and the data from `data.*`: never write prose in a
  layout. The structural words you may need are all in `data.t` (nav, buttons,
  section tags and titles, labels).
- No em dash anywhere.

## Blocks available (`../blocks`)

`Section`, `Heading`, `Button`, `Stars`, `Img`, `Avatar`, `Nav` (+ `defaultLinks`,
`Logo`, `LangToggle`), `Footer`, `MenuList` (rows | numbered | cards),
`Highlights` (cards | rows | tiles), `Team` (grid | list), `Reviews` (cards |
quotes; falls back to the trust pillars), `Gallery` (grid | masonry | strip),
`Faq`, `Hours`, `Stats`, `Offer`, `Marquee`, `BookCta` (hero | accent | surface),
`Products` (grid | list), `Programmes`, `ProductImages`, `ContactCards`, `Policy`,
`HoursCard`.

Compose them; write bespoke sections (your hero, your about, a signature band)
when the reference calls for it. Keep a layout between 250 and 450 lines.

## Verifying a layout

```bash
# from the repo root
bun scripts/build-from-brief.ts _briefs/demo-<key>.json --out /tmp/demo-<key>
cd /tmp/demo-<key> && bun install && bun run build && npx tsc --noEmit -p tsconfig.json | grep -v components/ui
bun x wrangler dev --port <port> --ip 127.0.0.1
```

Then look at `/`, `/services`, `/contact` at desktop and 375 px, FR and EN, and
once more with the optional blocks removed from the brief.

## The twelve layouts

Each follows a reference from the catalogue (`.claude/sobeauty-website-templates-catalogue.md`
in the so-beauty-crm repo). The reference is a mood and a structure, never a copy.

| Key | Reference | Home order and signature |
|---|---|---|
| `atelier` | Elysia | Light. Text + photo hero, numbered highlights with images, menu extract, about with stats, team, reviews, gallery, shop, FAQ, visit, CTA. Done. |
| `editorial-dark` | Salonix | Dark. Full-bleed photo hero with huge uppercase display title (Oswald), lead-service chip, 4-tile `Highlights` strip, red accent, numbered services with price, team, reviews as big quotes, gallery strip, CTA on accent. |
| `studio-team` | Marlo Hair Co | Light, warm. Hero with a short story line in italic display, pill buttons, "pick a stylist" team grid high on the page, menu as `cards` with Book per item, transformations gallery, reviews tagged by service, hours. |
| `gold-barber` | UrbanCut | Dark, gold. Full-width photo hero with condensed uppercase title ("CUT. TRIM. DEFINE." mood) over the photo, 3 service cards, "latest cuts" gallery, why-us tiles (walk-ins, WhatsApp), starting price (cheapest menu item), reviews, find-us with hours, footer with hours. Sharp corners. |
| `clean-barber` | Barbero | Light, minimal grotesk. Big two-line title, grayscale photo (CSS `grayscale`), about in a single bold paragraph, services as rows with price and duration, barbers grid, testimonials, CTA. Lots of white space. |
| `rose-nails` | Nailora | Light pink. Top bar with hours + phone, soft rounded hero, 3 family cards with counts linking to the menu, about with founder quote (the about sign) and stats, full price list by family in rows, reviews, FAQ, CTA. |
| `portfolio-noir` | Makeup Studio | Dark, wide type (Archivo). Giant wordmark hero with one portrait, "based in <city>" about with audience tiles from the highlights, gallery as the main event (masonry), reviews as uppercase quotes, FAQ, "let's work together" CTA. Menu on /services only, prices in a plain list. |
| `glow` | Zerra | Light cream, oxblood. Welcome hero with photo collage (hero + svc images overlapping), pill chips of section links, services "from" price with the team member's name when a team exists, founder quote band on accent-soft, client stories, products grid, CTA. |
| `sanctuary` | Lusora | Light teal, one page. Phone in header, hero with Google rating when reviewsSummary exists, offer banner, about with photo, treatments (menu cards), team, pricing rows, contact block inline (ContactCards + HoursCard), CTA. /services and /contact exist but the home already shows everything. |
| `sand` | Opalya | Sand paper background (subtle CSS noise is fine), italic serif. Hero with address + hours marquee under it, "the story" about with photo, stats, treatments list, pricing, memberships block only if products of kind physical exist named like packs (else skip), contact, CTA. |
| `brand-shop` | Nuda | Light, green hero band. Benefit marquee, product grid first (`Products`), 3-step routine from the highlights, brand story (about), reviews, FAQ, ordering CTA (shopUrl). No services menu unless one exists. |
| `academy` | Ananda + Makeup Studio | Light cream, deep green. Hero with the trainer, 4 benefit tiles from highlights, `Programmes` as the main block, about the trainer with stats, gallery of past sessions, reviews, FAQ, enrol CTA. Products of kind physical (if any) in a small shop block. |

Dark layouts (`scheme: "dark"` in the registry) use `tone="dark"` on `Nav`,
`Footer`, `Marquee`, `Stats` and pass `band="hero"` where a darker band is wanted.
