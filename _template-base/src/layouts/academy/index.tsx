/**
 * Academy: light cream, deep green, the trainings as programmes (after Ananda
 * with Makeup Studio's portfolio feel).
 *
 * Home: hero with the trainer (rating badge when a summary exists) · 4 benefit
 * tiles from the highlights · programmes (the main block) · menu extract when
 * one exists · about the trainer with stats · gallery of past sessions ·
 * reviews · FAQ · enrol CTA · small shop for physical products · footer.
 * Every block renders only with its data; the page stays complete without a
 * service menu: enrolment happens on the member's shop tab.
 */

import type { Layout, LayoutProps } from "../types";
import type { SiteData } from "../../lib/site-data";
import { hasAbout, hasFaq, hasGallery, hasHours, hasMenu, hasProducts, hasReviews, hasTeam } from "../../lib/site-data";
import type { NavLink } from "../../blocks";
import {
  Section, Heading, Button, Img, Stars, Nav, Footer, MenuList, Highlights, Team, Reviews, Gallery, Faq, Stats, Offer,
  Products, Programmes, ContactCards, Policy, Hours,
} from "../../blocks";

const hasProgrammes = (d: SiteData) => d.programmes.length > 0;
const physical = (d: SiteData) => d.products.filter((p) => p.kind === "physical");
const hasBenefits = (d: SiteData) => d.t.services.items.some((i) => i.title.trim());
/** Enrolment happens on the member's shop tab; her booking page otherwise. */
const enrolUrl = (d: SiteData) => d.content.brand.shopUrl || d.content.brand.bookingUrl;

/** Programmes first, then the menu when one exists, the trainer, the sessions. */
function links(d: SiteData, page: "home" | "services" | "contact"): NavLink[] {
  const t = d.t.nav;
  const home = page === "home";
  const out: NavLink[] = [];
  if (hasProgrammes(d)) out.push({ href: home ? "#programmes" : "/#programmes", label: t.programmes });
  if (hasMenu(d)) out.push(home ? { href: "#services", label: t.services } : { href: "/services", label: t.menu, route: true });
  if (hasAbout(d)) out.push({ href: home ? "#about" : "/#about", label: t.about });
  if (hasTeam(d)) out.push({ href: home ? "#team" : "/#team", label: t.team });
  if (hasGallery(d)) out.push({ href: home ? "#gallery" : "/#gallery", label: t.gallery });
  if (physical(d).length > 0) out.push({ href: home ? "#boutique" : "/#boutique", label: t.shop });
  if (hasFaq(d) && home) out.push({ href: "#faq", label: t.faq });
  out.push({ href: "/contact", label: t.contact, route: true });
  return out;
}

/** The header button enrols when there is no menu to book. */
const navCta = (d: SiteData) => (hasMenu(d) || !hasProgrammes(d) ? undefined : { href: enrolUrl(d), label: d.t.programmes.enrol });

