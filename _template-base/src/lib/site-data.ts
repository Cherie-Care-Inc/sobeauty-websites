/**
 * SiteData: what every layout receives. Snapshot content merged with the live
 * facts (when they could be fetched), already resolved for one language.
 */

import type { DayHours, Lang, PageCopy, Product, Review, ServiceGroup, SiteContent, TeamMember } from "../site-content";
import type { LiveByLang } from "./live";
import { heroImg, aboutImg, svcImgs, galleryImgs } from "../assets/generated-images";

export interface SiteData {
  content: SiteContent;
  lang: Lang;
  t: PageCopy;
  menu: ServiceGroup[];
  team: TeamMember[];
  products: Product[];
  /** Digital products presented as programmes (trainings). */
  programmes: Product[];
  reviews: Review[];
  reviewsSummary: { average: number; count: number } | null;
  hours: DayHours[];
  /** Image sources ready for <img>: local assets first, live portfolio as extra. */
  images: { hero: string; about: string; svc: string[]; gallery: string[] };
  whatsappUrl: string;
  /** True when the facts came from the member's page at request time. */
  live: boolean;
}

export function buildSiteData(content: SiteContent, live: LiveByLang, lang: Lang): SiteData {
  const l = content.brand.langs.includes(lang) ? lang : content.brand.defaultLang;
  const t = content.i18n[l];
  const facts = live[l];
  const products = facts?.products ?? content.blocks.products;
  const localGallery = galleryImgs.filter(Boolean);
  const remoteGallery = (facts?.gallery?.length ? facts.gallery : content.blocks.galleryUrls).filter(Boolean);
  const gallery = localGallery.length ? localGallery : remoteGallery;
  return {
    content,
    lang: l,
    t,
    menu: facts?.menu ?? content.services[l] ?? [],
    team: facts?.team ?? content.blocks.team,
    products,
    programmes: products.filter((p) => p.kind === "digital"),
    reviews: facts?.reviews ?? content.blocks.reviews,
    reviewsSummary: facts ? facts.reviewsSummary : content.blocks.reviewsSummary,
    hours: content.blocks.hours,
    // svc keeps its positions: image i belongs to highlight card i (an empty one = no image).
    images: { hero: heroImg, about: aboutImg, svc: svcImgs, gallery: gallery.slice(0, 12) },
    whatsappUrl: facts?.whatsappUrl || content.brand.whatsappUrl,
    live: !!facts,
  };
}

export const hasMenu = (d: SiteData) => d.menu.some((g) => g.items.length > 0);
export const hasProducts = (d: SiteData) => d.products.length > 0;
export const hasTeam = (d: SiteData) => d.team.length > 1;
export const hasReviews = (d: SiteData) => d.reviews.length >= 2;
export const hasGallery = (d: SiteData) => d.images.gallery.length >= 3;
export const hasHours = (d: SiteData) => d.hours.some((h) => h.ranges.length > 0);
export const hasFaq = (d: SiteData) => d.t.faq.items.length > 0;
export const hasStats = (d: SiteData) => d.t.stats.length > 0;
export const hasOffer = (d: SiteData) => d.t.offer.trim().length > 0;
export const hasAbout = (d: SiteData) => d.t.about.desc.trim().length > 0;
export const hasAddress = (d: SiteData) => d.content.contact.address.trim().length > 0;
