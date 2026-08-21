import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "./index";
import ingridLogoImg from "@/assets/ingrid-logo.jpeg";

const LOGO_URL = ingridLogoImg;
const BOOKING_URL = "https://book.sobeauty.business/ingrid-beauty-hair";

type Lang = "fr" | "en";
type Item = { name: string; price: string; notes?: string };
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
        title: "Locs",
        items: [
          { name: "Starter Locs", price: "150 €" },
          { name: "Retwist", price: "Sur devis" },
          { name: "Reprise racines twist", price: "Sur devis" },
          { name: "Micro-Locs Retwist", price: "Sur devis" },
          { name: "Crochet Retwist", price: "Sur devis" },
          { name: "Barrel Twist", price: "Sur devis" },
          { name: "Boho Locs", price: "Sur devis" },
          { name: "Loc Repair", price: "Sur devis" },
          { name: "Égalisation / Raccourcissement locks", price: "Sur devis" },
        ],
      },
      {
        title: "Tresses & Braids",
        items: [
          { name: "Knotless Braids", price: "Sur devis" },
          { name: "Box Braids", price: "Sur devis" },
          { name: "Fulani Braids", price: "Sur devis" },
          { name: "Ghana Weaving", price: "Sur devis" },
          { name: "Crochet Braids", price: "Sur devis" },
          { name: "Stitch Cornrows", price: "Sur devis" },
          { name: "Straight Back Cornrows", price: "Sur devis" },
          { name: "Nattes sans rajouts", price: "Sur devis" },
          { name: "Nattes / vanilles avec des rajouts", price: "Sur devis" },
          { name: "Vanilles sans rajouts", price: "Sur devis" },
          { name: "Tresses collées avec rajout", price: "Sur devis" },
          { name: "Tresses collées avec rajouts", price: "Sur devis" },
        ],
      },
      {
        title: "Twists & Finger Coils",
        items: [
          { name: "Passion Twists", price: "Sur devis" },
          { name: "Marley Twists", price: "Sur devis" },
          { name: "Finger Coils", price: "40 €" },
        ],
      },
      {
        title: "Kids",
        items: [
          { name: "Kids Braids", price: "Sur devis" },
          { name: "Kids Cornrows", price: "Sur devis" },
          { name: "Kids Twists", price: "Sur devis" },
        ],
      },
      {
        title: "Coupe & Coiffure",
        items: [
          { name: "Coiffure simple", price: "10 €" },
          { name: "Coiffure élaborée (évènement spécial)", price: "20 €" },
          { name: "Coupe enfant", price: "10 €" },
          { name: "Coupe femme / coupe homme", price: "15 €" },
          { name: "Coupe + barbe", price: "25 €" },
          { name: "Coupe transformation", price: "Sur devis" },
          { name: "Tailler les pointes abîmées", price: "35 €" },
        ],
      },
      {
        title: "Coloration & Décoloration",
        items: [
          { name: "Coloration Partielle", price: "Sur devis" },
          { name: "Coloration tête entière", price: "Sur devis" },
          { name: "Décoloration partielle", price: "Sur devis" },
          { name: "Décoloration tête entière", price: "Sur devis" },
        ],
      },
      {
        title: "Soins & Traitements",
        items: [
          { name: "Diagnostic", price: "20 €" },
          { name: "Shampooing simple", price: "25 €" },
          { name: "Shampoo & Wash", price: "25 €" },
          { name: "Shampooing détox", price: "60 €" },
          { name: "Soin « anti-pelliculaire »", price: "40 €" },
          { name: "Soin « Cuir chevelu apaisant » (psoriasis / démangeaisons)", price: "60 €" },
          { name: "Soin « Hydratation Intense »", price: "55 €" },
          { name: "Soin « Nutrition profonde » (cheveux cassants)", price: "60 €" },
          { name: "Soin « Pousse et Fortification »", price: "65 €" },
        ],
      },
      {
        title: "✨ Rituels Royal IBH",
        items: [
          { name: "Le 💫 Rituel Royal IBH", price: "100 €" },
          { name: "Le ✨ Rituel Royal IBH", price: "160 €" },
        ],
      },
      {
        title: "Forfaits FC Locks Twist",
        items: [
          { name: "FC Locks Twist — jusqu'à 50 locks", price: "85 €", notes: "Shampooing simple · Retwist · Coiffure simple" },
          { name: "FC Locks Twist — 50 à 80 locks", price: "95 €", notes: "Shampooing simple · Retwist · Coiffure simple" },
          { name: "FC Locks Twist — 80 à 100 locks", price: "105 €", notes: "Shampooing simple · Retwist · Coiffure simple" },
          { name: "FC Locks Twist — 100 à 120 locks", price: "115 €", notes: "Shampooing simple · Retwist · Coiffure simple" },
          { name: "FC Locks Twist — 120 à 140 locks", price: "125 €", notes: "Shampooing simple · Retwist · Coiffure simple" },
        ],
      },
      {
        title: "Forfaits FRC Locks Twist",
        items: [
          { name: "FRC Locks Twist — jusqu'à 50 locks", price: "60 €", notes: "Retwist · Coiffure simple" },
          { name: "FRC Locks Twist — 50 à 80 locks", price: "70 €", notes: "Retwist · Coiffure simple" },
          { name: "FRC Locks Twist — 80 à 100 locks", price: "80 €", notes: "Retwist · Coiffure simple" },
          { name: "FRC Locks Twist — 100 à 120 locks", price: "90 €", notes: "Retwist · Coiffure simple" },
        ],
      },
    ] as Group[],
    info: {
      title: "Bon à savoir",
      text: "Je vous accueille à mon domicile au 16 rue du président Paul Doumer, 95580 Andilly. Je ne me déplace pas. Pour toutes les prestations affichées « sur devis », contactez-moi avant de réserver afin de valider les détails et le tarif.",
      deposit: "Acompte obligatoire de 40% du total de la prestation à la réservation.",
    },
    footer: {
      tagline: "Locs, tresses & soins capillaires à Andilly (95). Spécialiste reprise racines, braiding, coloration.",
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
        title: "Locs",
        items: [
          { name: "Starter Locs", price: "€150" },
          { name: "Retwist", price: "On request" },
          { name: "Root retouch — twist", price: "On request" },
          { name: "Micro-Locs Retwist", price: "On request" },
          { name: "Crochet Retwist", price: "On request" },
          { name: "Barrel Twist", price: "On request" },
          { name: "Boho Locs", price: "On request" },
          { name: "Loc Repair", price: "On request" },
          { name: "Locs trim / shortening", price: "On request" },
        ],
      },
      {
        title: "Braids & Cornrows",
        items: [
          { name: "Knotless Braids", price: "On request" },
          { name: "Box Braids", price: "On request" },
          { name: "Fulani Braids", price: "On request" },
          { name: "Ghana Weaving", price: "On request" },
          { name: "Crochet Braids", price: "On request" },
          { name: "Stitch Cornrows", price: "On request" },
          { name: "Straight Back Cornrows", price: "On request" },
          { name: "Braids without extensions", price: "On request" },
          { name: "Braids / vanilles with extensions", price: "On request" },
          { name: "Vanilles without extensions", price: "On request" },
          { name: "Glue braids with extensions (small)", price: "On request" },
          { name: "Glue braids with extensions (full)", price: "On request" },
        ],
      },
      {
        title: "Twists & Finger Coils",
        items: [
          { name: "Passion Twists", price: "On request" },
          { name: "Marley Twists", price: "On request" },
          { name: "Finger Coils", price: "€40" },
        ],
      },
      {
        title: "Kids",
        items: [
          { name: "Kids Braids", price: "On request" },
          { name: "Kids Cornrows", price: "On request" },
          { name: "Kids Twists", price: "On request" },
        ],
      },
      {
        title: "Cut & Styling",
        items: [
          { name: "Simple styling", price: "€10" },
          { name: "Elaborate styling (special event)", price: "€20" },
          { name: "Children's cut", price: "€10" },
          { name: "Women's / men's cut", price: "€15" },
          { name: "Cut + beard", price: "€25" },
          { name: "Transformation cut", price: "On request" },
          { name: "Split ends trim", price: "€35" },
        ],
      },
      {
        title: "Colour & Bleach",
        items: [
          { name: "Partial colour", price: "On request" },
          { name: "Full-head colour", price: "On request" },
          { name: "Partial bleach", price: "On request" },
          { name: "Full-head bleach", price: "On request" },
        ],
      },
      {
        title: "Care & Treatments",
        items: [
          { name: "Diagnostic", price: "€20" },
          { name: "Simple shampoo", price: "€25" },
          { name: "Shampoo & Wash", price: "€25" },
          { name: "Detox shampoo", price: "€60" },
          { name: "Anti-dandruff treatment", price: "€40" },
          { name: "Soothing scalp treatment (psoriasis / itching)", price: "€60" },
          { name: "Intense Hydration treatment", price: "€55" },
          { name: "Deep Nutrition treatment (brittle hair)", price: "€60" },
          { name: "Growth & Strengthening treatment", price: "€65" },
        ],
      },
      {
        title: "✨ Royal IBH Rituals",
        items: [
          { name: "The 💫 Royal IBH Ritual", price: "€100" },
          { name: "The ✨ Royal IBH Ritual", price: "€160" },
        ],
      },
      {
        title: "FC Locks Twist packages",
        items: [
          { name: "FC Locks Twist — up to 50 locks", price: "€85", notes: "Simple shampoo · Retwist · Simple styling" },
          { name: "FC Locks Twist — 50 to 80 locks", price: "€95", notes: "Simple shampoo · Retwist · Simple styling" },
          { name: "FC Locks Twist — 80 to 100 locks", price: "€105", notes: "Simple shampoo · Retwist · Simple styling" },
          { name: "FC Locks Twist — 100 to 120 locks", price: "€115", notes: "Simple shampoo · Retwist · Simple styling" },
          { name: "FC Locks Twist — 120 to 140 locks", price: "€125", notes: "Simple shampoo · Retwist · Simple styling" },
        ],
      },
      {
        title: "FRC Locks Twist packages",
        items: [
          { name: "FRC Locks Twist — up to 50 locks", price: "€60", notes: "Retwist · Simple styling" },
          { name: "FRC Locks Twist — 50 to 80 locks", price: "€70", notes: "Retwist · Simple styling" },
          { name: "FRC Locks Twist — 80 to 100 locks", price: "€80", notes: "Retwist · Simple styling" },
          { name: "FRC Locks Twist — 100 to 120 locks", price: "€90", notes: "Retwist · Simple styling" },
        ],
      },
    ] as Group[],
    info: {
      title: "Good to know",
      text: "I welcome you at my home at 16 rue du président Paul Doumer, 95580 Andilly. I do not travel. For services listed as \"on request\", please contact me before booking to confirm details and pricing.",
      deposit: "A 40% deposit of the total service amount is required at booking.",
    },
    footer: {
      tagline: "Locs, braids & hair care in Andilly (95). Root retouch specialist, braiding, colouring.",
      contact: "Contact", follow: "Follow me", policy: "Cancellation policy", rights: "All rights reserved.",
    },
  },
};

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services & Tarifs - Ingrid Beauty Hair" },
      { name: "description", content: "Menu complet d'Ingrid Beauty Hair à Andilly (95) : locs, tresses, braids, soins capillaires, coloration, coupe. Starter Locs 150€, Forfaits FC/FRC Locks Twist, Rituels Royal IBH." },
      { property: "og:title", content: "Services & Tarifs - Ingrid Beauty Hair" },
      { property: "og:description", content: "Locs, knotless braids, Fulani, Ghana Weaving, soins, coloration, coupe — tous les tarifs d'Ingrid Beauty Hair à Andilly (95580)." },
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
                    <div className="col-span-8 md:col-span-10">
                      <div className="font-medium text-foreground">{it.name}</div>
                      {it.notes && <div className="text-xs text-muted-foreground mt-1">{it.notes}</div>}
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right font-display text-xl text-accent">{it.price}</div>
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
