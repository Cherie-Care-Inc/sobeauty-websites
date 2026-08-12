#!/usr/bin/env bun
/**
 * build-from-brief.ts — the DETERMINISTIC website builder.
 *
 * Turns an enriched brief (produced by the Studio `website` edge agent from the
 * beautician's intake answers + profile data) into a live site. No LLM, no
 * judgment: the brief already carries every piece of PROSE, per language. This
 * script does the mechanical assembly the LLM shouldn't:
 *   • resolve the palette (named set OR brand hex) → CSS token values
 *   • resolve the display font → font stack + Google Fonts URL
 *   • supply all structural CHROME labels (nav, "Réserver", section tags…)
 *   • assemble SEO strings + schema.org JSON-LD
 *   • materialise a client folder from _template-base
 *   • download the chosen images into src/assets
 *   • write src/content.ts (the one file the template renders from)
 *   • set package.json / wrangler.jsonc name + route (preview or production)
 *   • optionally build + deploy to Cloudflare
 *
 * Usage:
 *   bun scripts/build-from-brief.ts <brief.json>            # write files only
 *   bun scripts/build-from-brief.ts <brief.json> --build    # + bun run build
 *   bun scripts/build-from-brief.ts <brief.json> --deploy   # + wrangler deploy
 *   bun scripts/build-from-brief.ts <brief.json> --preview  # target the -preview host
 *
 * The GitHub Actions workflow calls this with --deploy (and --preview for the
 * review build, without it for the approved promotion).
 */

