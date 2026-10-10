#!/usr/bin/env bun
/**
 * build-from-brief.ts — the DETERMINISTIC website builder (v2, templates).
 *
 * Turns an enriched brief (from the Studio `website` edge agent) into a site:
 *   • picks the layout (`brief.template`, else the category default)
 *   • resolves the design tokens: template palette + the member's brand colour,
 *     every pair contrast-checked (WCAG AA)
 *   • supplies the structural labels (nav, buttons, section titles)
 *   • cleans the copy (no em dash, no placeholder, no lorem) and refuses to
 *     build when a required text is missing
 *   • assembles SEO + schema.org JSON-LD
 *   • materialises the client folder from _template-base, downloads the images
 *     (hero, about, highlights, gallery) keeping their real format
 *   • writes src/content.ts, src/layout.ts, src/assets/generated-images.ts
 *   • sets package.json / wrangler.jsonc, favicon, then optionally builds and
 *     deploys to Cloudflare.
 *
 * Usage:
 *   bun scripts/build-from-brief.ts <brief.json>            # write files only
 *   bun scripts/build-from-brief.ts <brief.json> --build    # + bun run build
 *   bun scripts/build-from-brief.ts <brief.json> --deploy   # + wrangler deploy
 *   bun scripts/build-from-brief.ts <brief.json> --preview  # target the -preview host
 *   bun scripts/build-from-brief.ts <brief.json> --out <dir> # write elsewhere (demos)
 */

