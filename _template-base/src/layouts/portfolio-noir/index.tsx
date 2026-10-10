/**
 * Portfolio noir: black page, wide type (Archivo), the work shown big
 * (after Makeup Studio). For makeup artists, weddings and events.
 *
 * Home: giant wordmark hero with one portrait · marquee · about ("based in
 * <city>") with the audience tiles from the highlights · gallery as the main
 * event (masonry) · reviews as uppercase quotes · FAQ · "let's work together"
 * CTA · footer. The menu lives on /services only, prices in a plain list.
 * Every block renders only with its data.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasGallery, hasFaq, hasReviews, hasTeam } from "../../lib/site-data";
import {
  Section, Button, Img, Stars, Nav, Footer, defaultLinks, MenuList, Team, Reviews, Gallery, Faq, Stats,
  Offer, Marquee, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import type { NavLink } from "../../blocks";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Wide uppercase heading. */
function Title({ tag, children, size = "md", className = "" }: { tag?: string; children: ReactNode; size?: "md" | "lg"; className?: string }) {
  const h = size === "lg" ? "text-4xl sm:text-6xl lg:text-8xl" : "text-3xl sm:text-5xl lg:text-6xl";
  return (
    <div className={`mb-10 max-w-4xl sm:mb-14 ${className}`}>
      {tag && <div className="eyebrow mb-3 text-muted-fg">{tag}</div>}
      <h2 className={`break-words font-display ${h} font-bold uppercase leading-[0.92] tracking-[-0.02em] text-balance [font-stretch:115%]`}>{children}</h2>
    </div>
  );
}

