/**
 * Glow: light cream and oxblood, elegant serif, photo collage (after Zerra).
 *
 * Home: offer · welcome hero (text + collage of hero and highlight photos,
 * pill chips of section links) · services with "from" price and the team
 * member who performs them · menu extract · about (photo, bullets, stats) ·
 * signature band on accent-soft (pillars signed by the founder) · client
 * stories · team · gallery · products · FAQ · visit · CTA · footer.
 * Every block renders only with its data; the page stays complete without.
 */

import type { Layout, LayoutProps } from "../types";
import type { ServiceGroup, TeamMember } from "../../site-content";
import type { SiteData } from "../../lib/site-data";
import { hasAbout, hasAddress, hasHours, hasMenu, hasProducts, hasTeam, hasGallery, hasFaq, hasReviews } from "../../lib/site-data";
import {
  Section, Heading, Button, Img, Nav, Footer, defaultLinks, MenuList, Team, Reviews,
  Gallery, Faq, Stats, Offer, BookCta, Products, Programmes, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";
import { Link } from "@tanstack/react-router";

/** "25 000 FCFA" → 25000, "12,50 €" → 12.5, "25,000 FCFA" → 25000. */
function priceValue(p: string): number {
  const m = p.replace(/\s/g, "").match(/(\d[\d.,]*)/);
  if (!m) return Number.POSITIVE_INFINITY;
  let n = m[1];
  if (/[.,]\d{2}$/.test(n) && !/[.,]\d{3}$/.test(n)) n = `${n.slice(0, -3).replace(/[.,]/g, "")}.${n.slice(-2)}`;
  else n = n.replace(/[.,]/g, "");
  const v = Number(n);
  return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY;
}

/** The menu group a highlight talks about: same title first, then same position. */
function groupFor(d: SiteData, title: string, i: number): ServiceGroup | undefined {
  const low = title.toLowerCase();
  return d.menu.find((g) => g.title.toLowerCase() === low)
    ?? d.menu.find((g) => g.title.toLowerCase().includes(low) || low.includes(g.title.toLowerCase()))
    ?? d.menu[i];
}

/** Who performs a group: a member listing one of its names, else the owner. */
function memberFor(d: SiteData, g: ServiceGroup | undefined): TeamMember | undefined {
  if (!hasTeam(d) || !g) return undefined;
  const names = [g.title, ...g.items.map((it) => it.name)].map((s) => s.toLowerCase());
  const listed = d.team.find((m) => (m.services[d.lang] ?? []).some((s) => {
    const l = s.toLowerCase();
    return names.some((n) => n.includes(l) || l.includes(n));
  }));
  return listed ?? d.team.find((m) => m.owner) ?? d.team[0];
}

function cheapest(g: ServiceGroup | undefined): string {
  if (!g) return "";
  let best = "", bestV = Number.POSITIVE_INFINITY;
  for (const it of g.items) { const v = priceValue(it.price); if (v < bestV) { bestV = v; best = it.price; } }
  return best;
}

function Collage({ data }: LayoutProps) {
  const { images } = data;
  const name = data.content.brand.name;
  const main = images.hero || images.about || images.svc[0];
  if (!main) return null;
  const extras = [images.svc[0], images.svc[1], images.about].filter((s) => s && s !== main).slice(0, 2);
  return (
    <div className="relative mx-auto w-full max-w-md px-6 pb-10 pt-8 sm:px-8 lg:max-w-none">
      <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2 shadow-soft">
        <Img src={main} alt={name} eager />
      </div>
      {extras[0] && (
        <div className="absolute bottom-0 left-0 w-32 rotate-[-4deg] overflow-hidden rounded-[var(--radius)] border-4 border-bg bg-surface-2 shadow-soft sm:w-44">
          <div className="aspect-square"><Img src={extras[0]} alt={name} /></div>
        </div>
      )}
      {extras[1] && (
        <div className="absolute right-0 top-0 w-28 rotate-[5deg] overflow-hidden rounded-[var(--radius)] border-4 border-bg bg-surface-2 shadow-soft sm:w-40">
          <div className="aspect-[4/5]"><Img src={extras[1]} alt={name} /></div>
        </div>
      )}
    </div>
  );
}

function Hero(props: LayoutProps) {
  const { data } = props;
  const { t, images } = data;
  const { brand, contact } = data.content;
  const chips = defaultLinks(data, "home").filter((l) => !l.route);
  const withPhoto = !!(images.hero || images.about || images.svc[0]);
  return (
    <section id="top" className="overflow-x-clip">
      <div className="container-site pb-10 pt-8 sm:pb-16 sm:pt-14">
        <div className={`grid items-center gap-8 lg:gap-14 ${withPhoto ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
          <div className="max-w-2xl">
            <div className="eyebrow text-accent">{t.hero.eyebrow}</div>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
              {t.hero.title1} <em className="italic text-accent">{t.hero.title2}</em>{t.hero.title3}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg text-pretty">{t.hero.desc}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={brand.bookingUrl} external size="lg" className="rounded-full">{t.hero.bookNow}</Button>
              {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline" className="rounded-full">{t.cta.whatsapp}</Button>}
            </div>
            {chips.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Navigation">
                {chips.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} className="inline-flex min-h-[44px] items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent">{c.label}</a>
                  </li>
                ))}
              </ul>
            )}
            {(contact.city || t.hero.leadService) && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-fg">
                {contact.city && <span>{t.hero.location}</span>}
                {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
              </div>
            )}
          </div>
          {withPhoto && <Collage {...props} />}
        </div>
      </div>
    </section>
  );
}

/** Highlights as cards with the cheapest price of their group and the person who performs them. */
function ServiceCards({ data }: LayoutProps) {
  const t = data.t;
  const items = t.services.items.filter((i) => i.title.trim());
  if (!items.length) return null;
  const imgs = data.images.svc;
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""} ${items.length === 4 ? "lg:grid-cols-4" : ""}`}>
      {items.map((it, i) => {
        const g = groupFor(data, it.title, i);
        const from = cheapest(g);
        const who = memberFor(data, g);
        return (
          <li key={it.title} className="flex flex-col overflow-hidden rounded-[calc(var(--radius)*1.5)] border border-line bg-surface">
            {imgs[i] && <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-surface-2"><Img src={imgs[i]} alt={it.title} className="absolute inset-0" /></div>}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl sm:text-3xl">{it.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-fg">{it.desc}</p>
              {(from || who) && (
                <div className="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-line pt-4">
                  {from && <span className="text-sm text-muted-fg">{t.services.from} <strong className="font-display text-2xl text-accent">{from}</strong></span>}
                  {who && <a href={who.bookUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline-offset-4 hover:underline">{t.team.bookWith} {who.name.split(" ")[0]}</a>}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function About({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const photo = images.about && images.about !== images.hero ? images.about : images.gallery[0] || "";
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
            <ul className="mt-6 flex flex-wrap gap-2">
              {t.about.bullets.filter(Boolean).map((b) => <li key={b} className="rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">{b}</li>)}
            </ul>
          )}
          <Stats data={data} className="mt-10" />
          <div className="mt-8"><Button href={data.content.brand.bookingUrl} external className="rounded-full">{t.about.cta}</Button></div>
        </div>
      </div>
    </Section>
  );
}

/** Signature band: the trust pillars on accent-soft, signed by the founder. */
function SignatureBand({ data }: LayoutProps) {
  const t = data.t;
  const pillars = t.pillars.items.filter((p) => p.label.trim() && p.text.trim());
  if (!pillars.length) return null;
  return (
    <section id="signature" className="bg-accent-soft py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-accent">{t.pillars.tag}</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            {t.pillars.title1} <em className="italic text-accent">{t.pillars.title2}</em>{t.pillars.title3}
          </h2>
        </div>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={p.label} className="rounded-[calc(var(--radius)*1.5)] bg-surface p-6 sm:p-8">
              <div className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-display text-2xl">{p.label}</h3>
              <p className="mt-2 leading-relaxed text-muted-fg">{p.text}</p>
            </li>
          ))}
        </ul>
        {t.about.sign && <p className="mt-10 text-center font-display text-2xl italic sm:text-3xl">{t.about.sign}</p>}
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
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "home")} />
      <Offer data={data} />
      <Hero {...props} />

      {hasMenu(data) && (
        <Section id="services" band="surface">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <em className="italic text-accent">{t.services.title2}</em>{t.services.title3}</>} align="center" />
          <ServiceCards {...props} />
          <div className="mx-auto mt-14 max-w-4xl">
            <MenuList data={data} variant="rows" limit={8} />
            <div className="mt-8 text-center"><Button href="/services" variant="outline" className="rounded-full">{t.services.seeAll}</Button></div>
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
      <SignatureBand {...props} />

      {hasReviews(data) && (
        <Section id="reviews">
          <Heading tag={t.reviews.tag} title={t.reviews.title} align="center" />
          <Reviews data={data} />
        </Section>
      )}

      {hasTeam(data) && (
        <Section id="team" band="surface">
          <Heading tag={t.team.tag} title={t.team.title} align="center" />
          <Team data={data} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} align="center" />
          <Gallery data={data} variant="grid" />
        </Section>
      )}

      {hasProducts(data) && !training && (
        <Section id="boutique" band="surface">
          <Heading tag={t.products.tag} title={t.products.title} align="center" />
          <Products data={data} />
          {data.content.brand.shopUrl && <div className="mt-8 text-center"><Button href={data.content.brand.shopUrl} external variant="outline" className="rounded-full">{t.products.seeAll}</Button></div>}
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq">
          <Heading tag={t.faq.tag} title={t.faq.title} align="center" />
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
                {data.content.contact.mapsUrl && <Button href={data.content.contact.mapsUrl} external variant="outline" className="rounded-full">{t.location.directions}</Button>}
                <Link to="/contact" className="inline-flex min-h-[44px] items-center px-2 text-sm font-semibold underline underline-offset-4 sm:text-base">{t.nav.contact}</Link>
              </div>
            </div>
            <HoursCard data={data} />
          </div>
        </Section>
      )}

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
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading tag={p.eyebrow} title={<>{t.nav.services} <em className="italic text-accent">{p.titleAccent}</em></>} sub={p.subtitle} size="lg" align="center" />
        <div className="text-center"><Button href={data.content.brand.bookingUrl} external size="lg" className="rounded-full">{t.hero.bookNow}</Button></div>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          {hasMenu(data) ? <MenuList data={data} variant="rows" /> : <Products data={data} />}
          {(p.infoText || p.depositLine) && (
            <div className="mt-14 rounded-[calc(var(--radius)*1.5)] bg-accent-soft p-6 sm:p-8">
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

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={defaultLinks(data, "contact")} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading title={<>{p.heroTitle} <em className="italic text-accent">{p.heroAccent}</em></>} sub={cp.intro} size="lg" align="center" />
        <div className="text-center"><Button href={data.content.brand.bookingUrl} external size="lg" className="rounded-full">{p.ctaLabel}</Button></div>
      </Section>
      <Section pad="pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <ContactCards data={data} />
            <Policy data={data} />
          </div>
          <div className="space-y-6">
            {hasHours(data) && (
              <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-6">
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
