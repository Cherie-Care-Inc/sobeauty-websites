/**
 * Live facts from the member's public page (book.sobeauty.business/<slug>).
 *
 * Runs on the server only (called from a server function in __root.tsx), with
 * a short edge cache, and degrades to the build-time snapshot on any failure.
 * The public endpoint needs no key (`professional?action=get-public-profile`).
 */

import type { Lang, Product, Review, ServiceGroup, SiteContent, TeamMember } from "../site-content";

export interface LiveFacts {
  menu: ServiceGroup[];
  team: TeamMember[];
  products: Product[];
  reviews: Review[];
  reviewsSummary: { average: number; count: number } | null;
  gallery: string[];
  whatsappUrl: string;
}

export type LiveByLang = Partial<Record<Lang, LiveFacts>>;

const TIMEOUT_MS = 4000;
const CACHE_SECONDS = 300;

type PricingType = "fixed" | "hourly" | "quote" | "starting_from";
interface ApiServiceItem {
  item_type: "service" | "category" | "subcategory";
  service_item_id: string;
  parent_category_id?: string | null;
  category_label?: string | null;
  parent_category_label?: string | null;
  label: string;
  description?: string | null;
  image_url?: string | null;
  price_amount?: number | null;
  currency?: string | null;
  pricing_type?: PricingType | null;
}
interface ApiProfile {
  slug: string;
  booking_url?: string;
  professional: { name: string; currency?: string };
  team?: { id: string; name: string; photo_url: string | null; share_code: string; is_owner: boolean; performs_all: boolean; services: string[] }[];
  categories?: ApiServiceItem[];
  subcategories?: ApiServiceItem[];
  portfolio?: { photo_url: string }[];
  reviews_summary?: { total_reviews: number; overall_rating?: number; average_rating?: number };
  reviews?: { client?: { name?: string }; review_text?: string | null; ratings?: { overall?: number } | null; rating_overall?: number; comment?: string; text?: string; created_at?: string; service_label?: string }[];
  products?: { id: string; name: string; description?: string | null; image_url?: string | null; image_urls?: string[]; price_amount: number; currency: string; in_stock: boolean; kind?: "physical" | "digital" }[];
  shop?: { whatsapp: string | null } | null;
}

