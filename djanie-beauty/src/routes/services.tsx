import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { SiteFooter } from "./index";

type Lang = "fr" | "en";
type Item = { name: string; duration?: string; price: string; notes?: string };
type Group = { title: string; items: Item[] };

const groupsFr: Group[] = [
  {
    title: "Nattes & Tresses",
    items: [
      { name: "Nattes Lace", duration: "2h30", price: "60€" },
      { name: "Nattes Collées", duration: "1h", price: "50€" },
    ],
  },
  {
    title: "Tissage & Extensions",
    items: [
      { name: "Tissage", duration: "40min", price: "40€" },
    ],
  },
  {
    title: "Manucure",
    items: [
      { name: "French Manucure", duration: "1h", price: "40€" },
    ],
  },
  {
    title: "Perruques & Mèches",
    items: [
      { name: "Perruque — Tissage / Mèche", price: "50€ et plus", notes: "Prix selon le modèle choisi" },
    ],
  },
];

const groupsEn: Group[] = [
  {
    title: "Braids",
    items: [
      { name: "Lace Braids", duration: "2h30", price: "60€" },
      { name: "Cornrows", duration: "1h", price: "50€" },
    ],
  },
  {
    title: "Weave & Extensions",
    items: [
      { name: "Hair Weave", duration: "40min", price: "40€" },
    ],
  },
  {
    title: "Manicure",
    items: [
      { name: "French Manicure", duration: "1h", price: "40€" },
    ],
  },
  {
    title: "Wigs & Hair",
    items: [
      { name: "Wig — Weave / Hair", price: "50€+", notes: "Price depends on chosen model" },
    ],
  },
];

const translations = {
  fr: {
    nav: { home: "Accueil", menu: "Prestations", contact: "Contact", book: "Réserver" },
    hero: {
      tag: "Prestations",
      title: "Toutes mes",
      titleAccent: "prestations",
      subtitle: "Des coiffures réalisées avec passion et précision, pour révéler votre beauté naturelle.",
    },
    groups: groupsFr,
    columns: { service: "Prestation", duration: "Durée", price: "Prix" },
    notice: {
      title: "Bon à savoir",
      items: [
        "Je vous reçois dans mon studio au 36 boulevard de Strasbourg, Paris 10e (Château d'Eau). Je ne me déplace pas.",
        "Un acompte de 20% est demandé à la réservation.",
        "Pour tout autre soin ou coiffure sur mesure, n'hésitez pas à me contacter.",
      ],
    },
    book: "Prendre rendez-vous",
    footer: {
      tagline: "Studio nattes, tissage & manucure — Paris 10e (Château d'Eau)",
      contact: "Contact", follow: "Suivez-moi", menu: "Prestations", rights: "Tous droits réservés.",
    },
  },
  en: {
    nav: { home: "Home", menu: "Services", contact: "Contact", book: "Book" },
    hero: {
      tag: "Services",
      title: "All my",
      titleAccent: "services",
      subtitle: "Hairstyles crafted with passion and precision, to reveal your natural beauty.",
    },
    groups: groupsEn,
    columns: { service: "Service", duration: "Duration", price: "Price" },
    notice: {
      title: "Good to know",
      items: [
        "I welcome you at my studio at 36 boulevard de Strasbourg, Paris 10th (Château d'Eau). I do not travel.",
        "A 20% deposit is required at the time of booking.",
        "For any other bespoke service, feel free to contact me.",
      ],
    },
    book: "Book an appointment",
    footer: {
      tagline: "Braids, weave & manicure studio — Paris 10th (Château d'Eau)",
      contact: "Contact", follow: "Follow me", menu: "Services", rights: "All rights reserved.",
    },
  },
};

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Prestations — Djanie Beauty · Paris 10e" },
      { name: "description", content: "Nattes lace, nattes collées, tissage, french manucure et perruques. Tarifs et durées. Studio au Château d'Eau, Paris 10e." },
      { property: "og:title", content: "Prestations — Djanie Beauty" },
      { property: "og:description", content: "Toutes mes prestations coiffure et manucure. Studio Paris 10e." },
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
      <PageHeader lang={lang} setLanguage={setLanguage} t={t.nav} />

      <section className="pt-32 pb-20 px-6 bg-hero text-cream">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--copper-glow)" }}>{t.hero.tag}</div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
            {t.hero.title} <em className="text-gradient-copper not-italic font-normal">{t.hero.titleAccent}</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.96 0.012 75 / 0.85)" }}>
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl space-y-16">
          {t.groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-3xl md:text-4xl font-light mb-8 pb-4 border-b border-border">
                {group.title}
              </h2>
              <ul className="space-y-0 divide-y divide-border">
                {group.items.map((it) => (
                  <li key={it.name + it.price} className="grid grid-cols-12 gap-4 py-4 items-baseline">
                    <div className="col-span-7 md:col-span-8">
                      <div className="font-medium text-foreground">{it.name}</div>
                      {it.notes && <div className="text-xs text-muted-foreground mt-1">{it.notes}</div>}
                    </div>
                    {it.duration && (
                      <div className="col-span-2 md:col-span-2 text-sm text-muted-foreground">{it.duration}</div>
                    )}
                    <div className={`${it.duration ? "col-span-3 md:col-span-2" : "col-span-5 md:col-span-4"} text-right font-display text-xl text-accent`}>
                      {it.price}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-3xl bg-muted p-8 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Info className="h-5 w-5 text-accent" />
              <h3 className="font-display text-xl font-medium">{t.notice.title}</h3>
            </div>
            <ul className="space-y-3">
              {t.notice.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-4">
            <a
              href="https://book.sobeauty.business/djanie-beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-copper px-8 py-4 text-base font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform duration-500"
            >
              {t.book}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
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
        <Link to="/" className="flex items-center gap-2" aria-label="Djanie Beauty">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <span className="font-display text-xl font-semibold" style={{ color: "var(--copper)" }}>Djanie Beauty</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors inline-flex items-center gap-1">{t.home}</Link>
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
            href="https://book.sobeauty.business/djanie-beauty"
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
