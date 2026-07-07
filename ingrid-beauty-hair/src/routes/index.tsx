import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MapPin, Star, ArrowRight, Heart, Instagram, Music2, Phone, Facebook } from "lucide-react";
import ingridCutoutImg from "@/assets/ingrid-cutout.png";
import svcLocsImg from "@/assets/svc-locs.jpg";
import svcTwistImg from "@/assets/svc-twist.jpg";
import svcBarberImg from "@/assets/svc-barber.jpg";
import flowerImg from "@/assets/flower.png";

const LOGO_URL = "https://mjdrordjjxnysfupzgzv.supabase.co/storage/v1/object/public/client-logos/nbqiDYMPqU8LGg5e3CRdPp/1781041519432.png";
const BOOKING_URL = "https://book.sobeauty.business/ingrid-beauty-hair";
const PHONE_HUMAN = "06 60 87 28 86";
const PHONE_TEL = "+33660872886";
const EMAIL = "ingrid.shillingford123@gmail.com";
const ADDRESS = "16 rue du président Paul Doumer, 95580 Andilly";

type Lang = "fr" | "en";

const translations = {
  fr: {
    nav: { services: "Services", about: "À propos", contact: "Contact", book: "Réserver" },
    hero: {
      title1: "Sublimez",
      title2: "votre style",
      title3: "à Andilly.",
      desc: "Ingrid Beauty Hair — Coiffeuse professionnelle spécialisée en locs, tresses, twist et barber. Forte de 15 ans d'expérience, je vous accueille chez moi à Andilly dans une ambiance chaleureuse et soignée.",
      bookNow: "Réserver maintenant",
      discover: "Découvrir",
      happy: "Clientes ravies",
      location: "Andilly · 95580 Val-d'Oise",
    },
    services: {
      tag: "Prestations",
      title1: "Des soins",
      title2: "sur mesure",
      title3: " pour vous.",
      seeAll: "Voir tous mes services",
      more: "Et bien plus...",
      items: [
        { title: "Locs", desc: "Reprise des racines en twist ou crochet + coiffure simple. Du plus court au plus long.", price: "à partir de 60€", duration: "sur mesure" },
        { title: "Twist", desc: "Twist soigné pour sublimer vos cheveux. Précision et douceur garanties.", price: "sur devis", duration: "sur mesure" },
        { title: "Barber", desc: "Coupe, dégradé et entretien sur mesure. Un service précis pour un look impeccable.", price: "sur devis", duration: "sur mesure" },
      ],
    },
    about: {
      tag: "À propos",
      title1: "Je m'appelle",
      title2: "Ingrid",
      title3: ".",
      desc: "Coiffeuse professionnelle passionnée, je mets mon expertise au service de mes clients depuis 15 ans. Locs, tresses, twist ou barber — j'aime sublimer chaque personne avec douceur, précision et soin.",
      bullets: [
        "À votre écoute pour un résultat qui vous ressemble",
        "Douce avec vos cheveux — je ne serre jamais trop",
        "Perfectionniste — chaque prestation est réalisée avec le plus grand soin",
      ],
      sign: "Je vous attends — Ingrid",
      cta: "Prendre rendez-vous",
      experience: "ans d'expérience",
    },
    testimonials: {
      tag: "Pourquoi me choisir",
      title1: "Des soins",
      title2: "chaleureux",
      title3: " et modernes.",
      items: [
        { label: "Écoute", text: "Je prends le temps d'écouter vos envies et de vous conseiller pour que vous repartiez avec exactement ce que vous souhaitiez." },
        { label: "Douceur", text: "Je travaille avec douceur et respect de votre cheveu. Mes clientes me font confiance depuis des années pour cette attention particulière." },
        { label: "Perfection", text: "Vos locs sont posées avec soin et précision. Je suis perfectionniste car vous méritez un résultat impeccable à chaque fois." },
      ],
    },
    cta: {
      title1: "Prête à",
      title2: "briller",
      title3: "?",
      desc: "Réservez votre rendez-vous en ligne en quelques secondes.",
      bookNow: "Réserver maintenant",
    },
    marquee: ["Locs", "Twist", "Barber", "Tresses", "Reprise Racines", "Andilly 95"],
    footer: {
      tagline: "Locs, Twist & Barber à Andilly (95). Reprise racines, coiffure et coupe sur mesure.",
      contact: "Contact",
      follow: "Suivez-moi",
      policy: "Politique d'annulation",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    nav: { services: "Services", about: "About", contact: "Contact", book: "Book" },
    hero: {
      title1: "Elevate",
      title2: "your style",
      title3: "in Andilly.",
      desc: "Ingrid Beauty Hair — Professional hairdresser specialised in locs, braids, twist and barber. With 15 years of experience, I welcome you at my home in Andilly in a warm and refined setting.",
      bookNow: "Book now",
      discover: "Discover",
      happy: "Happy clients",
      location: "Andilly · 95580 Val-d'Oise",
    },
    services: {
      tag: "Services",
      title1: "Services",
      title2: "made for you",
      title3: ".",
      seeAll: "See all services",
      more: "And more...",
      items: [
        { title: "Locs", desc: "Root retouch with twist or crochet method + simple styling. From shortest to longest.", price: "from €60", duration: "custom" },
        { title: "Twist", desc: "Refined twist to enhance your hair. Precision and gentleness guaranteed.", price: "on request", duration: "custom" },
        { title: "Barber", desc: "Cut, fade and custom maintenance. A precise service for an impeccable look.", price: "on request", duration: "custom" },
      ],
    },
    about: {
      tag: "About",
      title1: "My name is",
      title2: "Ingrid",
      title3: ".",
      desc: "A passionate professional hairdresser, I have been bringing my expertise to my clients for 15 years. Locs, braids, twist or barber — I love enhancing each person with gentleness, precision and care.",
      bullets: [
        "I listen to understand exactly what you want",
        "Gentle with your hair — I never work too tight",
        "Perfectionist — every service is delivered with the greatest care",
      ],
      sign: "I'm waiting for you — Ingrid",
      cta: "Book an appointment",
      experience: "years of experience",
    },
    testimonials: {
      tag: "Why choose me",
      title1: "Warm",
      title2: "and modern",
      title3: " care.",
      items: [
        { label: "Listening", text: "I take the time to listen and advise you so that you leave with exactly what you had in mind." },
        { label: "Gentleness", text: "I work with gentleness and respect for your hair. My clients have trusted me for years for this special care." },
        { label: "Perfection", text: "Every service is delivered with care and precision. I am a perfectionist because you deserve an impeccable result every time." },
      ],
    },
    cta: {
      title1: "Ready to",
      title2: "shine",
      title3: "?",
      desc: "Book your appointment online in seconds.",
      bookNow: "Book now",
    },
    marquee: ["Locs", "Twist", "Barber", "Braiding", "Root Retouch", "Andilly 95"],
    footer: {
      tagline: "Locs, Twist & Barber specialist in Andilly (95). Root retouch, styling and custom cuts.",
      contact: "Contact",
      follow: "Follow me",
      policy: "Cancellation policy",
      rights: "All rights reserved.",
    },
  },
} as const;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ingrid Beauty Hair - Spécialiste Locs à Andilly (95)" },
      { name: "description", content: "Ingrid Beauty Hair — Coiffeuse professionnelle à Andilly 95580. Locs, tresses, twist et barber. 15 ans d'expérience. Réservez en ligne." },
      { property: "og:title", content: "Ingrid Beauty Hair - Spécialiste Locs à Andilly (95)" },
      { property: "og:description", content: "Spécialiste des locs à Andilly. Reprise racines twist et crochet, tressage, coloration. 15 ans d'expérience." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const SERVICE_IMGS = [svcLocsImg, svcTwistImg, svcBarberImg];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored === "fr" || stored === "en") setLang(stored);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setLanguage = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Ingrid Beauty Hair">
            <img
              src={LOGO_URL}
              alt="Ingrid Beauty Hair"
              className={`transition-all duration-500 ${scrolled ? "h-10" : "h-12"} w-auto object-contain`}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <a href="#services" className="transition-colors hover:text-accent">{t.nav.services}</a>
            <a href="#about" className="transition-colors hover:text-accent">{t.nav.about}</a>
            <Link to="/services" className="transition-colors hover:text-accent">Menu</Link>
            <Link to="/contact" className="transition-colors hover:text-accent">{t.nav.contact}</Link>
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
                  aria-label={l === "fr" ? "Français" : "English"}
                >
                  {l}
                </button>
              ))}
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform duration-300"
            >
              {t.nav.book}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO BENTO ── */}
      <section id="top" className="relative pt-28 pb-10 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-12 auto-rows-[minmax(120px,auto)] gap-3 sm:gap-4">

          {/* Tagline tile */}
          <div className="col-span-12 lg:col-span-8 lg:row-span-4 relative overflow-hidden rounded-[2rem] bg-hero text-cream p-8 sm:p-12 flex flex-col justify-between min-h-[460px]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full animate-shimmer" style={{ background: "radial-gradient(circle, oklch(0.60 0.15 350 / 0.30), transparent 70%)" }} />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, oklch(0.99 0.002 355) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            </div>
            <div className="relative space-y-6">
              <div className="text-xs uppercase tracking-[0.3em] text-copper">Ingrid Beauty Hair · Andilly</div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] font-light" style={{ color: "var(--cream)" }}>
                {t.hero.title1} <span className="italic text-gradient-copper">{t.hero.title2}</span> {t.hero.title3}
              </h1>
              <p className="max-w-lg text-base sm:text-lg leading-relaxed" style={{ color: "oklch(0.99 0.002 355 / 0.75)" }}>
                {t.hero.desc}
              </p>
            </div>
            <div className="relative flex flex-wrap items-center gap-4 pt-8">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-copper px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-glow hover:scale-[1.03] transition-all duration-500"
              >
                {t.hero.bookNow}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services" className="text-xs uppercase tracking-[0.2em] border-b border-cream/40 pb-1 hover:border-copper transition-colors" style={{ color: "var(--cream)" }}>
                {t.hero.discover}
              </a>
            </div>
          </div>

          {/* Portrait tile */}
          <div className="col-span-12 sm:col-span-7 lg:col-span-4 lg:row-span-3 relative overflow-hidden rounded-[2rem] min-h-[260px] lg:min-h-0 shadow-elegant bg-muted/40">
            <img src={ingridCutoutImg} alt="Ingrid Beauty Hair" className="absolute left-1/2 -translate-x-1/2 w-auto h-[115%]" style={{ top: '-8%' }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.18 0.05 350 / 0.60), transparent 55%)" }} />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream">
              <span className="text-xs uppercase tracking-[0.25em]">Coiffeuse · Barber</span>
              <span className="font-display italic text-2xl">Ingrid</span>
            </div>
          </div>

          {/* Stars tile */}
          <div className="col-span-7 sm:col-span-5 lg:col-span-2 rounded-[2rem] bg-card border border-border p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current text-accent" />)}
            </div>
            <div className="text-xs text-muted-foreground leading-tight mt-3">{t.hero.happy}</div>
          </div>

          {/* Location tile */}
          <div className="col-span-5 sm:col-span-7 lg:col-span-2 rounded-[2rem] bg-espresso text-cream p-5 flex flex-col justify-between min-h-[120px]">
            <MapPin className="h-5 w-5 text-copper" />
            <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "oklch(0.99 0.002 355 / 0.8)" }}>{t.hero.location}</div>
          </div>

          {/* Marquee tile */}
          <div className="col-span-12 relative overflow-hidden rounded-[2rem] bg-muted/60 border border-border py-5 flex items-center">
            <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl italic text-muted-foreground">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 shrink-0 pl-12">
                  {t.marquee.flatMap((item, j) => [
                    <span key={`i${j}`}>{item}</span>,
                    <span key={`d${j}`} className="text-accent">•</span>,
                  ])}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES BENTO ── */}
      <section id="services" className="relative py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-3 sm:gap-4 mb-4">
            {/* Section heading tile */}
            <div className="col-span-12 lg:col-span-8 rounded-[2rem] bg-card border border-border p-8 sm:p-10">
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t.services.tag}</div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
                {t.services.title1} <em className="text-gradient-copper not-italic font-normal">{t.services.title2}</em>{t.services.title3}
              </h2>
            </div>
            {/* See-all CTA tile */}
            <Link
              to="/services"
              className="col-span-12 lg:col-span-4 group rounded-[2rem] bg-espresso text-cream p-8 flex flex-col justify-between min-h-[180px] hover:bg-copper transition-colors duration-500"
            >
              <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "oklch(0.99 0.002 355 / 0.7)" }}>{t.services.more}</span>
              <span className="flex items-center justify-between font-display text-2xl">
                {t.services.seeAll}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            {t.services.items.map((item, idx) => (
              <article
                key={item.title}
                className={`group relative rounded-[2rem] overflow-hidden bg-card border border-border hover:border-accent transition-all duration-500 hover:-translate-y-1 shadow-elegant flex flex-col col-span-12 md:col-span-6 ${
                  idx === 0 ? "lg:col-span-4" : idx === 1 ? "lg:col-span-5" : "lg:col-span-3"
                }`}
              >
                <div className={`overflow-hidden bg-muted ${idx === 1 ? "aspect-[5/3]" : "aspect-[4/3]"}`}>
                  <img
                    src={SERVICE_IMGS[idx]}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-2xl mb-2 leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-6 flex items-end justify-end">
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.2em] border-b border-foreground/30 pb-1 hover:border-accent hover:text-accent transition-colors"
                    >
                      {t.nav.book}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT BENTO ── */}
      <section id="about" className="relative py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-12 auto-rows-[minmax(120px,auto)] gap-3 sm:gap-4">

          {/* Portrait tile */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 row-span-2 rounded-[2rem] overflow-hidden shadow-elegant bg-muted/30 min-h-[420px] relative">
            <img src={ingridCutoutImg} alt="Ingrid Beauty Hair" loading="lazy" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto" />
          </div>

          {/* Bio tile */}
          <div className="col-span-12 md:col-span-7 lg:col-span-5 rounded-[2rem] bg-muted/40 border border-border p-8 sm:p-10 space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-accent">{t.about.tag}</div>
            <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">
              {t.about.title1} <em className="text-gradient-copper not-italic font-normal">{t.about.title2}</em>{t.about.title3}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{t.about.desc}</p>
            <ul className="space-y-2 pt-1">
              {t.about.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience badge tile */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3 rounded-[2rem] bg-espresso text-cream p-7 flex flex-col justify-between min-h-[180px]">
            <div className="font-display text-6xl text-gradient-copper">15</div>
            <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "oklch(0.99 0.002 355 / 0.7)" }}>{t.about.experience}</div>
          </div>

          {/* Signature + CTA tile */}
          <div className="col-span-6 md:col-span-3 lg:col-span-3 rounded-[2rem] bg-card border border-border p-4 sm:p-6 flex flex-col justify-between gap-3 min-h-[180px]">
            <p className="font-[Dancing_Script] text-lg sm:text-2xl leading-tight" style={{ color: "var(--accent)" }}>{t.about.sign}</p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-foreground hover:text-accent transition-colors"
            >
              <span>{t.about.cta}</span>
              <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Location tile */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 rounded-[2rem] bg-hero text-cream p-7 flex items-center justify-between min-h-[140px]">
            <div className="flex items-center gap-4">
              <MapPin className="h-10 w-10 shrink-0" style={{ color: "var(--copper-glow)" }} />
              <div>
                <p className="font-display text-2xl" style={{ color: "var(--cream)" }}>Andilly</p>
                <p className="text-xs uppercase tracking-[0.25em] mt-1" style={{ color: "oklch(0.99 0.002 355 / 0.7)" }}>95580 Val-d'Oise</p>
              </div>
            </div>
            <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "oklch(0.99 0.002 355 / 0.7)" }}>France</span>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ME BENTO ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-3 sm:gap-4">

          {/* Section heading tile */}
          <div className="col-span-12 lg:col-span-4 rounded-[2rem] bg-card border border-border p-8 sm:p-10 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t.testimonials.tag}</div>
              <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">
                {t.testimonials.title1} <em className="text-gradient-copper not-italic font-normal">{t.testimonials.title2}</em> {t.testimonials.title3}
              </h2>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 mt-6 text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
            >
              {t.nav.book}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Pillar 1 */}
          <figure className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2rem] bg-muted/40 border border-border p-7 shadow-elegant hover:shadow-glow transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-accent" />)}
              </div>
              <blockquote className="text-base leading-relaxed mb-6 font-display italic">"{t.testimonials.items[0].text}"</blockquote>
            </div>
            <figcaption className="flex items-center justify-between text-sm pt-4 border-t border-border">
              <span className="font-medium">{t.testimonials.items[0].label}</span>
            </figcaption>
          </figure>

          {/* Pillar 2 */}
          <figure className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2rem] bg-muted/40 border border-border p-7 shadow-elegant hover:shadow-glow transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-accent" />)}
              </div>
              <blockquote className="text-base leading-relaxed mb-6 font-display italic">"{t.testimonials.items[1].text}"</blockquote>
            </div>
            <figcaption className="flex items-center justify-between text-sm pt-4 border-t border-border">
              <span className="font-medium">{t.testimonials.items[1].label}</span>
            </figcaption>
          </figure>

          {/* Pillar 3 — wider, centered on lg row 2 */}
          <figure className="col-span-12 md:col-span-12 lg:col-span-8 lg:col-start-5 rounded-[2rem] bg-muted/40 border border-border p-7 shadow-elegant hover:shadow-glow transition-shadow duration-500 flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-accent" />)}
              </div>
              <blockquote className="text-base leading-relaxed mb-6 font-display italic">"{t.testimonials.items[2].text}"</blockquote>
            </div>
            <figcaption className="flex items-center justify-between text-sm pt-4 border-t border-border">
              <span className="font-medium">{t.testimonials.items[2].label}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── CONTACT / CTA BENTO ── */}
      <section id="contact" className="relative py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-12 auto-rows-[minmax(120px,auto)] gap-3 sm:gap-4">

          {/* Large CTA tile */}
          <div className="col-span-12 lg:col-span-8 lg:row-span-2 relative overflow-hidden rounded-[2rem] bg-hero text-cream p-8 sm:p-12 min-h-[360px] flex flex-col justify-between">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full animate-shimmer" style={{ background: "radial-gradient(circle, oklch(0.60 0.15 350 / 0.25), transparent 60%)" }} />
            </div>
            <div className="relative space-y-5">
              <img src={flowerImg} alt="" className="h-10 w-10 animate-[spin_10s_linear_infinite]" />
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
                {t.cta.title1} <em className="text-gradient-copper not-italic font-normal">{t.cta.title2}</em> {t.cta.title3}
              </h2>
              <p className="max-w-lg text-base" style={{ color: "oklch(0.99 0.002 355 / 0.75)" }}>{t.cta.desc}</p>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex w-fit items-center gap-3 rounded-full bg-copper px-8 py-4 text-base font-medium text-accent-foreground shadow-glow hover:scale-[1.03] transition-all duration-500 mt-6"
            >
              {t.cta.bookNow}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Phone tile */}
          <a
            href={`tel:${PHONE_TEL}`}
            className="col-span-6 lg:col-span-4 rounded-[2rem] bg-card border border-border p-5 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] hover:border-accent transition-colors group"
          >
            <Phone className="h-5 w-5 text-accent" />
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">{lang === "fr" ? "Téléphone" : "Phone"}</div>
              <div className="font-display text-lg sm:text-2xl whitespace-nowrap">{PHONE_HUMAN}</div>
            </div>
          </a>

          {/* Email tile */}
          <a
            href={`mailto:${EMAIL}`}
            className="col-span-6 lg:col-span-2 rounded-[2rem] bg-espresso text-cream p-5 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] hover:bg-copper transition-colors group"
          >
            <Mail className="h-5 w-5" />
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-1" style={{ color: "oklch(0.99 0.002 355 / 0.6)" }}>Email</div>
              <div className="text-xs sm:text-sm leading-tight break-all" style={{ color: "oklch(0.99 0.002 355 / 0.9)" }}>{EMAIL}</div>
            </div>
          </a>

          {/* Address tile */}
          <div className="col-span-12 lg:col-span-2 rounded-[2rem] bg-muted/60 border border-border p-5 sm:p-6 flex flex-col gap-4 min-h-[150px] sm:min-h-[170px]">
            <MapPin className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">{lang === "fr" ? "Adresse" : "Address"}</div>
              <div className="text-xs sm:text-sm leading-snug">{ADDRESS}</div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 rounded-full bg-accent/10 hover:bg-accent hover:text-accent-foreground text-accent px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors group"
            >
              <span>{lang === "fr" ? "Itinéraire" : "Get directions"}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter t={t} />
    </div>
  );
}

