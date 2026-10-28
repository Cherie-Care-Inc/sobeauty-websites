import type { ServiceGroup } from "../site-content";
import type { SiteData } from "../lib/site-data";
import { Button, Img } from "./primitives";

/**
 * The priced menu. Three presentations:
 *  rows      — grouped list, name / duration / price (Elysia, Nailora)
 *  numbered  — big "01" index per row, roomy (Elysia home)
 *  cards     — image cards with "Book for" (Marlo, Barbero)
 */
export function MenuList({ data, groups, variant = "rows", limit, bookPerItem = false, className = "" }: {
  data: SiteData; groups?: ServiceGroup[]; variant?: "rows" | "numbered" | "cards"; limit?: number; bookPerItem?: boolean; className?: string;
}) {
  const t = data.t.services;
  const book = data.content.brand.bookingUrl;
  const list = (groups ?? data.menu).filter((g) => g.items.length);
  if (!list.length) return null;
  // Collapse by category when there's more than one group and no hard limit, so
  // the page shows the categories (with their photo) rather than every service
  // at once. The first category opens by default; the rest expand on tap.
  const collapsible = list.length > 1 && !limit;
  let n = 0;
  return (
    <div className={`space-y-12 ${className}`}>
      {list.map((g, gi) => {
        const items = limit ? g.items.slice(0, Math.max(0, limit - n)) : g.items;
        if (!items.length) return null;
        n += items.length;
        const header = (
          <h3 className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-3 font-display text-2xl sm:text-3xl">
            <span className="flex min-w-0 items-center gap-3">
              {g.image && <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line"><Img src={g.image} alt={g.title} className="h-full w-full object-cover" /></span>}
              <span className="truncate">{g.title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-xs font-body font-medium uppercase tracking-widest text-muted-fg">
              {g.items.length}
              {collapsible && <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>}
            </span>
          </h3>
        );
        const body = (
          <>
            {variant === "cards" ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((it, i) => (
                  <li key={it.name + i} className="flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
                    {it.image && <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-surface-2"><Img src={it.image} alt={it.name} className="absolute inset-0" /></div>}
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{it.name}</span>
                        <span className="shrink-0 font-display text-xl text-accent">{it.price}</span>
                      </div>
                      {it.duration && <span className="text-xs uppercase tracking-wider text-muted-fg">{t.duration} · {it.duration}</span>}
                      {it.notes && <p className="text-sm text-muted-fg">{it.notes}</p>}
                      {bookPerItem && <div className="mt-auto pt-2"><Button href={book} external size="sm" variant="outline">{data.t.nav.book}</Button></div>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-line">
                {items.map((it, i) => (
                  <li key={it.name + i} className={`grid items-baseline gap-x-6 gap-y-1 py-4 ${variant === "numbered" ? "grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_7rem_auto]" : "grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_auto]"}`}>
                    {variant === "numbered" && <span className="font-display text-xl text-accent">{String(i + 1).padStart(2, "0")}</span>}
                    <div className="min-w-0">
                      <div className="font-medium">{it.name}</div>
                      {it.notes && <div className="mt-0.5 text-sm text-muted-fg">{it.notes}</div>}
                      {it.duration && <div className="mt-0.5 text-xs text-muted-fg sm:hidden">{it.duration}</div>}
                    </div>
                    <div className="hidden text-sm text-muted-fg sm:block">{it.duration}</div>
                    <div className="text-right font-display text-xl text-accent">{it.price}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
        return collapsible ? (
          <details key={g.title} open={gi === 0} className="group">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">{header}</summary>
            {body}
          </details>
        ) : (
          <div key={g.title}>
            {header}
            {body}
          </div>
        );
      })}
    </div>
  );
}

/** Up to 4 highlight cards (prose from the brief + optional image). */
export function Highlights({ data, variant = "cards", className = "" }: { data: SiteData; variant?: "cards" | "rows" | "tiles"; className?: string }) {
  const items = data.t.services.items.filter((i) => i.title.trim());
  if (!items.length) return null;
  const imgs = data.images.svc;
  if (variant === "rows") {
    return (
      <ul className={`divide-y divide-line ${className}`}>
        {items.map((it, i) => (
          <li key={it.title} className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr_18rem]">
            <span className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div><h3 className="font-display text-2xl sm:text-3xl">{it.title}</h3><p className="mt-2 max-w-xl leading-relaxed text-muted-fg">{it.desc}</p></div>
            {imgs[i] && <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius)] lg:aspect-[16/10]"><Img src={imgs[i]} alt={it.title} /></div>}
          </li>
        ))}
      </ul>
    );
  }
  if (variant === "tiles") {
    return (
      <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {items.map((it, i) => (
          <li key={it.title} className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius)] bg-surface-2">
            {imgs[i] && <Img src={imgs[i]} alt={it.title} className="absolute inset-0" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="font-display text-2xl">{it.title}</h3>
              <p className="mt-1 text-sm text-white/85">{it.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""} ${items.length === 4 ? "lg:grid-cols-4" : ""} ${className}`}>
      {items.map((it, i) => (
        <li key={it.title} className="flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
          {imgs[i] && <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-surface-2"><Img src={imgs[i]} alt={it.title} className="absolute inset-0" /></div>}
          <div className="p-6"><h3 className="font-display text-2xl">{it.title}</h3><p className="mt-2 leading-relaxed text-muted-fg">{it.desc}</p></div>
        </li>
      ))}
    </ul>
  );
}
