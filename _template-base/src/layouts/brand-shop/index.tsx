/**
 * Brand shop: light, green hero band, the products first (after Nuda).
 *
 * Home: hero band (text + product photo) · benefit marquee · products grid ·
 * 3-step routine from the highlights · brand story (about + stats) · team ·
 * reviews · gallery strip · FAQ · order CTA · footer.
 * Every block renders only with its data; the page stays complete without
 * a service menu: the member sells products, ordering happens on the shop tab.
 */

import { Link } from "@tanstack/react-router";
import type { Layout, LayoutProps } from "../types";
import type { SiteData } from "../../lib/site-data";
import { hasAbout, hasAddress, hasFaq, hasGallery, hasHours, hasMenu, hasProducts, hasReviews, hasTeam } from "../../lib/site-data";
import type { NavLink } from "../../blocks";
import {
  Section, Heading, Button, Img, Nav, Footer, MenuList, Team, Reviews, Gallery, Faq, Stats, Offer, Marquee,
  Products, ContactCards, Policy, HoursCard, Hours,
} from "../../blocks";

/** Ordering happens on the member's shop tab; her booking page when no products. */
const orderUrl = (d: SiteData) => d.content.brand.shopUrl || d.content.brand.bookingUrl;
const hasRoutine = (d: SiteData) => d.t.services.items.some((i) => i.title.trim());

/** Shop first, then the menu when one exists, then the story. */
function links(d: SiteData, page: "home" | "services" | "contact"): NavLink[] {
  const t = d.t.nav;
  const home = page === "home";
  const out: NavLink[] = [];
  if (hasProducts(d)) out.push({ href: home ? "#boutique" : "/#boutique", label: t.shop });
  if (hasMenu(d)) out.push(home ? { href: "#services", label: t.services } : { href: "/services", label: t.menu, route: true });
  if (hasAbout(d)) out.push({ href: home ? "#about" : "/#about", label: t.about });
  if (hasTeam(d)) out.push({ href: home ? "#team" : "/#team", label: t.team });
  if (hasGallery(d)) out.push({ href: home ? "#gallery" : "/#gallery", label: t.gallery });
  if (hasFaq(d) && home) out.push({ href: "#faq", label: t.faq });
  out.push({ href: "/contact", label: t.contact, route: true });
  return out;
}

/** The header button orders when there is no menu to book. */
const navCta = (d: SiteData) => (hasMenu(d) || !hasProducts(d) ? undefined : { href: orderUrl(d), label: d.t.products.order });

