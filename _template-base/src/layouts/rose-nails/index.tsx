/**
 * Rose nails: powder pink, rounded, the price list by family (after Nailora).
 *
 * Home: top bar with today's hours and phone · nav · offer · soft rounded
 * hero · 3 family cards with counts linking to the menu · about with the
 * founder's quote (the sign) and stats · full price list by family in rows ·
 * gallery · reviews · shop · FAQ · hours and address · CTA · footer.
 * Every block renders only with its data; the page stays complete without.
 */

import type { Layout, LayoutProps } from "../types";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews, hasStats } from "../../lib/site-data";
import { rangesLabel, todayHours } from "../../lib/format";
import {
  Section, Heading, Button, Img, Nav, Footer, defaultLinks, MenuList, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";

const round = "rounded-[calc(var(--radius)*2)]";

/** Thin bar above the nav: today's hours and the phone number (Nailora's signature). */
function TopBar({ data }: LayoutProps) {
  const { contact } = data.content;
  const today = hasHours(data) ? todayHours(data.hours) : undefined;
  if (!today && !contact.phoneHuman) return null;
  const h = data.t.hours;
  return (
    <div className="bg-accent text-accent-fg">
      <div className="container-site flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-xs font-medium">
        {today && <span>{h.days[today.day]} · {rangesLabel(today.ranges, data.lang, h.closed)}</span>}
        {contact.phoneHuman && <a href={`tel:${contact.phoneTel}`} className="hover:underline">{contact.phoneHuman}</a>}
      </div>
    </div>
  );
}

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand } = data.content;
  return (
    <section id="top" className="container-site pt-8 pb-12 sm:pt-14 sm:pb-20">
      <div className={`grid items-center gap-10 ${images.hero ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
        <div className="max-w-xl">
          <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={brand.bookingUrl} external size="lg" className="rounded-full">{t.hero.bookNow}</Button>
            {hasMenu(data) && <Button href="#services" variant="outline" size="lg" className="rounded-full">{t.hero.discover}</Button>}
          </div>
          {t.hero.leadService && <p className="mt-6 inline-flex rounded-full bg-accent-soft px-4 py-1.5 text-sm text-accent">{t.hero.leadService}</p>}
        </div>
        {images.hero && (
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[calc(var(--radius)*3)] bg-accent-soft" aria-hidden="true" />
            <div className={`aspect-[4/5] overflow-hidden ${round} bg-surface sm:aspect-square`}>
              <Img src={images.hero} alt={brand.name} eager />
            </div>
            {t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-full bg-surface/95 px-5 py-2 text-sm shadow-soft">
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

/** One card per family of the menu, with the item count, linking to the full list. */
function Families({ data }: LayoutProps) {
  if (!hasMenu(data)) return null;
  const { t, images } = data;
  const groups = data.menu.filter((g) => g.items.length);
  const id = (title: string) => "menu-" + title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  return (
    <Section id="families" pad="pb-16 sm:pb-24">
      <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} />
      <ul className={`grid gap-5 sm:grid-cols-2 ${groups.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {groups.map((g, i) => {
          const hl = t.services.items[i];
          const cheapest = g.items[0]?.price;
          return (
            <li key={g.title}>
              <a href={`#${id(g.title)}`} className={`group flex h-full flex-col overflow-hidden ${round} border border-line bg-surface transition-colors hover:border-accent`}>
                {images.svc[i] && <div className="aspect-[4/3] overflow-hidden bg-surface-2"><Img src={images.svc[i]} alt={g.title} className="transition-transform duration-700 group-hover:scale-[1.03]" /></div>}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl">{g.title}</h3>
                    <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{g.items.length}</span>
                  </div>
                  {hl && hl.title && <p className="mt-2 text-sm leading-relaxed text-muted-fg">{hl.desc}</p>}
                  {cheapest && <p className="mt-auto pt-4 text-sm"><span className="text-muted-fg">{t.services.from}</span> <span className="font-semibold text-accent">{cheapest}</span></p>}
                </div>
              </a>
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
  return (
    <Section id="about" band="surface2">
      <div className={`grid items-center gap-10 ${images.about ? "lg:grid-cols-[1fr_1.2fr]" : ""}`}>
        {images.about && (
          <div className={`mx-auto aspect-[4/5] w-full max-w-md overflow-hidden ${round} bg-surface shadow-soft`}>
            <Img src={images.about} alt={t.about.title2} />
          </div>
        )}
        <div>
          <div className="eyebrow text-accent">{t.about.tag}</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{t.about.title1} <em className="italic text-accent">{t.about.title2}</em>{t.about.title3}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {t.about.bullets.filter(Boolean).length > 0 && (
            <ul className="mt-6 space-y-2">
              {t.about.bullets.filter(Boolean).map((b) => <li key={b} className="flex gap-3"><span className="mt-0.5 text-accent" aria-hidden="true">✦</span><span>{b}</span></li>)}
            </ul>
          )}
          {t.about.sign && (
            <blockquote className={`mt-8 ${round} bg-surface p-6 font-display text-2xl italic leading-snug`}>
              « {t.about.sign} »
            </blockquote>
          )}
          {hasStats(data) && <Stats data={data} className="mt-10" />}
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external className="rounded-full">{t.about.cta}</Button></div>
        </div>
      </div>
    </Section>
  );
}

/** The full price list, each family anchored for the family cards. */
function PriceList({ data, full }: LayoutProps & { full?: boolean }) {
  if (!hasMenu(data)) return null;
  const { t } = data;
  const id = (title: string) => "menu-" + title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="space-y-12">
      {data.menu.filter((g) => g.items.length).map((g) => (
        <div key={g.title} id={id(g.title)} className="scroll-mt-28">
          <MenuList data={data} groups={[g]} variant="rows" />
        </div>
      ))}
      {!full && <div><Button href="/services" variant="outline" className="rounded-full">{t.services.seeAll}</Button></div>}
    </div>
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
            {content.contact.mapsUrl && <Button href={content.contact.mapsUrl} external variant="outline" className="rounded-full">{t.location.directions}</Button>}
            <Link to="/contact" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
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
      <TopBar {...props} />
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "home")} />
      <Offer data={data} />
      <Hero {...props} />
      <Families {...props} />
      <About {...props} />

      {hasMenu(data) && (
        <Section id="services">
          <Heading tag={t.nav.menu} title={t.nav.menu} sub={data.content.pages[data.lang].services.subtitle} />
          <div className="mx-auto max-w-4xl"><PriceList {...props} /></div>
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery" band="surface2">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band={hasGallery(data) ? undefined : "surface2"}>
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}</>} />
          <Reviews data={data} />
        </Section>
      )}

      {hasProducts(data) && (
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

      <Visit {...props} />

      <Section pad="py-10 sm:py-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} tone="light" />
    </div>
  );
}

function Services(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <TopBar {...props} />
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "services")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" />
        <Button href={data.content.brand.bookingUrl} external size="lg" className="rounded-full">{t.hero.bookNow}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          {hasMenu(data) ? <PriceList {...props} full /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className={`mt-14 ${round} bg-surface-2 p-6 sm:p-8`}>
              <h3 className="font-display text-2xl">{p.infoTitle}</h3>
              {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
              {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
            </div>
          )}
        </div>
      </Section>
      <Section pad="pb-16"><BookCta data={data} tone="accent" /></Section>
      <Footer data={data} tone="light" />
    </div>
  );
}

function Contact(props: LayoutProps) {
  const { data, setLang } = props;
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
      <TopBar {...props} />
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "contact")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading title={<>{p.heroTitle} <em className="italic text-accent">{p.heroAccent}</em></>} sub={cp.intro} size="lg" />
        <Button href={data.content.brand.bookingUrl} external size="lg" className="rounded-full">{p.ctaLabel}</Button>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <ContactCards data={data} />
            <Policy data={data} />
          </div>
          <div className="space-y-6">
            {hasHours(data) && (
              <div className={`${round} border border-line bg-surface p-6`}>
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
