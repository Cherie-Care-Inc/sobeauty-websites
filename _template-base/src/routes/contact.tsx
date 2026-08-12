import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, MapPin, Phone, Instagram, Music2, Facebook, Clock } from "lucide-react";
import { SiteFooter } from "./index";
import { PageHeader } from "./services";
import content from "@/content";
import type { Lang } from "@/site-content";

const { brand, contact } = content;
const seoContact = content.seoPages[brand.defaultLang].contact;

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: seoContact.title },
      { name: "description", content: seoContact.description },
      { property: "og:title", content: seoContact.title },
      { property: "og:description", content: seoContact.description },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const [lang, setLang] = useState<Lang>(brand.defaultLang);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored && brand.langs.includes(stored)) setLang(stored);
  }, []);

  const setLanguage = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = content.i18n[lang];
  const p = content.pages[lang].contact;
  const cp = content.contactPage[lang];
  const [addrLine1, ...addrRest] = contact.address.split(",");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader lang={lang} setLanguage={setLanguage} active="contact" />

      <section className="pt-32 pb-20 px-6 bg-hero text-cream">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--copper-glow)" }}>{t.nav.contact}</div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05]" style={{ color: "var(--cream)" }}>
            {p.heroTitle} <em className="text-gradient-copper not-italic font-normal">{p.heroAccent}</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.99 0.004 60 / 0.85)" }}>
            {cp.intro}
          </p>
          <div className="pt-4">
            <a
              href={brand.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-copper px-8 py-4 text-base font-medium text-accent-foreground shadow-glow hover:scale-105 transition-transform duration-500"
            >
              {p.ctaLabel}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6">
          <a href={`tel:${contact.phoneTel}`} className="group rounded-3xl bg-card border border-border p-8 shadow-elegant hover:border-accent hover:-translate-y-1 transition-all duration-500">
            <Phone className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{p.labelPhone}</div>
            <div className="font-display text-2xl">{contact.phoneHuman}</div>
          </a>
          <a href={`mailto:${contact.email}`} className="group rounded-3xl bg-card border border-border p-8 shadow-elegant hover:border-accent hover:-translate-y-1 transition-all duration-500">
            <Mail className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{p.labelEmail}</div>
            <div className="font-display text-xl break-all">{contact.email}</div>
          </a>
          <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant md:col-span-2">
            <MapPin className="h-6 w-6 text-accent mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{p.labelAddress}</div>
            <div className="font-display text-2xl mb-1">{addrLine1.trim()}</div>
            <div className="text-muted-foreground">{addrRest.join(",").trim()}</div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{cp.note}</p>
          </div>
          <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{t.footer.follow}</div>
            <div className="flex items-center gap-4">
              <a href={contact.socials.instagram || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={contact.socials.tiktok || "#"} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Music2 className="h-5 w-5" />
              </a>
              <a href={contact.socials.facebook || "#"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-copper hover:text-accent-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            {p.socialsLine && <div className="mt-4 text-sm text-muted-foreground">{p.socialsLine}</div>}
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-muted p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-accent" />
              <h2 className="font-display text-3xl md:text-4xl font-light">
                <em className="text-gradient-copper not-italic font-normal">{p.policyTitle}</em>
              </h2>
            </div>
            <ul className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {cp.policy.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent">📌</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 italic text-foreground">{p.signature}</p>
          </div>
        </div>
      </section>

      <SiteFooter content={content} lang={lang} />
    </div>
  );
}
