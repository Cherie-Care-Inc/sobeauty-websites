import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "./index";
import content from "@/content";
import type { Lang } from "@/site-content";

const { brand } = content;
const showLangToggle = brand.langs.includes("en");
const seoServices = content.seoPages[brand.defaultLang].services;

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: seoServices.title },
      { name: "description", content: seoServices.description },
      { property: "og:title", content: seoServices.title },
      { property: "og:description", content: seoServices.description },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesPage() {
  const [lang, setLang] = useState<Lang>(brand.defaultLang);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored && brand.langs.includes(stored)) setLang(stored);
  }, []);

  const setLanguage = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = content.i18n[lang];
  const p = content.pages[lang].services;
  const groups = content.services[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader lang={lang} setLanguage={setLanguage} active="menu" />

      <section className="pt-32 pb-16 px-6 bg-hero text-cream">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--copper-glow)" }}>{p.eyebrow}</div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
            {t.nav.services} <em className="text-gradient-copper not-italic font-normal">{p.titleAccent}</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.99 0.004 60 / 0.80)" }}>
            {p.subtitle}
          </p>
          <div className="pt-4">
            <a
              href={brand.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-copper px-8 py-4 text-base font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform duration-500"
            >
              {t.hero.bookNow}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl space-y-20">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-display text-3xl md:text-4xl font-light mb-6 pb-4 border-b border-border">
                <em className="text-gradient-copper not-italic font-normal">{g.title}</em>
              </h2>
              <ul className="divide-y divide-border">
                {g.items.map((it) => (
                  <li key={it.name + it.price} className="grid grid-cols-12 gap-4 py-4 items-baseline">
                    <div className="col-span-12 md:col-span-7">
                      <div className="font-medium text-foreground">{it.name}</div>
                      {it.notes && <div className="text-xs text-muted-foreground mt-1">{it.notes}</div>}
                    </div>
                    <div className="col-span-6 md:col-span-3 text-sm text-muted-foreground">{it.duration}</div>
                    <div className="col-span-6 md:col-span-2 text-right font-display text-xl text-accent">{it.price}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-3xl bg-muted p-8 md:p-10 text-sm md:text-base leading-relaxed text-muted-foreground">
            <h3 className="font-display text-2xl text-foreground mb-3">{p.infoTitle}</h3>
            <p>{p.infoText}</p>
            {p.depositLine && <p className="mt-3">{p.depositLine}</p>}
          </div>
        </div>
      </section>

      <SiteFooter content={content} lang={lang} />
    </div>
  );
}

function PageHeader({
  lang,
  setLanguage,
  active,
}: {
  lang: Lang;
  setLanguage: (l: Lang) => void;
  active: "menu" | "contact";
}) {
  const t = content.i18n[lang];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label={brand.name}>
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-display font-semibold tracking-wide text-lg" style={{ color: "var(--copper)" }}>
              {brand.displayParts[0]} <em className="not-italic font-light">{brand.displayParts[1]}</em>
            </span>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {t.nav.home}
          </Link>
          <Link to="/services" className={active === "menu" ? "text-accent" : "hover:text-accent transition-colors"}>{t.nav.menu}</Link>
          <Link to="/contact" className={active === "contact" ? "text-accent" : "hover:text-accent transition-colors"}>{t.nav.contact}</Link>
        </nav>
        <div className="flex items-center gap-3">
          {showLangToggle && (
            <div className="hidden sm:flex items-center text-xs font-medium rounded-full border border-border overflow-hidden">
              {brand.langs.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
                    lang === l ? "bg-copper text-accent-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <a
            href={brand.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform"
          >
            {t.nav.book}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

export { PageHeader };
