/**
 * Editorial dark: black page, huge uppercase display titles, red accent
 * (after Salonix). For a premium salon that wants impact.
 *
 * Home: full-bleed photo hero with the lead-service chip · marquee · 4-tile
 * highlights strip · numbered menu with prices · about (photo, bullets, stats)
 * · team · reviews as big quotes · gallery strip · FAQ · visit · CTA on the
 * accent · footer. Every block renders only with its data.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews } from "../../lib/site-data";
import {
  Section, Button, Img, Nav, Footer, defaultLinks, MenuList, Highlights, Team, Reviews, Gallery, Faq, Stats,
  Offer, Marquee, BookCta, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Uppercase display heading, the signature of this layout. */
function Title({ tag, children, size = "md", className = "" }: { tag?: string; children: ReactNode; size?: "md" | "lg"; className?: string }) {
  const h = size === "lg" ? "text-[2.75rem] sm:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl lg:text-6xl";
  return (
    <div className={`mb-10 max-w-4xl sm:mb-14 ${className}`}>
      {tag && <div className="eyebrow mb-3 text-accent">{tag}</div>}
      <h2 className={`font-display ${h} font-semibold uppercase leading-[0.95] tracking-tight text-balance`}>{children}</h2>
    </div>
  );
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-hero text-hero-fg">
      {images.hero && (
        <div className="absolute inset-0 -z-10">
          <Img src={images.hero} alt={brand.name} eager />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        </div>
      )}
      <div className="container-site flex min-h-[80vh] flex-col justify-end pb-14 pt-28 sm:pb-20 sm:pt-36">
        <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
        <h1 className="mt-4 max-w-5xl font-display text-[3rem] font-bold uppercase leading-[0.92] tracking-tight text-balance sm:text-7xl lg:text-8xl">
          {t.hero.title1} <span className="text-accent">{t.hero.title2}</span>{t.hero.title3}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty">{t.hero.desc}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          {hasMenu(data) && <Button href="#services" variant="hero" size="lg">{t.hero.discover}</Button>}
        </div>
        {(t.hero.leadService || contact.city) && (
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
            {t.hero.leadService && (
              <span className="inline-flex items-center gap-2 border border-hero-muted/40 bg-black/50 px-4 py-2 backdrop-blur">
                <span className="h-2 w-2 bg-accent" aria-hidden="true" />
                {t.hero.leadService}
              </span>
            )}
            {contact.city && <span className="text-hero-muted">{t.hero.location}</span>}
          </div>
        )}
      </div>
    </section>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const bullets = t.about.bullets.filter(Boolean);
  return (
    <Section id="about" band="surface2">
      <div className={`grid items-center gap-10 lg:gap-16 ${images.about ? "lg:grid-cols-[1fr_1.15fr]" : ""}`}>
        {images.about && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden bg-surface">
              <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
            </div>
            {t.about.experienceValue && (
              <div className="absolute -bottom-4 -right-2 bg-accent px-5 py-4 text-accent-fg sm:-right-4">
                <div className="font-display text-4xl font-bold leading-none">{t.about.experienceValue}</div>
                <div className="mt-1 text-xs uppercase tracking-wider">{t.about.experience}</div>
              </div>
            )}
          </div>
        )}
        <div>
          <Title tag={t.about.tag} className="mb-6 sm:mb-8">{t.about.title1} <span className="text-accent">{t.about.title2}</span>{t.about.title3}</Title>
          <p className="text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => <li key={b} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 bg-accent" aria-hidden="true" /><span>{b}</span></li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-2xl uppercase tracking-wide">{t.about.sign}</p>}
          <Stats data={data} tone="dark" className="mt-10" />
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button></div>
        </div>
      </div>
    </Section>
  );
}

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  const training = data.content.category === "training" && data.programmes.length > 0;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "home")} tone="dark" />
      <Offer data={data} />
      <Hero {...props} />
      <Marquee data={data} tone="dark" />

      {hasMenu(data) && (
        <Section id="services">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Title tag={t.services.tag} className="mb-0 sm:mb-0">{t.services.title1} <span className="text-accent">{t.services.title2}</span>{t.services.title3}</Title>
            <Button href="/services" variant="outline" className="mb-2 self-start lg:self-auto">{t.services.seeAll}</Button>
          </div>
          <Highlights data={data} variant="tiles" className="mt-10 sm:mt-14" />
          <div className="mt-14 border-t border-line pt-10 sm:mt-20">
            <MenuList data={data} variant="numbered" limit={8} />
            <div className="mt-8"><Button href="/services" variant="outline">{t.services.seeAll}</Button></div>
          </div>
        </Section>
      )}

      {training && (
        <Section id="programmes" band="surface2">
          <Title tag={t.programmes.tag}>{t.programmes.title}</Title>
          <Programmes data={data} />
        </Section>
      )}

      <About {...props} />

      {hasTeam(data) && (
        <Section id="team">
          <Title tag={t.team.tag}>{t.team.title}</Title>
          <Team data={data} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band={hasTeam(data) ? "surface2" : undefined}>
          {hasReviews(data)
            ? <Title tag={t.reviews.tag}>{t.reviews.title}</Title>
            : <Title tag={t.pillars.tag}>{t.pillars.title1} <span className="text-accent">{t.pillars.title2}</span>{t.pillars.title3}</Title>}
          <Reviews data={data} variant="quotes" className="max-w-4xl [&_blockquote]:font-display [&_blockquote]:text-2xl [&_blockquote]:leading-snug sm:[&_blockquote]:text-3xl" />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Title tag={t.gallery.tag}>{t.gallery.title}</Title>
          <Gallery data={data} variant="strip" />
        </Section>
      )}

      {hasProducts(data) && !training && (
        <Section id="boutique" band="surface2">
          <Title tag={t.products.tag}>{t.products.title}</Title>
          <Products data={data} />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq">
          <Title tag={t.faq.tag}>{t.faq.title}</Title>
          <Faq data={data} className="max-w-3xl" />
        </Section>
      )}

      {(hasHours(data) || hasAddress(data)) && (
        <Section id="visit" band="surface2">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Title tag={t.nav.contact} className="mb-4 sm:mb-6">{t.location.city}</Title>
              {hasAddress(data) && <p className="text-lg text-muted-fg">{data.content.contact.address}</p>}
              {t.location.hint && <p className="mt-1 text-muted-fg">{t.location.hint}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {data.content.contact.mapsUrl && <Button href={data.content.contact.mapsUrl} external variant="outline">{t.location.directions}</Button>}
                <Link to="/contact" className="inline-flex items-center px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
              </div>
            </div>
            <HoursCard data={data} />
          </div>
        </Section>
      )}

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" className="[&_h2]:uppercase [&_h2]:tracking-tight [&_em]:not-italic" /></Section>
      <Footer data={data} tone="dark" />
    </div>
  );
}

