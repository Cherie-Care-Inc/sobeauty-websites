/**
 * Atelier — light, editorial, the service menu up front (after Elysia).
 *
 * Home: hero (text + photo) · offer · highlights as numbered rows · menu
 * extract · about (photo, bullets, stats) · team · reviews · gallery · shop ·
 * FAQ · visit (hours + address) · closing CTA · footer.
 * Every block renders only with its data; the page stays complete without.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Nav, Footer, defaultLinks, MenuList, Highlights, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  const withPhoto = !!images.hero;
  return (
    <section id="top" className="container-site pt-10 sm:pt-16 pb-8">
      <div className={`grid items-center gap-10 ${withPhoto ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
            {hasMenu(data) && <Button href="#services" variant="outline" size="lg">{t.hero.discover}</Button>}
          </div>
          {(contact.city || t.hero.leadService) && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-fg">
              {contact.city && <span>{t.hero.location}</span>}
              {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
            </div>
          )}
        </div>
        {withPhoto && (
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft sm:aspect-[5/6]">
              <Img src={images.hero} alt={brand.name} eager />
            </div>
            {t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-[var(--radius)] bg-bg/90 px-4 py-2 text-sm backdrop-blur">
                <span className="font-display text-lg">{t.hero.portraitName}</span>
                <span className="ml-2 text-muted-fg">{t.hero.portraitTag}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  return (
    <Section id="about" band="surface2">
      <div className={`grid items-center gap-10 ${images.about ? "lg:grid-cols-[1fr_1.2fr]" : ""}`}>
        {images.about && (
          <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface shadow-soft">
            <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
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

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  const links = defaultLinks(data, "home");
  const training = data.content.category === "training" && data.programmes.length > 0;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links} />
      <Offer data={data} />
      <Hero {...props} />

      {hasMenu(data) && (
        <Section id="services">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} />
          <Highlights data={data} variant="rows" />
          <div className="mt-14">
            <MenuList data={data} variant="numbered" limit={10} />
            <div className="mt-8"><Button href="/services" variant="outline">{t.services.seeAll}</Button></div>
          </div>
        </Section>
      )}

      {training && (
        <Section id="programmes" band="surface2">
          <Heading tag={t.programmes.tag} title={t.programmes.title} />
          <Programmes data={data} />
        </Section>
      )}

      <About {...props} />

      {hasTeam(data) && (
        <Section id="team">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band={hasTeam(data) ? "surface2" : undefined}>
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}</>} />
          <Reviews data={data} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="masonry" />
        </Section>
      )}

      {hasProducts(data) && !training && (
        <Section id="boutique" band="surface2">
          <Heading tag={t.products.tag} title={t.products.title} />
          <Products data={data} />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq">
          <Heading tag={t.faq.tag} title={t.faq.title} />
          <Faq data={data} className="mx-auto max-w-3xl" />
        </Section>
      )}

      {(hasHours(data) || hasAddress(data)) && (
        <Section id="visit" band="surface2">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="eyebrow text-accent">{t.nav.contact}</div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">{t.location.city}</h2>
              {hasAddress(data) && <p className="mt-4 text-lg text-muted-fg">{data.content.contact.address}</p>}
              {t.location.hint && <p className="mt-1 text-muted-fg">{t.location.hint}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {data.content.contact.mapsUrl && <Button href={data.content.contact.mapsUrl} external variant="outline">{t.location.directions}</Button>}
                <Link to="/contact" className="inline-flex items-center rounded-[var(--radius)] px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
              </div>
            </div>
            <HoursCard data={data} />
          </div>
        </Section>
      )}

      <Section pad="py-10 sm:py-16"><BookCta data={data} /></Section>
      <Footer data={data} />
    </div>
  );
}

function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "services")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
        <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="numbered" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
              <h3 className="font-display text-2xl">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} /></Section>
      <Footer data={data} />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
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
