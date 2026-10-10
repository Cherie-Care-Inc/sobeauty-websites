import { useEffect, useState } from "react";
import type { Product } from "../site-content";
import type { SiteData } from "../lib/site-data";
import { hasProducts } from "../lib/site-data";
import { Button, Img } from "./primitives";

/** Fades through a product's photos every 6 s (same rhythm as the booking page). */
export function ProductImages({ images, alt, className = "" }: { images: string[]; alt: string; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);
  if (!images.length) return null;
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {images.map((src, k) => (
        <img key={src + k} src={src} alt={k === 0 ? alt : ""} loading={k === 0 ? "eager" : "lazy"} decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000" style={{ opacity: k === i ? 1 : 0 }} />
      ))}
    </div>
  );
}

/** Product grid; ordering happens on the member's booking page. */
export function Products({ data, items, variant = "grid", className = "" }: { data: SiteData; items?: Product[]; variant?: "grid" | "list"; className?: string }) {
  const list = items ?? data.products;
  if (!list.length || !hasProducts(data)) return null;
  const t = data.t.products;
  return (
    <ul className={`${variant === "list" ? "divide-y divide-line" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"} ${className}`}>
      {list.map((p) => (
        <li key={p.id} className={variant === "list" ? "flex flex-wrap items-center gap-5 py-5" : "flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface"}>
          {p.images.length > 0 && (
            variant === "list"
              ? <ProductImages images={p.images} alt={p.name} className="h-24 w-24 shrink-0 rounded-[var(--radius)]" />
              : <ProductImages images={p.images} alt={p.name} className="aspect-square" />
          )}
          <div className={variant === "list" ? "min-w-0 flex-1" : "flex flex-1 flex-col gap-2 p-5"}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl">{p.name}</h3>
              <span className="shrink-0 font-semibold text-accent">{p.price}</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-fg">{p.kind === "digital" ? t.digital : t.physical}{!p.inStock ? ` · ${t.outOfStock}` : ""}</div>
            {p.desc && <p className="text-sm leading-relaxed text-muted-fg line-clamp-3">{p.desc}</p>}
            <div className={variant === "list" ? "pt-2" : "mt-auto pt-3"}>
              <Button href={p.url} external size="sm" variant={p.inStock ? "primary" : "outline"}>{t.order}</Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Trainings as programmes: what it is, what it includes, enrol. */
export function Programmes({ data, className = "" }: { data: SiteData; className?: string }) {
  const list = data.programmes;
  if (!list.length) return null;
  const t = data.t.programmes;
  return (
    <ul className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      {list.map((p, i) => (
        <li key={p.id} className="grid overflow-hidden rounded-[var(--radius)] border border-line bg-surface sm:grid-cols-[14rem_1fr]">
          {p.images.length > 0 ? <ProductImages images={p.images} alt={p.name} className="aspect-[4/3] sm:aspect-auto sm:h-full" />
            : <div className="hidden items-center justify-center bg-accent-soft font-display text-5xl text-accent sm:flex">{String(i + 1).padStart(2, "0")}</div>}
          <div className="flex flex-col gap-3 p-6">
            <div className="eyebrow text-accent">{t.tag}</div>
            <h3 className="font-display text-2xl sm:text-3xl">{p.name}</h3>
            {p.desc && <p className="leading-relaxed text-muted-fg whitespace-pre-line">{p.desc}</p>}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
              <span className="font-display text-2xl text-accent">{p.price}</span>
              <Button href={p.url} external>{t.enrol}</Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