import { readFileSync, writeFileSync, existsSync, cpSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import type { CategoryKey, DayHours, Lang, PageCopy, Product, Review, ServiceGroup, SiteContent, TeamMember, TemplateKey, ThemeTokens } from "../_schema/site-content";
import { TEMPLATES, FONTS, DEFAULT_TEMPLATE, isTemplateKey } from "../_schema/templates";
import { LABELS } from "./labels";
import { contrast, ensureContrast, normalizeHex, onColor, softOf, luminance, mix } from "./color";

const REPO = join(import.meta.dir, "..");
const TEMPLATE = join(REPO, "_template-base");
const BASE_DOMAIN = "sobeauty.business";
const API_BASE = "https://api.cherie.care/functions/v1";
const CREDIT = { label: "SoBeauty", url: "https://sobeauty.business", logoUrl: "https://sobeauty.business/lovable-uploads/c7fadc4d-63e3-4259-9348-e54ad2da526f.png" };

// ─────────────────────────────────────────────────────────────────────────────
// Brief (the edge agent's output). v1 briefs still build (template inferred).
// ─────────────────────────────────────────────────────────────────────────────

type Mode = "salon" | "home" | "mobile";
interface HeroCopy { title1: string; title2: string; title3: string; desc: string; lead_service?: string }
interface AboutCopy { title2: string; desc: string; bullets: string[]; sign: string }
interface Pillar { label: string; text: string }
interface Highlight { title: string; desc: string }
interface LangCopy {
  hero: HeroCopy;
  highlights: Highlight[];
  about: AboutCopy;
  pillars: Pillar[];
  marquee: string[];
  footerTagline: string;
  services: ServiceGroup[];
  contact: { intro: string; policy: string[]; note?: string };
  cta?: { title1: string; title2: string; title3: string; desc: string };
  faq?: { q: string; a: string }[];
  offer?: string;
  team_roles?: Record<string, string>;   // member name → role line
}

interface Brief {
  slug: string;                       // site slug (brand name based)
  template?: TemplateKey;
  category?: CategoryKey;
  brand_name: string;
  professional_name: string;
  first_name?: string;
  display_parts?: [string, string];
  schema_type?: SiteContent["brand"]["schemaType"];
  about_mode?: "her" | "salon";
  langs?: Lang[];
  default_lang?: Lang;
  booking_url?: string;
  booking_slug?: string;              // live facts source (public page slug)
  live?: boolean;
  shop_url?: string;
  whatsapp?: string;                  // digits, international
  logo_url?: string;
  owner_photo_url?: string;
  credit_logo_url?: string;
  contact: {
    phone_human: string; phone_tel: string; email: string;
    address: string; city: string; postal_code?: string; region?: string; location_hint?: string; maps_url?: string;
    instagram?: string; tiktok?: string; facebook?: string; snapchat?: string;
    mode?: Mode;
  };
  theme: {
    palette?: string;                 // v1 named palette (ignored in v2)
    colors?: { copper?: string; accent?: string; copperGlow?: string; espresso?: string; cream?: string; heroMid?: string };
    brand_colors?: string[];          // the member's colours (hex), first = accent
    font?: string;                    // v1 font name (ignored unless no template font)
  };
  images: { hero_url?: string; about_url?: string; svc_urls?: string[]; gallery_urls?: string[] };
  team?: { name: string; photo_url?: string | null; owner?: boolean; share_code?: string; services?: Partial<Record<Lang, string[]>> }[];
  products?: { id: string; name: string; description?: string | null; price_amount: number; currency: string; image_urls?: string[]; image_url?: string | null; kind?: "physical" | "digital"; in_stock?: boolean }[];
  reviews?: Review[];
  reviews_summary?: { average: number; count: number } | null;
  hours?: DayHours[];
  years_experience?: number;
  portrait_tag?: string;
  deposit_percent?: number;
  cf_analytics_token?: string;
  copy: Record<Lang, LangCopy>;
  seo?: Partial<Record<Lang, { title: string; description: string }>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function die(msg: string): never { console.error(`❌  ${msg}`); process.exit(1); }
const warn = (msg: string) => console.warn(`⚠️   ${msg}`);

/** Copy hygiene: no em/en dash, no doubled spaces, trimmed. */
const clean = (s: unknown): string => String(s ?? "")
  .replace(/\s*[—–]\s*/g, ", ").replace(/,\s*,/g, ", ").replace(/\s*,\s*([.!?])/g, "$1")
  .replace(/[ \t]+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
const cleanList = (xs: unknown): string[] => (Array.isArray(xs) ? xs.map(clean).filter(Boolean) : []);
/**
 * The third part of a split title carries its own spacing: " vos cheveux." keeps
 * its leading space, "." sticks to the word, "?" gets the French narrow space.
 */
const tail = (s: unknown, lang: Lang): string => {
  const c = clean(s);
  if (!c) return "";
  if (/^[.,;]/.test(c)) return c;
  if (/^[!?:]/.test(c)) return lang === "fr" ? `\u202F${c}` : c;
  return ` ${c}`;
};

const PLACEHOLDER = /(lorem|ipsum|\{\{|\}\}|\bTODO\b|\bTBD\b|\[insert|placeholder|xxx)/i;
function assertClean(path: string, value: string) {
  if (PLACEHOLDER.test(value)) die(`placeholder text in ${path}: "${value.slice(0, 60)}"`);
}
function required(path: string, value: string): string {
  if (!value.trim()) die(`missing required copy: ${path}`);
  assertClean(path, value);
  return value;
}

function deriveDisplayParts(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  return words.length === 1 ? [words[0], ""] : [words[0], words.slice(1).join(" ")];
}

const money = (amount: number, currency: string, lang: Lang): string => {
  try {
    return new Intl.NumberFormat(lang === "en" ? "en-GB" : "fr-FR", { style: "currency", currency, maximumFractionDigits: 2 })
      .format(amount).replace(/[   ]/g, " ").replace(/F CFA/, "FCFA");
  } catch { return `${amount} ${currency}`; }
};

function inferCategory(b: Brief): CategoryKey {
  if (b.category) return b.category;
  const hay = `${b.portrait_tag ?? ""} ${Object.values(b.copy).flatMap((c) => c.services.map((g) => g.title)).join(" ")}`.toLowerCase();
  const hasServices = Object.values(b.copy).some((c) => c.services.some((g) => g.items.length));
  const products = b.products ?? [];
  if (!hasServices && products.length) return products.every((p) => p.kind === "digital") ? "training" : "shop";
  if (/(barber|barbier|coupe homme)/.test(hay) || b.schema_type === "Barber") return "barber";
  if (/(ongle|nail|manucure)/.test(hay) || b.schema_type === "NailSalon") return "nails";
  if (/(maquill|makeup|make-up)/.test(hay)) return "makeup";
  if (/(massage|spa|bien-être|wellness|corps)/.test(hay)) return "spa";
  if (/(soin|peau|skin|facial|cil|sourcil|lash|brow|épil)/.test(hay)) return "skin";
  return "hair";
}

function schemaTypeFor(category: CategoryKey, given?: Brief["schema_type"]): SiteContent["brand"]["schemaType"] {
  if (given) return given;
  return ({ hair: "HairSalon", barber: "Barber", nails: "NailSalon", makeup: "BeautySalon", skin: "BeautySalon", spa: "DaySpa", institut: "BeautySalon", shop: "Store", training: "EducationalOrganization" } as const)[category];
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme: template palette + brand accent, contrast-checked
// ─────────────────────────────────────────────────────────────────────────────

function resolveTheme(b: Brief, template: TemplateKey): ThemeTokens {
  const meta = TEMPLATES[template];
  const p = { ...meta.palette };
  const brand = (b.theme?.brand_colors ?? []).map(normalizeHex).filter(Boolean) as string[];
  const legacy = b.theme?.colors?.accent ?? b.theme?.colors?.copper;
  const accentIn = brand[0] ?? (legacy && normalizeHex(legacy)) ?? null;
  if (accentIn) {
    // Her colour as the accent: readable as text on the page and the cards,
    // and as a button background under its own text.
    let accent = ensureContrast(accentIn, p.bg, 4.5);
    accent = ensureContrast(accent, p.surface, 4.5);
    accent = ensureContrast(accent, p.surface2, 4.5);
    const moved = contrast(accent, accentIn) > 1.6;
    if (moved) warn(`brand colour ${accentIn} adjusted to ${accent} for readability on ${template}`);
    p.accent = accent;
    p.accentFg = onColor(accent);
    p.accentSoft = softOf(accent, p.bg);
    // A dark hero can take her second colour when it is dark enough.
    const second = brand[1];
    if (second && meta.scheme === "light" && luminance(p.heroBg) < 0.2 && luminance(second) < 0.12) {
      p.heroBg = second;
      p.heroFg = onColor(second);
      p.heroMuted = mix(second, p.heroFg, 0.7);
    }
  }
  // Final guard on every text/background pair (template palettes pass; brand overrides are forced to).
  p.fg = ensureContrast(p.fg, p.bg, 7);
  p.mutedFg = ensureContrast(p.mutedFg, p.bg, 4.5);
  p.mutedFg = ensureContrast(p.mutedFg, p.surface2, 4.5);
  p.accentFg = contrast(p.accentFg, p.accent) >= 4.5 ? p.accentFg : onColor(p.accent);
  p.heroFg = ensureContrast(p.heroFg, p.heroBg, 7);
  p.heroMuted = ensureContrast(p.heroMuted, p.heroBg, 4.5);
  const display = FONTS[meta.fonts.display], body = FONTS[meta.fonts.body];
  const families = [display.axis, ...(body.family !== display.family ? [body.axis] : [])].map((a) => `family=${a}`).join("&");
  return {
    bg: p.bg, fg: p.fg, surface: p.surface, surface2: p.surface2, mutedFg: p.mutedFg, border: p.border,
    accent: p.accent, accentFg: p.accentFg, accentSoft: p.accentSoft,
    heroBg: p.heroBg, heroFg: p.heroFg, heroMuted: p.heroMuted,
    fontDisplay: display.stack, fontBody: body.stack,
    googleFontsUrl: `https://fonts.googleapis.com/css2?${families}&display=swap`,
    radius: meta.radius,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Assemble SiteContent
// ─────────────────────────────────────────────────────────────────────────────

function buildStructuredData(b: Brief, c: SiteContent, host: string): string {
  const ct = b.contact;
  const lang = c.brand.defaultLang;
  const hours = (b.hours ?? []).filter((h) => h.ranges.length).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][h.day],
    opens: h.ranges[0][0], closes: h.ranges[h.ranges.length - 1][1],
  }));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": c.brand.schemaType,
    name: b.brand_name,
    description: c.seo[lang].description,
    url: `https://${host}`,
    telephone: ct.phone_tel || undefined,
    email: ct.email || undefined,
    address: ct.address ? { "@type": "PostalAddress", streetAddress: ct.address, addressLocality: ct.city, postalCode: ct.postal_code ?? "" } : undefined,
    image: b.logo_url || b.images.hero_url || undefined,
    logo: b.logo_url || undefined,
    sameAs: [ct.instagram, ct.tiktok, ct.facebook, ct.snapchat].filter(Boolean),
    founder: { "@type": "Person", name: b.professional_name },
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(c.blocks.reviewsSummary ? { aggregateRating: { "@type": "AggregateRating", ratingValue: c.blocks.reviewsSummary.average, reviewCount: c.blocks.reviewsSummary.count } } : {}),
  });
}

function assemble(b: Brief, host: string, template: TemplateKey, category: CategoryKey, files: SiteContent["assets"]) {
  const langs = (b.langs?.length ? b.langs : ["fr"]) as Lang[];
  const defaultLang = (b.default_lang && langs.includes(b.default_lang) ? b.default_lang : langs[0]) as Lang;
  const firstName = clean(b.first_name ?? b.professional_name.trim().split(/\s+/)[0]);
  const displayParts = b.display_parts ?? deriveDisplayParts(b.brand_name);
  const theme = resolveTheme(b, template);
  const region = clean(b.contact.region ?? [b.contact.postal_code, b.contact.city].filter(Boolean).join(" "));
  const mode: Mode = b.contact.mode ?? "salon";
  const bookingSlug = b.booking_slug ?? (b.booking_url?.match(/book\.sobeauty\.business\/([^/?#]+)/)?.[1] ?? "");
  const bookingUrl = b.booking_url ?? (bookingSlug ? `https://book.${BASE_DOMAIN}/${bookingSlug}` : "");
  if (!bookingUrl) die("booking_url (or booking_slug) is required: every button books on her page");
  const whatsappDigits = (b.whatsapp ?? "").replace(/\D/g, "");
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : "";
  const products: Product[] = (b.products ?? []).map((p) => ({
    id: p.id, name: clean(p.name), desc: clean(p.description), price: money(Number(p.price_amount), p.currency, defaultLang),
    image: p.image_url || p.image_urls?.[0] || "", images: (p.image_urls?.length ? p.image_urls : p.image_url ? [p.image_url] : []).filter(Boolean),
    kind: p.kind === "digital" ? "digital" : "physical", inStock: p.in_stock !== false, url: b.shop_url || bookingUrl,
  }));
  const team: TeamMember[] = (b.team ?? []).map((m) => ({
    name: clean(m.name), photo: m.photo_url || "", owner: !!m.owner,
    role: Object.fromEntries(langs.map((l) => [l, clean(b.copy[l]?.team_roles?.[m.name] ?? "")]).filter(([, v]) => v)),
    services: m.services ?? {},
    bookUrl: m.share_code ? `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}c=${encodeURIComponent(m.share_code)}` : bookingUrl,
  }));
  const reviews: Review[] = (b.reviews ?? []).map((r) => ({ author: clean(r.author), text: clean(r.text), rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))), service: clean(r.service), date: r.date ?? "" }))
    .filter((r) => r.text.length > 12);
  const hours: DayHours[] = (b.hours ?? []).filter((h) => Number.isInteger(h.day) && h.day >= 0 && h.day <= 6);
  const summary = b.reviews_summary && b.reviews_summary.count >= 3 ? { average: Math.round(Number(b.reviews_summary.average) * 10) / 10, count: Number(b.reviews_summary.count) } : null;

  const i18n = {} as Record<Lang, PageCopy>;
  const services = {} as SiteContent["services"];
  const contactPage = {} as SiteContent["contactPage"];
  const pages = {} as SiteContent["pages"];
  const seo = {} as SiteContent["seo"];
  const seoPages = {} as SiteContent["seoPages"];

  for (const lang of langs) {
    const L = LABELS[lang];
    const c = b.copy[lang];
    if (!c) die(`brief.copy missing language "${lang}"`);
    const salonVoice = b.about_mode === "salon" || (b.about_mode !== "her" && (/^l'équipe|^the team|^notre|^our/i.test(c.about.sign ?? "") || team.length > 1));
    const highlights = c.highlights.map((h) => ({ title: clean(h.title), desc: clean(h.desc) })).filter((h) => h.title && h.desc).slice(0, 4);
    const menu: ServiceGroup[] = c.services.map((g) => ({ title: clean(g.title), items: g.items.map((it) => ({ name: clean(it.name), duration: clean(it.duration), price: clean(it.price), ...(it.notes ? { notes: clean(it.notes) } : {}), ...(it.image ? { image: it.image } : {}) })).filter((it) => it.name && it.price) })).filter((g) => g.title && g.items.length);
    // Highlights never empty when there is a menu: derive from the first groups.
    const fallbackHighlights = menu.slice(0, 3).map((g) => ({ title: g.title, desc: g.items.slice(0, 3).map((i) => i.name).join(", ") + "." }));
    const stats: { value: string; label: string }[] = [];
    if (b.years_experience && b.years_experience > 0) stats.push({ value: `${b.years_experience}+`, label: L.stats.years });
    if (summary) { stats.push({ value: `${summary.average.toFixed(1).replace(/\.0$/, "")}/5`, label: L.stats.rating }); stats.push({ value: `${summary.count}`, label: L.stats.reviews }); }
    const faq = (c.faq ?? []).map((f) => ({ q: clean(f.q), a: clean(f.a) })).filter((f) => f.q && f.a).slice(0, 8);
    const heroDesc = required(`copy.${lang}.hero.desc`, clean(c.hero.desc));
    const aboutDesc = required(`copy.${lang}.about.desc`, clean(c.about.desc));
    const pillars = c.pillars.map((p) => ({ label: clean(p.label), text: clean(p.text) })).filter((p) => p.label && p.text).slice(0, 3);

    i18n[lang] = {
      nav: { home: L.sub.home, ...L.nav },
      hero: {
        eyebrow: clean(`${b.brand_name}${b.contact.city ? ` · ${b.contact.city}` : ""}`),
        title1: required(`copy.${lang}.hero.title1`, clean(c.hero.title1)), title2: clean(c.hero.title2), title3: tail(c.hero.title3, lang), desc: heroDesc,
        bookNow: L.hero.bookNow, discover: L.hero.discover,
        location: clean([b.contact.city, b.contact.postal_code].filter(Boolean).join(" · ")),
        portraitTag: clean(b.portrait_tag), portraitName: salonVoice ? "" : firstName,
        leadService: clean(c.hero.lead_service),
      },
      services: { tag: L.services.tag, title1: L.services.title1, title2: L.services.title2, title3: L.services.title3, seeAll: L.services.seeAll, more: L.services.more, from: L.services.from, duration: L.services.duration, items: highlights.length ? highlights : fallbackHighlights },
      about: {
        tag: L.about.tag, title1: salonVoice ? L.about.teamTitle1 : L.about.title1, title2: clean(c.about.title2) || (salonVoice ? b.brand_name : firstName), title3: L.about.title3,
        desc: aboutDesc, bullets: cleanList(c.about.bullets).slice(0, 3), sign: clean(c.about.sign), cta: L.about.cta,
        experienceValue: b.years_experience ? String(b.years_experience) : "", experience: L.about.experience,
      },
      pillars: { ...L.pillars, items: pillars },
      reviews: L.reviews,
      team: L.team,
      gallery: L.gallery,
      faq: { ...L.faq, items: faq },
      hours: L.hours,
      products: L.products,
      programmes: L.programmes,
      cta: { title1: clean(c.cta?.title1) || L.cta.title1, title2: clean(c.cta?.title2) || L.cta.title2, title3: c.cta?.title3?.trim() ? tail(c.cta.title3, lang) : L.cta.title3, desc: clean(c.cta?.desc), bookNow: L.cta.bookNow, whatsapp: L.cta.whatsapp },
      offer: clean(c.offer),
      stats,
      marquee: cleanList(c.marquee).slice(0, 8),
      footer: { tagline: clean(c.footerTagline), ...L.footer },
      location: { city: clean(b.contact.city), region, hint: clean(b.contact.location_hint), directions: L.location.directions },
    };
    for (const [k, v] of Object.entries({ ...i18n[lang].hero, ...i18n[lang].about, tagline: i18n[lang].footer.tagline, offer: i18n[lang].offer })) if (typeof v === "string") assertClean(`copy.${lang}.${k}`, v);
    services[lang] = menu;
    contactPage[lang] = { intro: clean(c.contact?.intro), policy: cleanList(c.contact?.policy).slice(0, 4), ...(c.contact?.note ? { note: clean(c.contact.note) } : {}) };
    seo[lang] = b.seo?.[lang] ? { title: clean(b.seo[lang]!.title), description: clean(b.seo[lang]!.description) } : { title: `${b.brand_name}${b.contact.city ? ` · ${b.contact.city}` : ""}`, description: heroDesc.slice(0, 160) };
    const infoParts = [L.modeInfo[mode], b.contact.location_hint ? `${clean(b.contact.location_hint)}.` : ""].filter(Boolean);
    const socialNames = [b.contact.instagram && "Instagram", b.contact.tiktok && "TikTok", b.contact.facebook && "Facebook", b.contact.snapchat && "Snapchat"].filter(Boolean) as string[];
    pages[lang] = {
      navHome: L.sub.home,
      services: { eyebrow: L.sub.svcEyebrow, titleAccent: L.sub.svcTitleAccent, subtitle: L.sub.svcSubtitle, infoTitle: L.sub.svcInfoTitle, infoText: infoParts.join(" "), depositLine: b.deposit_percent ? L.deposit(b.deposit_percent) : "" },
      contact: {
        heroTitle: L.sub.ctHeroTitle, heroAccent: L.sub.ctHeroAccent, ctaLabel: L.sub.ctCta,
        labelPhone: L.sub.ctLabelPhone, labelEmail: L.sub.ctLabelEmail, labelAddress: L.sub.ctLabelAddress, labelWhatsapp: L.sub.ctLabelWhatsapp,
        socialsLine: socialNames.length ? `${socialNames.join(" · ")}${L.socialsTail}` : "", policyTitle: L.sub.ctPolicyTitle, signature: salonVoice ? `L'équipe ${b.brand_name}`.replace(/^L'équipe/, lang === "en" ? "The team at" : "L'équipe") : firstName,
      },
    };
    seoPages[lang] = {
      services: { title: `${b.brand_name} · ${L.sub.menuWord}`, description: L.sub.svcSubtitle },
      contact: { title: `${b.brand_name} · ${L.nav.contact}`, description: contactPage[lang].intro || heroDesc.slice(0, 160) },
    };
  }

  const mapsUrl = b.contact.maps_url || (b.contact.address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.contact.address)}` : "");
  const content: SiteContent = {
    template, category,
    brand: {
      name: clean(b.brand_name), displayParts, initial: b.brand_name.trim()[0].toUpperCase(), slug: b.slug,
      logoUrl: b.logo_url ?? "", bookingUrl, shopUrl: b.shop_url ?? (products.length ? `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}tab=boutique` : ""),
      whatsappUrl, schemaType: schemaTypeFor(category, b.schema_type), defaultLang, langs,
    },
    contact: {
      phoneHuman: clean(b.contact.phone_human), phoneTel: (b.contact.phone_tel ?? "").replace(/[^\d+]/g, ""), email: clean(b.contact.email),
      address: clean(b.contact.address), city: clean(b.contact.city), region, locationHint: clean(b.contact.location_hint), mapsUrl,
      socials: { instagram: b.contact.instagram || undefined, tiktok: b.contact.tiktok || undefined, facebook: b.contact.facebook || undefined, snapchat: b.contact.snapchat || undefined },
      mode,
    },
    live: { enabled: b.live !== false && !!bookingSlug, apiBase: API_BASE, slug: bookingSlug },
    theme,
    assets: files,
    blocks: { team, products, reviews, reviewsSummary: summary, hours, galleryUrls: (b.images.gallery_urls ?? []).filter(Boolean) },
    credit: { ...CREDIT, logoUrl: b.credit_logo_url ?? CREDIT.logoUrl },
    cfAnalyticsToken: b.cf_analytics_token ?? "",
    i18n, services, contactPage, pages, seo, seoPages,
    structuredData: "",
  };
  content.structuredData = buildStructuredData(b, content, host);
  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
// Images
// ─────────────────────────────────────────────────────────────────────────────

function extFromType(ct: string | null, url: string): string {
  const t = (ct ?? "").toLowerCase();
  if (t.includes("webp")) return "webp";
  if (t.includes("png")) return "png";
  if (t.includes("avif")) return "avif";
  if (t.includes("jpeg") || t.includes("jpg")) return "jpg";
  const m = url.split("?")[0].match(/\.(webp|png|avif|jpe?g)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

/** Download into src/assets as `<base>.<real-ext>`; "" when the image cannot be fetched (the block then hides). */
async function download(url: string, dir: string, base: string, must = false): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type");
    if (ct && !/image\//.test(ct)) throw new Error(`not an image (${ct})`);
    const file = `${base}.${extFromType(ct, url)}`;
    writeFileSync(join(dir, "src/assets", file), Buffer.from(await res.arrayBuffer()));
    console.log(`   ↓ ${base} → ${file}`);
    return file;
  } catch (e) {
    if (must) die(`failed to download ${url}: ${(e as Error).message}`);
    warn(`image skipped ${base}: ${(e as Error).message}`);
    return "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const briefPath = argv[0];
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const outIdx = argv.indexOf("--out");
const outDir = outIdx >= 0 ? argv[outIdx + 1] : null;
if (!briefPath) die("Usage: bun scripts/build-from-brief.ts <brief.json> [--build] [--deploy] [--preview] [--out <dir>]");

const brief: Brief = JSON.parse(readFileSync(briefPath, "utf-8"));
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(brief.slug ?? "")) die(`slug "${brief.slug}" must be kebab-case`);
const category = inferCategory(brief);
const template: TemplateKey = isTemplateKey(brief.template) ? brief.template : DEFAULT_TEMPLATE[category];

const preview = flags.has("--preview");
const host = preview ? `${brief.slug}-preview.${BASE_DOMAIN}` : `${brief.slug}.${BASE_DOMAIN}`;
const dir = outDir ? (outDir.startsWith("/") ? outDir : join(process.cwd(), outDir)) : join(REPO, brief.slug);

console.log(`\n🏗  Building ${brief.brand_name} → ${host}  [${template} · ${category}]\n`);

// 1. materialise the client folder from the template (always refresh the code,
//    keep the folder's downloaded assets out of the copy)
mkdirSync(dir, { recursive: true });
// Bun's cpSync keeps files that already exist: wipe the code so a rebuilt folder
// (committed client sites, demos) always carries the current layouts.
rmSync(join(dir, "src"), { recursive: true, force: true });
rmSync(join(dir, "public"), { recursive: true, force: true });
cpSync(TEMPLATE, dir, { recursive: true, force: true, filter: (s) => !/\/(node_modules|dist|\.wrangler)(\/|$)/.test(s) && !/\/src\/assets\/[^/]+\.(jpe?g|png|webp|avif)$/.test(s) });
mkdirSync(join(dir, "src/assets"), { recursive: true });
// Registry + schema come from _schema (single source).
writeFileSync(join(dir, "src/site-content.ts"), readFileSync(join(REPO, "_schema/site-content.ts"), "utf-8"));
writeFileSync(join(dir, "src/layouts/registry.ts"), readFileSync(join(REPO, "_schema/templates.ts"), "utf-8").replace('from "./site-content"', 'from "../site-content"'));
console.log(`   • materialised ${dir}`);

// 2. images (real format kept); the barrel exports "" for what is absent
console.log(`   • assets`);
const files: SiteContent["assets"] = { hero: "", about: "", svc: [], gallery: [] };
if (brief.images.hero_url) files.hero = await download(brief.images.hero_url, dir, "hero");
const aboutUrl = brief.owner_photo_url ?? brief.images.about_url;
if (aboutUrl) files.about = await download(aboutUrl, dir, "about");
for (const [i, u] of (brief.images.svc_urls ?? []).slice(0, 4).entries()) files.svc.push(await download(u, dir, `svc-${i + 1}`));
for (const [i, u] of (brief.images.gallery_urls ?? []).slice(0, 12).entries()) files.gallery.push(await download(u, dir, `g-${i + 1}`));
files.svc = files.svc.filter(Boolean);
files.gallery = files.gallery.filter(Boolean);
const imp = (name: string, file: string) => (file ? `import ${name} from "./${file}";\n` : "");
const svcNames = files.svc.map((_, i) => `svc${i + 1}Img`);
const galNames = files.gallery.map((_, i) => `g${i + 1}Img`);
writeFileSync(join(dir, "src/assets/generated-images.ts"),
  `// GENERATED by build-from-brief.ts — do not edit by hand.\n` +
  imp("heroImgFile", files.hero) + imp("aboutImgFile", files.about) +
  files.svc.map((f, i) => imp(svcNames[i], f)).join("") + files.gallery.map((f, i) => imp(galNames[i], f)).join("") +
  `\nexport const heroImg: string = ${files.hero ? "heroImgFile" : '""'};\n` +
  `export const aboutImg: string = ${files.about ? "aboutImgFile" : '""'};\n` +
  `export const svcImgs: string[] = [${svcNames.join(", ")}];\n` +
  `export const galleryImgs: string[] = [${galNames.join(", ")}];\n`);

// 3. content.ts + layout.ts
const content = assemble(brief, host, template, category, files);
writeFileSync(join(dir, "src/content.ts"),
  `// GENERATED by build-from-brief.ts — do not edit by hand.\n` +
  `import type { SiteContent } from "./site-content";\n\n` +
  `const content: SiteContent = ${JSON.stringify(content, null, 2)};\n\nexport default content;\n`);
writeFileSync(join(dir, "src/layout.ts"),
  `// GENERATED by build-from-brief.ts — do not edit by hand.\n// Re-exports the chosen layout so the bundle only carries that one.\nexport { default } from "./layouts/${template}";\n`);
console.log(`   • wrote src/content.ts + src/layout.ts (${template})`);

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
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" style="fill:${content.theme.accent}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="40" font-weight="600" fill="${content.theme.accentFg}">${content.brand.initial}</text></svg>`;
writeFileSync(join(dir, "public/favicon.svg"), fav);

// 6. a quality summary (what the page will show)
const d = content.blocks;
console.log(`\n   blocks: menu ${content.services[content.brand.defaultLang].reduce((n, g) => n + g.items.length, 0)} · team ${d.team.length} · products ${d.products.length} · reviews ${d.reviews.length} · hours ${d.hours.length ? "yes" : "no"} · gallery ${files.gallery.length} · faq ${content.i18n[content.brand.defaultLang].faq.items.length} · stats ${content.i18n[content.brand.defaultLang].stats.length}`);
console.log(`   tokens: accent ${content.theme.accent} on bg ${content.theme.bg} = ${contrast(content.theme.accent, content.theme.bg).toFixed(1)}:1 · hero ${contrast(content.theme.heroFg, content.theme.heroBg).toFixed(1)}:1`);
console.log(`\n✅  Files written to ${dir}`);

// 7. optional build / deploy
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
