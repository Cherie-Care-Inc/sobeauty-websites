import { Link } from "@tanstack/react-router";
import type { SiteData } from "../lib/site-data";
import { hasHours } from "../lib/site-data";
import { rangesLabel } from "../lib/format";

function SocialIcon({ kind }: { kind: "instagram" | "tiktok" | "facebook" | "snapchat" | "whatsapp" }) {
  const common = { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "currentColor", "aria-hidden": true } as const;
  switch (kind) {
    case "instagram": return <svg {...common}><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.9-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.6-1.4 3.9-4 4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.6-.1-3.9-1.4-4-4C3.8 15 3.8 14.7 3.8 12s0-3 .1-4.1c.1-2.6 1.4-3.9 4-4 1.1-.1 1.4-.1 4.1-.1zM12 2C9.3 2 9 2 7.9 2.1 4.2 2.2 2.2 4.2 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.7 2.1 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.7-.2 5.7-2.1 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.7-2.1-5.7-5.8-5.8C15 2 14.7 2 12 2z" /></svg>;
    case "tiktok": return <svg {...common}><path d="M16.5 3c.3 2.2 1.7 3.6 3.9 3.8v3.1c-1.4 0-2.7-.4-3.9-1.2v5.7a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.2a2.4 2.4 0 1 0 1.5 2.2V3h3.1z" /></svg>;
    case "facebook": return <svg {...common}><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" /></svg>;
    case "snapchat": return <svg {...common}><path d="M12 2.5c3 0 5.1 2.2 5.1 5.3v2c.4.2.9.1 1.3-.1.4-.2.9 0 1 .4.1.5-.4.8-1.3 1.2-.6.3-.9.5-.8.9.5 1.4 1.8 2.6 3.3 3 .4.1.5.5.2.8-.5.5-1.6.7-2.3.8-.2.4-.2 1-.6 1.1-.5.1-1.3-.3-2.3-.1-1 .2-1.8 1.7-3.6 1.7s-2.6-1.5-3.6-1.7c-1-.2-1.8.2-2.3.1-.4-.1-.4-.7-.6-1.1-.7-.1-1.8-.3-2.3-.8-.3-.3-.2-.7.2-.8 1.5-.4 2.8-1.6 3.3-3 .1-.4-.2-.6-.8-.9-.9-.4-1.4-.7-1.3-1.2.1-.4.6-.6 1-.4.4.2.9.3 1.3.1v-2C6.9 4.7 9 2.5 12 2.5z" /></svg>;
    case "whatsapp": return <svg {...common}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z" /></svg>;
  }
}

/** Footer: identity, contact, hours, socials, then the SoBeauty credit. */
export function Footer({ data, tone = "dark" }: { data: SiteData; tone?: "dark" | "light" }) {
  const { brand, contact, credit } = data.content;
  const f = data.t.footer;
  const h = data.t.hours;
  const dark = tone === "dark";
  const base = dark ? "bg-hero text-hero-fg" : "bg-surface-2 text-fg";
  const muted = dark ? "text-hero-muted" : "text-muted-fg";
  const line = dark ? "border-hero-muted/25" : "border-line";
  const socials = [
    contact.socials.instagram && { kind: "instagram" as const, href: contact.socials.instagram, label: "Instagram" },
    contact.socials.tiktok && { kind: "tiktok" as const, href: contact.socials.tiktok, label: "TikTok" },
    contact.socials.facebook && { kind: "facebook" as const, href: contact.socials.facebook, label: "Facebook" },
    contact.socials.snapchat && { kind: "snapchat" as const, href: contact.socials.snapchat, label: "Snapchat" },
    data.whatsappUrl && { kind: "whatsapp" as const, href: data.whatsappUrl, label: "WhatsApp" },
  ].filter(Boolean) as { kind: "instagram" | "tiktok" | "facebook" | "snapchat" | "whatsapp"; href: string; label: string }[];
  const showHours = hasHours(data);
  return (
    <footer className={`${base} py-14 sm:py-16`}>
      <div className={`container-site grid gap-10 ${showHours ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <div>
          {brand.logoUrl
            ? <img src={brand.logoUrl} alt={brand.name} className="mb-4 h-16 w-auto max-w-[220px] object-contain" loading="lazy" />
            : <div className="mb-4 font-display text-2xl font-semibold">{brand.name}</div>}
          {f.tagline && <p className={`max-w-xs text-sm leading-relaxed ${muted}`}>{f.tagline}</p>}
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-display text-xl">{f.contact}</h4>
          {contact.phoneHuman && <a href={`tel:${contact.phoneTel}`} className="block hover:text-accent">{contact.phoneHuman}</a>}
          {contact.email && <a href={`mailto:${contact.email}`} className="block break-all hover:text-accent">{contact.email}</a>}
          {contact.address && <p className={muted}>{contact.address}</p>}
          {!contact.address && contact.city && <p className={muted}>{contact.city}</p>}
        </div>
        {showHours && (
          <div className="space-y-1 text-sm">
            <h4 className="mb-2 font-display text-xl">{h.title}</h4>
            {data.hours.map((d) => (
              <div key={d.day} className="flex justify-between gap-4">
                <span className={muted}>{h.days[d.day]}</span>
                <span>{rangesLabel(d.ranges, data.lang, h.closed)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3 text-sm">
          {socials.length > 0 && <h4 className="font-display text-xl">{f.follow}</h4>}
          {socials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {socials.map((s) => (
                <a key={s.kind} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${line} transition-colors hover:bg-accent hover:text-accent-fg hover:border-transparent`}>
                  <SocialIcon kind={s.kind} />
                </a>
              ))}
            </div>
          )}
          <div className="pt-2">
            <a href={brand.bookingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">{data.t.nav.book}</a>
            <span className={`mx-2 ${muted}`}>·</span>
            <Link to="/contact" className={`${muted} hover:text-accent`}>{f.policy}</Link>
          </div>
        </div>
      </div>
      <div className={`container-site mt-10 flex flex-wrap items-center justify-between gap-3 border-t ${line} pt-6 text-xs ${muted}`}>
        <span>© {new Date().getFullYear()} {brand.name}. {f.rights}</span>
        <a href={credit.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
          <span>{f.madeBy}</span>
          {credit.logoUrl && <img src={credit.logoUrl} alt="SoBeauty" className={`h-5 w-auto ${dark ? "brightness-0 invert opacity-80" : "opacity-80"}`} loading="lazy" />}
        </a>
      </div>
    </footer>
  );
}
