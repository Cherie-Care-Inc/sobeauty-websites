import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "./index";
import ingridLogoImg from "@/assets/ingrid-logo.jpeg";

const LOGO_URL = ingridLogoImg;
const BOOKING_URL = "https://book.sobeauty.business/ingrid-beauty-hair";

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
      subtitle: "Toutes mes prestations réalisées à mon domicile à Andilly (95580). Je parle français, créole et anglais.",
      bookNow: "Réserver maintenant",
    },
    groups: [
      {
        title: "Locs — Reprise racines twist",
        items: [
          { name: "Locs (jusqu'à 50 locs)", duration: "1h", price: "60€", notes: "Reprise racines twist + coiffure simple" },
          { name: "Locs (50 à 80 locs)", duration: "1h30", price: "70€", notes: "Reprise racines twist + coiffure simple" },
          { name: "Locs (80 à 100 locs)", duration: "2h", price: "80€", notes: "Reprise racines twist + coiffure simple" },
          { name: "Locs (100 à 120 locs)", duration: "2h30", price: "90€", notes: "Reprise racines twist + coiffure simple" },
          { name: "Locs (120 à 140 locs)", duration: "3h", price: "100€", notes: "Reprise racines twist + coiffure" },
        ],
      },
      {
        title: "Locs — Reprise racines crochet",
        items: [
          { name: "Locs (jusqu'à 50 locs)", duration: "2h", price: "75€", notes: "Reprise racines crochet + coiffure simple" },
          { name: "Locs (50 à 80 locs)", duration: "3h", price: "85€", notes: "Reprise racines crochet + coiffure simple" },
          { name: "Locs (80 à 100 locs)", duration: "4h", price: "95€", notes: "Reprise racines crochet + coiffure simple" },
          { name: "Locs (100 à 120 locs)", duration: "5h", price: "105€", notes: "Reprise racines crochet + coiffure simple" },
          { name: "Locs (100 à 120 locs) — Premium", duration: "6h", price: "115€", notes: "Reprise racines crochet + coiffure simple" },
        ],
      },
      {
        title: "Produits capillaires",
        items: [
          { name: "Sérum Pousse Pousse 100 ml", duration: "—", price: "20€" },
          { name: "Sérum Pousse Pousse 200 ml", duration: "—", price: "25€" },
          { name: "Huile explosive 300 ml", duration: "—", price: "30€" },
          { name: "Shampooing savon noir 100 ml", duration: "—", price: "20€" },
        ],
      },
    ] as Group[],
    info: {
      title: "Bon à savoir",
      text: "Je vous accueille à mon domicile au 16 rue du président Paul Doumer, 95580 Andilly. Je ne me déplace pas. J'ai également d'autres prestations disponibles sur demande : tressage, barber, coloration… N'hésitez pas à me contacter pour en savoir plus.",
      deposit: "Acompte obligatoire de 40% du total de la prestation à la réservation.",
    },
    footer: {
      tagline: "Spécialiste des locs à Andilly (95). Reprise racines twist & crochet, tressage, coloration.",
      contact: "Contact", follow: "Suivez-moi", policy: "Politique d'annulation", rights: "Tous droits réservés.",
    },
  },
  en: {
    header: { home: "Home", menu: "Menu", contact: "Contact", book: "Book" },
    hero: {
      tag: "Full menu",
      title: "Services",
      titleAccent: "& pricing",
      subtitle: "All services at my home in Andilly (95580). I speak French, Creole and English.",
      bookNow: "Book now",
    },
    groups: [
      {
        title: "Locs — Twist root retouch",
        items: [
          { name: "Locs (up to 50 locs)", duration: "1h", price: "€60", notes: "Twist root retouch + simple styling" },
          { name: "Locs (50 to 80 locs)", duration: "1h30", price: "€70", notes: "Twist root retouch + simple styling" },
          { name: "Locs (80 to 100 locs)", duration: "2h", price: "€80", notes: "Twist root retouch + simple styling" },
          { name: "Locs (100 to 120 locs)", duration: "2h30", price: "€90", notes: "Twist root retouch + simple styling" },
          { name: "Locs (120 to 140 locs)", duration: "3h", price: "€100", notes: "Twist root retouch + styling" },
        ],
      },
      {
        title: "Locs — Crochet root retouch",
        items: [
          { name: "Locs (up to 50 locs)", duration: "2h", price: "€75", notes: "Crochet root retouch + simple styling" },
          { name: "Locs (50 to 80 locs)", duration: "3h", price: "€85", notes: "Crochet root retouch + simple styling" },
          { name: "Locs (80 to 100 locs)", duration: "4h", price: "€95", notes: "Crochet root retouch + simple styling" },
          { name: "Locs (100 to 120 locs)", duration: "5h", price: "€105", notes: "Crochet root retouch + simple styling" },
          { name: "Locs (100 to 120 locs) — Premium", duration: "6h", price: "€115", notes: "Crochet root retouch + simple styling" },
        ],
      },
      {
        title: "Hair products",
        items: [
          { name: "Sérum Pousse Pousse 100 ml", duration: "—", price: "€20" },
          { name: "Sérum Pousse Pousse 200 ml", duration: "—", price: "€25" },
          { name: "Explosive Oil 300 ml", duration: "—", price: "€30" },
          { name: "Black Soap Shampoo 100 ml", duration: "—", price: "€20" },
        ],
      },
    ] as Group[],
    info: {
      title: "Good to know",
      text: "I welcome you at my home at 16 rue du président Paul Doumer, 95580 Andilly. I do not travel. I also offer other services on request: braiding, barber, colouring… Feel free to contact me for more information.",
      deposit: "A 40% deposit of the total service amount is required at booking.",
    },
    footer: {
      tagline: "Locs specialist in Andilly (95). Twist & crochet root retouch, braiding, colouring.",
      contact: "Contact", follow: "Follow me", policy: "Cancellation policy", rights: "All rights reserved.",
    },
  },
};

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services & Tarifs - Ingrid Beauty Hair" },
      { name: "description", content: "Menu complet des prestations d'Ingrid Beauty Hair : reprise racines locs en twist et crochet, produits capillaires. Tarifs et durées. Andilly 95580." },
      { property: "og:title", content: "Services & Tarifs - Ingrid Beauty Hair" },
      { property: "og:description", content: "Menu complet des prestations : locs reprise racines twist et crochet, produits capillaires Sérum Pousse Pousse, Huile explosive." },
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
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.96 0.012 60 / 0.80)" }}>
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
        <Link to="/" className="flex items-center" aria-label="Ingrid Beauty Hair">
          <img src={LOGO_URL} alt="Ingrid Beauty Hair" className="h-10 w-auto object-contain" />
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
