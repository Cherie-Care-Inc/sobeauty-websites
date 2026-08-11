import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "./index";

const LOGO_URL = "";
const BOOKING_URL = "https://book.sobeauty.business/maison-prodige";

type Lang = "fr" | "en";
type Item = { name: string; duration: string; price: string; notes?: string };
type Group = { title: string; items: Item[] };

const translations = {
  fr: {
    header: { home: "Accueil", menu: "Menu", contact: "Contact", book: "Réserver" },
    hero: {
      tag: "Menu complet",
      title: "Services",
      titleAccent: "& tarifs",
      subtitle: "Toutes mes prestations réalisées à mon domicile à Chevilly-Larue (94550) ou chez vous. Je me déplace à 20 minutes de Paris.",
      bookNow: "Réserver maintenant",
    },
    groups: [
      {
        title: "Tresses & Nattes",
        items: [
          { name: "Braids vanille", duration: "1h", price: "50€" },
          { name: "Cornrows / Nattes plaquées", duration: "1h", price: "50€" },
          { name: "Box braids (mi-longues)", duration: "2h30", price: "80€" },
          { name: "Box braids (longues)", duration: "3h30", price: "100€" },
          { name: "Tressage sur mesure", duration: "sur mesure", price: "sur devis" },
        ],
      },
      {
        title: "Pose de Perruque & Tissage",
        items: [
          { name: "Pose de perruque simple", duration: "1h", price: "50€" },
          { name: "Tissage mi-longueur", duration: "2h", price: "80€" },
          { name: "Tissage long", duration: "2h30", price: "100€" },
          { name: "Pose closure / frontal", duration: "1h30", price: "80€" },
        ],
      },
      {
        title: "Nattes Collées & Stylisation",
        items: [
          { name: "Natte collée", duration: "1h30", price: "60€" },
          { name: "Fulani braids / Goddess braids", duration: "2h", price: "70€" },
          { name: "Coiffure événementielle", duration: "2h+", price: "à partir de 80€" },
        ],
      },
    ] as Group[],
    info: {
      title: "Bon à savoir",
      text: "Je vous accueille à mon domicile au 1 Square Martorell, 94550 Chevilly-Larue, ou me déplace chez vous à 20 minutes de Paris. Toutes les prestations sont disponibles, n'hésitez pas à me contacter pour un devis personnalisé.",
      deposit: "Tarifs à partir de 50€. Contactez-moi pour un devis sur les prestations non listées.",
    },
    footer: {
      tagline: "Tresses, perruques & tissage à Chevilly-Larue (94). Service à domicile, 20 min de Paris.",
      contact: "Contact", follow: "Suivez-moi", policy: "Politique d'annulation", rights: "Tous droits réservés.",
    },
  },
  en: {
    header: { home: "Home", menu: "Menu", contact: "Contact", book: "Book" },
    hero: {
      tag: "Full menu",
      title: "Services",
      titleAccent: "& pricing",
      subtitle: "All services at my home in Chevilly-Larue (94550) or at yours. I travel within 20 minutes of Paris.",
      bookNow: "Book now",
    },
    groups: [
      {
        title: "Braids & Cornrows",
        items: [
          { name: "Vanilla braids", duration: "1h", price: "€50" },
          { name: "Cornrows / Flat braids", duration: "1h", price: "€50" },
          { name: "Box braids (medium length)", duration: "2h30", price: "€80" },
          { name: "Box braids (long)", duration: "3h30", price: "€100" },
          { name: "Custom braiding", duration: "custom", price: "on request" },
        ],
      },
      {
        title: "Wig & Weave",
        items: [
          { name: "Simple wig placement", duration: "1h", price: "€50" },
          { name: "Mid-length weave", duration: "2h", price: "€80" },
          { name: "Long weave", duration: "2h30", price: "€100" },
          { name: "Closure / frontal placement", duration: "1h30", price: "€80" },
        ],
      },
      {
        title: "Glue Braids & Styling",
        items: [
          { name: "Glue braids", duration: "1h30", price: "€60" },
          { name: "Fulani braids / Goddess braids", duration: "2h", price: "€70" },
          { name: "Event styling", duration: "2h+", price: "from €80" },
        ],
      },
    ] as Group[],
    info: {
      title: "Good to know",
      text: "I welcome you at my home at 1 Square Martorell, 94550 Chevilly-Larue, or come to you within 20 minutes of Paris. All services are available — contact me for a personalised quote.",
      deposit: "Services from €50. Contact me for a quote on services not listed.",
    },
    footer: {
      tagline: "Braids, wigs & weave in Chevilly-Larue (94). Home service, 20 min from Paris.",
      contact: "Contact", follow: "Follow me", policy: "Cancellation policy", rights: "All rights reserved.",
    },
  },
};

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services & Tarifs - Maison Prodige Beauty" },
      { name: "description", content: "Menu complet de Maison Prodige Beauty : tresses, box braids, nattes collées, pose de perruque, tissage. Tarifs à partir de 50€. Chevilly-Larue 94550 · À domicile." },
      { property: "og:title", content: "Services & Tarifs - Maison Prodige Beauty" },
      { property: "og:description", content: "Tresses, perruques, tissage et nattes collées. Tarifs à partir de 50€. Service à domicile à 20 min de Paris." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesPage() {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored === "fr" || stored === "en") setLang(stored);
  }, []);

  const setLanguage = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader lang={lang} setLanguage={setLanguage} t={t.header} />

      <section className="pt-32 pb-16 px-6 bg-hero text-cream">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--copper-glow)" }}>{t.hero.tag}</div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
            {t.hero.title} <em className="text-gradient-copper not-italic font-normal">{t.hero.titleAccent}</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.99 0.004 60 / 0.80)" }}>
            {t.hero.subtitle}
          </p>
          <div className="pt-4">
            <a
              href={BOOKING_URL}
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
          {t.groups.map((g) => (
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
            <h3 className="font-display text-2xl text-foreground mb-3">{t.info.title}</h3>
            <p>{t.info.text}</p>
            <p className="mt-3">{t.info.deposit}</p>
          </div>
        </div>
      </section>

      <SiteFooter t={{ footer: t.footer }} />
    </div>
  );
}

function PageHeader({
  lang,
  setLanguage,
  t,
}: {
  lang: Lang;
  setLanguage: (l: Lang) => void;
  t: { home: string; menu: string; contact: string; book: string };
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Maison Prodige Beauty">
          {LOGO_URL ? (
            <img src={LOGO_URL} alt="Maison Prodige Beauty" className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-display font-semibold tracking-wide text-lg" style={{ color: "var(--copper)" }}>
              Maison <em className="not-italic font-light">Prodige</em>
            </span>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {t.home}
          </Link>
          <Link to="/services" className="text-accent">{t.menu}</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">{t.contact}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center text-xs font-medium rounded-full border border-border overflow-hidden">
            {(["fr", "en"] as Lang[]).map((l) => (
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
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform"
          >
            {t.book}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
