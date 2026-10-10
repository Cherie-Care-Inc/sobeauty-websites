/**
 * Structural chrome labels (never written by the model), per language.
 * Neutral wording: barbers and salon owners read these too.
 */
import type { Lang } from "../_schema/site-content";

export interface Labels {
  nav: { home: string; services: string; about: string; menu: string; contact: string; book: string; shop: string; team: string; gallery: string; faq: string; programmes: string };
  hero: { bookNow: string; discover: string };
  services: { tag: string; title1: string; title2: string; title3: string; seeAll: string; more: string; from: string; duration: string };
  about: { tag: string; title1: string; title3: string; cta: string; experience: string; teamTitle1: string };
  pillars: { tag: string; title1: string; title2: string; title3: string };
  reviews: { tag: string; title: string; count: string; basedOn: string };
  team: { tag: string; title: string; bookWith: string; owner: string; allServices: string };
  gallery: { tag: string; title: string };
  faq: { tag: string; title: string };
  hours: { tag: string; title: string; closed: string; days: [string, string, string, string, string, string, string]; today: string };
  products: { tag: string; title: string; order: string; outOfStock: string; digital: string; physical: string; seeAll: string };
  programmes: { tag: string; title: string; enrol: string; includes: string };
  cta: { title1: string; title2: string; title3: string; bookNow: string; whatsapp: string };
  footer: { contact: string; follow: string; policy: string; rights: string; madeBy: string };
  location: { directions: string };
  stats: { years: string; rating: string; reviews: string };
  sub: {
    home: string; menuWord: string;
    svcEyebrow: string; svcTitleAccent: string; svcSubtitle: string; svcInfoTitle: string;
    ctHeroTitle: string; ctHeroAccent: string; ctCta: string;
    ctLabelPhone: string; ctLabelEmail: string; ctLabelAddress: string; ctLabelWhatsapp: string; ctPolicyTitle: string;
  };
  modeInfo: { salon: string; home: string; mobile: string };
  deposit: (pct: number) => string;
  socialsTail: string;
}