import { readFileSync, writeFileSync, existsSync, cpSync, mkdirSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const REPO = join(import.meta.dir, "..");
const TEMPLATE = join(REPO, "_template-base");
const BASE_DOMAIN = "sobeauty.business";

// ─────────────────────────────────────────────────────────────────────────────
// Brief type (the edge agent's output). Prose is per-language; the rest is data.
// ─────────────────────────────────────────────────────────────────────────────

type Lang = "fr" | "en";
type PaletteName =
  | "violet-elegance" | "or-noir" | "rose-nude" | "vert-sauge"
  | "bordeaux-gold" | "bleu-nuit" | "terracotta" | "monochrome";
type FontName = "fraunces" | "playfair" | "cormorant" | "dm-serif" | "libre-baskerville";
type SchemaType = "HairSalon" | "BeautySalon" | "NailSalon" | "Barber";
type Mode = "salon" | "home" | "mobile";

interface HeroCopy { title1: string; title2: string; title3: string; desc: string; }
interface AboutCopy { title2: string; desc: string; bullets: string[]; sign: string; }
interface Pillar { label: string; text: string; }
interface Highlight { title: string; desc: string; }
interface ServiceGroup { title: string; items: { name: string; duration?: string; price: string; notes?: string }[]; }

interface LangCopy {
  hero: HeroCopy;
  highlights: Highlight[];          // 3 homepage service cards
  about: AboutCopy;
  pillars: Pillar[];                // 3 trust pillars
  marquee: string[];
  footerTagline: string;
  services: ServiceGroup[];         // full priced menu
  contact: { intro: string; policy: string[]; note?: string };
  cta?: { title1: string; title2: string; title3: string; desc: string };
}

interface Brief {
  slug: string;
  brand_name: string;
  professional_name: string;
  first_name?: string;              // portrait/signature; else derived
  display_parts?: [string, string]; // wordmark split; else derived
  schema_type?: SchemaType;
  langs?: Lang[];
  default_lang?: Lang;

  booking_url?: string;             // else derived from slug
  logo_url?: string;
  owner_photo_url?: string;

  contact: {
    phone_human: string; phone_tel: string; email: string;
    address: string; city: string; postal_code?: string; region?: string;
    location_hint?: string;
    instagram?: string; tiktok?: string; facebook?: string;
    mode?: Mode;
  };

  theme: {
    palette?: PaletteName;
    colors?: { copper: string; copperGlow: string; espresso: string; cream: string; heroMid?: string };
    font?: FontName;
  };

  images: { hero_url?: string; about_url?: string; svc_urls?: string[]; };

  years_experience?: number;
  portrait_tag?: string;            // "Coiffeuse · Tresses"
  deposit_percent?: number;         // acompte at booking (drives the services info line)
  cf_analytics_token?: string;

  copy: Record<Lang, LangCopy>;
  seo?: Partial<Record<Lang, { title: string; description: string }>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic lookups
// ─────────────────────────────────────────────────────────────────────────────

const PALETTES: Record<PaletteName, { copper: string; copperGlow: string; espresso: string; cream: string; heroMid: string }> = {
  "violet-elegance": { copper: "oklch(0.48 0.20 310)", copperGlow: "oklch(0.88 0.05 355)", espresso: "oklch(0.20 0.06 310)", cream: "oklch(0.99 0.003 310)", heroMid: "oklch(0.30 0.10 310)" },
  "or-noir":         { copper: "oklch(0.72 0.12 75)",  copperGlow: "oklch(0.88 0.08 75)",  espresso: "oklch(0.16 0.03 60)",  cream: "oklch(0.99 0.004 60)",  heroMid: "oklch(0.28 0.05 60)" },
  "rose-nude":       { copper: "oklch(0.72 0.08 20)",  copperGlow: "oklch(0.88 0.04 20)",  espresso: "oklch(0.22 0.04 20)",  cream: "oklch(0.98 0.008 60)",  heroMid: "oklch(0.34 0.06 20)" },
  "vert-sauge":      { copper: "oklch(0.60 0.10 155)", copperGlow: "oklch(0.85 0.06 155)", espresso: "oklch(0.20 0.05 155)", cream: "oklch(0.98 0.005 155)", heroMid: "oklch(0.30 0.07 155)" },
  "bordeaux-gold":   { copper: "oklch(0.42 0.16 15)",  copperGlow: "oklch(0.72 0.12 75)",  espresso: "oklch(0.18 0.05 15)",  cream: "oklch(0.99 0.004 60)",  heroMid: "oklch(0.28 0.09 15)" },
  "bleu-nuit":       { copper: "oklch(0.50 0.18 260)", copperGlow: "oklch(0.78 0.08 220)", espresso: "oklch(0.17 0.06 255)", cream: "oklch(0.98 0.004 220)", heroMid: "oklch(0.28 0.10 258)" },
  "terracotta":      { copper: "oklch(0.58 0.14 40)",  copperGlow: "oklch(0.82 0.08 55)",  espresso: "oklch(0.22 0.06 35)",  cream: "oklch(0.99 0.005 55)",  heroMid: "oklch(0.32 0.09 38)" },
  "monochrome":      { copper: "oklch(0.40 0.00 0)",   copperGlow: "oklch(0.75 0.00 0)",   espresso: "oklch(0.15 0.00 0)",   cream: "oklch(0.99 0.00 0)",   heroMid: "oklch(0.28 0.00 0)" },
};

const FONTS: Record<FontName, { stack: string; family: string; axis: string }> = {
  fraunces:            { stack: "'Fraunces', Georgia, serif",            family: "Fraunces",            axis: "Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400" },
  playfair:            { stack: "'Playfair Display', Georgia, serif",    family: "Playfair Display",    axis: "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400" },
  cormorant:           { stack: "'Cormorant Garamond', Georgia, serif",  family: "Cormorant Garamond",  axis: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400" },
  "dm-serif":          { stack: "'DM Serif Display', Georgia, serif",    family: "DM Serif Display",    axis: "DM+Serif+Display:ital@0;1" },
  "libre-baskerville": { stack: "'Libre Baskerville', Georgia, serif",   family: "Libre Baskerville",   axis: "Libre+Baskerville:ital,wght@0,400;0,700;1,400" },
};

/** Structural chrome — never written by the LLM, always these. */
const LABELS: Record<Lang, {
  nav: { services: string; about: string; menu: string; contact: string; book: string };
  hero: { bookNow: string; discover: string; happy: string };
  services: { tag: string; title1: string; title2: string; title3: string; seeAll: string; more: string };
  about: { tag: string; title1: string; title3: string; cta: string; experience: string };
  testimonials: { tag: string; title1: string; title2: string; title3: string };
  cta: { title1: string; title2: string; title3: string; bookNow: string };
  footer: { contact: string; follow: string; policy: string; rights: string };
  sub: {
    home: string; menuWord: string;
    svcEyebrow: string; svcTitleAccent: string; svcSubtitle: string; svcInfoTitle: string;
    ctHeroTitle: string; ctHeroAccent: string; ctCta: string;
    ctLabelPhone: string; ctLabelEmail: string; ctLabelAddress: string; ctPolicyTitle: string;
  };
}> = {
  fr: {
    nav: { services: "Services", about: "À propos", menu: "Menu", contact: "Contact", book: "Réserver" },
    hero: { bookNow: "Réserver maintenant", discover: "Découvrir", happy: "Clientes ravies" },
    services: { tag: "Prestations", title1: "Des prestations", title2: "d'exception", title3: " pour vous.", seeAll: "Voir tous mes services", more: "Et bien plus..." },
    about: { tag: "À propos", title1: "Je m'appelle", title3: ".", cta: "Prendre rendez-vous", experience: "ans d'expérience" },
    testimonials: { tag: "Pourquoi me choisir", title1: "Un savoir-faire", title2: "qui vous fait", title3: " rayonner." },
    cta: { title1: "Prête à", title2: "rayonner", title3: " ?", bookNow: "Réserver maintenant" },
    footer: { contact: "Contact", follow: "Suivez-moi", policy: "Politique d'annulation", rights: "Tous droits réservés." },
    sub: {
      home: "Accueil", menuWord: "Menu & tarifs",
      svcEyebrow: "Menu complet", svcTitleAccent: "& tarifs", svcSubtitle: "Retrouvez l'ensemble de mes prestations et leurs tarifs.", svcInfoTitle: "Bon à savoir",
      ctHeroTitle: "Prenons", ctHeroAccent: "rendez-vous", ctCta: "Réserver en ligne",
      ctLabelPhone: "Téléphone", ctLabelEmail: "Email", ctLabelAddress: "Adresse", ctPolicyTitle: "Politique d'annulation",
    },
  },
  en: {
    nav: { services: "Services", about: "About", menu: "Menu", contact: "Contact", book: "Book" },
    hero: { bookNow: "Book now", discover: "Discover", happy: "Happy clients" },
    services: { tag: "Services", title1: "Exceptional", title2: "services", title3: " for you.", seeAll: "View all services", more: "And much more..." },
    about: { tag: "About", title1: "My name is", title3: ".", cta: "Book an appointment", experience: "years of experience" },
    testimonials: { tag: "Why choose me", title1: "Craft that", title2: "makes you", title3: " shine." },
    cta: { title1: "Ready to", title2: "shine", title3: " ?", bookNow: "Book now" },
    footer: { contact: "Contact", follow: "Follow me", policy: "Cancellation policy", rights: "All rights reserved." },
    sub: {
      home: "Home", menuWord: "Menu & pricing",
      svcEyebrow: "Full menu", svcTitleAccent: "& pricing", svcSubtitle: "All my services and their pricing in one place.", svcInfoTitle: "Good to know",
      ctHeroTitle: "Let's", ctHeroAccent: "book", ctCta: "Book online",
      ctLabelPhone: "Phone", ctLabelEmail: "Email", ctLabelAddress: "Address", ctPolicyTitle: "Cancellation policy",
    },
  },
};

/** Derived sub-page bits that depend on the pro's data. */
const MODE_INFO: Record<Mode, { fr: string; en: string }> = {
  salon:  { fr: "Je vous reçois en salon.", en: "I welcome you at my salon." },
  home:   { fr: "Je vous reçois à mon domicile.", en: "I welcome you at my home." },
  mobile: { fr: "Je me déplace chez vous.", en: "I travel to you." },
};
const SOCIAL_NAMES: Record<Lang, { lead: string; tail: string }> = {
  fr: { lead: "", tail: " — suivez mon travail au quotidien." },
  en: { lead: "", tail: " — follow my work day to day." },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function die(msg: string): never { console.error(`❌  ${msg}`); process.exit(1); }

function resolveTheme(t: Brief["theme"]) {
  const font = FONTS[t.font ?? "fraunces"];
  const colors = t.colors
    ? { ...t.colors, heroMid: t.colors.heroMid ?? t.colors.espresso }
    : PALETTES[t.palette ?? "or-noir"];
  const googleFontsUrl =
    `https://fonts.googleapis.com/css2?family=${font.axis}` +
    `&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@500&display=swap`;
  return { ...colors, fontDisplayStack: font.stack, googleFontsUrl };
}

function deriveDisplayParts(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return [words[0], ""];
  return [words[0], words.slice(1).join(" ")];
}

function buildStructuredData(b: Brief, host: string, lang: Lang): string {
  const c = b.contact;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": b.schema_type ?? "HairSalon",
    name: b.brand_name,
    description: b.seo?.[lang]?.description ?? b.copy[lang].hero.desc,
    url: `https://${host}`,
    telephone: c.phone_tel,
    email: c.email,
    address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: c.city, postalCode: c.postal_code ?? "", addressCountry: "FR" },
    image: b.logo_url || undefined,
    logo: b.logo_url || undefined,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    knowsLanguage: b.langs ?? ["fr"],
    sameAs: [c.instagram, c.tiktok, c.facebook].filter(Boolean),
    founder: { "@type": "Person", name: b.professional_name },
  });
}

function extFromType(ct: string | null, url: string): string {
  const t = (ct ?? "").toLowerCase();
  if (t.includes("webp")) return "webp";
  if (t.includes("png")) return "png";
  if (t.includes("avif")) return "avif";
  if (t.includes("jpeg") || t.includes("jpg")) return "jpg";
  const m = url.split("?")[0].match(/\.(webp|png|avif|jpe?g)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

// Download into src/assets as `<base>.<real-ext>` and return the filename, so the
// generated image barrel points at a file whose extension matches its bytes
// (Cloudflare serves by extension → correct Content-Type for og:image etc.).
async function download(url: string, dir: string, base: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) die(`failed to download ${url} (${res.status})`);
  const file = `${base}.${extFromType(res.headers.get("content-type"), url)}`;
  writeFileSync(join(dir, "src/assets", file), Buffer.from(await res.arrayBuffer()));
  console.log(`   ↓ ${base} → ${file}`);
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// Assemble SiteContent (matches _schema/site-content.ts)
// ─────────────────────────────────────────────────────────────────────────────

function assemble(b: Brief, host: string) {
  const langs = b.langs ?? ["fr"];
  const defaultLang = b.default_lang ?? langs[0];
  const firstName = b.first_name ?? b.professional_name.trim().split(/\s+/)[0];
  const displayParts = b.display_parts ?? deriveDisplayParts(b.brand_name);
  const theme = resolveTheme(b.theme);
  const region = b.contact.region ?? [b.contact.postal_code, b.contact.city].filter(Boolean).join(" ");

  const mode = b.contact.mode ?? "home";
  const socialNames = [
    b.contact.instagram && "Instagram",
    b.contact.tiktok && "TikTok",
    b.contact.facebook && "Facebook",
  ].filter(Boolean) as string[];

  const i18n: Record<string, unknown> = {};
  const services: Record<string, unknown> = {};
  const contactPage: Record<string, unknown> = {};
  const pages: Record<string, unknown> = {};
  const seo: Record<string, unknown> = {};
  const seoPages: Record<string, unknown> = {};

  for (const lang of langs) {
    const L = LABELS[lang];
    const c = b.copy[lang];
    if (!c) die(`brief.copy missing language "${lang}"`);
    i18n[lang] = {
      nav: { home: L.sub.home, ...L.nav },
      hero: {
        eyebrow: `${b.brand_name} · ${b.contact.city}`,
        title1: c.hero.title1, title2: c.hero.title2, title3: c.hero.title3, desc: c.hero.desc,
        bookNow: L.hero.bookNow, discover: L.hero.discover, happy: L.hero.happy,
        location: `${b.contact.city} · ${b.contact.postal_code ?? ""}`.trim(),
        portraitTag: b.portrait_tag ?? "", portraitName: firstName,
      },
      services: { tag: L.services.tag, ...L.services, items: c.highlights },
      about: {
        tag: L.about.tag, title1: L.about.title1, title2: c.about.title2 || firstName, title3: L.about.title3,
        desc: c.about.desc, bullets: c.about.bullets, sign: c.about.sign, cta: L.about.cta,
        experienceValue: b.years_experience != null ? String(b.years_experience) : "", experience: L.about.experience,
      },
      testimonials: { ...L.testimonials, items: c.pillars },
      cta: { title1: c.cta?.title1 ?? L.cta.title1, title2: c.cta?.title2 ?? L.cta.title2, title3: c.cta?.title3 ?? L.cta.title3, desc: c.cta?.desc ?? "", bookNow: L.cta.bookNow },
      marquee: c.marquee,
      footer: { tagline: c.footerTagline, contact: L.footer.contact, follow: L.footer.follow, policy: L.footer.policy, rights: L.footer.rights },
      location: { city: b.contact.city, region, hint: b.contact.location_hint ?? "" },
    };
    services[lang] = c.services;
    contactPage[lang] = c.contact;
    seo[lang] = b.seo?.[lang] ?? { title: `${b.brand_name} · ${b.contact.city}`, description: c.hero.desc };

    const infoParts = [MODE_INFO[mode][lang], b.contact.location_hint ? `${b.contact.location_hint}.` : ""].filter(Boolean);
    const depositLine = b.deposit_percent
      ? (lang === "fr"
          ? `Un acompte de ${b.deposit_percent}% est demandé à la réservation.`
          : `A ${b.deposit_percent}% deposit is required at booking.`)
      : "";
    const socialsLine = socialNames.length
      ? `${socialNames.join(" · ")}${SOCIAL_NAMES[lang].tail}`
      : "";
    pages[lang] = {
      navHome: L.sub.home,
      services: {
        eyebrow: L.sub.svcEyebrow, titleAccent: L.sub.svcTitleAccent, subtitle: L.sub.svcSubtitle,
        infoTitle: L.sub.svcInfoTitle, infoText: infoParts.join(" "), depositLine,
      },
      contact: {
        heroTitle: L.sub.ctHeroTitle, heroAccent: L.sub.ctHeroAccent, ctaLabel: L.sub.ctCta,
        labelPhone: L.sub.ctLabelPhone, labelEmail: L.sub.ctLabelEmail, labelAddress: L.sub.ctLabelAddress,
        socialsLine, policyTitle: L.sub.ctPolicyTitle, signature: `— ${firstName}`,
      },
    };
    seoPages[lang] = {
      services: { title: `${b.brand_name} · ${L.sub.menuWord}`, description: L.sub.svcSubtitle },
      contact: { title: `${b.brand_name} · ${L.nav.contact}`, description: c.contact.intro || c.hero.desc },
    };
  }

  return {
    brand: {
      name: b.brand_name, displayParts, initial: b.brand_name.trim()[0].toUpperCase(), slug: b.slug,
      logoUrl: b.logo_url ?? "", bookingUrl: b.booking_url ?? `https://book.${BASE_DOMAIN}/${b.slug}`,
      schemaType: b.schema_type ?? "HairSalon", defaultLang, langs,
    },
    contact: {
      phoneHuman: b.contact.phone_human, phoneTel: b.contact.phone_tel, email: b.contact.email,
      address: b.contact.address, city: b.contact.city, region, locationHint: b.contact.location_hint ?? "",
      socials: { instagram: b.contact.instagram, tiktok: b.contact.tiktok, facebook: b.contact.facebook },
      mode: b.contact.mode ?? "home",
    },
    theme,
    assets: { hero: "hero.jpg", about: "about.jpg", svc1: "svc-1.jpg", svc2: "svc-2.jpg", svc3: "svc-3.jpg", flower: "flower.png" },
    cfAnalyticsToken: b.cf_analytics_token ?? "",
    i18n, services, contactPage, pages, seo, seoPages,
    structuredData: buildStructuredData(b, host, defaultLang),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const briefPath = process.argv[2];
const flags = new Set(process.argv.slice(3));
if (!briefPath) die("Usage: bun scripts/build-from-brief.ts <brief.json> [--build] [--deploy] [--preview]");

const brief: Brief = JSON.parse(readFileSync(briefPath, "utf-8"));
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(brief.slug ?? "")) die(`slug "${brief.slug}" must be kebab-case`);

const preview = flags.has("--preview");
const host = preview ? `${brief.slug}-preview.${BASE_DOMAIN}` : `${brief.slug}.${BASE_DOMAIN}`;
const dir = join(REPO, brief.slug);

console.log(`\n🏗  Building ${brief.brand_name} → ${host}\n`);

// 1. materialise client folder from template
if (!existsSync(dir)) {
  cpSync(TEMPLATE, dir, { recursive: true, filter: (s) => !/\/(node_modules|dist)(\/|$)/.test(s) });
  console.log(`   • copied _template-base → ${brief.slug}/`);
}
mkdirSync(join(dir, "src/assets"), { recursive: true });

// 2. write content.ts
const content = assemble(brief, host);
const contentTs =
  `// GENERATED by build-from-brief.ts — do not edit by hand.\n` +
  `import type { SiteContent } from "./site-content";\n\n` +
  `const content: SiteContent = ${JSON.stringify(content, null, 2)};\n\n` +
  `export default content;\n`;
writeFileSync(join(dir, "src/content.ts"), contentTs);
console.log(`   • wrote src/content.ts`);

// 3. images — download the pro's real photos (keeping their true format) and
//    regenerate the image barrel. Non-downloaded slots keep the template
//    placeholders (which are .jpg).
console.log(`   • assets`);
const files = { hero: "hero.jpg", about: "about.jpg", svc1: "svc-1.jpg", svc2: "svc-2.jpg", svc3: "svc-3.jpg", flower: "flower.png" };
if (brief.images.hero_url) files.hero = await download(brief.images.hero_url, dir, "hero");
const aboutUrl = brief.owner_photo_url ?? brief.images.about_url;
if (aboutUrl) files.about = await download(aboutUrl, dir, "about");
const svc = brief.images.svc_urls ?? [];
if (svc[0]) files.svc1 = await download(svc[0], dir, "svc-1");
if (svc[1]) files.svc2 = await download(svc[1], dir, "svc-2");
if (svc[2]) files.svc3 = await download(svc[2], dir, "svc-3");
writeFileSync(join(dir, "src/assets/generated-images.ts"),
  `// GENERATED by build-from-brief.ts — do not edit by hand.\n` +
  `import heroImg from "./${files.hero}";\n` +
  `import aboutImg from "./${files.about}";\n` +
  `import svc1Img from "./${files.svc1}";\n` +
  `import svc2Img from "./${files.svc2}";\n` +
  `import svc3Img from "./${files.svc3}";\n` +
  `import flowerImg from "./${files.flower}";\n\n` +
  `export { heroImg, aboutImg, svc1Img, svc2Img, svc3Img, flowerImg };\n`);

// 4. package.json + wrangler.jsonc name & route
const pkgPath = join(dir, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")); pkg.name = brief.slug; writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
const wrangler = {
  $schema: "node_modules/wrangler/config-schema.json",
  name: preview ? `${brief.slug}-preview` : brief.slug,
  compatibility_date: "2025-09-24",
  compatibility_flags: ["nodejs_compat"],
  main: "dist/server/server.js",
  assets: { directory: "dist/client" },
  routes: [{ pattern: host, custom_domain: true }],
};
writeFileSync(join(dir, "wrangler.jsonc"), JSON.stringify(wrangler, null, 2) + "\n");
console.log(`   • package.json + wrangler.jsonc (${wrangler.name})`);

// 5. favicon initial
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" style="fill:${content.theme.copper}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="44" font-weight="600" fill="white">${content.brand.initial}</text></svg>`;
writeFileSync(join(dir, "public/favicon.svg"), fav);

console.log(`\n✅  Files written to ${brief.slug}/`);

// 6. optional build / deploy
function run(cmd: string, args: string[]) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd: dir, stdio: "inherit" });
  if (r.status !== 0) die(`${cmd} failed`);
}
if (flags.has("--build") || flags.has("--deploy")) { run("bun", ["install"]); run("bun", ["run", "build"]); }
if (flags.has("--deploy")) {
  run("npx", ["wrangler", "deploy"]);
  console.log(`\n🚀  Deployed → https://${host}`);
}
