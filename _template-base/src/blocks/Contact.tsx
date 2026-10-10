import type { SiteData } from "../lib/site-data";
import { hasAddress, hasHours } from "../lib/site-data";
import { Hours } from "./Content";

/** Phone, e-mail, WhatsApp, address (with directions): only the ones that exist. */
export function ContactCards({ data, className = "" }: { data: SiteData; className?: string }) {
  const { contact } = data.content;
  const p = data.content.pages[data.lang].contact;
  const cards = [
    contact.phoneHuman && { label: p.labelPhone, value: contact.phoneHuman, href: `tel:${contact.phoneTel}` },
    data.whatsappUrl && { label: p.labelWhatsapp, value: contact.phoneHuman || "WhatsApp", href: data.whatsappUrl, external: true },
    contact.email && { label: p.labelEmail, value: contact.email, href: `mailto:${contact.email}` },
    hasAddress(data) && { label: p.labelAddress, value: contact.address, href: contact.mapsUrl || "", external: true, sub: data.t.location.hint },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean; sub?: string }[];
  if (!cards.length) return null;
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {cards.map((c) => {
        const inner = (
          <>
            <div className="eyebrow text-muted-fg">{c.label}</div>
            <div className="mt-2 break-words font-display text-xl sm:text-2xl">{c.value}</div>
            {c.sub && <div className="mt-1 text-sm text-muted-fg">{c.sub}</div>}
          </>
        );
        return (
          <li key={c.label} className="rounded-[var(--radius)] border border-line bg-surface p-6 transition-colors hover:border-accent">
            {c.href ? <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block">{inner}</a> : <div>{inner}</div>}
          </li>
        );
      })}
    </ul>
  );
}

/** Cancellation policy + good-to-know note. */
export function Policy({ data, className = "" }: { data: SiteData; className?: string }) {
  const cp = data.content.contactPage[data.lang];
  const p = data.content.pages[data.lang];
  const items = cp.policy.filter((s) => s.trim());
  if (!items.length && !cp.note && !p.services.depositLine) return null;
  return (
    <div className={`rounded-[var(--radius)] bg-surface-2 p-6 sm:p-8 ${className}`}>
      <h2 className="font-display text-2xl sm:text-3xl">{p.contact.policyTitle}</h2>
      {items.length > 0 && (
        <ul className="mt-4 space-y-2 leading-relaxed text-muted-fg">
          {items.map((s, i) => <li key={i} className="flex gap-3"><span className="text-accent" aria-hidden="true">•</span><span>{s}</span></li>)}
        </ul>
      )}
      {p.services.depositLine && <p className="mt-3 text-muted-fg">{p.services.depositLine}</p>}
      {cp.note && <p className="mt-3 text-muted-fg">{cp.note}</p>}
      {p.contact.signature && <p className="mt-5 font-display text-lg italic">{p.contact.signature}</p>}
    </div>
  );
}

/** Hours card (when hours exist). */
export function HoursCard({ data, className = "" }: { data: SiteData; className?: string }) {
  if (!hasHours(data)) return null;
  return (
    <div className={`rounded-[var(--radius)] border border-line bg-surface p-6 ${className}`}>
      <h3 className="mb-3 font-display text-2xl">{data.t.hours.title}</h3>
      <Hours data={data} compact />
    </div>
  );
}