export function SiteFooter({ t }: { t: { footer: { tagline: string; contact: string; follow: string; policy: string; rights: string } } }) {
  return (
    <footer className="text-cream/80 py-16 px-6" style={{ background: "var(--espresso)" }}>
      <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-10 items-start">
        <div>
          <img src={LOGO_URL} alt="Ingrid Beauty Hair" className="h-16 w-auto mb-4 object-contain" />
          <p className="text-sm max-w-xs" style={{ color: "oklch(0.99 0.002 355 / 0.7)" }}>
            {t.footer.tagline}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-xl mb-3" style={{ color: "var(--cream)" }}>{t.footer.contact}</h4>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 hover:text-copper transition-colors"><Mail className="h-4 w-4" /><span>{EMAIL}</span></a>
          <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:text-copper transition-colors"><Phone className="h-4 w-4" /><span>{PHONE_HUMAN}</span></a>
          <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{ADDRESS}</span></div>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-xl mb-3" style={{ color: "var(--cream)" }}>{t.footer.follow}</h4>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/Ingridbeautyhair971" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com/@ingridbeautyhair971" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Music2 className="h-4 w-4" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61584014396897" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <div className="pt-4 text-xs" style={{ color: "oklch(0.99 0.002 355 / 0.6)" }}>
            <Link to="/contact" className="hover:text-copper transition-colors">{t.footer.policy}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-cream/10 text-xs flex flex-wrap justify-between gap-3" style={{ color: "oklch(0.99 0.002 355 / 0.5)" }}>
        <span>© {new Date().getFullYear()} Ingrid Beauty Hair. {t.footer.rights}</span>
        <span className="inline-flex items-center gap-1.5">
          Made with <Heart className="h-3 w-3 fill-current text-copper" /> by{" "}
          <a href="https://sobeauty.business" target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors underline-offset-2 hover:underline">
            SoBeauty Business
          </a>
        </span>
      </div>
    </footer>
  );
}