export const formatMoney = (amount: number, currency: string, lang: Lang): string => {
  try {
    const s = new Intl.NumberFormat(lang === "en" ? "en-GB" : "fr-FR", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
    return s.replace(/[   ]/g, " ").replace(/F CFA/, "FCFA");
  } catch {
    return `${amount} ${currency}`;
  }
};

const priceLabel = (it: ApiServiceItem, lang: Lang, startingFrom = false): string => {
  if (it.pricing_type === "quote" || it.price_amount == null) return lang === "en" ? "On quote" : "Sur devis";
  const base = formatMoney(Number(it.price_amount), it.currency || "EUR", lang);
  if (it.pricing_type === "hourly") return `${base} / h`;
  // "À partir de" when the service is priced from a floor (starting_from) or has
  // several size variants sharing the one name (we keep the lowest).
  if (startingFrom || it.pricing_type === "starting_from") return `${lang === "en" ? "From" : "Dès"} ${base}`;
  return base;
};

/**
 * Group the priced services by their CATEGORY (e.g. "Tresses", "Locks", not the
 * family "Coiffure"), each with the category image. One row per service, priced
 * "à partir de" its lowest variant. Keeps the snapshot's durations and order.
 */
export function toMenu(profile: ApiProfile, lang: Lang, snapshot: ServiceGroup[]): ServiceGroup[] {
  const durationByName = new Map<string, string>();
  for (const g of snapshot) for (const it of g.items) durationByName.set(it.name.toLowerCase(), it.duration);

  // category service_item_id -> { label, image } (the app's category level).
  const catById = new Map<string, { label: string; image?: string | null; order: number }>();
  (profile.categories ?? []).forEach((c, i) => catById.set(c.service_item_id, { label: c.label.trim(), image: c.image_url, order: i }));

  type Row = { title: string; image?: string | null; order: number; items: Map<string, { it: ApiServiceItem; count: number }> };
  const groups = new Map<string, Row>();
  for (const it of profile.subcategories ?? []) {
    if (it.price_amount == null && it.pricing_type !== "quote") continue;
    const cat = it.parent_category_id ? catById.get(it.parent_category_id) : undefined;
    const title = (cat?.label || it.category_label || it.parent_category_label || "").trim()
      || (lang === "en" ? "Services" : "Prestations");
    const key = title.toLowerCase();
    const g = groups.get(key) ?? { title, image: cat?.image ?? undefined, order: cat?.order ?? 999, items: new Map() };
    // Collapse size variants of the same service to one row, keeping the lowest price.
    const nameKey = it.label.trim().toLowerCase();
    const prev = g.items.get(nameKey);
    if (!prev) g.items.set(nameKey, { it, count: 1 });
    else {
      prev.count += 1;
      const pa = Number(it.price_amount ?? Infinity), pb = Number(prev.it.price_amount ?? Infinity);
      if (Number.isFinite(pa) && pa < pb) prev.it = it;
    }
    groups.set(key, g);
  }
  if (!groups.size) return snapshot;

  const order = snapshot.map((g) => g.title.toLowerCase());
  return [...groups.values()]
    .map((g) => ({
      title: g.title,
      ...(g.image ? { image: g.image } : {}),
      items: [...g.items.values()].map(({ it, count }) => ({
        name: it.label.trim(),
        duration: durationByName.get(it.label.trim().toLowerCase()) ?? "",
        price: priceLabel(it, lang, count > 1),
        ...(it.description ? { notes: String(it.description).trim().slice(0, 140) } : {}),
        ...(it.image_url ? { image: it.image_url } : {}),
      })),
    }))
    .sort((a, b) => {
      const ia = order.indexOf(a.title.toLowerCase()), ib = order.indexOf(b.title.toLowerCase());
      if (ia !== -1 || ib !== -1) { if (ia === -1) return 1; if (ib === -1) return -1; return ia - ib; }
      const oa = groups.get(a.title.toLowerCase())?.order ?? 999, ob = groups.get(b.title.toLowerCase())?.order ?? 999;
      return oa - ob || b.items.length - a.items.length;
    });
}

export function toFacts(profile: ApiProfile, lang: Lang, content: SiteContent): LiveFacts {
  const bookingUrl = profile.booking_url || content.brand.bookingUrl;
  const snapshotTeam = new Map(content.blocks.team.map((m) => [m.name.toLowerCase(), m]));
  const team: TeamMember[] = (profile.team ?? []).map((m) => {
    const prev = snapshotTeam.get(m.name.toLowerCase());
    return {
      name: m.name,
      photo: m.photo_url || prev?.photo || "",
      owner: !!m.is_owner,
      role: prev?.role ?? {},
      services: m.performs_all ? {} : { [lang]: m.services },
      bookUrl: `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}c=${encodeURIComponent(m.share_code)}`,
    };
  });
  const products: Product[] = (profile.products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    desc: (p.description ?? "").trim(),
    price: formatMoney(Number(p.price_amount), p.currency, lang),
    image: p.image_url || p.image_urls?.[0] || "",
    images: (p.image_urls?.length ? p.image_urls : p.image_url ? [p.image_url] : []).filter(Boolean),
    kind: p.kind === "digital" ? "digital" : "physical",
    inStock: p.in_stock !== false,
    url: content.brand.shopUrl || bookingUrl,
  }));
  // L'API renvoie `review_text` et `ratings.overall` (17/10/2026) : sans eux, aucun
  // avis ne passait. Prénom + initiale, jamais le nom complet de la cliente.
  const textOf = (r: NonNullable<ApiProfile["reviews"]>[number]) => (r.review_text ?? r.comment ?? r.text ?? "").trim();
  const shortName = (name: string) => {
    const [first, ...rest] = name.trim().split(/\s+/);
    const last = rest.pop();
    return first ? `${first.charAt(0).toUpperCase()}${first.slice(1).toLowerCase()}${last ? ` ${last.charAt(0).toUpperCase()}.` : ""}` : "";
  };
  const reviews: Review[] = (profile.reviews ?? [])
    .filter((r) => textOf(r).length > 12)
    .map((r) => ({
      author: shortName(r.client?.name ?? "") || (lang === "en" ? "A client" : "Une cliente"),
      text: textOf(r),
      rating: Math.max(1, Math.min(5, Math.round(Number(r.ratings?.overall ?? r.rating_overall ?? 5)))),
      service: (r.service_label ?? "").trim(),
      date: r.created_at ? String(r.created_at).slice(0, 10) : "",
    }));
  const count = Number(profile.reviews_summary?.total_reviews ?? 0);
  const average = Number(profile.reviews_summary?.overall_rating ?? profile.reviews_summary?.average_rating ?? 0);
  const whatsapp = profile.shop?.whatsapp ? `https://wa.me/${profile.shop.whatsapp.replace(/\D/g, "")}` : content.brand.whatsappUrl;
  return {
    menu: toMenu(profile, lang, content.services[lang] ?? content.services[content.brand.defaultLang]),
    team,
    products,
    reviews,
    reviewsSummary: count >= 3 && average > 0 ? { average: Math.round(average * 10) / 10, count } : null,
    gallery: (profile.portfolio ?? []).map((p) => p.photo_url).filter(Boolean),
    whatsappUrl: whatsapp,
  };
}

async function fetchProfile(apiBase: string, slug: string, lang: Lang): Promise<ApiProfile | null> {
  const url = `${apiBase}/professional?action=get-public-profile&slug=${encodeURIComponent(slug)}&lang=${lang}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // `cf` is honoured on Cloudflare Workers (edge cache); ignored elsewhere.
    const init = { signal: controller.signal, cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } } as RequestInit;
    const res = await fetch(url, init);
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: ApiProfile };
    return json?.success && json.data ? json.data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Live facts for every language of the site; a language is missing when its fetch failed. */
export async function fetchLive(content: SiteContent): Promise<LiveByLang> {
  if (!content.live.enabled || !content.live.slug) return {};
  const out: LiveByLang = {};
  await Promise.all(content.brand.langs.map(async (lang) => {
    const profile = await fetchProfile(content.live.apiBase, content.live.slug, lang);
    if (profile) out[lang] = toFacts(profile, lang, content);
  }));
  return out;
}