function Hero({ data }: LayoutProps) {
  const { t, images } = data;
  const { brand, contact } = data.content;
  const photo = images.hero;
  const ghost = "border-hero-muted/50 text-hero-fg hover:bg-hero-fg/10";
  return (
    <section id="top" className="bg-hero text-hero-fg">
      <div className={`container-site grid items-center gap-10 py-14 sm:py-20 ${photo ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          <div className="eyebrow text-hero-muted">{t.hero.eyebrow}</div>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {t.hero.title1} <em className="not-italic text-hero-muted">{t.hero.title2}</em>{t.hero.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty">{t.hero.desc}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hasProducts(data) && <Button href={orderUrl(data)} external size="lg" variant="hero">{t.products.seeAll}</Button>}
            {hasMenu(data)
              ? <Button href={brand.bookingUrl} external size="lg" variant="outline" className={ghost}>{t.hero.bookNow}</Button>
              : hasRoutine(data) && <Button href="#routine" size="lg" variant="outline" className={ghost}>{t.hero.discover}</Button>}
          </div>
          {(contact.city || t.hero.leadService) && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-hero-muted">
              {contact.city && <span>{t.hero.location}</span>}
              {t.hero.leadService && <span>✦ {t.hero.leadService}</span>}
            </div>
          )}
        </div>
        {photo && (
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-black/10 sm:aspect-square">
              <Img src={photo} alt={brand.name} eager />
            </div>
            {t.hero.portraitTag && (
              <div className="absolute bottom-5 left-5 rounded-[var(--radius)] bg-white/90 px-4 py-2 text-sm text-black backdrop-blur">
                {t.hero.portraitName && <span className="font-display text-lg font-bold">{t.hero.portraitName}</span>}
                <span className={t.hero.portraitName ? "ml-2 opacity-70" : "opacity-80"}>{t.hero.portraitTag}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** The 3-step routine: the highlights as numbered cards with their photos. */
function Routine({ data }: LayoutProps) {
  if (!hasRoutine(data)) return null;
  const steps = data.t.services.items.filter((i) => i.title.trim());
  const imgs = data.images.svc;
  return (
    <Section id="routine" band="surface2">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
        <div>
          <div className="eyebrow text-accent">{data.t.hero.discover}</div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{data.content.brand.name}</h2>
        </div>
        {hasProducts(data) && <Button href="#boutique" variant="outline">{data.t.products.seeAll}</Button>}
      </div>
      <ol className={`grid gap-5 ${steps.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
            {imgs[i] && <div className="aspect-[4/3] bg-surface-2"><Img src={imgs[i]} alt={s.title} /></div>}
            <div className="flex flex-1 flex-col p-6">
              <div className="font-display text-4xl font-extrabold text-accent">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-fg">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** The brand story: photo, text, bullets, signature, real figures. */
function Story({ data }: LayoutProps) {
  if (!hasAbout(data)) return null;
  const { t, images } = data;
  const bullets = t.about.bullets.filter(Boolean);
  return (
    <Section id="about">
      <div className={`grid items-center gap-10 ${images.about ? "lg:grid-cols-[1fr_1.1fr]" : ""}`}>
        {images.about && (
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 -z-10 rounded-[calc(var(--radius)*2)] bg-accent-soft" aria-hidden="true" />
            <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*2)] bg-surface-2">
              <Img src={images.about} alt={t.hero.portraitName || data.content.brand.name} />
            </div>
          </div>
        )}
        <div>
          <div className="eyebrow text-accent">{t.about.tag}</div>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {t.about.title1} <span className="text-accent">{t.about.title2}</span>{t.about.title3}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-fg text-pretty">{t.about.desc}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-1">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-[var(--radius)] bg-surface px-4 py-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-accent-fg" aria-hidden="true">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {t.about.sign && <p className="mt-6 font-display text-xl font-semibold">{t.about.sign}</p>}
          <Stats data={data} className="mt-10" />
          {hasProducts(data) && <div className="mt-8"><Button href={orderUrl(data)} external>{t.products.seeAll}</Button></div>}
        </div>
      </div>
    </Section>
  );
}

/** Closing call to order (and book when a menu exists). */
function OrderCta({ data, className = "" }: { data: SiteData; className?: string }) {
  const c = data.t.cta;
  const { brand } = data.content;
  return (
    <div className={`rounded-[calc(var(--radius)*1.5)] bg-hero px-6 py-14 text-center text-hero-fg sm:px-12 sm:py-20 ${className}`}>
      <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {c.title1} <span className="text-hero-muted">{c.title2}</span>{c.title3}
      </h2>
      {c.desc && <p className="mx-auto mt-4 max-w-xl text-base text-hero-muted sm:text-lg">{c.desc}</p>}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {hasProducts(data) && <Button href={orderUrl(data)} external size="lg" variant="hero">{data.t.products.order}</Button>}
        {(hasMenu(data) || !hasProducts(data)) && <Button href={brand.bookingUrl} external size="lg" variant={hasProducts(data) ? "outline" : "hero"} className={hasProducts(data) ? "border-hero-muted/50 text-hero-fg hover:bg-hero-fg/10" : ""}>{c.bookNow}</Button>}
        {data.whatsappUrl && <Button href={data.whatsappUrl} external size="lg" variant="outline" className="border-hero-muted/50 text-hero-fg hover:bg-hero-fg/10">{c.whatsapp}</Button>}
      </div>
    </div>
  );
}

function Home(props: LayoutProps) {
  const { data, setLang } = props;
  const { t } = data;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "home")} cta={navCta(data)} />
      <Offer data={data} />
      <Hero {...props} />
      <Marquee data={data} />

      {hasProducts(data) && (
        <Section id="boutique">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
            <div>
              <div className="eyebrow text-accent">{t.products.tag}</div>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{t.products.title}</h2>
            </div>
            <Button href={orderUrl(data)} external variant="outline">{t.products.seeAll}</Button>
          </div>
          <Products data={data} />
        </Section>
      )}

      <Routine {...props} />

      {hasMenu(data) && (
        <Section id="services">
          <Heading tag={t.services.tag} title={<>{t.services.title1} <span className="text-accent">{t.services.title2}</span>{t.services.title3}</>} />
          <MenuList data={data} variant="rows" limit={8} />
          <div className="mt-8"><Button href="/services" variant="outline">{t.services.seeAll}</Button></div>
        </Section>
      )}

      <Story {...props} />

      {hasTeam(data) && (
        <Section id="team" band="surface2">
          <Heading tag={t.team.tag} title={t.team.title} />
          <Team data={data} />
        </Section>
      )}

      {(hasReviews(data) || t.pillars.items.length > 0) && (
        <Section id="reviews" band={hasTeam(data) ? undefined : "surface2"}>
          <Heading tag={hasReviews(data) ? t.reviews.tag : t.pillars.tag} title={hasReviews(data) ? t.reviews.title : <>{t.pillars.title1} <span className="text-accent">{t.pillars.title2}</span>{t.pillars.title3}</>} />
          <Reviews data={data} />
        </Section>
      )}

      {hasGallery(data) && (
        <Section id="gallery">
          <Heading tag={t.gallery.tag} title={t.gallery.title} />
          <Gallery data={data} variant="strip" />
        </Section>
      )}

      {hasFaq(data) && (
        <Section id="faq" band="surface2">
          <Heading tag={t.faq.tag} title={t.faq.title} align="center" />
          <Faq data={data} className="mx-auto max-w-3xl" />
        </Section>
      )}

      {(hasHours(data) || hasAddress(data)) && (
        <Section id="visit">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="eyebrow text-accent">{t.nav.contact}</div>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t.location.city}</h2>
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

      <Section pad="py-10 sm:py-16"><OrderCta data={data} /></Section>
      <Footer data={data} />
    </div>
  );
}