/** Home links: the menu is a page here, not a section. */
function homeLinks(data: LayoutProps["data"]): NavLink[] {
  return defaultLinks(data, "home").map((l) => (l.href === "#services" ? { href: "/services", label: data.t.nav.menu, route: true } : l));
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand } = data.content;
  const [w1, w2] = brand.displayParts;
  return (
    <section id="top" className="container-site pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="eyebrow text-muted-fg">{t.hero.eyebrow}</div>
      <h1 className="mt-6 break-words font-display text-[clamp(2.75rem,9vw,9.5rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] [font-stretch:125%]">
        {w1}{w2 ? <><br />{w2}</> : null}
      </h1>
      <div className={`mt-10 grid gap-10 ${images.hero ? "lg:grid-cols-[1.35fr_1fr] lg:items-end" : ""}`}>
        <div className="min-w-0">
          <p className="max-w-2xl font-display text-2xl uppercase leading-tight tracking-wide sm:text-3xl [font-stretch:110%]">
            {t.hero.title1} <span className="text-muted-fg">{t.hero.title2}</span>{t.hero.title3}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
            {hasGallery(data) && <Button href="#gallery" variant="outline" size="lg">{t.nav.gallery}</Button>}
            {!hasGallery(data) && hasMenu(data) && <Button href="/services" variant="outline" size="lg">{t.hero.discover}</Button>}
          </div>
          {t.hero.leadService && <p className="mt-6 text-sm text-muted-fg">{t.hero.leadService}</p>}
        </div>
        {images.hero && (
          <div className="relative w-full max-w-md justify-self-start lg:max-w-none lg:justify-self-end">
            <div className="aspect-[4/5] overflow-hidden bg-surface-2">
              <Img src={images.hero} alt={t.hero.portraitName || brand.name} eager />
            </div>
            {(t.hero.portraitName || t.hero.portraitTag) && (
              <div className="absolute bottom-0 left-0 bg-accent px-4 py-2 text-accent-fg">
                {t.hero.portraitName && <span className="font-display text-base font-bold uppercase tracking-wide">{t.hero.portraitName}</span>}
                {t.hero.portraitTag && <span className={`text-xs uppercase tracking-wider ${t.hero.portraitName ? "ml-3" : ""}`}>{t.hero.portraitTag}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** About with the city line, then the audience tiles built from the highlights. */
function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const tiles = t.services.items.filter((i) => i.title.trim());
  const imgs = images.svc;
  const bullets = t.about.bullets.filter(Boolean);
  const place = [t.location.city, t.location.region && t.location.region !== t.location.city ? t.location.region : ""].filter(Boolean).join(" · ");
  return (
    <Section id="about" band="surface2">
      <div className={`grid gap-10 lg:gap-16 ${images.about ? "lg:grid-cols-[1fr_1.3fr] lg:items-center" : ""}`}>
        {images.about && (
          <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-surface lg:max-w-none">
            <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="eyebrow text-muted-fg">{t.about.tag}</span>
            {place && (
              <span className="inline-flex items-center gap-2 border border-line px-3 py-1 text-xs uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />{place}
              </span>
            )}
          </div>
          <h2 className="mt-5 break-words font-display text-3xl font-bold uppercase leading-[0.95] tracking-[-0.02em] sm:text-5xl lg:text-6xl [font-stretch:115%]">
            {t.about.title1} <span className="text-muted-fg">{t.about.title2}</span>{t.about.title3}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {bullets.map((b) => <li key={b} className="border border-line px-3 py-1.5 text-sm">{b}</li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-xl uppercase tracking-wide">{t.about.sign}</p>}
          <Stats data={data} tone="dark" className="mt-10" />
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button></div>
        </div>
      </div>
      {tiles.length > 0 && (
        <ul className={`mt-14 grid gap-4 sm:mt-20 ${tiles.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {tiles.map((it, i) => (
            <li key={it.title} className="flex flex-col border border-line bg-surface">
              {imgs[i] && <div className="aspect-[4/3] overflow-hidden bg-surface-2"><Img src={imgs[i]} alt={it.title} className="grayscale transition-all duration-700 hover:grayscale-0" /></div>}
              <div className="flex flex-1 flex-col p-6">
                <div className="font-display text-sm text-muted-fg">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-wide">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-fg">{it.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/** Real reviews as big uppercase quotes; without them the trust pillars. */
function Quotes({ data }: LayoutProps) {
  const { t } = data;
  if (hasReviews(data)) {
    const s = data.reviewsSummary;
    return (
      <Section id="reviews">
        <Title tag={t.reviews.tag}>{t.reviews.title}</Title>
        {s && (
          <p className="mb-6 flex items-center gap-3 text-sm text-muted-fg">
            <Stars n={Math.round(s.average)} />
            <span><strong className="text-fg">{s.average.toFixed(1)}</strong>/5 · {s.count} {t.reviews.count}</span>
          </p>
        )}
        <ul className="divide-y divide-line border-y border-line">
          {data.reviews.slice(0, 4).map((r, i) => (
            <li key={i} className="grid gap-4 py-10 lg:grid-cols-[1fr_14rem]">
              <blockquote className="font-display text-2xl font-bold uppercase leading-[1.05] tracking-[-0.01em] text-balance sm:text-3xl lg:text-4xl [font-stretch:110%]">{r.text}</blockquote>
              <figcaption className="text-sm text-muted-fg lg:text-right">
                <Stars n={r.rating} />
                <div className="mt-2 text-fg">{r.author}</div>
                {r.service && <div>{r.service}</div>}
              </figcaption>
            </li>
          ))}
        </ul>
      </Section>
    );
  }
  if (!t.pillars.items.length) return null;
  return (
    <Section id="reviews">
      <Title tag={t.pillars.tag}>{t.pillars.title1} <span className="text-muted-fg">{t.pillars.title2}</span>{t.pillars.title3}</Title>
      <Reviews data={data} variant="pillars-only" />
    </Section>
  );
}

/** "Let's work together": the closing band on the accent (white on this layout). */
function WorkTogether({ data }: LayoutProps) {
  const c = data.t.cta;
  return (
    <section className="bg-accent text-accent-fg">
      <div className="container-site py-16 sm:py-24">
        <h2 className="max-w-5xl break-words font-display text-4xl font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-balance sm:text-7xl lg:text-8xl [font-stretch:120%]">
          {c.title1} {c.title2}{c.title3}
        </h2>
        {c.desc && <p className="mt-6 max-w-xl text-lg opacity-80">{c.desc}</p>}
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={data.content.brand.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-accent-fg px-7 py-4 font-semibold text-accent transition-transform hover:scale-[1.02]">{c.bookNow}</a>
          {data.whatsappUrl && <a href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center border border-accent-fg px-7 py-4 font-semibold transition-colors hover:bg-accent-fg hover:text-accent">{c.whatsapp}</a>}
        </div>
      </div>
    </section>
  );
}

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  const training = data.content.category === "training" && data.programmes.length > 0;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={homeLinks(data)} tone="dark" />
      <Offer data={data} />
      <Hero {...props} />
      <Marquee data={data} tone="dark" />
      <About {...props} />

      {training && (
        <Section id="programmes">
          <Title tag={t.programmes.tag}>{t.programmes.title}</Title>
          <Programmes data={data} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery" pad="py-16 sm:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Title tag={t.gallery.tag} size="lg" className="mb-0 sm:mb-0">{t.gallery.title}</Title>
            <Button href={data.content.brand.bookingUrl} external variant="outline" className="self-start">{t.hero.bookNow}</Button>
          </div>
          <Gallery data={data} variant="masonry" className="mt-10 sm:mt-14" />
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team" band="surface2">
          <Title tag={t.team.tag}>{t.team.title}</Title>
          <Team data={data} />
        </Section>
      )}

      <Quotes {...props} />

      {hasProducts(data) && !training && (
        <Section id="boutique" band="surface2">
          <Title tag={t.products.tag}>{t.products.title}</Title>
          <Products data={data} />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface2">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <Title tag={t.faq.tag} className="mb-0">{t.faq.title}</Title>
            <Faq data={data} />
          </div>
        </Section>
      )}

      {(hasHours(data) || hasAddress(data)) && (
        <Section id="visit">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Title tag={t.nav.contact} className="mb-6">{t.location.city}</Title>
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

      <WorkTogether {...props} />
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
        <Title tag={p.eyebrow} size="lg" className="mb-6">{t.nav.services} <span className="text-muted-fg">{p.titleAccent}</span></Title>
        {p.subtitle && <p className="mb-8 max-w-2xl text-lg text-muted-fg">{p.subtitle}</p>}
        <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="max-w-3xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 border-t border-line pt-6">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <WorkTogether data={data} setLang={setLang} />
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
        <Title size="lg" className="mb-6">{p.heroTitle} <span className="text-muted-fg">{p.heroAccent}</span></Title>
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
                <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-wide">{data.t.hours.title}</h3>
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
