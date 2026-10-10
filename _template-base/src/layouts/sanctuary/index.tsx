/**
 * Sanctuary: light teal and sage, one page (after Lusora).
 *
 * Home: phone bar + nav · hero on the deep teal band (text, photo, rating
 * badge when a summary exists) · offer banner · about with photo and stats ·
 * treatments (highlight cards) · team · pricing rows · client reviews ·
 * gallery · FAQ · contact block inline (cards + hours) · CTA · footer.
 * /services and /contact exist, but the home already shows everything.
 * Every block renders only with its data; the page stays complete without.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Stars, Nav, Footer, defaultLinks, MenuList, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import type { NavLink } from "../../blocks";
import { rangesLabel, todayHours } from "../../lib/format";

/** Slim bar above the nav: phone, WhatsApp, today's hours. Hidden without any of them. */
function PhoneBar({ data }: LayoutProps) {
  const { contact } = data.content;
  const today = hasHours(data) ? todayHours(data.hours) : undefined;
  const h = data.t.hours;
  if (!contact.phoneHuman && !data.whatsappUrl && !today) return null;
  return (
    <div className="bg-hero text-hero-fg">
      <div className="container-site flex min-h-[40px] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {contact.phoneHuman && <a href={`tel:${contact.phoneTel}`} className="inline-flex min-h-[28px] items-center font-semibold hover:text-accent-soft">{contact.phoneHuman}</a>}
          {data.whatsappUrl && <a href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[28px] items-center text-hero-muted hover:text-hero-fg">WhatsApp</a>}
        </div>
        {today && <span className="text-hero-muted">{h.days[today.day]} · {rangesLabel(today.ranges, data.lang, h.closed)}</span>}
      </div>
    </div>
  );
}

function Header({ data, setLang, links }: LayoutProps & { links: NavLink[] }) {
  return (
    <>
      <PhoneBar data={data} setLang={setLang} />
      <Nav data={data} setLang={setLang} links={links} />
    </>
  );
}

function RatingBadge({ data }: LayoutProps) {
  const s = data.reviewsSummary;
  if (!s) return null;
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-hero-muted/40 bg-hero-fg/10 px-4 py-2 text-sm [&_.fill-accent]:fill-hero-fg [&_.fill-line]:fill-hero-muted/40">
      <Stars n={Math.round(s.average)} />
      <span><strong>{s.average.toFixed(1)}</strong>/5 · {s.count} {data.t.reviews.count}</span>
    </div>
  );
}

