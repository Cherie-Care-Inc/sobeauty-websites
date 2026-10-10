/**
 * SiteContent v2 — the single content contract every layout consumes.
 *
 * One generated file per client (`src/content.ts`) feeds every template: the
 * layout chosen (`template`) only changes HOW the same data is presented.
 *
 * Two layers feed this:
 *   • the edge `website` agent writes the PROSE (hero/about/highlights/faq…)
 *     into the brief, per language, and collects the FACTS (menu, team,
 *     products, reviews, hours, photos) from the member's app data;
 *   • `scripts/build-from-brief.ts` does the deterministic assembly (tokens,
 *     fonts, SEO, JSON-LD, quality checks) and emits this object.
 *
 * Rules every layout follows (founder, 10/10/2026):
 *   • a block renders ONLY when its data exists: no placeholder, no empty
 *     frame, no lorem, no fake counter;
 *   • the page must still look complete with the minimum set: hero, about,
 *     menu (or products), contact, footer;
 *   • facts (menu, products, team, reviews) are refreshed LIVE from the
 *     member's public page at request time (`live`), the snapshot here is
 *     the fallback;
 *   • everything paints immediately (no scroll-gated content);
 *   • the footer carries the SoBeauty credit (`credit`).
 */

export type Lang = "fr" | "en";

export type TemplateKey =
  | "atelier" | "editorial-dark" | "studio-team"
  | "gold-barber" | "clean-barber"
  | "rose-nails"
  | "portfolio-noir"
  | "glow"
  | "sanctuary" | "sand"
  | "brand-shop"
  | "academy";

export type CategoryKey =
  | "hair" | "barber" | "nails" | "makeup" | "skin" | "spa" | "institut" | "shop" | "training";

/** Resolved design tokens, injected as CSS custom properties on :root. All colours are hex. */
export interface ThemeTokens {
  bg: string;            // page background
  fg: string;            // body text on bg
  surface: string;       // cards
  surface2: string;      // alternate band / muted background
  mutedFg: string;       // secondary text on bg/surface (≥ 4.5:1)
  border: string;
  accent: string;        // brand accent (buttons, highlights)
  accentFg: string;      // text on accent (≥ 4.5:1)
  accentSoft: string;    // tinted background derived from accent
  heroBg: string;        // hero / dark band background
  heroFg: string;        // text on heroBg (≥ 4.5:1)
  heroMuted: string;     // secondary text on heroBg
  fontDisplay: string;   // CSS stack
  fontBody: string;      // CSS stack
  googleFontsUrl: string;
  radius: string;        // "1.5rem" | "0.5rem" | "0"
}

/** Per-language narrative + labels for the homepage. */
export interface PageCopy {
  nav: { home: string; services: string; about: string; menu: string; contact: string; book: string; shop: string; team: string; gallery: string; faq: string; programmes: string };
  hero: {
    eyebrow: string;        // "Maison Prodige Beauty · Chevilly-Larue"
    title1: string;         // "Sublimez"
    title2: string;         // "votre beauté"   (the accented middle)
    title3: string;         // " avec soin."
    desc: string;
    bookNow: string;
    discover: string;
    location: string;       // "Chevilly-Larue · 94550"
    portraitTag: string;    // "Coiffeuse · Tresses"
    portraitName: string;   // "Fally"
    /** Most-booked / lead service chip. "" hides it. */
    leadService: string;
  };
  services: {
    tag: string;
    title1: string; title2: string; title3: string;
    seeAll: string;
    more: string;
    from: string;           // "dès" / "from"
    duration: string;       // "durée" / "duration"
    /** 3–4 homepage highlight cards (not the full menu). */
    items: { title: string; desc: string }[];
  };
  about: {
    tag: string;
    title1: string; title2: string; title3: string;
    desc: string;
    bullets: string[];      // 3 qualities
    sign: string;           // signature line
    cta: string;
    experienceValue: string; // "7"  (the badge number; "" hides the tile)
    experience: string;      // "ans d'expérience"
  };
  pillars: {
    tag: string;
    title1: string; title2: string; title3: string;
    /** 3 trust pillars (used when there are no real reviews). */
    items: { label: string; text: string }[];
  };
  reviews: { tag: string; title: string; count: string; basedOn: string };
  team: { tag: string; title: string; bookWith: string; owner: string; allServices: string };
  gallery: { tag: string; title: string };
  faq: { tag: string; title: string; items: { q: string; a: string }[] };
  hours: { tag: string; title: string; closed: string; days: [string, string, string, string, string, string, string]; today: string };
  products: { tag: string; title: string; order: string; outOfStock: string; digital: string; physical: string; seeAll: string };
  programmes: { tag: string; title: string; enrol: string; includes: string };
  cta: { title1: string; title2: string; title3: string; desc: string; bookNow: string; whatsapp: string };
  /** Short promotion banner. "" hides it. */
  offer: string;
  /** Real figures only (years of experience, rating). Empty array hides the block. */
  stats: { value: string; label: string }[];
  marquee: string[];
  footer: { tagline: string; contact: string; follow: string; policy: string; rights: string; madeBy: string };
  /** About-section location tile. */
  location: { city: string; region: string; hint: string; directions: string };
}