/** The menu when one exists; otherwise the full product list. */
function Services({ data, setLang }: LayoutProps) {
  const { t } = data;
  const p = data.content.pages[data.lang].services;
  const menu = hasMenu(data);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "services")} cta={navCta(data)} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        {menu
          ? <Heading tag={p.eyebrow} title={<>{t.nav.services} <span className="text-accent">{p.titleAccent}</span></>} sub={p.subtitle} size="lg" />
          : <Heading tag={t.products.tag} title={t.products.title} size="lg" />}
        {menu
          ? <Button href={data.content.brand.bookingUrl} external size="lg">{t.hero.bookNow}</Button>
          : hasProducts(data) && <Button href={orderUrl(data)} external size="lg">{t.products.order}</Button>}
      </Section>
      <Section pad="pb-16 sm:pb-24">
        {menu ? <div className="mx-auto max-w-4xl"><MenuList data={data} variant="rows" /></div> : <Products data={data} />}
        {!menu && hasProducts(data) && (
          <div className="mt-14 rounded-[var(--radius)] border border-line bg-surface p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold">{p.infoTitle}</h3>
            {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
            <div className="mt-5"><Button href={orderUrl(data)} external>{t.products.seeAll}</Button></div>
          </div>
        )}
        {menu && (p.infoText || p.depositLine) && (
          <div className="mx-auto mt-14 max-w-4xl rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold">{p.infoTitle}</h3>
            {p.infoText && <p className="mt-2 text-muted-fg">{p.infoText}</p>}
            {p.depositLine && <p className="mt-2 text-muted-fg">{p.depositLine}</p>}
          </div>
        )}
      </Section>
      <Section pad="pb-16"><OrderCta data={data} /></Section>
      <Footer data={data} />
    </div>
  );
}

function Contact({ data, setLang }: LayoutProps) {
  const p = data.content.pages[data.lang].contact;
  const cp = data.content.contactPage[data.lang];
  const cta = hasMenu(data) || !hasProducts(data) ? { href: data.content.brand.bookingUrl, label: p.ctaLabel } : { href: orderUrl(data), label: data.t.products.order };
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav data={data} setLang={setLang} links={links(data, "contact")} cta={navCta(data)} />
      <Section pad="pt-12 pb-10 sm:pt-20 sm:pb-14">
        <Heading title={<>{p.heroTitle} <span className="text-accent">{p.heroAccent}</span></>} sub={cp.intro} size="lg" />
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
                <h3 className="mb-3 font-display text-2xl font-bold">{data.t.hours.title}</h3>
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