function Hero(props: LayoutProps) {
  const { data } = props;
  const { t, images } = data;
  const { brand, contact } = data.content;
  const withPhoto = !!images.hero;
  return (
    <section id="top" className="bg-hero text-hero-fg">
      <div className="container-site pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className={`grid items-center gap-10 ${withPhoto ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
          <div className="max-w-2xl">
            <div className="eyebrow text-hero-muted">{t.hero.eyebrow}</div>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
              {t.hero.title1} <em className="italic">{t.hero.title2}</em>{t.hero.title3}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty">{t.hero.desc}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
              {hasMenu(data) && <Button href="#services" variant="hero" size="lg">{t.hero.discover}</Button>}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-hero-muted">
              <RatingBadge {...props} />
              {contact.city && <span>{t.hero.location}</span>}
              {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
            </div>
          </div>
          {withPhoto && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft sm:aspect-[5/6]">
                <Img src={images.hero} alt={brand.name} eager />
              </div>
              {t.hero.portraitTag && (
                <div className="absolute bottom-5 left-5 rounded-[var(--radius)] bg-bg/90 px-4 py-2 text-sm text-fg backdrop-blur">
                  {t.hero.portraitName && <span className="font-display text-lg">{t.hero.portraitName}</span>}
                  <span className={t.hero.portraitName ? "ml-2 text-muted-fg" : "text-muted-fg"}>{t.hero.portraitTag}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const photo = images.about || images.gallery[0] || "";
  return (
    <Section id="about">
      <div className={`grid items-center gap-10 ${photo ? "lg:grid-cols-[1fr_1.15fr]" : ""}`}>
        {photo && (
          <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft">
            <Img src={photo} alt={t.hero.portraitName || data.content.brand.name} />
          </div>
        )}
        <div>
          <div className="eyebrow text-accent">{t.about.tag}</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{t.about.title1} <em className="italic text-accent">{t.about.title2}</em>{t.about.title3}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {t.about.bullets.filter(Boolean).length > 0 && (
            <ul className="mt-6 space-y-2">
              {t.about.bullets.filter(Boolean).map((b) => <li key={b} className="flex gap-3"><span className="mt-1 text-accent" aria-hidden="true">✦</span><span>{b}</span></li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-2xl italic">{t.about.sign}</p>}
          <Stats data={data} className="mt-10" />
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button></div>
        </div>
      </div>
    </Section>
  );
}

/** Treatments: the highlight cards, photo on top (fixed 4:3 frame), title and text. */
function Treatments({ data }: LayoutProps) {
  const items = data.t.services.items.filter((i) => i.title.trim());
  if (!items.length) return null;
  const imgs = data.images.svc;
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""} ${items.length === 4 ? "lg:grid-cols-4" : ""}`}>
      {items.map((it, i) => (
        <li key={it.title} className="flex flex-col overflow-hidden rounded-[calc(var(--radius)*1.5)] border border-line bg-surface">
          {imgs[i] && <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-surface-2"><Img src={imgs[i]} alt={it.title} className="absolute inset-0" /></div>}
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-2xl sm:text-3xl">{it.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-fg">{it.desc}</p>
            <div className="mt-auto pt-5"><a href={data.content.brand.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline-offset-4 hover:underline">{data.t.nav.book}</a></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Contact inline on the home: cards (phone, WhatsApp, e-mail, address) and the hours card. */
function ContactBlock({ data }: LayoutProps) {
  const { t } = data;
  const { contact } = data.content;
  const any = contact.phoneHuman || data.whatsappUrl || contact.email || hasAddress(data) || hasHours(data);
  if (!any) return null;
  return (
    <Section id="contact-block" band="surface2">
      <Heading tag={t.nav.contact} title={<>{data.content.pages[data.lang].contact.heroTitle} <em className="italic text-accent">{data.content.pages[data.lang].contact.heroAccent}</em></>} sub={data.content.contactPage[data.lang].intro || undefined} />
      <div className={`grid gap-6 ${hasHours(data) ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
        <ContactCards data={data} />
        <HoursCard data={data} />
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
      <Header data={data} setLang={setLang} links={defaultLinks(data, "home")} />
      <Hero {...props} />
      <Offer data={data} />
      <About {...props} />

      {hasMenu(data) && (
        <Section id="services" band="surface2">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} align="center" />
          <Treatments {...props} />
        </Section>
      )}

      {training && (
        <Section id="programmes">
          <Heading tag={t.programmes.tag} title={t.programmes.title} />
          <Programmes data={data} />
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team">
          <Heading tag={t.team.tag} title={t.team.title} align="center" />
          <Team data={data} />
        </Section>
      )}

      {hasMenu(data) && (
        <Section id="pricing" band={hasTeam(data) ? "surface2" : undefined}>
          <Heading tag={data.content.pages[data.lang].services.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{data.content.pages[data.lang].services.titleAccent}</em></>} />
          <div className="mx-auto max-w-4xl">
            <MenuList data={data} variant="rows" limit={12} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={data.content.brand.bookingUrl} external>{t.hero.bookNow}</Button>
              <Button href="/services" variant="outline">{t.services.seeAll}</Button>
            </div>
          </div>
        </Section>
      )}

      {hasProducts(data) && !training && (
        <Section id="boutique">
          <Heading tag={t.products.tag} title={t.products.title} />
          <Products data={data} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band="hero">
          <Heading tone="hero" tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <em className="italic">{t.pillars.title2}</em>{t.pillars.title3}</>} align="center" />
          <div className="[&_li]:bg-surface [&_li]:text-fg">
            <Reviews data={data} className="[&>p]:justify-center [&>p]:text-hero-muted [&>p_strong]:text-hero-fg [&>p_.fill-accent]:fill-hero-fg [&>p_.fill-line]:fill-hero-muted/40" />
          </div>
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} align="center" />
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface2">
          <Heading tag={t.faq.tag} title={t.faq.title} align="center" />
          <Faq data={data} className="mx-auto max-w-3xl" />
        </Section>
      )}

      <ContactBlock {...props} />

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} />
    </div>
  );
}

function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header data={data} setLang={setLang} links={defaultLinks(data, "services")} />
      <section className="bg-hero text-hero-fg">
        <div className="container-site pb-10 pt-12 sm:pb-14 sm:pt-20">
          <Heading tone="hero" tag={p.eyebrow} title={<>{t.nav.services} <em className="italic">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
          <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
        </div>
      </section>
      <Section>
        <div className="mx-auto max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
              <h3 className="font-display text-2xl">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header data={data} setLang={setLang} links={defaultLinks(data, "contact")} />
      <section className="bg-hero text-hero-fg">
        <div className="container-site pb-10 pt-12 sm:pb-14 sm:pt-20">
          <Heading tone="hero" title={<>{p.heroTitle} <em className="italic">{p.heroAccent}</em></>} sub={cp.intro} size="lg" />
          <Button href={data.content.brand.bookingUrl} external size="lg">{p.ctaLabel}</Button>
        </div>
      </section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <ContactCards data={data} />
            <Policy data={data} />
          </div>
          <div className="space-y-6">
            {hasHours(data) && (
              <div className="rounded-[var(--radius)] border border-line bg-surface p-6">
                <h3 className="mb-3 font-display text-2xl">{data.t.hours.title}</h3>
                <Hours data={data} />
              </div>
            )}
            {p.socialsLine && <p className="text-sm text-muted-fg">{p.socialsLine}</p>}
          </div>
        </div>
      </Section>
      <Footer data={data} />
    </div>
  );
}

const layout: Layout = { Home, Services, Contact };
export default layout;
