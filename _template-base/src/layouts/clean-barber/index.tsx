/**
 * Clean barber: white, sharp, grotesk type, black and white photos (after
 * Barbero).
 *
 * Home: big two-line title · grayscale photo · offer · about in one bold
 * paragraph · services as rows with price and duration · barbers grid ·
 * latest cuts (gallery) · testimonials · shop · FAQ · find us · CTA · footer.
 * Lots of white space. Every block renders only with its data.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews, hasStats } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Nav, Footer, defaultLinks, MenuList, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";

/** Photos go black and white; colour comes back on hover. */
const mono = "[&_img]:grayscale [&_img]:transition-[filter] [&_img]:duration-700 [&_img:hover]:grayscale-0";

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  return (
    <section id="top" className="container-site pt-12 pb-10 sm:pt-20 sm:pb-16">
      <div className="eyebrow text-muted-fg">{t.hero.eyebrow}</div>
      <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
        <span className="block">{t.hero.title1}</span>
        <span className="block text-muted-fg">{t.hero.title2}{t.hero.title3}</span>
      </h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <p className="max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button href={brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          {hasMenu(data) && <Button href="#services" variant="outline" size="lg">{t.hero.discover}</Button>}
        </div>
      </div>
      {images.hero && (
        <div className={`relative mt-12 ${mono}`}>
          <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-surface-2 sm:aspect-[16/9]">
            <Img src={images.hero} alt={brand.name} eager />
          </div>
          {(t.hero.leadService || t.hero.portraitTag) && (
            <div className="absolute bottom-4 left-4 rounded-[var(--radius)] bg-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider">
              {t.hero.leadService || t.hero.portraitTag}
            </div>
          )}
        </div>
      )}
      {(contact.city || contact.phoneHuman || hasHours(data)) && (
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5 text-sm">
          {contact.city && <li><span className="text-muted-fg">{t.location.city}</span>{t.location.region && <span className="text-muted-fg"> · {t.location.region}</span>}</li>}
          {contact.phoneHuman && <li><a href={`tel:${contact.phoneTel}`} className="font-semibold hover:underline">{contact.phoneHuman}</a></li>}
          {data.whatsappUrl && <li><a href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">WhatsApp</a></li>}
        </ul>
      )}
    </section>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const bullets = t.about.bullets.filter(Boolean);
  return (
    <Section id="about" band="surface2">
      <div className="eyebrow text-muted-fg">{t.about.tag}</div>
      <p className="mt-6 max-w-4xl font-display text-2xl font-medium leading-snug text-balance sm:text-3xl lg:text-4xl">{t.about.desc}</p>
      <div className={`mt-12 grid gap-10 ${images.about ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
        <div className="flex flex-col justify-between gap-8">
          {bullets.length > 0 && (
            <ol className="grid gap-4 sm:grid-cols-3">
              {bullets.map((b, i) => (
                <li key={b} className="border-t border-fg pt-3">
                  <span className="font-display text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1 text-sm leading-relaxed">{b}</p>
                </li>
              ))}
            </ol>
          )}
          {hasStats(data) && <Stats data={data} />}
          <div className="flex flex-wrap items-center gap-4">
            <Button href={data.content.brand.bookingUrl} external>{t.about.cta}</Button>
            {t.about.sign && <span className="font-display text-lg font-medium">{t.about.sign}</span>}
          </div>
        </div>
        {images.about && (
          <div className={`aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-surface ${mono}`}>
            <Img src={images.about} alt={t.about.title2} />
          </div>
        )}
      </div>
    </Section>
  );
}

function FindUs({ data }: LayoutProps) {
  if (!hasHours(data) && !hasAddress(data)) return null;
  const { t, content } = data;
  return (
    <Section id="visit">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="eyebrow text-muted-fg">{t.nav.contact}</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t.location.city}</h2>
          {hasAddress(data) && <p className="mt-4 text-lg">{content.contact.address}</p>}
          {t.location.hint && <p className="mt-1 text-muted-fg">{t.location.hint}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {content.contact.mapsUrl && <Button href={content.contact.mapsUrl} external variant="outline">{t.location.directions}</Button>}
            <Link to="/contact" className="inline-flex items-center rounded-[var(--radius)] px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
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
      <About {...props} />

      {hasMenu(data) && (
        <Section id="services">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div>
              <div className="eyebrow text-muted-fg">{t.services.tag}</div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t.services.title1} {t.services.title2}{t.services.title3}</h2>
              {t.services.items.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {t.services.items.map((it) => (
                    <li key={it.title} className="border-l-2 border-fg pl-4">
                      <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-fg">{it.desc}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <MenuList data={data} variant="rows" limit={8} />
              <div className="mt-8"><Button href="/services" variant="outline">{t.services.seeAll}</Button></div>
            </div>
          </div>
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team" band="surface2">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} className={mono} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="grid" className={mono} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band="surface2">
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} {t.pillars.title2}{t.pillars.title3}</>} />
          <Reviews data={data} variant={hasReviews(data) ? "quotes" : "cards"} className="max-w-3xl" />
        </Section>
      )}

      {hasProducts(data) && (
        <Section id="boutique">
          <Heading tag={t.products.tag} title={t.products.title} />
          <Products data={data} />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface2">
          <Heading tag={t.faq.tag} title={t.faq.title} />
          <Faq data={data} className="max-w-3xl" />
        </Section>
      )}

      <FindUs {...props} />

      <Section pad="py-6 sm:py-10"><BookCta data={data} tone="surface" /></Section>
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
      <Section pad="pt-12 pb-6 sm:pt-20 sm:pb-10">
        <div className="eyebrow text-muted-fg">{p.eyebrow}</div>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">{t.nav.services}</span>
          <span className="block text-muted-fg">{p.titleAccent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-fg">{p.subtitle}</p>
        <div className="mt-8"><Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button></div>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      {hasTeam(data) && (
        <Section band="surface2" pad="py-14 sm:py-20">
          <Heading tag={t.team.tag} title={t.team.title} size="sm" />
          <Team data={data} variant="list" className={mono} />
        </Section>
      )}
      <Section pad="py-6 sm:py-10"><BookCta data={data} tone="surface" /></Section>
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
      <Section pad="pt-12 pb-6 sm:pt-20 sm:pb-10">
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">{p.heroTitle}</span>
          <span className="block text-muted-fg">{p.heroAccent}</span>
        </h1>
        {cp.intro && <p className="mt-6 max-w-xl text-lg text-muted-fg">{cp.intro}</p>}
        <div className="mt-8"><Button href={data.content.brand.bookingUrl} external size="lg">{p.ctaLabel}</Button></div>
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
                <h3 className="mb-3 font-display text-2xl font-semibold">{data.t.hours.title}</h3>
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
