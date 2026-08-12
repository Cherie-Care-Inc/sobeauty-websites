/**
 * SiteContent — the single content contract every data-driven template consumes.
 *
 * This is the ONLY file `build-from-brief.ts` generates per client (as
 * `src/content.ts`). The template's route files (`index.tsx`, `services.tsx`,
 * `contact.tsx`, `__root.tsx`) import the generated object and render it —
 * they contain NO hardcoded brand strings, copy, colors or fonts.
 *
 * Two layers feed this:
 *   • the edge `website` agent writes the PROSE (hero/about/marquee/pillars,
 *     service descriptions) into the brief, per language;
 *   • `build-from-brief.ts` does the DETERMINISTIC assembly (OKLCH palette,
 *     font stack + Google Fonts URL, SEO strings, structural labels) and emits
 *     this object.
 *
 * Keep this type stable: adding a new template means writing a new layout that
 * consumes THIS shape, not inventing a new one.
 */

export type Lang = "fr" | "en";

/** Per-language narrative + labels for the homepage. */
export interface PageCopy {
  nav: { home: string; services: string; about: string; menu: string; contact: string; book: string };
  hero: {
    eyebrow: string;        // "Maison Prodige Beauty · Chevilly-Larue"
    title1: string;         // "Sublimez"
    title2: string;         // "votre beauté"   (gets the gradient/italic treatment)
    title3: string;         // " avec soin."
    desc: string;
    bookNow: string;
    discover: string;
    happy: string;          // "Clientes ravies"
    location: string;       // "Chevilly-Larue · 94550"
    portraitTag: string;    // "Coiffeuse · Tresses"
    portraitName: string;   // "Fally"
  };
  services: {
    tag: string;
    title1: string; title2: string; title3: string;
    seeAll: string;
    more: string;
    /** 3 homepage highlight cards (not the full menu). */
    items: { title: string; desc: string }[];
  };
  about: {
    tag: string;
    title1: string; title2: string; title3: string;
    desc: string;
    bullets: string[];      // 3 qualities
    sign: string;           // handwritten signature line
    cta: string;
    experienceValue: string; // "7"  (the big badge number; "" hides the tile)
    experience: string;      // "ans d'expérience"
  };
  testimonials: {
    tag: string;
    title1: string; title2: string; title3: string;
    /** 3 trust pillars (used in place of real reviews). */
    items: { label: string; text: string }[];
  };
  cta: { title1: string; title2: string; title3: string; desc: string; bookNow: string };
  marquee: string[];
  footer: { tagline: string; contact: string; follow: string; policy: string; rights: string };
  /** About-section location tile. */
  location: { city: string; region: string; hint: string };
}

/** One priced group on the /services menu page. */
export interface ServiceGroup {
  title: string;
  items: { name: string; duration: string; price: string; notes?: string }[];
}

/** The /contact page extras, per language. */
export interface ContactPageCopy {
  intro: string;
  /** 3–4 cancellation-policy bullets. */
  policy: string[];
  /** Optional "Bon à savoir" note (travel, deposit, languages). */
  note?: string;
}

/**
 * Sub-page chrome (/, /services, /contact headers + card labels). This is all
 * STRUCTURAL — the build script fills it from label dictionaries + derivation,
 * the LLM never writes it. Keeps the sub-page route files brand-string free.
 */
export interface SubPageChrome {
  navHome: string;
  services: {
    eyebrow: string; titleAccent: string; subtitle: string;
    infoTitle: string; infoText: string; depositLine: string;
  };
  contact: {
    heroTitle: string; heroAccent: string; ctaLabel: string;
    labelPhone: string; labelEmail: string; labelAddress: string;
    socialsLine: string; policyTitle: string; signature: string;
  };
}

export interface SiteContent {
  /** Identity / routing — language-neutral. */
  brand: {
    name: string;                 // "Maison Prodige Beauty"
    /** Wordmark split for the logo fallback: ["Maison", "Prodige"]; use [name, ""] for no split. */
    displayParts: [string, string];
    initial: string;              // "M" — favicon + fallbacks
    slug: string;                 // "maison-prodige"
    logoUrl: string;              // "" => render the wordmark fallback
    bookingUrl: string;
    schemaType: "HairSalon" | "BeautySalon" | "NailSalon" | "Barber";
    defaultLang: Lang;
    langs: Lang[];                // ["fr"] or ["fr","en"]
  };

  contact: {
    phoneHuman: string;           // "06 68 12 58 66"
    phoneTel: string;             // "+33668125866"
    email: string;
    address: string;              // one-line
    city: string;
    region: string;               // "94550 Val-de-Marne"
    locationHint: string;         // "20 min Paris"  ("" hides it)
    socials: { instagram?: string; tiktok?: string; facebook?: string };
    mode: "salon" | "home" | "mobile";
  };

  /** Brand look — injected as CSS custom properties at runtime (no styles.css edit). */
  theme: {
    copper: string;               // "oklch(0.72 0.12 75)"
    copperGlow: string;
    espresso: string;
    cream: string;
    heroMid: string;              // mid stop of --gradient-hero
    fontDisplayStack: string;     // "'Fraunces', Georgia, serif"
    googleFontsUrl: string;       // full <link href> for the display + signature + Inter fonts
  };

  /** Asset filenames placed in src/assets by the build script. */
  assets: {
    hero: string;                 // "hero.jpg"
    about: string;                // "about.jpg"
    svc1: string; svc2: string; svc3: string;
    heroVideo?: string;           // "hero.mp4" in /public, if present
    flower: string;               // decorative, usually "flower.png"
  };

  /** Optional analytics beacon token. */
  cfAnalyticsToken?: string;

  /** Narrative + labels, per language. */
  i18n: Record<Lang, PageCopy>;
  /** Full priced menu, per language. */
  services: Record<Lang, ServiceGroup[]>;
  /** Contact page extras, per language. */
  contactPage: Record<Lang, ContactPageCopy>;
  /** Sub-page structural chrome, per language. */
  pages: Record<Lang, SubPageChrome>;
  /** Homepage SEO title/description, per language. */
  seo: Record<Lang, { title: string; description: string }>;
  /** Per-sub-page SEO, per language. */
  seoPages: Record<Lang, { services: { title: string; description: string }; contact: { title: string; description: string } }>;
  /** schema.org LocalBusiness JSON-LD, prebuilt string. */
  structuredData: string;
}
