/**
 * Ingrid's menu, live from her SoBeauty app (15/10/2026): the services, prices and
 * durations she sets in the app are what this site shows, a few minutes later,
 * without a rebuild. Read on the server (Cloudflare edge cache, 5 min) from her
 * public page's endpoint, which needs no key. Any failure falls back to the
 * menu written in the page, so the site never shows an empty menu.
 */
import { createServerFn } from "@tanstack/react-start";

export type Lang = "fr" | "en";
export type MenuItem = { name: string; price: string; notes?: string };
export type MenuGroup = { title: string; items: MenuItem[] };
export type LiveMenu = Partial<Record<Lang, MenuGroup[]>>;

const API = "https://api.cherie.care/functions/v1";
const SLUG = "ingrid-beauty-hair";
const TIMEOUT_MS = 4000;
const CACHE_SECONDS = 300;

interface ApiItem {
  level?: string;
  service_item_id: string;
  parent_category_id?: string | null;
  label: string;
  description?: string | null;
  price_amount?: number | null;
  currency?: string | null;
  pricing_type?: string | null;
  duration_minutes?: number | null;
}

const money = (amount: number, currency: string, lang: Lang): string => {
  if (currency === "EUR") {
    const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(".", lang === "fr" ? "," : ".");
    return lang === "fr" ? `${n} €` : `€${n}`;
  }
  try {
    return new Intl.NumberFormat(lang === "en" ? "en-GB" : "fr-FR", { style: "currency", currency, maximumFractionDigits: 0 })
      .format(amount).replace(/[  ]/g, " ").replace(/F CFA/, "FCFA");
  } catch {
    return `${amount} ${currency}`;
  }
};

const priceText = (it: ApiItem, lang: Lang): string => {
  const type = it.pricing_type ?? "fixed";
  if (type === "quote") return lang === "fr" ? "Sur devis" : "On quote";
  const p = money(Number(it.price_amount ?? 0), it.currency || "EUR", lang);
  if (type === "starting_from") return lang === "fr" ? `à partir de ${p}` : `from ${p}`;
  if (type === "hourly") return `${p}/h`;
  return p;
};

/** 150 → « 2h30 », 60 → « 1h », 45 → « 45min ». */
const durationText = (minutes?: number | null): string | undefined => {
  if (!minutes || minutes <= 0) return undefined;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (!h) return `${m}min`;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
};

/** Her note, shortened: whole sentences until it says something (« Attention! » alone does not), 160 chars max. */
const firstSentence = (raw?: string | null): string => {
  const t = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  let out = "";
  for (const part of t.split(/(?<=[.!?])\s+/)) {
    const next = out ? `${out} ${part}` : part;
    if (next.length > 160) break;
    out = next;
    if (out.length >= 40) break;
  }
  if (out.length >= 20) return out;
  return t.length <= 160 ? t : `${t.slice(0, 157).replace(/\s+\S*$/, "")}…`;
};

async function fetchMenu(lang: Lang): Promise<MenuGroup[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const init = { signal: controller.signal, cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } } as RequestInit;
    const res = await fetch(`${API}/professional?action=get-public-profile&slug=${SLUG}&lang=${lang}`, init);
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: { categories?: ApiItem[]; subcategories?: ApiItem[] } };
    if (!json?.success || !json.data) return null;
    const categories = (json.data.categories ?? []).filter((c) => (c.level ?? "category") === "category");
    const order = new Map(categories.map((c, i) => [c.service_item_id, i]));
    const titleOf = new Map(categories.map((c) => [c.service_item_id, c.label.trim()]));
    const groups = new Map<string, MenuGroup & { rank: number }>();
    for (const it of json.data.subcategories ?? []) {
      if ((it.level ?? "subcategory") !== "subcategory") continue;
      if (it.price_amount == null && it.pricing_type !== "quote") continue;
      const key = it.parent_category_id ?? "";
      const title = titleOf.get(key) ?? (lang === "fr" ? "Prestations" : "Services");
      const g = groups.get(key) ?? { title, items: [], rank: order.get(key) ?? 999 };
      // This page has no duration column: the duration leads the small line under the name,
      // then the first sentence of her own note (her notes can run long).
      const notes = [durationText(it.duration_minutes), firstSentence(it.description)].filter(Boolean).join(" · ");
      g.items.push({ name: it.label.trim(), price: priceText(it, lang), ...(notes ? { notes } : {}) });
      groups.set(key, g);
    }
    const list = [...groups.values()].sort((a, b) => a.rank - b.rank).map(({ title, items }) => ({ title, items }));
    return list.length ? list : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Both languages; a language is missing when its fetch failed (the page then keeps its written menu). */
export const getLiveMenu = createServerFn({ method: "GET" }).handler(async (): Promise<LiveMenu> => {
  const out: LiveMenu = {};
  await Promise.all((["fr", "en"] as const).map(async (lang) => {
    const groups = await fetchMenu(lang);
    if (groups) out[lang] = groups;
  }));
  return out;
});

const norm = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Her packages and rituals exist only on this site, not in her app (15/10/2026):
 * they stay as written, after her live menu, until they are added to the app.
 */
export const SITE_ONLY_SECTIONS = (title: string): boolean =>
  /rituel|forfait/.test(norm(title));
