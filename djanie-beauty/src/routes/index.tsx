import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Instagram, Music2, Facebook, Star } from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import svc1Img from "@/assets/svc-1.jpg";
import svc2Img from "@/assets/svc-2.jpg";
import svc3Img from "@/assets/svc-3.jpg";
import flowerImg from "@/assets/flower.png";

const BOOKING_URL = "https://book.sobeauty.business/djanie-beauty";

type Lang = "fr" | "en";

const translations = {
  fr: {
    nav: { home: "Accueil", menu: "Prestations", contact: "Contact", book: "Réserver" },
    hero: {
      tag: "Studio — Paris 10e",
      title1: "L'art de",
      title2: "sublimer",
      title3: "vos cheveux",
      subtitle: "Nattes, tissage & french manucure réalisés avec soin, au coeur de Paris.",
      cta: "Prendre rendez-vous",
      scroll: "Découvrir",
    },
    marquee: ["Nattes Lace", "Tissage", "Nattes Collées", "French Manucure", "Perruques", "Mèches"],
    services: {
      tag: "Prestations",
      title: "Ce que je",
      titleAccent: "propose",
      items: [
        { name: "French Manucure", desc: "Un classique intemporel, réalisé avec précision pour un fini impeccable.", price: "40€", img: svc1Img },
        { name: "Tissage", desc: "Extensions posées avec soin pour un rendu naturel et durable.", price: "40€", img: svc2Img },
        { name: "Nattes Lace", desc: "Nattes lacées fines et précises, technique minutieuse pour un résultat parfait.", price: "60€", img: svc3Img },
      ],
      viewAll: "Voir toutes les prestations",
    },
    about: {
      tag: "Mon histoire",
      badge1: "6",
      badge1Label: "ans d'expérience",
      title: "Mon sens du",
      titleAccent: "détail",
      desc: "Depuis 6 ans, je mets mon talent et ma passion au service de votre beauté. Spécialisée dans les coiffures afro, le tissage et la french manucure, je crée des looks soignés qui vous ressemblent, dans un studio chaleureux au coeur de Paris.",
      bullets: [
        "Chaque prestation est réalisée avec le plus grand soin",
        "Un accueil personnalisé et à l'écoute de vos envies",
        "Un studio intime et chaleureux au Château d'Eau",
      ],
      sign: "Je vous attends, Adja",
      cta: "Me contacter",
    },
    testimonials: {
      tag: "Mon engagement",
      title: "Pourquoi choisir",
      titleAccent: "Djanie Beauty",
      items: [
        { quote: "J'aime ce métier parce que c'est ma passion. Chaque cliente repart plus belle et plus confiante.", name: "Adja Bamba", role: "Fondatrice, Djanie Beauty" },
        { quote: "La précision et le soin du détail guident chaque prestation. Votre satisfaction est ma priorité.", name: "Mon approche", role: "Studio Paris 10e" },
        { quote: "Un studio intime, une coiffeuse attentionnée, et un résultat qui vous correspond.", name: "L'ambiance", role: "Luxe minimaliste & chaleureux" },
      ],
    },
    footer: {
      tagline: "Studio nattes, tissage & manucure — Paris 10e (Château d'Eau)",
      contact: "Contact",
      follow: "Suivez-moi",
      menu: "Prestations",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    nav: { home: "Home", menu: "Services", contact: "Contact", book: "Book" },
    hero: {
      tag: "Studio — Paris 10th",
      title1: "The art of",
      title2: "enhancing",
      title3: "your hair",
      subtitle: "Braids, hair weaves & French manicure crafted with care, in the heart of Paris.",
      cta: "Book an appointment",
      scroll: "Discover",
    },
    marquee: ["Lace Braids", "Hair Weave", "Cornrows", "French Manicure", "Wigs", "Extensions"],
    services: {
      tag: "Services",
      title: "What I",
      titleAccent: "offer",
      items: [
        { name: "French Manicure", desc: "A timeless classic, crafted with precision for an impeccable finish.", price: "40€", img: svc1Img },
        { name: "Hair Weave", desc: "Extensions carefully applied for a natural and long-lasting result.", price: "40€", img: svc2Img },
        { name: "Lace Braids", desc: "Fine lace braids, a meticulous technique for a perfect result.", price: "60€", img: svc3Img },
      ],
      viewAll: "View all services",
    },
    about: {
      tag: "My story",
      badge1: "6",
      badge1Label: "years of experience",
      title: "My eye for",
      titleAccent: "detail",
      desc: "For 6 years, I have put my talent and passion at the service of your beauty. Specialised in Afro hairstyles, weaves and French manicures, I create refined looks that reflect who you are, in a warm studio in the heart of Paris.",
      bullets: [
        "Every service is performed with the greatest care",
        "A personalised welcome tailored to your wishes",
        "An intimate, warm studio at Château d'Eau",
      ],
      sign: "I'm waiting for you, Adja",
      cta: "Contact me",
    },
    testimonials: {
      tag: "My commitment",
      title: "Why choose",
      titleAccent: "Djanie Beauty",
      items: [
        { quote: "I love this profession because it is my passion. Every client leaves more beautiful and more confident.", name: "Adja Bamba", role: "Founder, Djanie Beauty" },
        { quote: "Precision and attention to detail guide every service. Your satisfaction is my priority.", name: "My approach", role: "Studio Paris 10th" },
        { quote: "An intimate studio, an attentive stylist, and a result that is truly yours.", name: "The experience", role: "Minimalist luxury & warmth" },
      ],
    },
    footer: {
      tagline: "Braids, weave & manicure studio — Paris 10th (Château d'Eau)",
      contact: "Contact",
      follow: "Follow me",
      menu: "Services",
      rights: "All rights reserved.",
    },
  },
};

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Djanie Beauty · Nattes & Tissage Paris 10e" },
      { name: "description", content: "Adja Bamba — studio nattes, tissage et french manucure au 36 boulevard de Strasbourg, Paris 10e. Réservez en ligne." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function HomePage() {
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PageHeader lang={lang} setLanguage={setLanguage} t={t.nav} />
      <HeroSection t={t.hero} />
      <MarqueeSection items={t.marquee} />
      <ServicesSection t={t.services} />
      <AboutSection t={t.about} />
      <TestimonialsSection t={t.testimonials} />
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
        <Link to="/" className="flex items-center gap-3" aria-label="Djanie Beauty">
          <span className="font-display text-xl font-semibold tracking-wide" style={{ color: "var(--copper)" }}>Djanie Beauty</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="text-accent">{t.home}</Link>
          <Link to="/services" className="hover:text-accent transition-colors">{t.menu}</Link>
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

function HeroSection({ t }: { t: typeof translations.fr.hero }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Djanie Beauty — studio coiffure Paris"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero opacity-80" />
      </div>
      <img
        src={flowerImg}
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-1/4 w-64 opacity-10 animate-shimmer pointer-events-none"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center space-y-8">
        <div className="animate-float-up text-xs uppercase tracking-[0.3em]" style={{ color: "var(--copper-glow)" }}>
          {t.tag}
        </div>
        <h1 className="animate-float-up delay-100 font-display text-6xl md:text-8xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
          {t.title1}{" "}
          <em className="text-gradient-copper not-italic font-normal">{t.title2}</em>
          <br />
          {t.title3}
        </h1>
        <p className="animate-float-up delay-200 text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.96 0.012 75 / 0.85)" }}>
          {t.subtitle}
        </p>
        <div className="animate-float-up delay-300 flex flex-wrap items-center justify-center gap-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-copper px-8 py-4 text-base font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform duration-500"
          >
            {t.cta}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 text-base font-medium hover:border-cream/60 transition-colors"
            style={{ color: "var(--cream)" }}
          >
            {t.scroll}
          </Link>
        </div>
      </div>
    </section>
  );
}

