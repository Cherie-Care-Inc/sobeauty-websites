/**
 * Sand: sand paper background, italic serif, calm (after Opalya).
 *
 * Home: nav · offer · hero (text + photo) · address and hours marquee ·
 * the story (about with photo, signature) · stats · treatments (numbered
 * rows with photos) · pricing rows · packs (physical products named like
 * packs) · other products · reviews · gallery · FAQ · contact · CTA · footer.
 * Every block renders only with its data; the page stays complete without.
 */

import type { ReactNode } from "react";
import type { Layout, LayoutProps } from "../types";
import type { Product } from "../../site-content";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews, hasStats } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Nav, Footer, defaultLinks, MenuList, Highlights, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, Programmes, ProductImages, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { rangesLabel, todayHours } from "../../lib/format";

/** Subtle paper grain over the sand background (pure black and white, so it suits any brand). */
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const PACK = /(pack|forfait|abonnement|cure|membership|formule|carte de|séances|sessions|bundle)/i;
const isPack = (p: Product) => p.kind === "physical" && PACK.test(p.name);

function Page({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-bg text-fg" style={{ backgroundImage: GRAIN }}>{children}</div>;
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  const withPhoto = !!images.hero;
  return (
    <section id="top" className="container-site pb-10 pt-10 sm:pb-16 sm:pt-16">
      <div className={`grid items-center gap-10 ${withPhoto ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
            {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline">{t.cta.whatsapp}</Button>}
          </div>
          {(contact.city || t.hero.leadService) && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-fg">
              {contact.city && <span>{t.hero.location}</span>}
              {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
            </div>
          )}
        </div>
        {withPhoto && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*3)] rounded-tl-none bg-surface-2 shadow-soft">
              <Img src={images.hero} alt={brand.name} eager />
            </div>
            {t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-[var(--radius)] bg-bg/90 px-4 py-2 text-sm backdrop-blur">
                {t.hero.portraitName && <span className="font-display text-lg italic">{t.hero.portraitName}</span>}
                <span className={t.hero.portraitName ? "ml-2 text-muted-fg" : "text-muted-fg"}>{t.hero.portraitTag}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Address, today's hours, phone and the service words, scrolling under the hero. */
function InfoMarquee({ data }: LayoutProps) {
  const { t } = data;
  const { contact } = data.content;
  const today = hasHours(data) ? todayHours(data.hours) : undefined;
  const items = [
    hasAddress(data) ? contact.address : contact.city,
    today ? `${t.hours.days[today.day]} · ${rangesLabel(today.ranges, data.lang, t.hours.closed)}` : "",
    contact.phoneHuman,
    data.content.pages[data.lang].services.infoText.split(".")[0],
    ...t.marquee,
  ].map((s) => (s ?? "").trim()).filter(Boolean);
  if (items.length < 3) return null;
  return (
    <div className="overflow-hidden border-y border-line py-4 text-muted-fg" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl italic sm:text-2xl">
        {[0, 1].map((k) => <div key={k} className="flex gap-10">{items.map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span className="not-italic text-accent">✦</span></span>)}</div>)}
      </div>
    </div>
  );
}

function Story({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const photo = images.about || images.gallery[0] || "";
  return (
    <Section id="about">
      <div className={`grid items-center gap-10 ${photo ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
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
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button></div>
        </div>
        {photo && (
          <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*3)] rounded-br-none bg-surface-2 shadow-soft">
            <Img src={photo} alt={t.hero.portraitName || data.content.brand.name} />
          </div>
        )}
      </div>
    </Section>
  );
}

/** Packs: physical products named like packs or memberships, as roomy cards. */
function Packs({ data }: LayoutProps) {
  const packs = data.products.filter(isPack);
  if (!packs.length) return null;
  const t = data.t.products;
  return (
    <Section id="packs" band="surface2">
      <Heading tag={t.tag} title={t.title} />
      <ul className={`grid gap-5 ${packs.length >= 2 ? "md:grid-cols-2" : ""} ${packs.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {packs.map((p, i) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded-[calc(var(--radius)*2)] border border-line bg-surface">
            {p.images.length > 0 && <ProductImages images={p.images} alt={p.name} className="aspect-[16/10]" />}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="font-display text-3xl italic text-accent">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl">{p.name}</h3>
              {p.desc && <p className="mt-2 leading-relaxed text-muted-fg whitespace-pre-line">{p.desc}</p>}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <span className="font-display text-2xl text-accent">{p.price}</span>
                <Button href={p.url} external size="sm" variant={p.inStock ? "primary" : "outline"}>{p.inStock ? t.order : t.outOfStock}</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ContactBlock({ data }: LayoutProps) {
  const { t } = data;
  const { contact } = data.content;
  if (!(contact.phoneHuman || data.whatsappUrl || contact.email || hasAddress(data) || hasHours(data))) return null;
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
  const others = data.products.filter((p) => !isPack(p));
  return (
    <Page>
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "home")} />
      <Offer data={data} />
      <Hero {...props} />
      <InfoMarquee {...props} />
      <Story {...props} />

      {hasStats(data) && (
        <Section pad="py-0 pb-16 sm:pb-24">
          <div className="rounded-[calc(var(--radius)*2)] bg-surface p-6 sm:p-10"><Stats data={data} /></div>
        </Section>
      )}

      {hasMenu(data) && (
        <Section id="services" band="surface">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} />
          <Highlights data={data} variant="rows" />
        </Section>
      )}

      {training && (
        <Section id="programmes">
          <Heading tag={t.programmes.tag} title={t.programmes.title} />
          <Programmes data={data} />
        </Section>
      )}

      {hasMenu(data) && (
        <Section id="pricing">
          <Heading tag={data.content.pages[data.lang].services.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{data.content.pages[data.lang].services.titleAccent}</em></>} />
          <div className="mx-auto max-w-4xl">
            <MenuList data={data} variant="rows" limit={10} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={data.content.brand.bookingUrl} external>{t.hero.bookNow}</Button>
              <Button href="/services" variant="outline">{t.services.seeAll}</Button>
            </div>
          </div>
        </Section>
      )}

      {!training && <Packs {...props} />}

      {hasProducts(data) && !training && others.length > 0 && (
        <Section id="boutique">
          <Heading tag={t.products.tag} title={t.products.title} />
          <Products data={data} items={others} />
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team" band="surface">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} variant="list" className="mx-auto max-w-3xl" />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews">
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}</>} />
          <Reviews data={data} variant={hasReviews(data) ? "quotes" : "cards"} className="max-w-3xl" />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery" band="surface">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="strip" />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq">
          <Heading tag={t.faq.tag} title={t.faq.title} />
          <Faq data={data} className="max-w-3xl" />
        </Section>
      )}

      <ContactBlock {...props} />

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="surface" /></Section>
      <Footer data={data} tone="light" />
    </Page>
  );
}

function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <Page>
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "services")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
        <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 rounded-[calc(var(--radius)*2)] bg-surface p-6 sm:p-8">
              <h3 className="font-display text-2xl italic">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} tone="surface" /></Section>
      <Footer data={data} tone="light" />
    </Page>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <Page>
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "contact")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading title={<>{p.heroTitle} <em className="italic text-accent">{p.heroAccent}</em></>} sub={cp.intro} size="lg" />
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
              <div className="rounded-[calc(var(--radius)*2)] border border-line bg-surface p-6">
                <h3 className="mb-3 font-display text-2xl">{data.t.hours.title}</h3>
                <Hours data={data} />
              </div>
            )}
            {p.socialsLine && <p className="text-sm text-muted-fg">{p.socialsLine}</p>}
          </div>
        </div>
      </Section>
      <Footer data={data} tone="light" />
    </Page>
  );
}

const layout: Layout = { Home, Services, Contact };
export default layout;