function RatingBadge({ data }: { data: SiteData }) {
  const s = data.reviewsSummary;
  if (!s) return null;
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-sm">
      <Stars n={Math.round(s.average)} />
      <span><strong>{s.average.toFixed(1)}</strong>/5 · {s.count} {data.t.reviews.count}</span>
    </div>
  );
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  const photo = images.hero;
  return (
    <section id="top" className="container-site pt-10 pb-8 sm:pt-16">
      <div className={`grid items-center gap-10 ${photo ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hasProgrammes(data) && <Button href={enrolUrl(data)} external size="lg">{t.programmes.enrol}</Button>}
            {hasMenu(data)
              ? <Button href={brand.bookingUrl} external size="lg" variant="outline">{t.hero.bookNow}</Button>
              : hasProgrammes(data) && <Button href="#programmes" size="lg" variant="outline">{t.hero.discover}</Button>}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-fg">
            <RatingBadge data={data} />
            {contact.city && <span>{t.hero.location}</span>}
            {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
          </div>
        </div>
        {photo && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -right-3 -top-3 -z-10 h-2/3 w-2/3 rounded-[calc(var(--radius)*2)] bg-accent-soft" aria-hidden="true" />
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft">
              <Img src={photo} alt={t.hero.portraitName || brand.name} eager />
            </div>
            {t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-[var(--radius)] bg-white/90 px-4 py-2 text-sm text-black backdrop-blur">
                {t.hero.portraitName && <span className="font-display text-lg">{t.hero.portraitName}</span>}
                <span className={t.hero.portraitName ? "ml-2 opacity-70" : "opacity-80"}>{t.hero.portraitTag}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** The trainer: photo, story, qualities, signature, real figures. */
function Trainer({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const bullets = t.about.bullets.filter(Boolean);
  return (
    <Section id="about">
      <div className={`grid items-center gap-10 ${images.about ? "lg:grid-cols-[1fr_1.2fr]" : ""}`}>
        {images.about && (
          <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft">
            <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
          </div>
        )}
        <div>
          <div className="eyebrow text-accent">{t.about.tag}</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{t.about.title1} <em className="italic text-accent">{t.about.title2}</em>{t.about.title3}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-2">
              {bullets.map((b) => <li key={b} className="flex gap-3"><span className="mt-1 text-accent" aria-hidden="true">✦</span><span>{b}</span></li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-2xl italic">{t.about.sign}</p>}
          <Stats data={data} className="mt-10" />
          <div className="mt-8">
            {hasProgrammes(data)
              ? <Button href={enrolUrl(data)} external>{t.programmes.enrol}</Button>
              : <Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button>}
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Closing call to enrol (and to book when a menu exists). */
function EnrolCta({ data, className = "" }: { data: SiteData; className?: string }) {
  const c = data.t.cta;
  const ghost = "border-hero-muted/50 text-hero-fg hover:bg-hero-fg/10";
  return (
    <div className={`rounded-[calc(var(--radius)*1.5)] bg-hero px-6 py-14 text-center text-hero-fg sm:px-12 sm:py-20 ${className}`}>
      <h2 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">{c.title1} <em className="italic">{c.title2}</em>{c.title3}</h2>
      {c.desc && <p className="mx-auto mt-4 max-w-xl text-base text-hero-muted sm:text-lg">{c.desc}</p>}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {hasProgrammes(data) && <Button href={enrolUrl(data)} external size="lg">{data.t.programmes.enrol}</Button>}
        {(hasMenu(data) || !hasProgrammes(data)) && <Button href={data.content.brand.bookingUrl} external size="lg" variant={hasProgrammes(data) ? "outline" : "primary"} className={hasProgrammes(data) ? ghost : ""}>{c.bookNow}</Button>}
        {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline" className={ghost}>{c.whatsapp}</Button>}
      </div>
    </div>
  );
}

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  const shop = physical(data);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "home")} cta={navCta(data)} />
      <Offer data={data} />
      <Hero {...props} />

      {hasBenefits(data) && (
        <Section id="benefits" pad="py-12 sm:py-16">
          <Heading tag={t.pillars.tag} title={<>{t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}</>} />
          <Highlights data={data} variant="tiles" />
        </Section>
      )}

      {hasProgrammes(data) && (
        <Section id="programmes" band="surface2">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
            <div>
              <div className="eyebrow text-accent">{t.programmes.tag}</div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">{t.programmes.title}</h2>
            </div>
            <Button href={enrolUrl(data)} external variant="outline">{t.programmes.enrol}</Button>
          </div>
          <Programmes data={data} />
        </Section>
      )}

      {hasMenu(data) && (
        <Section id="services">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} />
          <MenuList data={data} variant="rows" limit={8} />
          <div className="mt-8"><Button href="/services" variant="outline">{t.services.seeAll}</Button></div>
        </Section>
      )}

      <Trainer {...props} />

      {hasTeam(data) && (
        <Section id="team" band="surface2">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery" band={hasTeam(data) ? undefined : "surface2"}>
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      {hasReviews(data) && (
        <Section id="reviews">
          <Heading tag={t.reviews.tag} title={t.reviews.title} />
          <Reviews data={data} variant="quotes" className="mx-auto max-w-3xl" />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface2">
          <Heading tag={t.faq.tag} title={t.faq.title} align="center" />
          <Faq data={data} className="mx-auto max-w-3xl" />
        </Section>
      )}

      <Section pad="py-10 sm:py-16"><EnrolCta data={data} /></Section>

      {shop.length > 0 && (
        <Section id="boutique" pad="pb-16 sm:pb-24">
          <Heading tag={t.products.tag} title={t.products.title} size="sm" />
          <Products data={data} items={shop} variant="list" className="mx-auto max-w-3xl" />
        </Section>
      )}

      <Footer data={data} />
    </div>
  );
}

/** The menu when one exists; otherwise the programmes and the shop. */
function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  const menu = hasMenu(data);
  const shop = physical(data);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "services")} cta={navCta(data)} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        {menu
          ? <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
          : <Heading tag={t.programmes.tag} title={hasProgrammes(data) ? t.programmes.title : t.products.title} size="lg" />}
        {menu
          ? <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          : hasProgrammes(data) ? <Button href={enrolUrl(data)} external size="lg">{t.programmes.enrol}</Button>
          : hasProducts(data) && <Button href={enrolUrl(data)} external size="lg">{t.products.order}</Button>}
      </Section>
      <Section pad="pb-16 sm:pb-24">
        {menu ? (
          <div className="mx-auto max-w-4xl">
            <MenuList data={data} variant="rows" />
            {(p.infoText || p.depositLine) && (
              <div className="mt-14 rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
                <h3 className="font-display text-2xl">{p.infoTitle}</h3>
                {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
                {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            <Programmes data={data} />
            {shop.length > 0 && (
              <div>
                <Heading tag={t.products.tag} title={t.products.title} size="sm" />
                <Products data={data} items={shop} />
              </div>
            )}
          </div>
        )}
      </Section>
      <Section pad="pb-16"><EnrolCta data={data} /></Section>
      <Footer data={data} />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  const cta = hasMenu(data) || !hasProgrammes(data) ? { href: data.content.brand.bookingUrl, label: p.ctaLabel } : { href: enrolUrl(data), label: data.t.programmes.enrol };
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "contact")} cta={navCta(data)} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading title={<>{p.heroTitle} <em className="italic text-accent">{p.heroAccent}</em></>} sub={cp.intro} size="lg" />
        <Button href={cta.href} external size="lg">{cta.label}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
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
