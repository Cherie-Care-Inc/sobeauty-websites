/**
 * Studio team: light, warm, the salon's story and its team up front (after
 * Marlo Hair Co).
 *
 * Home: hero (story line in italic display, pill buttons, photo) · offer ·
 * pick a stylist (team, high on the page) · services as cards with Book per
 * item · about (the salon's story, bullets, stats) · transformations gallery ·
 * reviews tagged by service · shop · FAQ · hours and address · CTA · footer.
 * Every block renders only with its data; the page stays complete without.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews, hasStats } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Avatar, Nav, Footer, defaultLinks, MenuList, Highlights, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";

const pill = "rounded-full";

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  const withPhoto = !!images.hero;
  const owner = data.team.find((m) => m.owner);
  return (
    <section id="top" className="bg-hero">
      <div className={`container-site grid items-center gap-10 pt-10 pb-14 sm:pt-16 sm:pb-20 ${withPhoto ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
        <div className="max-w-2xl">
          <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 max-w-xl font-display text-xl italic leading-snug text-hero-muted text-pretty sm:text-2xl">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={brand.bookingUrl} external size="lg" className={pill}>{t.hero.bookNow}</Button>
            {hasTeam(data)
              ? <Button href="#team" variant="outline" size="lg" className={pill}>{t.team.tag}</Button>
              : hasMenu(data) && <Button href="#services" variant="outline" size="lg" className={pill}>{t.hero.discover}</Button>}
          </div>
          {(contact.city || t.hero.leadService) && (
            <div className="mt-8 flex flex-wrap gap-2 text-sm">
              {contact.city && <span className={`${pill} border border-line bg-bg px-4 py-1.5`}>{t.hero.location}</span>}
              {t.hero.leadService && <span className={`${pill} bg-accent-soft px-4 py-1.5 text-accent`}>{t.hero.leadService}</span>}
            </div>
          )}
        </div>
        {withPhoto && (
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft sm:aspect-[5/6]">
              <Img src={images.hero} alt={brand.name} eager />
            </div>
            {owner && hasTeam(data) && (
              <a href={owner.bookUrl} target="_blank" rel="noopener noreferrer"
                className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-bg/95 py-2 pl-2 pr-5 text-sm shadow-soft backdrop-blur">
                <Avatar name={owner.name} src={owner.photo} className="h-10 w-10 text-sm" />
                <span><span className="block font-semibold">{owner.name}</span><span className="text-muted-fg">{owner.role[data.lang] || t.team.owner}</span></span>
              </a>
            )}
            {!hasTeam(data) && t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-full bg-bg/95 px-5 py-2 text-sm shadow-soft backdrop-blur">
                {t.hero.portraitName && <span className="font-display text-lg">{t.hero.portraitName}</span>}
                <span className={t.hero.portraitName ? "ml-2 text-muted-fg" : "text-muted-fg"}>{t.hero.portraitTag}</span>
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
      <div className={`grid items-center gap-10 ${images.about ? "lg:grid-cols-[1fr_1.15fr]" : ""}`}>
        {images.about && (
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface shadow-soft">
              <Img src={images.about} alt={t.about.title2} />
            </div>
            {t.about.experienceValue && (
              <div className="absolute -bottom-4 -right-2 rounded-full bg-accent px-5 py-3 text-accent-fg shadow-soft sm:right-4">
                <span className="font-display text-3xl">{t.about.experienceValue}</span>
                <span className="ml-2 text-xs uppercase tracking-wider">{t.about.experience}</span>
              </div>
            )}
          </div>
        )}
        <div>
          <div className="eyebrow text-accent">{t.about.tag}</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{t.about.title1} <em className="italic text-accent">{t.about.title2}</em>{t.about.title3}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {t.about.bullets.filter(Boolean).length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {t.about.bullets.filter(Boolean).map((b) => <li key={b} className={`${pill} border border-line bg-bg px-4 py-2 text-sm`}>{b}</li>)}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-2xl italic">{t.about.sign}</p>}
          {hasStats(data) && <Stats data={data} className="mt-10" />}
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external className={pill}>{t.about.cta}</Button></div>
        </div>
      </div>
    </Section>
  );
}

function Visit({ data }: LayoutProps) {
  if (!hasHours(data) && !hasAddress(data)) return null;
  const { t, content } = data;
  return (
    <Section id="visit" band="surface2">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="eyebrow text-accent">{t.nav.contact}</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">{t.location.city}</h2>
          {hasAddress(data) && <p className="mt-4 text-lg text-muted-fg">{content.contact.address}</p>}
          {t.location.hint && <p className="mt-1 text-muted-fg">{t.location.hint}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {content.contact.mapsUrl && <Button href={content.contact.mapsUrl} external variant="outline" className={pill}>{t.location.directions}</Button>}
            <Link to="/contact" className={`inline-flex items-center ${pill} px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base`}>{t.nav.contact}</Link>
          </div>
        </div>
        <HoursCard data={data} />
      </div>
    </Section>
  );
}

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "home")} />
      <Offer data={data} />
      <Hero {...props} />

      {hasTeam(data) && (
        <Section id="team">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} />
        </Section>
      )}

      {hasMenu(data) && (
        <Section id="services" band={hasTeam(data) ? "surface" : undefined}>
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} />
          <Highlights data={data} variant="cards" />
          <div className="mt-14">
            <MenuList data={data} variant="cards" limit={6} bookPerItem />
            <div className="mt-8"><Button href="/services" variant="outline" className={pill}>{t.services.seeAll}</Button></div>
          </div>
        </Section>
      )}

      <About {...props} />

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band="surface">
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}</>} />
          <Reviews data={data} />
        </Section>
      )}

      {hasProducts(data) && (
        <Section id="boutique">
          <Heading tag={t.products.tag} title={t.products.title} />
          <Products data={data} />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface">
          <Heading tag={t.faq.tag} title={t.faq.title} />
          <Faq data={data} className="mx-auto max-w-3xl" />
        </Section>
      )}

      <Visit {...props} />

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} tone="light" />
    </div>
  );
}

function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "services")} />
      <section className="bg-hero">
        <div className="container-site pt-12 pb-10 sm:pt-20 sm:pb-14">
          <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
          <Button href={data.content.brand.bookingUrl} external size="lg" className={pill}>{t.hero.bookNow}</Button>
        </div>
      </section>
      <Section>
        {hasMenu(data) ? <MenuList data={data} variant="cards" bookPerItem /> : <Products data={data} />}
        {(p.infoText || p.depositLine) && (
          <div className="mt-14 rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
            <h3 className="font-display text-2xl">{p.infoTitle}</h3>
            {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
            {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
          </div>
        )}
      </Section>
      {hasTeam(data) && (
        <Section band="surface" pad="py-14 sm:py-20">
          <Heading tag={t.team.tag} title={t.team.title} size="sm" />
          <Team data={data} variant="list" />
        </Section>
      )}
      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} tone="light" />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "contact")} />
      <section className="bg-hero">
        <div className="container-site pt-12 pb-10 sm:pt-20 sm:pb-14">
          <Heading title={<>{p.heroTitle} <em className="italic text-accent">{p.heroAccent}</em></>} sub={cp.intro} size="lg" />
          <Button href={data.content.brand.bookingUrl} external size="lg" className={pill}>{p.ctaLabel}</Button>
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
      <Footer data={data} tone="light" />
    </div>
  );
}

const layout: Layout = { Home, Services, Contact };
export default layout;
