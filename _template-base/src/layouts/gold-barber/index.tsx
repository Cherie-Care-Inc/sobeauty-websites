/**
 * Gold barber: black and gold, condensed uppercase, hours and WhatsApp in
 * plain sight (after UrbanCut). Sharp corners: the registry sets radius 0.
 *
 * Home: full-width photo hero with the title over it · info bar (today's
 * hours, WhatsApp, address) · 3 service cards · starting price (the cheapest
 * menu item) and menu extract · latest cuts gallery · why-us tiles · about ·
 * barbers · reviews · find us with hours · CTA · footer with hours.
 * Every block renders only with its data.
 */

import type { Layout, LayoutProps } from "../types";
import type { SiteData } from "../../lib/site-data";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews } from "../../lib/site-data";
import { rangesLabel, todayHours, todayIndex } from "../../lib/format";
import {
  Section, Button, Img, Nav, Footer, defaultLinks, MenuList, Highlights, Team, Reviews, Gallery, Faq, Stats,
  Offer, Marquee, BookCta, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Condensed uppercase heading with a short gold rule. */
function Title({ tag, children, size = "md", align = "left", className = "" }: { tag?: string; children: ReactNode; size?: "md" | "lg"; align?: "left" | "center"; className?: string }) {
  const h = size === "lg" ? "text-5xl sm:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl";
  const c = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`mb-10 max-w-3xl sm:mb-12 ${c} ${className}`}>
      {tag && <div className="eyebrow mb-3 text-accent">{tag}</div>}
      <h2 className={`font-display ${h} font-semibold uppercase leading-[0.95] tracking-wide text-balance`}>{children}</h2>
      <div className={`mt-5 h-0.5 w-12 bg-accent ${align === "center" ? "mx-auto" : ""}`} aria-hidden="true" />
    </div>
  );
}

/** "25 000 FCFA" → 25000, "12,50 €" → 12.5, "1.250.000" → 1250000. NaN when no digit. */
function priceValue(s: string): number {
  const m = s.replace(/[\s  ]/g, "").match(/\d[\d.,]*/);
  if (!m) return Number.NaN;
  const n = /[.,]\d{3}(?:[.,]|$)/.test(m[0]) ? m[0].replace(/[.,](?=\d{3})/g, "") : m[0].replace(",", ".");
  return parseFloat(n);
}

function cheapest(data: SiteData): { name: string; price: string } | null {
  let best: { v: number; name: string; price: string } | null = null;
  for (const g of data.menu) for (const it of g.items) {
    const v = priceValue(it.price);
    if (!Number.isNaN(v) && (!best || v < best.v)) best = { v, name: it.name, price: it.price };
  }
  return best;
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand } = data.content;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-hero text-hero-fg">
      {images.hero && (
        <div className="absolute inset-0 -z-10">
          <Img src={images.hero} alt={brand.name} eager />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
        </div>
      )}
      <div className="container-site flex min-h-[78vh] flex-col items-center justify-center py-24 text-center sm:py-32">
        <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
        <h1 className="mt-5 max-w-5xl font-display text-6xl font-bold uppercase leading-[0.9] tracking-wide text-balance sm:text-8xl lg:text-[7.5rem]">
          {t.hero.title1} <span className="text-accent">{t.hero.title2}</span>{t.hero.title3}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty">{t.hero.desc}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="hero">{t.cta.whatsapp}</Button>}
        </div>
        {t.hero.leadService && (
          <div className="mt-8 inline-flex items-center gap-2 border border-accent/60 px-4 py-2 text-sm">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />{t.hero.leadService}
          </div>
        )}
      </div>
    </section>
  );
}

