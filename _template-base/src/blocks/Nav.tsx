import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Lang } from "../site-content";
import type { SiteData } from "../lib/site-data";
import { hasMenu, hasProducts, hasTeam, hasGallery, hasFaq } from "../lib/site-data";

export interface NavLink { href: string; label: string; route?: boolean }

/** The links a layout usually shows, derived from the data present. */
export function defaultLinks(d: SiteData, page: "home" | "services" | "contact"): NavLink[] {
  const t = d.t.nav;
  const home = page === "home";
  const links: NavLink[] = [];
  if (hasMenu(d)) links.push(home ? { href: "#services", label: t.services } : { href: "/services", label: t.menu, route: true });
  if (d.programmes.length && d.content.category === "training") links.push({ href: home ? "#programmes" : "/#programmes", label: t.programmes });
  else if (hasProducts(d)) links.push({ href: home ? "#boutique" : "/#boutique", label: t.shop });
  links.push({ href: home ? "#about" : "/#about", label: t.about });
  if (hasTeam(d)) links.push({ href: home ? "#team" : "/#team", label: t.team });
  if (hasGallery(d)) links.push({ href: home ? "#gallery" : "/#gallery", label: t.gallery });
  if (hasFaq(d) && home) links.push({ href: "#faq", label: t.faq });
  links.push({ href: "/contact", label: t.contact, route: true });
  return links;
}

export function LangToggle({ data, setLang, tone = "light" }: { data: SiteData; setLang: (l: Lang) => void; tone?: "light" | "dark" }) {
  const { langs } = data.content.brand;
  if (langs.length < 2) return null;
  const on = tone === "dark" ? "bg-hero-fg text-hero" : "bg-fg text-bg";
  const off = tone === "dark" ? "text-hero-muted" : "text-muted-fg";
  return (
    <div className={`inline-flex items-center overflow-hidden rounded-full border text-xs font-semibold ${tone === "dark" ? "border-hero-muted/40" : "border-line"}`}>
      {langs.map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={data.lang === l} aria-label={l === "fr" ? "Français" : "English"}
          className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${data.lang === l ? on : off}`}>{l}</button>
      ))}
    </div>
  );
}

export function Logo({ data, className = "h-12 sm:h-14", tone = "light" }: { data: SiteData; className?: string; tone?: "light" | "dark" }) {
  const { brand } = data.content;
  return (
    <Link to="/" className="flex items-center" aria-label={brand.name}>
      {brand.logoUrl
        ? <img src={brand.logoUrl} alt={brand.name} className={`${className} w-auto max-w-[200px] object-contain`} />
        : <span className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${tone === "dark" ? "text-hero-fg" : "text-fg"}`}>
            {brand.displayParts[0]}{brand.displayParts[1] ? <span className="font-normal"> {brand.displayParts[1]}</span> : null}
          </span>}
    </Link>
  );
}

/**
 * Sticky header: big readable logo, links, language toggle, Book button.
 * `tone` dark = on a dark hero (text light), light = on the page background.
 */
export function Nav({ data, setLang, links, tone = "light", solid = true, cta }: {
  data: SiteData; setLang: (l: Lang) => void; links: NavLink[]; tone?: "light" | "dark"; solid?: boolean; cta?: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const book = cta ?? { href: data.content.brand.bookingUrl, label: data.t.nav.book };
  const dark = tone === "dark";
  const bg = dark ? "bg-hero/90 text-hero-fg" : "bg-bg/90 text-fg";
  const frame = solid || scrolled ? `${bg} backdrop-blur-md border-b ${dark ? "border-hero-muted/20" : "border-line"}` : "bg-transparent text-hero-fg";
  const linkCls = dark || !(solid || scrolled) ? "hover:text-accent" : "hover:text-accent";
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${frame}`}>
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Logo data={data} tone={dark || !(solid || scrolled) ? "dark" : "light"} />
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex" aria-label="Navigation">
          {links.map((l) => l.route
            ? <Link key={l.href} to={l.href} className={`transition-colors ${linkCls}`}>{l.label}</Link>
            : <a key={l.href} href={l.href} className={`transition-colors ${linkCls}`}>{l.label}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><LangToggle data={data} setLang={setLang} tone={dark || !(solid || scrolled) ? "dark" : "light"} /></div>
          <a href={book.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg sm:px-5">
            {book.label}
          </a>
          <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border lg:hidden ${dark ? "border-hero-muted/40" : "border-line"}`}>
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className={`lg:hidden border-t ${dark ? "border-hero-muted/20 bg-hero text-hero-fg" : "border-line bg-bg text-fg"}`}>
          <nav className="container-site flex flex-col py-3" aria-label="Navigation">
            {links.map((l) => l.route
              ? <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="py-3 text-base font-medium">{l.label}</Link>
              : <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-base font-medium">{l.label}</a>)}
            <div className="py-3"><LangToggle data={data} setLang={setLang} tone={dark ? "dark" : "light"} /></div>
          </nav>
        </div>
      )}
    </header>
  );
}
