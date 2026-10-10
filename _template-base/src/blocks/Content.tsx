import { useEffect, useState } from "react";
import type { SiteData } from "../lib/site-data";
import { hasFaq, hasGallery, hasHours, hasOffer, hasStats } from "../lib/site-data";
import { rangesLabel, todayIndex } from "../lib/format";
import { Button, Img } from "./primitives";

/** Photo grid (3+ photos only), with a simple lightbox. */
export function Gallery({ data, variant = "grid", className = "" }: { data: SiteData; variant?: "grid" | "masonry" | "strip"; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!hasGallery(data)) return null;
  const imgs = data.images.gallery;
  const alt = data.t.gallery.title;
  const cls = variant === "strip"
    ? "flex gap-3 overflow-x-auto scrollbar-none snap-x"
    : variant === "masonry" ? "columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={className}>
      <ul className={cls}>
        {imgs.map((src, i) => (
          <li key={src + i} className={variant === "strip" ? "w-64 shrink-0 snap-start sm:w-80" : variant === "masonry" ? "break-inside-avoid" : ""}>
            <button type="button" onClick={() => setOpen(i)} className={`block w-full overflow-hidden rounded-[var(--radius)] bg-surface-2 ${variant === "masonry" ? "" : "aspect-square"}`} aria-label={`${alt} ${i + 1}`}>
              <Img src={src} alt={`${alt} ${i + 1}`} className={variant === "masonry" ? "h-auto w-full" : "h-full w-full transition-transform duration-700 hover:scale-[1.04]"} />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <img src={imgs[open]} alt={`${alt} ${open + 1}`} className="max-h-full max-w-full rounded-[var(--radius)] object-contain" />
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white" onClick={() => setOpen(null)} aria-label="Close">✕</button>
        </div>
      )}
    </div>
  );
}

/** Questions and answers (native disclosure, keyboard friendly). */
export function Faq({ data, className = "" }: { data: SiteData; className?: string }) {
  if (!hasFaq(data)) return null;
  return (
    <div className={`divide-y divide-line rounded-[var(--radius)] border border-line bg-surface ${className}`}>
      {data.t.faq.items.map((f) => (
        <details key={f.q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span className="text-accent transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-muted-fg">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Opening hours, today highlighted. */
export function Hours({ data, className = "", compact = false }: { data: SiteData; className?: string; compact?: boolean }) {
  if (!hasHours(data)) return null;
  const h = data.t.hours;
  const today = todayIndex();
  return (
    <ul className={`${compact ? "text-sm" : ""} divide-y divide-line ${className}`}>
      {data.hours.map((d) => (
        <li key={d.day} className={`flex justify-between gap-4 py-2 ${d.day === today ? "font-semibold text-accent" : ""}`}>
          <span>{h.days[d.day]}{d.day === today ? ` · ${h.today}` : ""}</span>
          <span className={d.day === today ? "" : d.ranges.length ? "" : "text-muted-fg"}>{rangesLabel(d.ranges, data.lang, h.closed)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Real figures only (years, rating, reviews). */
export function Stats({ data, className = "", tone = "light" }: { data: SiteData; className?: string; tone?: "light" | "dark" }) {
  if (!hasStats(data)) return null;
  const cols = ["", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-4"][Math.min(4, data.t.stats.length)];
  return (
    <ul className={`grid grid-cols-2 gap-6 ${cols} ${className}`}>
      {data.t.stats.map((s) => (
        <li key={s.label} className={tone === "dark" ? "border-l border-hero-muted/30 pl-4" : "border-l border-line pl-4"}>
          <div className="font-display text-4xl sm:text-5xl">{s.value}</div>
          <div className={`mt-1 text-sm ${tone === "dark" ? "text-hero-muted" : "text-muted-fg"}`}>{s.label}</div>
        </li>
      ))}
    </ul>
  );
}

/** Promotion banner (marquee), hidden without a real offer. */
export function Offer({ data, className = "" }: { data: SiteData; className?: string }) {
  if (!hasOffer(data)) return null;
  const items = Array(6).fill(data.t.offer);
  return (
    <div className={`overflow-hidden bg-accent py-2.5 text-sm font-semibold text-accent-fg ${className}`} role="note">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[0, 1].map((k) => <div key={k} className="flex gap-12">{items.map((s, i) => <span key={i}>✦ {s}</span>)}</div>)}
      </div>
    </div>
  );
}

/** Service names marquee (home decoration). */
export function Marquee({ data, className = "", tone = "light" }: { data: SiteData; className?: string; tone?: "light" | "dark" }) {
  const items = data.t.marquee.filter((s) => s.trim());
  if (items.length < 3) return null;
  return (
    <div className={`overflow-hidden border-y ${tone === "dark" ? "border-hero-muted/25 text-hero-muted" : "border-line text-muted-fg"} py-4 ${className}`} aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl sm:text-2xl">
        {[0, 1].map((k) => <div key={k} className="flex gap-10">{items.map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span className="text-accent">✦</span></span>)}</div>)}
      </div>
    </div>
  );
}

/** Closing call to action with Book (and WhatsApp when the number exists). */
export function BookCta({ data, className = "", tone = "hero" }: { data: SiteData; className?: string; tone?: "hero" | "accent" | "surface" }) {
  const c = data.t.cta;
  const bg = tone === "hero" ? "bg-hero text-hero-fg" : tone === "accent" ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg";
  const muted = tone === "hero" ? "text-hero-muted" : tone === "accent" ? "text-accent-fg/85" : "text-muted-fg";
  return (
    <div className={`rounded-[var(--radius)] ${bg} px-6 py-14 text-center sm:px-12 sm:py-20 ${className}`}>
      <h2 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">{c.title1} <em className="italic">{c.title2}</em>{c.title3}</h2>
      {c.desc && <p className={`mx-auto mt-4 max-w-xl text-base sm:text-lg ${muted}`}>{c.desc}</p>}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={data.content.brand.bookingUrl} external size="lg" variant={tone === "accent" ? "hero" : "primary"} className={tone === "accent" ? "bg-accent-fg text-accent" : ""}>{c.bookNow}</Button>
        {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline" className={tone === "hero" ? "border-hero-muted/50 text-hero-fg hover:bg-hero-fg/10" : ""}>{c.whatsapp}</Button>}
      </div>
    </div>
  );
}