/** Today's hours, WhatsApp and the address, in one bar under the hero. */
function InfoBar({ data }: LayoutProps) {
  const { t } = data;
  const { contact } = data.content;
  const today = hasHours(data) ? todayHours(data.hours) : undefined;
  const cells = [
    today && { label: `${t.hours.days[todayIndex()]} · ${t.hours.today}`, value: rangesLabel(today.ranges, data.lang, t.hours.closed), href: "#visit" },
    data.whatsappUrl && { label: "WhatsApp", value: contact.phoneHuman || t.cta.whatsapp, href: data.whatsappUrl, external: true },
    hasAddress(data) && { label: t.location.city, value: contact.address, href: contact.mapsUrl || "/contact", external: !!contact.mapsUrl },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[];
  if (!cells.length) return null;
  return (
    <div className="border-y border-line bg-surface">
      <ul className={`container-site grid divide-y divide-line sm:divide-x sm:divide-y-0 ${cells.length === 3 ? "sm:grid-cols-3" : cells.length === 2 ? "sm:grid-cols-2" : ""}`}>
        {cells.map((c) => (
          <li key={c.label} className="py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block hover:text-accent">
              <div className="eyebrow text-accent">{c.label}</div>
              <div className="mt-1 truncate font-display text-xl uppercase tracking-wide">{c.value}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StartingPrice({ data }: LayoutProps) {
  const t = data.t.services;
  const item = cheapest(data);
  if (!item) return null;
  return (
    <div className="mt-12 flex flex-col gap-6 bg-accent px-6 py-8 text-accent-fg sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <div>
        <div className="eyebrow">{t.from}</div>
        <div className="mt-1 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">{item.price}</div>
        <div className="mt-2 text-sm font-medium">{item.name}</div>
      </div>
      <a href="/services" className="inline-flex items-center justify-center bg-accent-fg px-6 py-3 text-sm font-semibold text-accent transition-transform hover:scale-[1.02] sm:text-base">{t.seeAll}</a>
    </div>
  );
}

/** Why us: the trust pillars as tiles, plus WhatsApp and hours when they exist. */
function WhyUs({ data }: LayoutProps) {
  const { t } = data;
  const pillars = t.pillars.items.filter((p) => p.label.trim() && p.text.trim());
  const today = hasHours(data) ? todayHours(data.hours) : undefined;
  const extras = [
    data.whatsappUrl && { label: "WhatsApp", text: t.cta.whatsapp, href: data.whatsappUrl },
    today && { label: t.hours.title, text: `${t.hours.days[todayIndex()]} · ${rangesLabel(today.ranges, data.lang, t.hours.closed)}`, href: "#visit" },
  ].filter(Boolean) as { label: string; text: string; href: string }[];
  const tiles = [...pillars.map((p) => ({ ...p, href: "" })), ...extras];
  if (!tiles.length) return null;
  return (
    <Section id="why" band="surface2">
      <Title tag={t.pillars.tag}>{t.pillars.title1} <span className="text-accent">{t.pillars.title2}</span>{t.pillars.title3}</Title>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((p, i) => {
          const inner = (
            <>
              <div className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-4 font-display text-xl uppercase tracking-wide">{p.label}</div>
              <p className="mt-2 leading-relaxed text-muted-fg">{p.text}</p>
            </>
          );
          return (
            <li key={p.label} className="border border-line bg-surface p-6 sm:p-8">
              {p.href ? <a href={p.href} {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block hover:text-accent">{inner}</a> : inner}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const bullets = t.about.bullets.filter(Boolean);
  return (
    <Section id="about">
      <div className={`grid items-center gap-10 lg:gap-16 ${images.about ? "lg:grid-cols-2" : ""}`}>
        <div>
          <Title tag={t.about.tag}>{t.about.title1} <span className="text-accent">{t.about.title2}</span>{t.about.title3}</Title>
          <p className="text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => <li key={b} className="flex gap-3"><span className="mt-2 h-1.5 w-4 shrink-0 bg-accent" aria-hidden="true" /><span>{b}</span></li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-2xl uppercase tracking-wide text-accent">{t.about.sign}</p>}
          <Stats data={data} tone="dark" className="mt-10" />
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button></div>
        </div>
        {images.about && (
          <div className="border border-accent/40 p-2 sm:p-3">
            <div className="aspect-[4/5] overflow-hidden bg-surface-2 sm:aspect-[5/6]">
              <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
            </div>
          </div>
        )}
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
      <InfoBar {...props} />

      {hasMenu(data) && (
        <Section id="services">
          <Title tag={t.services.tag}>{t.services.title1} <span className="text-accent">{t.services.title2}</span>{t.services.title3}</Title>
          <Highlights data={data} variant="cards" />
          <StartingPrice {...props} />
          <div className="mt-14">
            <MenuList data={data} variant="rows" limit={8} />
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

      {hasGallery(data) && (
        <Section id="gallery" band="surface2">
          <Title tag={t.gallery.tag}>{t.gallery.title}</Title>
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      <Marquee data={data} tone="dark" />
      <WhyUs {...props} />
      <About {...props} />

      {hasTeam(data) && (
        <Section id="team" band="surface2">
          <Title tag={t.team.tag}>{t.team.title}</Title>
          <Team data={data} />
        </Section>
      )}

      {hasReviews(data) && (
        <Section id="reviews">
          <Title tag={t.reviews.tag}>{t.reviews.title}</Title>
          <Reviews data={data} variant="cards" />
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
              <Title tag={t.nav.contact}>{t.location.city}</Title>
              {hasAddress(data) && <p className="text-lg text-muted-fg">{data.content.contact.address}</p>}
              {t.location.hint && <p className="mt-1 text-muted-fg">{t.location.hint}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {data.content.contact.mapsUrl && <Button href={data.content.contact.mapsUrl} external variant="outline">{t.location.directions}</Button>}
                {data.whatsappUrl && <Button href={data.whatsappUrl} external>{t.cta.whatsapp}</Button>}
                <Link to="/contact" className="inline-flex items-center px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
              </div>
            </div>
            <HoursCard data={data} />
          </div>
        </Section>
      )}

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" className="[&_h2]:uppercase [&_h2]:tracking-wide [&_em]:not-italic" /></Section>
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
        <Title tag={p.eyebrow} size="lg" className="mb-6">{t.nav.services} <span className="text-accent">{p.titleAccent}</span></Title>
        {p.subtitle && <p className="mb-8 max-w-2xl text-lg text-muted-fg">{p.subtitle}</p>}
        <div className="flex flex-wrap gap-3">
          <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline">{t.cta.whatsapp}</Button>}
        </div>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 border border-line bg-surface p-6 sm:p-8">
              <h3 className="font-display text-2xl uppercase tracking-wide">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} tone="accent" className="[&_h2]:uppercase [&_h2]:tracking-wide [&_em]:not-italic" /></Section>
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
        <Title size="lg" className="mb-6">{p.heroTitle} <span className="text-accent">{p.heroAccent}</span></Title>
        {cp.intro && <p className="mb-8 max-w-2xl text-lg text-muted-fg">{cp.intro}</p>}
        <div className="flex flex-wrap gap-3">
          <Button href={data.content.brand.bookingUrl} external size="lg">{p.ctaLabel}</Button>
          {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline">{data.t.cta.whatsapp}</Button>}
        </div>
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
