import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MapPin, Star, ArrowRight, Heart, Instagram, Music2, Phone, Facebook } from "lucide-react";
// Image bindings come from a generated barrel so build-from-brief.ts can point
// each to a file whose extension matches its real format (jpg/webp/png).
import { heroImg, aboutImg, svc1Img, svc2Img, svc3Img, flowerImg } from "@/assets/generated-images";
import content from "@/content";
import type { Lang, SiteContent } from "@/site-content";

const { brand, contact } = content;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: content.seo[brand.defaultLang].title },
      { name: "description", content: content.seo[brand.defaultLang].description },
      { property: "og:title", content: content.seo[brand.defaultLang].title },
      { property: "og:description", content: content.seo[brand.defaultLang].description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const SERVICE_IMGS = [svc1Img, svc2Img, svc3Img];
const showLangToggle = brand.langs.includes("en");

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>(brand.defaultLang);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored && brand.langs.includes(stored)) setLang(stored);
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

  const t = content.i18n[lang];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label={brand.name}>
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className={`transition-all duration-500 ${scrolled ? "h-10" : "h-12"} w-auto object-contain`}
              />
            ) : (
              <span className="font-display font-semibold tracking-wide" style={{ color: "var(--copper)", fontSize: scrolled ? "1.1rem" : "1.25rem" }}>
                {brand.displayParts[0]} <em className="not-italic font-light">{brand.displayParts[1]}</em>
              </span>
            )}
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <a href="#services" className="transition-colors hover:text-accent">{t.nav.services}</a>
            <a href="#about" className="transition-colors hover:text-accent">{t.nav.about}</a>
            <Link to="/services" className="transition-colors hover:text-accent">{t.nav.menu}</Link>
            <Link to="/contact" className="transition-colors hover:text-accent">{t.nav.contact}</Link>
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
                    aria-label={l === "fr" ? "Français" : "English"}
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
              <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full animate-shimmer" style={{ background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.30), transparent 70%)" }} />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, oklch(0.99 0.004 60) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            </div>
            <div className="relative space-y-6">
              <div className="text-xs uppercase tracking-[0.3em] text-copper">{t.hero.eyebrow}</div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] font-light" style={{ color: "var(--cream)" }}>
                {t.hero.title1} <span className="italic text-gradient-copper">{t.hero.title2}</span> {t.hero.title3}
              </h1>
              <p className="max-w-lg text-base sm:text-lg leading-relaxed" style={{ color: "oklch(0.99 0.004 60 / 0.75)" }}>
                {t.hero.desc}
              </p>
            </div>
            <div className="relative flex flex-wrap items-center gap-4 pt-8">
              <a
                href={brand.bookingUrl}
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
          <div className="col-span-12 sm:col-span-7 lg:col-span-4 lg:row-span-3 relative overflow-hidden rounded-[2rem] min-h-[260px] lg:min-h-0 shadow-elegant">
            <img src={heroImg} alt={brand.name} className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.12 0.02 60 / 0.70), transparent 55%)" }} />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream">
              <span className="text-xs uppercase tracking-[0.25em]">{t.hero.portraitTag}</span>
              <span className="font-display italic text-2xl">{t.hero.portraitName}</span>
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
            <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "oklch(0.99 0.004 60 / 0.8)" }}>{t.hero.location}</div>
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
              <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "oklch(0.99 0.004 60 / 0.7)" }}>{t.services.more}</span>
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
                      href={brand.bookingUrl}
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
          <div className="col-span-12 md:col-span-5 lg:col-span-4 row-span-2 rounded-[2rem] overflow-hidden shadow-elegant min-h-[420px] relative">
            <img src={aboutImg} alt={brand.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.12 0.02 60 / 0.55), transparent 60%)" }} />
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
          {t.about.experienceValue && (
            <div className="col-span-6 md:col-span-4 lg:col-span-3 rounded-[2rem] bg-espresso text-cream p-7 flex flex-col justify-between min-h-[180px]">
              <div className="font-display text-6xl text-gradient-copper">{t.about.experienceValue}</div>
              <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "oklch(0.99 0.004 60 / 0.7)" }}>{t.about.experience}</div>
            </div>
          )}

          {/* Signature + CTA tile */}
          <div className="col-span-6 md:col-span-3 lg:col-span-3 rounded-[2rem] bg-card border border-border p-4 sm:p-6 flex flex-col justify-between gap-3 min-h-[180px]">
            <p className="font-[Dancing_Script] text-lg sm:text-2xl leading-tight" style={{ color: "var(--accent)" }}>{t.about.sign}</p>
            <a
              href={brand.bookingUrl}
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
                <p className="font-display text-2xl" style={{ color: "var(--cream)" }}>{t.location.city}</p>
                <p className="text-xs uppercase tracking-[0.25em] mt-1" style={{ color: "oklch(0.99 0.004 60 / 0.7)" }}>{t.location.region}</p>
              </div>
            </div>
            {t.location.hint && (
              <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "oklch(0.99 0.004 60 / 0.7)" }}>{t.location.hint}</span>
            )}
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
              href={brand.bookingUrl}
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

          {/* Pillar 3 — wider */}
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full animate-shimmer" style={{ background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.25), transparent 60%)" }} />
            </div>
            <div className="relative space-y-5">
              <img src={flowerImg} alt="" className="h-10 w-10 animate-[spin_10s_linear_infinite]" />
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
                {t.cta.title1} <em className="text-gradient-copper not-italic font-normal">{t.cta.title2}</em> {t.cta.title3}
              </h2>
              <p className="max-w-lg text-base" style={{ color: "oklch(0.99 0.004 60 / 0.75)" }}>{t.cta.desc}</p>
            </div>
            <a
              href={brand.bookingUrl}
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
            href={`tel:${contact.phoneTel}`}
            className="col-span-6 lg:col-span-4 rounded-[2rem] bg-card border border-border p-5 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] hover:border-accent transition-colors group"
          >
            <Phone className="h-5 w-5 text-accent" />
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">{lang === "fr" ? "Téléphone" : "Phone"}</div>
              <div className="font-display text-lg sm:text-2xl whitespace-nowrap">{contact.phoneHuman}</div>
            </div>
          </a>

          {/* Email tile */}
          <a
            href={`mailto:${contact.email}`}
            className="col-span-6 lg:col-span-2 rounded-[2rem] bg-espresso text-cream p-5 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] hover:bg-copper transition-colors group"
          >
            <Mail className="h-5 w-5" />
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-1" style={{ color: "oklch(0.99 0.004 60 / 0.6)" }}>Email</div>
              <div className="text-xs sm:text-sm leading-tight break-all" style={{ color: "oklch(0.99 0.004 60 / 0.9)" }}>{contact.email}</div>
            </div>
          </a>

          {/* Address tile */}
          <div className="col-span-12 lg:col-span-2 rounded-[2rem] bg-muted/60 border border-border p-5 sm:p-6 flex flex-col gap-4 min-h-[150px] sm:min-h-[170px]">
            <MapPin className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">{lang === "fr" ? "Adresse" : "Address"}</div>
              <div className="text-xs sm:text-sm leading-snug">{contact.address}</div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`}
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

      <SiteFooter content={content} lang={lang} />
    </div>
  );
}

export function SiteFooter({ content, lang }: { content: SiteContent; lang: Lang }) {
  const { brand, contact } = content;
  const f = content.i18n[lang].footer;
  const nameTail = brand.name.split(" ").slice(brand.displayParts.filter(Boolean).length).join(" ");

  return (
    <footer className="text-cream/80 py-16 px-6" style={{ background: "var(--espresso)" }}>
      <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-10 items-start">
        <div>
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="h-16 w-auto mb-4 object-contain" />
          ) : (
            <div className="mb-4">
              <div className="font-display text-2xl font-semibold" style={{ color: "var(--copper)" }}>{brand.displayParts.filter(Boolean).join(" ")}</div>
              {nameTail && (
                <div className="text-xs uppercase tracking-[0.3em] mt-0.5" style={{ color: "oklch(0.99 0.004 60 / 0.5)" }}>{nameTail}</div>
              )}
            </div>
          )}
          <p className="text-sm max-w-xs" style={{ color: "oklch(0.99 0.004 60 / 0.7)" }}>
            {f.tagline}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-xl mb-3" style={{ color: "var(--cream)" }}>{f.contact}</h4>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-copper transition-colors"><Mail className="h-4 w-4" /><span>{contact.email}</span></a>
          <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-3 hover:text-copper transition-colors"><Phone className="h-4 w-4" /><span>{contact.phoneHuman}</span></a>
          <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{contact.address}</span></div>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-xl mb-3" style={{ color: "var(--cream)" }}>{f.follow}</h4>
          <div className="flex items-center gap-3">
            <a href={contact.socials.instagram || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={contact.socials.tiktok || "#"} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Music2 className="h-4 w-4" />
            </a>
            <a href={contact.socials.facebook || "#"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:bg-copper hover:border-transparent transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <div className="pt-4 text-xs" style={{ color: "oklch(0.99 0.004 60 / 0.6)" }}>
            <Link to="/contact" className="hover:text-copper transition-colors">{f.policy}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-cream/10 text-xs flex flex-wrap justify-between gap-3" style={{ color: "oklch(0.99 0.004 60 / 0.5)" }}>
        <span>© {new Date().getFullYear()} {brand.name}. {f.rights}</span>
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