function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "services")} tone="dark" />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Title tag={p.eyebrow} size="lg" className="mb-4 sm:mb-6">{t.nav.services} <span className="text-accent">{p.titleAccent}</span></Title>
        {p.subtitle && <p className="mb-8 max-w-2xl text-lg text-muted-fg">{p.subtitle}</p>}
        <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="numbered" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 border-l-2 border-accent bg-surface-2 p-6 sm:p-8">
              <h3 className="font-display text-2xl uppercase tracking-wide">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} tone="accent" className="[&_h2]:uppercase [&_h2]:tracking-tight [&_em]:not-italic" /></Section>
      <Footer data={data} tone="dark" />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "contact")} tone="dark" />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Title size="lg" className="mb-4 sm:mb-6">{p.heroTitle} <span className="text-accent">{p.heroAccent}</span></Title>
        {cp.intro && <p className="mb-8 max-w-2xl text-lg text-muted-fg">{cp.intro}</p>}
        <Button href={data.content.brand.bookingUrl} external size="lg">{p.ctaLabel}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <ContactCards data={data} />
            <Policy data={data} />
          </div>
          <div className="space-y-6">
            {hasHours(data) && (
              <div className="border border-line bg-surface p-6">
                <h3 className="mb-3 font-display text-2xl uppercase tracking-wide">{data.t.hours.title}</h3>
                <Hours data={data} />
              </div>
            )}
            {p.socialsLine && <p className="text-sm text-muted-fg">{p.socialsLine}</p>}
          </div>
        </div>
      </Section>
      <Footer data={data} tone="dark" />
    </div>
  );
}

const layout: Layout = { Home, Services, Contact };
export default layout;
