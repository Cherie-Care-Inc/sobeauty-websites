import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone, Instagram, Music2, Facebook, Clock } from "lucide-react";
import { SiteFooter } from "./index";

type Lang = "fr" | "en";

const translations = {
  fr: {
    nav: { home: "Accueil", menu: "Prestations", contact: "Contact", book: "Réserver" },
    hero: {
      tag: "Contact",
      title: "Prenons",
      titleAccent: "rendez-vous",
      subtitle: "Réservez en ligne en quelques secondes ou contactez-moi directement. Je suis ravie de vous accueillir.",
      bookNow: "Réserver en ligne",
    },
    cards: {
      phone: "Téléphone",
      email: "Email",
      address: "Adresse",
      addressNote: "Je vous reçois dans mon studio. Je ne me déplace pas. Langue parlée : Français.",
      social: "Suivez-moi",
      socialHandle: "Instagram & Facebook : Djanie la k'rismatik · TikTok : @adja19853",
    },
    policy: {
      title: "Politique",
      titleAccent: "d'annulation",
      items: [
        "Un acompte de 20% du montant total de la prestation est demandé à la réservation.",
        "Merci de me prévenir dès que possible en cas d'empêchement afin de libérer le créneau.",
        "Pour toute question, n'hésitez pas à me contacter par téléphone ou sur les réseaux sociaux.",
      ],
      sign: "Merci pour votre compréhension. — Adja",
    },
    footer: {
      tagline: "Studio nattes, tissage & manucure — Paris 10e (Château d'Eau)",
      contact: "Contact", follow: "Suivez-moi", menu: "Prestations", rights: "Tous droits réservés.",
    },
  },
  en: {
    nav: { home: "Home", menu: "Services", contact: "Contact", book: "Book" },
    hero: {
      tag: "Contact",
      title: "Let's book",
      titleAccent: "an appointment",
      subtitle: "Book online in seconds or contact me directly. I look forward to welcoming you.",
      bookNow: "Book online",
    },
    cards: {
      phone: "Phone",
      email: "Email",
      address: "Address",
      addressNote: "I welcome you at my studio. I do not travel. Language spoken: French.",
      social: "Follow me",
      socialHandle: "Instagram & Facebook: Djanie la k'rismatik · TikTok: @adja19853",
    },
    policy: {
      title: "Cancellation",
      titleAccent: "policy",
      items: [
        "A 20% deposit of the total service amount is required at the time of booking.",
        "Please let me know as soon as possible if you cannot make it, so the slot can be released.",
        "For any question, feel free to contact me by phone or on social media.",
      ],
      sign: "Thank you for your understanding. — Adja",
    },
    footer: {
      tagline: "Braids, weave & manicure studio — Paris 10th (Château d'Eau)",
      contact: "Contact", follow: "Follow me", menu: "Services", rights: "All rights reserved.",
    },
  },
};

const BOOKING_URL = "https://book.sobeauty.business/djanie-beauty";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Réservation — Djanie Beauty · Paris 10e" },
      { name: "description", content: "Contactez Adja Bamba — studio nattes & tissage, 36 boulevard de Strasbourg, Paris 10e (Château d'Eau). Téléphone, email, adresse, réseaux sociaux." },
      { property: "og:title", content: "Contact & Réservation — Djanie Beauty" },
      { property: "og:description", content: "Réservez votre rendez-vous ou contactez-moi directement." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
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
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6">
          <a href="tel:+33758838363" className="group rounded-3xl bg-card border border-border p-8 shadow-elegant hover:border-accent hover:-translate-y-1 transition-all duration-500">
            <Phone className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.cards.phone}</div>
            <div className="font-display text-2xl">07 58 83 83 63</div>
          </a>
          <a href="mailto:bambaadja594@gmail.com" className="group rounded-3xl bg-card border border-border p-8 shadow-elegant hover:border-accent hover:-translate-y-1 transition-all duration-500">
            <Mail className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.cards.email}</div>
            <div className="font-display text-xl break-all">bambaadja594@gmail.com</div>
          </a>
          <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant md:col-span-2">
            <MapPin className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.cards.address}</div>
            <div className="font-display text-2xl mb-1">36 boulevard de Strasbourg</div>
            <div className="text-muted-foreground">75010 Paris — Metro Château d'Eau</div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t.cards.addressNote}</p>
          </div>
          <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{t.cards.social}</div>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/djaniela.krismatik" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@adja19853" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Music2 className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/DjanylaKrismatik" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{t.cards.socialHandle}</div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-muted p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-accent" />
              <h2 className="font-display text-3xl md:text-4xl font-light">
                {t.policy.title} <em className="text-gradient-copper not-italic font-normal">{t.policy.titleAccent}</em>
              </h2>
            </div>
            <ul className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {t.policy.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 italic text-foreground">{t.policy.sign}</p>
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
          <Link to="/" className="hover:text-accent transition-colors">{t.home}</Link>
          <Link to="/services" className="hover:text-accent transition-colors">{t.menu}</Link>
          <Link to="/contact" className="text-accent">{t.contact}</Link>
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
