/**
 * The template registry: one entry per layout, with its default design tokens.
 *
 * Shared verbatim between the builder (`scripts/build-from-brief.ts`) and the
 * generated site (`_template-base/src/layouts/registry.ts`, copied at build).
 * The backend mirrors `TEMPLATE_META` (key, categories, labels) for the gallery
 * and the suggestion rule; colours stay here.
 */

import type { CategoryKey, TemplateKey } from "../site-content";

export interface FontSpec { family: string; axis: string; stack: string }

export const FONTS: Record<string, FontSpec> = {
  cormorant:   { family: "Cormorant Garamond", axis: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500", stack: "'Cormorant Garamond', Georgia, serif" },
  fraunces:    { family: "Fraunces", axis: "Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400", stack: "'Fraunces', Georgia, serif" },
  playfair:    { family: "Playfair Display", axis: "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500", stack: "'Playfair Display', Georgia, serif" },
  "dm-serif":  { family: "DM Serif Display", axis: "DM+Serif+Display:ital@0;1", stack: "'DM Serif Display', Georgia, serif" },
  oswald:      { family: "Oswald", axis: "Oswald:wght@400;500;600;700", stack: "'Oswald', 'Arial Narrow', sans-serif" },
  archivo:     { family: "Archivo", axis: "Archivo:wdth,wght@100..125,500..800", stack: "'Archivo', 'Helvetica Neue', sans-serif" },
  "space-grotesk": { family: "Space Grotesk", axis: "Space+Grotesk:wght@400;500;600;700", stack: "'Space Grotesk', 'Helvetica Neue', sans-serif" },
  manrope:     { family: "Manrope", axis: "Manrope:wght@400;500;600;700;800", stack: "'Manrope', 'Helvetica Neue', sans-serif" },
  inter:       { family: "Inter", axis: "Inter:wght@300;400;500;600;700", stack: "'Inter', system-ui, sans-serif" },
  "dm-sans":   { family: "DM Sans", axis: "DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700", stack: "'DM Sans', system-ui, sans-serif" },
};

export interface TemplatePalette {
  bg: string; fg: string; surface: string; surface2: string; mutedFg: string; border: string;
  accent: string; accentFg: string; accentSoft: string;
  heroBg: string; heroFg: string; heroMuted: string;
}

export interface TemplateMeta {
  key: TemplateKey;
  /** Categories this layout suits; the first is its home category. */
  categories: CategoryKey[];
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  /** The reference it was designed after (for the team, never shown to members). */
  reference: string;
  fonts: { display: keyof typeof FONTS; body: keyof typeof FONTS };
  radius: string;
  /** Light or dark page: decides how brand colours are applied. */
  scheme: "light" | "dark";
  palette: TemplatePalette;
}

export const TEMPLATES: Record<TemplateKey, TemplateMeta> = {
  atelier: {
    key: "atelier", categories: ["hair", "institut", "skin"],
    label: { fr: "Atelier", en: "Atelier" },
    description: { fr: "Clair et éditorial, la carte des prestations en vedette : pour les menus riches (tresses, couleur, soins).", en: "Light and editorial, the service menu up front: for rich menus (braids, colour, care)." },
    reference: "Elysia", fonts: { display: "cormorant", body: "inter" }, radius: "0.75rem", scheme: "light",
    palette: { bg: "#FBF8F3", fg: "#1F1A17", surface: "#FFFFFF", surface2: "#F3EDE4", mutedFg: "#5F564E", border: "#E6DED2", accent: "#B5542E", accentFg: "#FFFFFF", accentSoft: "#F6E6DD", heroBg: "#1F1A17", heroFg: "#FBF8F3", heroMuted: "#CFC6BB" },
  },
  "editorial-dark": {
    key: "editorial-dark", categories: ["hair", "institut", "makeup"],
    label: { fr: "Éditorial sombre", en: "Dark editorial" },
    description: { fr: "Fond noir, grands titres en capitales, accent rouge : pour un salon premium qui veut de l'impact.", en: "Black background, big uppercase headlines, red accent: for a premium salon that wants impact." },
    reference: "Salonix", fonts: { display: "oswald", body: "inter" }, radius: "0.25rem", scheme: "dark",
    palette: { bg: "#0E0D0C", fg: "#F4F1EC", surface: "#171513", surface2: "#1F1C19", mutedFg: "#B3ABA1", border: "#2E2925", accent: "#D1223A", accentFg: "#FFFFFF", accentSoft: "#2A1114", heroBg: "#0E0D0C", heroFg: "#F4F1EC", heroMuted: "#B3ABA1" },
  },
  "studio-team": {
    key: "studio-team", categories: ["hair", "institut", "barber"],
    label: { fr: "Studio et équipe", en: "Studio and team" },
    description: { fr: "Chaleureux, l'histoire du salon et l'équipe en avant, chaque prestation avec sa durée et son bouton Réserver.", en: "Warm, the salon's story and team up front, every service with its duration and a Book button." },
    reference: "Marlo Hair Co", fonts: { display: "playfair", body: "inter" }, radius: "1.5rem", scheme: "light",
    palette: { bg: "#FFFFFF", fg: "#2B1D14", surface: "#FBF7F2", surface2: "#F3EBE2", mutedFg: "#6A5A4E", border: "#E8DED3", accent: "#6B3F27", accentFg: "#FFFFFF", accentSoft: "#F2E6DC", heroBg: "#FBF7F2", heroFg: "#2B1D14", heroMuted: "#6A5A4E" },
  },
  "gold-barber": {
    key: "gold-barber", categories: ["barber"],
    label: { fr: "Barbier or et noir", en: "Gold and black barber" },
    description: { fr: "Noir et doré, capitales condensées, horaires et WhatsApp bien visibles : le salon de barbier classique.", en: "Black and gold, condensed caps, hours and WhatsApp in plain sight: the classic barbershop." },
    reference: "UrbanCut", fonts: { display: "oswald", body: "inter" }, radius: "0", scheme: "dark",
    palette: { bg: "#0B0B0B", fg: "#F2EFE9", surface: "#151412", surface2: "#1C1A17", mutedFg: "#ADA89E", border: "#2B2824", accent: "#C9A24D", accentFg: "#0B0B0B", accentSoft: "#2A2412", heroBg: "#0B0B0B", heroFg: "#F2EFE9", heroMuted: "#ADA89E" },
  },
  "clean-barber": {
    key: "clean-barber", categories: ["barber", "hair"],
    label: { fr: "Barbier épuré", en: "Clean barber" },
    description: { fr: "Blanc, net, photos noir et blanc, prix et durées alignés : le barbier moderne.", en: "White, sharp, black and white photos, prices and durations aligned: the modern barber." },
    reference: "Barbero", fonts: { display: "space-grotesk", body: "inter" }, radius: "0.5rem", scheme: "light",
    palette: { bg: "#FFFFFF", fg: "#111111", surface: "#F6F6F4", surface2: "#EFEFEC", mutedFg: "#5A5A56", border: "#E2E2DE", accent: "#111111", accentFg: "#FFFFFF", accentSoft: "#EFEFEC", heroBg: "#FFFFFF", heroFg: "#111111", heroMuted: "#5A5A56" },
  },
  "rose-nails": {
    key: "rose-nails", categories: ["nails", "skin"],
    label: { fr: "Rose onglerie", en: "Rose nails" },
    description: { fr: "Rose poudré, arrondi, la grille de prix par famille (manucure, pédicure, gel) : l'onglerie.", en: "Powder pink, rounded, the price list by family (manicure, pedicure, gel): the nail bar." },
    reference: "Nailora", fonts: { display: "fraunces", body: "dm-sans" }, radius: "1.5rem", scheme: "light",
    palette: { bg: "#FBF3F1", fg: "#3A2230", surface: "#FFFFFF", surface2: "#F6E8E5", mutedFg: "#6F5060", border: "#EAD7D3", accent: "#8E3A5E", accentFg: "#FFFFFF", accentSoft: "#F3DEE6", heroBg: "#FBF3F1", heroFg: "#3A2230", heroMuted: "#6F5060" },
  },
  "portfolio-noir": {
    key: "portfolio-noir", categories: ["makeup", "training"],
    label: { fr: "Portfolio noir", en: "Portfolio noir" },
    description: { fr: "Noir, typographie large, les réalisations en grand : pour les maquilleuses et maquilleurs, mariages et événements.", en: "Black, wide type, the work shown big: for makeup artists, weddings and events." },
    reference: "Makeup Studio", fonts: { display: "archivo", body: "inter" }, radius: "0", scheme: "dark",
    palette: { bg: "#0A0A0A", fg: "#F5F5F5", surface: "#141414", surface2: "#1B1B1B", mutedFg: "#ABABAB", border: "#262626", accent: "#F5F5F5", accentFg: "#0A0A0A", accentSoft: "#1F1F1F", heroBg: "#0A0A0A", heroFg: "#F5F5F5", heroMuted: "#ABABAB" },
  },
  glow: {
    key: "glow", categories: ["skin", "institut", "makeup", "nails"],
    label: { fr: "Éclat", en: "Glow" },
    description: { fr: "Crème et bordeaux, serif élégant, collage de photos : soins du visage, cils, sourcils, instituts multi-services.", en: "Cream and oxblood, elegant serif, photo collage: facial care, lashes, brows, multi-service institutes." },
    reference: "Zerra", fonts: { display: "cormorant", body: "dm-sans" }, radius: "1rem", scheme: "light",
    palette: { bg: "#F7EFE6", fg: "#2A1612", surface: "#FFFFFF", surface2: "#F1E5D8", mutedFg: "#6A5046", border: "#E6D6C7", accent: "#8A1C2B", accentFg: "#FFFFFF", accentSoft: "#F3DFDF", heroBg: "#F7EFE6", heroFg: "#2A1612", heroMuted: "#6A5046" },
  },
  sanctuary: {
    key: "sanctuary", categories: ["spa", "skin"],
    label: { fr: "Sanctuaire", en: "Sanctuary" },
    description: { fr: "Une page, vert d'eau et sauge, bandeau d'offre, soins, équipe et tarifs : le spa.", en: "One page, teal and sage, offer banner, treatments, team and pricing: the spa." },
    reference: "Lusora", fonts: { display: "cormorant", body: "inter" }, radius: "1rem", scheme: "light",
    palette: { bg: "#F4F6F3", fg: "#17302B", surface: "#FFFFFF", surface2: "#E7EEE9", mutedFg: "#4A605A", border: "#D7E1DB", accent: "#1F5F55", accentFg: "#FFFFFF", accentSoft: "#DCEBE5", heroBg: "#17302B", heroFg: "#F4F6F3", heroMuted: "#B9CBC4" },
  },
  sand: {
    key: "sand", categories: ["spa", "skin"],
    label: { fr: "Sable", en: "Sand" },
    description: { fr: "Beige sable, serif italique, adresse et horaires en bandeau, formules et abonnements : massage et spa à domicile.", en: "Sand beige, italic serif, address and hours banner, packages and memberships: massage and home spa." },
    reference: "Opalya", fonts: { display: "playfair", body: "inter" }, radius: "0.5rem", scheme: "light",
    palette: { bg: "#F2E6CF", fg: "#2E2415", surface: "#F8F0DE", surface2: "#EADBBE", mutedFg: "#66563B", border: "#DCCBA8", accent: "#7A5A2E", accentFg: "#FFFFFF", accentSoft: "#EADBBE", heroBg: "#F2E6CF", heroFg: "#2E2415", heroMuted: "#66563B" },
  },
  "brand-shop": {
    key: "brand-shop", categories: ["shop"],
    label: { fr: "Boutique", en: "Shop" },
    description: { fr: "Blanc et vert, étapes de routine, grille de produits et commande : vente de produits et cosmétiques.", en: "White and green, routine steps, product grid and ordering: product and cosmetics sellers." },
    reference: "Nuda", fonts: { display: "manrope", body: "manrope" }, radius: "1.25rem", scheme: "light",
    palette: { bg: "#FFFFFF", fg: "#1A1F1B", surface: "#F4F7F4", surface2: "#E8EFE9", mutedFg: "#56625A", border: "#DCE5DD", accent: "#2F7D4F", accentFg: "#FFFFFF", accentSoft: "#DDEEE3", heroBg: "#2F7D4F", heroFg: "#FFFFFF", heroMuted: "#D7EADF" },
  },
  academy: {
    key: "academy", categories: ["training", "shop"],
    label: { fr: "Académie", en: "Academy" },
    description: { fr: "Crème et vert profond, les formations en programmes avec ce qu'on y apprend, la formatrice et l'inscription.", en: "Cream and deep green, trainings as programmes with what you learn, the trainer and enrolment." },
    reference: "Ananda + Makeup Studio", fonts: { display: "playfair", body: "inter" }, radius: "1rem", scheme: "light",
    palette: { bg: "#FAF7F0", fg: "#1E2A22", surface: "#FFFFFF", surface2: "#EEF2E8", mutedFg: "#53625A", border: "#DFE5D8", accent: "#3B6B45", accentFg: "#FFFFFF", accentSoft: "#E2ECE1", heroBg: "#1E2A22", heroFg: "#FAF7F0", heroMuted: "#C3CFC3" },
  },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATES) as TemplateKey[];

/** The default layout of each category (the gallery lists it first). */
export const DEFAULT_TEMPLATE: Record<CategoryKey, TemplateKey> = {
  hair: "atelier", barber: "gold-barber", nails: "rose-nails", makeup: "portfolio-noir", skin: "glow",
  spa: "sanctuary", institut: "glow", shop: "brand-shop", training: "academy",
};

export const isTemplateKey = (v: unknown): v is TemplateKey => typeof v === "string" && v in TEMPLATES;
