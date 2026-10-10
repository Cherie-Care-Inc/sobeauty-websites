import type { ReactNode } from "react";

/** Section wrapper: consistent spacing, optional alternate band. */
export function Section({ id, children, band, className = "", pad = "py-16 sm:py-24" }: {
  id?: string; children: ReactNode; band?: "surface2" | "hero" | "surface"; className?: string; pad?: string;
}) {
  const bg = band === "surface2" ? "bg-surface-2" : band === "hero" ? "bg-hero" : band === "surface" ? "bg-surface" : "";
  return (
    <section id={id} className={`${bg} ${pad} ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function Heading({ tag, title, sub, align = "left", size = "md", tone }: {
  tag?: string; title: ReactNode; sub?: string; align?: "left" | "center"; size?: "sm" | "md" | "lg"; tone?: "hero";
}) {
  const h = size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : size === "sm" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl";
  const muted = tone === "hero" ? "text-hero-muted" : "text-muted-fg";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-10 sm:mb-14`}>
      {tag && <div className={`eyebrow mb-3 ${tone === "hero" ? "text-hero-muted" : "text-accent"}`}>{tag}</div>}
      <h2 className={`font-display ${h} leading-[1.05] text-balance`}>{title}</h2>
      {sub && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${muted} text-pretty`}>{sub}</p>}
    </div>
  );
}

export function Button({ href, children, variant = "primary", size = "md", external, className = "" }: {
  href: string; children: ReactNode; variant?: "primary" | "ghost" | "hero" | "outline"; size?: "sm" | "md" | "lg"; external?: boolean; className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] rounded-[var(--radius)]";
  const sz = size === "lg" ? "px-7 py-4 text-base" : size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm sm:text-base";
  const v = variant === "primary" ? "bg-accent text-accent-fg"
    : variant === "hero" ? "bg-hero-fg text-hero"
    : variant === "outline" ? "border border-line text-fg bg-transparent hover:bg-surface-2"
    : "bg-transparent text-fg underline underline-offset-4 hover:no-underline";
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <a href={href} className={`${base} ${sz} ${v} ${className}`} {...ext}>{children}</a>;
}

export function Stars({ n = 5, className = "h-4 w-4" }: { n?: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n}/5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`${className} ${i < n ? "fill-accent" : "fill-line"}`} aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** Image with a solid fallback (never a broken icon, never an empty frame). */
export function Img({ src, alt, className = "", aspect = "", eager }: { src: string; alt: string; className?: string; aspect?: string; eager?: boolean }) {
  if (!src) return null;
  return (
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${aspect} ${className}`} />
  );
}

export function Avatar({ name, src, className = "h-14 w-14 text-lg" }: { name: string; src?: string; className?: string }) {
  const ini = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return src
    ? <img src={src} alt={name} loading="lazy" className={`${className} rounded-full object-cover`} />
    : <span className={`${className} inline-flex items-center justify-center rounded-full bg-accent-soft font-display text-accent`} aria-hidden="true">{ini}</span>;
}