function MarqueeSection({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-5 border-y border-border bg-espresso">
      <div className="flex animate-marquee whitespace-nowrap gap-8 text-sm uppercase tracking-[0.2em]" style={{ color: "var(--copper-glow)" }}>
        {doubled.flatMap((item, j) => [
          <span key={`i${j}`}>{item}</span>,
          <span key={`d${j}`} style={{ color: "var(--copper)" }}>•</span>,
        ])}
      </div>
    </div>
  );
}

function ServicesSection({ t }: { t: typeof translations.fr.services }) {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">{t.tag}</div>
          <h2 className="font-display text-5xl md:text-6xl font-light">
            {t.title} <em className="text-gradient-copper not-italic">{t.titleAccent}</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.items.map((svc) => (
            <div
              key={svc.name}
              className="group rounded-3xl overflow-hidden bg-card border border-border shadow-elegant hover:-translate-y-2 transition-all duration-700"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={svc.img}
                  alt={svc.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-xl font-medium">{svc.name}</h3>
                  <span className="text-accent font-display text-lg font-semibold ml-2 shrink-0">{svc.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
          >
            {t.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ t }: { t: typeof translations.fr.about }) {
  return (
    <section className="py-32 px-6 bg-muted/40">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-card shadow-elegant">
            <img
              src={svc2Img}
              alt="Adja Bamba — Djanie Beauty"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-espresso p-6 shadow-elegant text-center min-w-[120px]">
            <div className="font-display text-4xl text-gradient-copper">{t.badge1}+</div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--copper-glow)" }}>{t.badge1Label}</div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">{t.tag}</div>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-tight">
            {t.title} <em className="text-gradient-copper not-italic">{t.titleAccent}</em>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{t.desc}</p>
          <ul className="space-y-3">
            {t.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 rounded-full bg-copper flex items-center justify-center shrink-0">
                  <span className="text-accent-foreground text-xs">✓</span>
                </span>
                <span className="text-foreground/80">{b}</span>
              </li>
            ))}
          </ul>
          <p className="font-display text-2xl italic text-gradient-copper">{t.sign}</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {t.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ t }: { t: typeof translations.fr.testimonials }) {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">{t.tag}</div>
          <h2 className="font-display text-5xl md:text-6xl font-light">
            {t.title} <em className="text-gradient-copper not-italic">{t.titleAccent}</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.items.map((item) => (
            <div key={item.name} className="rounded-3xl bg-card border border-border p-8 shadow-elegant">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">"{item.quote}"</p>
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ t }: { t: { footer: typeof translations.fr.footer } }) {
  const { footer } = t;
  return (
    <footer className="bg-espresso text-cream/80 py-16 px-6">
      <div className="mx-auto max-w-6xl grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="font-display text-2xl font-semibold" style={{ color: "var(--copper-glow)" }}>Djanie Beauty</div>
          <p className="text-sm leading-relaxed opacity-70">{footer.tagline}</p>
          <div className="flex gap-3 pt-2">
            <a href="https://www.instagram.com/djaniela.krismatik" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:border-copper transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com/@adja19853" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:border-copper transition-colors">
              <Music2 className="h-4 w-4" />
            </a>
            <a href="https://www.facebook.com/DjanylaKrismatik" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:border-copper transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--copper)" }}>{footer.menu}</div>
          <nav className="space-y-2 text-sm">
            <Link to="/services" className="block opacity-70 hover:opacity-100 hover:text-copper transition-colors">Nattes & Tresses</Link>
            <Link to="/services" className="block opacity-70 hover:opacity-100 hover:text-copper transition-colors">Tissage</Link>
            <Link to="/services" className="block opacity-70 hover:opacity-100 hover:text-copper transition-colors">French Manucure</Link>
            <Link to="/services" className="block opacity-70 hover:opacity-100 hover:text-copper transition-colors">Perruques</Link>
          </nav>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--copper)" }}>{footer.contact}</div>
          <div className="space-y-2 text-sm opacity-70">
            <p>36 boulevard de Strasbourg</p>
            <p>75010 Paris (Château d'Eau)</p>
            <a href="tel:+33758838363" className="block hover:opacity-100 transition-opacity">07 58 83 83 63</a>
            <a href="mailto:bambaadja594@gmail.com" className="block hover:opacity-100 transition-opacity break-all">bambaadja594@gmail.com</a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-cream/10 text-center text-xs opacity-40">
        © {new Date().getFullYear()} Djanie Beauty — {footer.rights}
      </div>
    </footer>
  );
}