/** One priced group on the /services menu page. */
export interface ServiceGroup {
  title: string;
  items: { name: string; duration: string; price: string; notes?: string; image?: string }[];
}

/** The /contact page extras, per language. */
export interface ContactPageCopy {
  intro: string;
  /** 2–4 cancellation-policy bullets. */
  policy: string[];
  /** Optional "Bon à savoir" note (travel, deposit, languages). */
  note?: string;
}

/**
 * Sub-page chrome (/services, /contact headers + card labels). Structural:
 * the build script fills it from label dictionaries, the LLM never writes it.
 */
export interface SubPageChrome {
  navHome: string;
  services: {
    eyebrow: string; titleAccent: string; subtitle: string;
    infoTitle: string; infoText: string; depositLine: string;
  };
  contact: {
    heroTitle: string; heroAccent: string; ctaLabel: string;
    labelPhone: string; labelEmail: string; labelAddress: string; labelWhatsapp: string;
    socialsLine: string; policyTitle: string; signature: string;
  };
}

export interface TeamMember {
  name: string;
  photo: string;                       // "" => initials avatar
  owner: boolean;
  /** "Fondatrice · Tresses" per language; "" => role hidden. */
  role: Partial<Record<Lang, string>>;
  /** Labels of what she performs, per language (empty => performs all). */
  services: Partial<Record<Lang, string[]>>;
  /** Booking link preselecting her (?c=code). */
  bookUrl: string;
}

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;                       // formatted "12 000 FCFA"
  image: string;                       // cover; "" => text card
  images: string[];
  kind: "physical" | "digital";
  inStock: boolean;
  /** Where ordering happens (the member's booking page, shop tab). */
  url: string;
}

export interface Review {
  author: string;
  text: string;
  rating: number;                      // 1–5
  service: string;                     // "" if unknown
  date: string;                        // ISO date or ""
}

/** Opening hours, language-neutral. day: 0 = Monday … 6 = Sunday. */
export interface DayHours { day: number; ranges: [string, string][] }

export interface SiteContent {
  template: TemplateKey;
  category: CategoryKey;

  /** Identity / routing — language-neutral. */
  brand: {
    name: string;                 // "Maison Prodige Beauty"
    displayParts: [string, string];
    initial: string;              // "M"
    slug: string;                 // site slug (brand name)
    logoUrl: string;              // "" => wordmark fallback
    bookingUrl: string;           // https://book.sobeauty.business/<booking-slug>
    shopUrl: string;              // booking page, shop tab ("" when no products)
    whatsappUrl: string;          // https://wa.me/<digits> ("" when no number)
    schemaType: "HairSalon" | "BeautySalon" | "NailSalon" | "Barber" | "DaySpa" | "Store" | "EducationalOrganization";
    defaultLang: Lang;
    langs: Lang[];
  };

  contact: {
    phoneHuman: string;
    phoneTel: string;
    email: string;
    address: string;              // one-line ("" hides address tiles)
    city: string;
    region: string;
    locationHint: string;
    mapsUrl: string;              // directions link ("" hides)
    socials: { instagram?: string; tiktok?: string; facebook?: string; snapchat?: string };
    mode: "salon" | "home" | "mobile";
  };

  /** Live refresh of the facts from the member's public page. */
  live: {
    enabled: boolean;
    apiBase: string;              // "https://api.cherie.care/functions/v1"
    slug: string;                 // booking slug
  };

  theme: ThemeTokens;

  /** Asset filenames placed in src/assets by the build script ("" when absent). */
  assets: {
    hero: string;
    about: string;
    svc: string[];                // up to 4, aligned with services.items
    gallery: string[];            // up to 12 local files
  };

  /** Language-neutral facts (snapshot; refreshed live when `live.enabled`). */
  blocks: {
    team: TeamMember[];
    products: Product[];
    reviews: Review[];
    reviewsSummary: { average: number; count: number } | null;
    hours: DayHours[];            // [] hides the block
    galleryUrls: string[];        // remote originals (for lightbox / fallback)
  };

  credit: { label: string; url: string; logoUrl: string };

  cfAnalyticsToken?: string;

  i18n: Record<Lang, PageCopy>;
  services: Record<Lang, ServiceGroup[]>;
  contactPage: Record<Lang, ContactPageCopy>;
  pages: Record<Lang, SubPageChrome>;
  seo: Record<Lang, { title: string; description: string }>;
  seoPages: Record<Lang, { services: { title: string; description: string }; contact: { title: string; description: string } }>;
  structuredData: string;
}