export const LABELS: Record<Lang, Labels> = {
  fr: {
    nav: { home: "Accueil", services: "Prestations", about: "À propos", menu: "Carte et tarifs", contact: "Contact", book: "Réserver", shop: "Boutique", team: "Équipe", gallery: "Réalisations", faq: "Questions", programmes: "Formations" },
    hero: { bookNow: "Réserver maintenant", discover: "Découvrir" },
    services: { tag: "Prestations", title1: "Des prestations", title2: "pensées", title3: " pour vous.", seeAll: "Voir toute la carte", more: "Et bien plus", from: "dès", duration: "durée" },
    about: { tag: "À propos", title1: "Je m'appelle", title3: ".", cta: "Prendre rendez-vous", experience: "ans d'expérience", teamTitle1: "Bienvenue chez" },
    pillars: { tag: "Pourquoi nous choisir", title1: "Un savoir-faire", title2: "qui fait", title3: " la différence." },
    reviews: { tag: "Avis", title: "Ce que disent les clients", count: "avis", basedOn: "sur" },
    team: { tag: "L'équipe", title: "Les personnes derrière le fauteuil", bookWith: "Réserver avec", owner: "Fondatrice ou fondateur", allServices: "Toutes les prestations" },
    gallery: { tag: "Réalisations", title: "Nos dernières réalisations" },
    faq: { tag: "Questions fréquentes", title: "Tout ce qu'il faut savoir" },
    hours: { tag: "Horaires", title: "Horaires d'ouverture", closed: "Fermé", days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], today: "aujourd'hui" },
    products: { tag: "Boutique", title: "Nos produits", order: "Commander", outOfStock: "Rupture", digital: "Produit numérique", physical: "Produit", seeAll: "Voir la boutique" },
    programmes: { tag: "Formation", title: "Nos formations", enrol: "S'inscrire", includes: "Au programme" },
    cta: { title1: "Prêt à", title2: "réserver", title3: "\u202F?", bookNow: "Réserver maintenant", whatsapp: "Écrire sur WhatsApp" },
    footer: { contact: "Contact", follow: "Suivez-nous", policy: "Conditions et annulation", rights: "Tous droits réservés.", madeBy: "Site réalisé par SoBeauty" },
    location: { directions: "Itinéraire" },
    stats: { years: "ans d'expérience", rating: "note moyenne", reviews: "avis clients" },
    sub: {
      home: "Accueil", menuWord: "Carte et tarifs",
      svcEyebrow: "Carte complète", svcTitleAccent: "et tarifs", svcSubtitle: "Toutes les prestations et leurs tarifs, au même endroit.", svcInfoTitle: "Bon à savoir",
      ctHeroTitle: "Prenons", ctHeroAccent: "rendez-vous", ctCta: "Réserver en ligne",
      ctLabelPhone: "Téléphone", ctLabelEmail: "E-mail", ctLabelAddress: "Adresse", ctLabelWhatsapp: "WhatsApp", ctPolicyTitle: "Conditions et annulation",
    },
    modeInfo: { salon: "Accueil en salon.", home: "Accueil à domicile.", mobile: "Déplacement chez vous." },
    deposit: (pct) => `Un acompte de ${pct} % est demandé à la réservation.`,
    socialsTail: ", suivez le travail au quotidien.",
  },
  en: {
    nav: { home: "Home", services: "Services", about: "About", menu: "Menu and prices", contact: "Contact", book: "Book", shop: "Shop", team: "Team", gallery: "Work", faq: "Questions", programmes: "Trainings" },
    hero: { bookNow: "Book now", discover: "Discover" },
    services: { tag: "Services", title1: "Services", title2: "designed", title3: " for you.", seeAll: "See the full menu", more: "And much more", from: "from", duration: "duration" },
    about: { tag: "About", title1: "My name is", title3: ".", cta: "Book an appointment", experience: "years of experience", teamTitle1: "Welcome to" },
    pillars: { tag: "Why choose us", title1: "Craft that", title2: "makes", title3: " the difference." },
    reviews: { tag: "Reviews", title: "What clients say", count: "reviews", basedOn: "based on" },
    team: { tag: "The team", title: "The people behind the chair", bookWith: "Book with", owner: "Founder", allServices: "All services" },
    gallery: { tag: "Work", title: "Our latest work" },
    faq: { tag: "Questions", title: "Good to know" },
    hours: { tag: "Hours", title: "Opening hours", closed: "Closed", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], today: "today" },
    products: { tag: "Shop", title: "Our products", order: "Order", outOfStock: "Out of stock", digital: "Digital product", physical: "Product", seeAll: "See the shop" },
    programmes: { tag: "Training", title: "Our trainings", enrol: "Enrol", includes: "What you will learn" },
    cta: { title1: "Ready to", title2: "book", title3: "?", bookNow: "Book now", whatsapp: "Message on WhatsApp" },
    footer: { contact: "Contact", follow: "Follow us", policy: "Terms and cancellation", rights: "All rights reserved.", madeBy: "Website by SoBeauty" },
    location: { directions: "Directions" },
    stats: { years: "years of experience", rating: "average rating", reviews: "client reviews" },
    sub: {
      home: "Home", menuWord: "Menu and prices",
      svcEyebrow: "Full menu", svcTitleAccent: "and prices", svcSubtitle: "All services and their prices in one place.", svcInfoTitle: "Good to know",
      ctHeroTitle: "Let's", ctHeroAccent: "book", ctCta: "Book online",
      ctLabelPhone: "Phone", ctLabelEmail: "E-mail", ctLabelAddress: "Address", ctLabelWhatsapp: "WhatsApp", ctPolicyTitle: "Terms and cancellation",
    },
    modeInfo: { salon: "Welcome at the salon.", home: "Welcome at home.", mobile: "We come to you." },
    deposit: (pct) => `A ${pct}% deposit is required at booking.`,
    socialsTail: ", follow the work day to day.",
  },
};
