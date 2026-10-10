import type { SiteData } from "../lib/site-data";
import { hasReviews, hasTeam } from "../lib/site-data";
import { Avatar, Button, Img, Stars } from "./primitives";

/** The team (rendered only with 2+ members). */
export function Team({ data, variant = "grid", className = "" }: { data: SiteData; variant?: "grid" | "list"; className?: string }) {
  if (!hasTeam(data)) return null;
  const t = data.t.team;
  if (variant === "list") {
    return (
      <ul className={`divide-y divide-line ${className}`}>
        {data.team.map((m) => (
          <li key={m.name} className="flex flex-wrap items-center gap-5 py-5">
            <Avatar name={m.name} src={m.photo} className="h-16 w-16 text-xl" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-xl">{m.name}</div>
              <div className="text-sm text-muted-fg">{m.role[data.lang] || (m.owner ? t.owner : "")}{(m.services[data.lang]?.length ? ` · ${m.services[data.lang]!.slice(0, 3).join(", ")}` : "")}</div>
            </div>
            <Button href={m.bookUrl} external size="sm" variant="outline">{t.bookWith} {m.name.split(" ")[0]}</Button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {data.team.map((m) => (
        <li key={m.name} className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
          <div className="aspect-[4/5] bg-surface-2">
            {m.photo ? <Img src={m.photo} alt={m.name} className="transition-transform duration-700 group-hover:scale-[1.03]" />
              : <div className="flex h-full items-center justify-center"><Avatar name={m.name} className="h-24 w-24 text-3xl" /></div>}
          </div>
          <div className="flex flex-1 flex-col gap-1 p-5">
            <div className="font-display text-xl">{m.name}</div>
            <div className="text-sm text-muted-fg">{m.role[data.lang] || (m.owner ? t.owner : t.allServices)}</div>
            {m.services[data.lang]?.length ? <div className="text-xs text-muted-fg">{m.services[data.lang]!.slice(0, 4).join(" · ")}</div> : null}
            <div className="mt-auto pt-3"><a href={m.bookUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline-offset-4 hover:underline">{t.bookWith} {m.name.split(" ")[0]}</a></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Real reviews (2+) or, without them, the 3 trust pillars. Never fake quotes. */
export function Reviews({ data, variant = "cards", className = "" }: { data: SiteData; variant?: "cards" | "quotes" | "pillars-only"; className?: string }) {
  const t = data.t;
  if (hasReviews(data) && variant !== "pillars-only") {
    const reviews = data.reviews.slice(0, 6);
    return (
      <div className={className}>
        {data.reviewsSummary && (
          <p className="mb-6 flex items-center gap-3 text-sm text-muted-fg">
            <Stars n={Math.round(data.reviewsSummary.average)} />
            <span><strong className="text-fg">{data.reviewsSummary.average.toFixed(1)}</strong>/5 · {data.reviewsSummary.count} {t.reviews.count}</span>
          </p>
        )}
        <ul className={variant === "quotes" ? "space-y-8" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
          {reviews.map((r, i) => (
            <li key={i} className={variant === "quotes" ? "border-l-2 border-accent pl-6" : "flex flex-col rounded-[var(--radius)] border border-line bg-surface p-6"}>
              <Stars n={r.rating} />
              <blockquote className="mt-3 font-display text-lg leading-relaxed sm:text-xl">« {r.text} »</blockquote>
              <figcaption className="mt-4 text-sm text-muted-fg">{r.author}{r.service ? ` · ${r.service}` : ""}</figcaption>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const pillars = t.pillars.items.filter((p) => p.label.trim() && p.text.trim());
  if (!pillars.length) return null;
  return (
    <ul className={`grid gap-5 md:grid-cols-3 ${className}`}>
      {pillars.map((p) => (
        <li key={p.label} className="rounded-[var(--radius)] border border-line bg-surface p-6">
          <div className="eyebrow text-accent">{p.label}</div>
          <p className="mt-3 leading-relaxed text-muted-fg">{p.text}</p>
        </li>
      ))}
    </ul>
  );
}
