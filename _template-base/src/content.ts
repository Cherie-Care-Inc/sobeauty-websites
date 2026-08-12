import type { SiteContent } from "./site-content";

/**
 * Sample content — Maison Prodige Beauty.
 *
 * This is the reference example the build script overwrites per client.
 * It reproduces the original hardcoded maison-prodige template 1:1 so the
 * base template renders identically to before the data-driven refactor.
 */
const content: SiteContent = {
  brand: {
    name: "Maison Prodige Beauty",
    displayParts: ["Maison", "Prodige"],
    initial: "M",
    slug: "maison-prodige",
    logoUrl: "",
    bookingUrl: "https://book.sobeauty.business/maison-prodige",
    schemaType: "HairSalon",
    defaultLang: "fr",
    langs: ["fr", "en"],
  },

  contact: {
    phoneHuman: "06 68 12 58 66",
    phoneTel: "+33668125866",
    email: "ackfall8@gmail.com",
    address: "1 Square Martorell, 94550 Chevilly-Larue",
    city: "Chevilly-Larue",
    region: "94550 Val-de-Marne",
    locationHint: "20 min Paris",
    socials: {},
    mode: "home",
  },

  theme: {
    copper: "oklch(0.72 0.12 75)",
    copperGlow: "oklch(0.88 0.08 75)",
    espresso: "oklch(0.14 0.02 60)",
    cream: "oklch(0.99 0.004 60)",
    heroMid: "oklch(0.28 0.05 60)",
    fontDisplayStack: "'Fraunces', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@500&display=swap",
  },

  assets: {
    hero: "hero.jpg",
    about: "about.jpg",
    svc1: "svc-1.jpg",
    svc2: "svc-2.jpg",
    svc3: "svc-3.jpg",
    flower: "flower.png",
  },

  cfAnalyticsToken: "",

  i18n: {
    fr: {
      nav: { home: "Accueil", services: "Services", about: "À propos", menu: "Menu", contact: "Contact", book: "Réserver" },
      hero: {
        eyebrow: "Maison Prodige Beauty · Chevilly-Larue",
        title1: "Sublimez",
        title2: "votre beauté",
        title3: " avec soin.",
        desc: "Maison Prodige Beauty — Fally Christelle Kongo, coiffeuse passionnée depuis 7 ans. Tresses, perruques, tissage et nattes collées à Chevilly-Larue ou à domicile, à 20 minutes de Paris.",
        bookNow: "Réserver maintenant",
        discover: "Découvrir",
        happy: "Clientes ravies",
        location: "Chevilly-Larue · 94550",
        portraitTag: "Coiffeuse · Tresses",
        portraitName: "Fally",
      },
      services: {
        tag: "Prestations",
        title1: "Des coiffures",
        title2: "d'exception",
        title3: " pour vous.",
        seeAll: "Voir tous mes services",
        more: "Et bien plus...",
        items: [
          { title: "Tresses & Nattes", desc: "Box braids, cornrows, nattes africaines et tressage sur mesure. Un résultat net et durable, réalisé avec soin." },
          { title: "Perruque & Tissage", desc: "Pose de perruque naturelle ou synthétique, tissage et closure. Un look naturel, élégant et soigné." },
          { title: "Natte Collée & Vanille", desc: "Nattes collées, braids vanille et stylisation créative. Un style unique rien que pour vous." },
        ],
      },
      about: {
        tag: "À propos",
        title1: "Je m'appelle",
        title2: "Fally",
        title3: ".",
        desc: "Créative et profondément passionnée par la coiffure, faire rayonner chaque cliente est ma plus grande joie. Depuis 7 ans, je maîtrise toutes les techniques capillaires : tresses, tissage, pose de perruque, nattes collées et bien plus encore. Je vous accueille à domicile à Chevilly-Larue ou me déplace chez vous, à 20 minutes de Paris.",
        bullets: [
          "À l'écoute de vos envies pour un résultat qui vous ressemble",
          "Créative — j'adapte chaque coiffure à votre style et vos cheveux",
          "Soignée et précise — chaque prestation est réalisée avec le plus grand soin",
        ],
        sign: "Je vous attends — Fally",
        cta: "Prendre rendez-vous",
        experienceValue: "7",
        experience: "ans d'expérience",
      },
      testimonials: {
        tag: "Pourquoi me choisir",
        title1: "Des coiffures",
        title2: "qui vous font",
        title3: " rayonner.",
        items: [
          { label: "Écoute", text: "Je prends le temps de comprendre vos envies et votre style pour créer une coiffure qui vous ressemble vraiment." },
          { label: "Créativité", text: "Passionnée et créative, j'aime proposer des styles qui subliment chaque cliente — du plus classique au plus audacieux." },
          { label: "Soin", text: "Je travaille avec minutie et respect de votre cheveu. Chaque prestation est réalisée avec le plus grand soin pour un résultat impeccable." },
        ],
      },
      cta: {
        title1: "Prête à",
        title2: "rayonner",
        title3: " ?",
        desc: "Réservez votre rendez-vous en ligne en quelques secondes.",
        bookNow: "Réserver maintenant",
      },
      marquee: ["Tresses", "Nattes Collées", "Perruque", "Tissage", "Braids Vanille", "Chevilly-Larue 94"],
      footer: {
        tagline: "Tresses, perruques & tissage à Chevilly-Larue (94). Service à domicile, 20 min de Paris.",
        contact: "Contact",
        follow: "Suivez-moi",
        policy: "Politique d'annulation",
        rights: "Tous droits réservés.",
      },
      location: { city: "Chevilly-Larue", region: "94550 Val-de-Marne", hint: "20 min Paris" },
    },
    en: {
      nav: { home: "Home", services: "Services", about: "About", menu: "Menu", contact: "Contact", book: "Book" },
      hero: {
        eyebrow: "Maison Prodige Beauty · Chevilly-Larue",
        title1: "Elevate",
        title2: "your beauty",
        title3: " with care.",
        desc: "Maison Prodige Beauty — Fally Christelle Kongo, passionate hairdresser for 7 years. Braids, wigs, weaves and glue braids in Chevilly-Larue or at your home, 20 minutes from Paris.",
        bookNow: "Book now",
        discover: "Discover",
        happy: "Happy clients",
        location: "Chevilly-Larue · 94550",
        portraitTag: "Coiffeuse · Tresses",
        portraitName: "Fally",
      },
      services: {
        tag: "Services",
        title1: "Exceptional",
        title2: "hair styles",
        title3: " for you.",
        seeAll: "View all services",
        more: "And much more...",
        items: [
          { title: "Braids & Cornrows", desc: "Box braids, cornrows, African braids and custom braiding. A neat, long-lasting result, crafted with care." },
          { title: "Wig & Weave", desc: "Natural or synthetic wig placement, weaves and closures. A natural, elegant and refined look." },
          { title: "Glue Braids & Vanilla", desc: "Glue braids, vanilla braids and creative styling. A unique style, just for you." },
        ],
      },
      about: {
        tag: "About",
        title1: "My name is",
        title2: "Fally",
        title3: ".",
        desc: "Creative and deeply passionate about hairdressing, making every client shine is my greatest joy. For 7 years, I have mastered all hair techniques: braids, weaves, wig placements, glue braids and much more. I welcome you at my home in Chevilly-Larue or come to you, 20 minutes from Paris.",
        bullets: [
          "I listen to understand exactly the style you want",
          "Creative — I adapt every style to your hair and personality",
          "Precise and careful — every service is delivered with the greatest care",
        ],
        sign: "I'm waiting for you — Fally",
        cta: "Book an appointment",
        experienceValue: "7",
        experience: "years of experience",
      },
      testimonials: {
        tag: "Why choose me",
        title1: "Hair styles",
        title2: "that make you",
        title3: " shine.",
        items: [
          { label: "Listening", text: "I take the time to understand your desires and your style to create a hairstyle that truly reflects who you are." },
          { label: "Creativity", text: "Passionate and creative, I love proposing styles that enhance every client — from the most classic to the most daring." },
          { label: "Care", text: "I work with precision and respect for your hair. Every service is delivered with the greatest care for an impeccable result." },
        ],
      },
      cta: {
        title1: "Ready to",
        title2: "shine",
        title3: " ?",
        desc: "Book your appointment online in a few seconds.",
        bookNow: "Book now",
      },
      marquee: ["Braids", "Glue Braids", "Wigs", "Weave", "Vanilla Braids", "Chevilly-Larue 94"],
      footer: {
        tagline: "Braids, wigs & weave in Chevilly-Larue (94). Home service, 20 min from Paris.",
        contact: "Contact",
        follow: "Follow me",
        policy: "Cancellation policy",
        rights: "All rights reserved.",
      },
      location: { city: "Chevilly-Larue", region: "94550 Val-de-Marne", hint: "20 min Paris" },
    },
  },

  services: {
    fr: [
      {
        title: "Tresses & Nattes",
        items: [
          { name: "Braids vanille", duration: "1h", price: "50€" },
          { name: "Cornrows / Nattes plaquées", duration: "1h", price: "50€" },
          { name: "Box braids (mi-longues)", duration: "2h30", price: "80€" },
          { name: "Box braids (longues)", duration: "3h30", price: "100€" },
          { name: "Tressage sur mesure", duration: "sur mesure", price: "sur devis" },
        ],
      },
      {
        title: "Pose de Perruque & Tissage",
        items: [
          { name: "Pose de perruque simple", duration: "1h", price: "50€" },
          { name: "Tissage mi-longueur", duration: "2h", price: "80€" },
          { name: "Tissage long", duration: "2h30", price: "100€" },
          { name: "Pose closure / frontal", duration: "1h30", price: "80€" },
        ],
      },
      {
        title: "Nattes Collées & Stylisation",
        items: [
          { name: "Natte collée", duration: "1h30", price: "60€" },
          { name: "Fulani braids / Goddess braids", duration: "2h", price: "70€" },
          { name: "Coiffure événementielle", duration: "2h+", price: "à partir de 80€" },
        ],
      },
    ],
    en: [
      {
        title: "Braids & Cornrows",
        items: [
          { name: "Vanilla braids", duration: "1h", price: "€50" },
          { name: "Cornrows / Flat braids", duration: "1h", price: "€50" },
          { name: "Box braids (medium length)", duration: "2h30", price: "€80" },
          { name: "Box braids (long)", duration: "3h30", price: "€100" },
          { name: "Custom braiding", duration: "custom", price: "on request" },
        ],
      },
      {
        title: "Wig & Weave",
        items: [
          { name: "Simple wig placement", duration: "1h", price: "€50" },
          { name: "Mid-length weave", duration: "2h", price: "€80" },
          { name: "Long weave", duration: "2h30", price: "€100" },
          { name: "Closure / frontal placement", duration: "1h30", price: "€80" },
        ],
      },
      {
        title: "Glue Braids & Styling",
        items: [
          { name: "Glue braids", duration: "1h30", price: "€60" },
          { name: "Fulani braids / Goddess braids", duration: "2h", price: "€70" },
          { name: "Event styling", duration: "2h+", price: "from €80" },
        ],
      },
    ],
  },

  contactPage: {
    fr: {
      intro: "Réservez en ligne en quelques secondes ou contactez-moi directement. Je réponds avec plaisir.",
      policy: [
        "Contactez-moi au moins 24h à l'avance en cas d'annulation ou de report.",
        "Pour les prestations longues (3h+), un acompte peut être demandé à la réservation.",
        "En cas d'empêchement de dernière minute, merci de me prévenir dès que possible.",
        "Je ferai de mon mieux pour vous proposer un nouveau créneau dans les plus brefs délais.",
      ],
      note: "Je vous accueille à domicile à Chevilly-Larue ou me déplace chez vous à 20 minutes de Paris. Langues parlées : Français.",
    },
    en: {
      intro: "Book online in seconds or contact me directly — I'm happy to help.",
      policy: [
        "Please contact me at least 24 hours in advance to cancel or reschedule.",
        "For longer services (3h+), a deposit may be required at the time of booking.",
        "In case of last-minute cancellation, please notify me as soon as possible.",
        "I will do my best to offer you a new appointment at the earliest convenience.",
      ],
      note: "I welcome you at my home in Chevilly-Larue or come to you within 20 minutes of Paris. Languages spoken: French.",
    },
  },

  pages: {
    fr: {
      navHome: "Accueil",
      services: {
        eyebrow: "Menu complet",
        titleAccent: "& tarifs",
        subtitle: "Retrouvez l'ensemble de mes prestations et leurs tarifs.",
        infoTitle: "Bon à savoir",
        infoText: "Je vous accueille à mon domicile au 1 Square Martorell, 94550 Chevilly-Larue, ou me déplace chez vous à 20 minutes de Paris. Toutes les prestations sont disponibles, n'hésitez pas à me contacter pour un devis personnalisé.",
        depositLine: "",
      },
      contact: {
        heroTitle: "Prenons",
        heroAccent: "rendez-vous",
        ctaLabel: "Réserver en ligne",
        labelPhone: "Téléphone",
        labelEmail: "Email",
        labelAddress: "Adresse",
        socialsLine: "",
        policyTitle: "Politique d'annulation",
        signature: "— Fally",
      },
    },
    en: {
      navHome: "Home",
      services: {
        eyebrow: "Full menu",
        titleAccent: "& pricing",
        subtitle: "All my services and their pricing in one place.",
        infoTitle: "Good to know",
        infoText: "I welcome you at my home at 1 Square Martorell, 94550 Chevilly-Larue, or come to you within 20 minutes of Paris. All services are available — contact me for a personalised quote.",
        depositLine: "",
      },
      contact: {
        heroTitle: "Let's",
        heroAccent: "book",
        ctaLabel: "Book online",
        labelPhone: "Phone",
        labelEmail: "Email",
        labelAddress: "Address",
        socialsLine: "",
        policyTitle: "Cancellation policy",
        signature: "— Fally",
      },
    },
  },

  seoPages: {
    fr: {
      services: {
        title: "Services & Tarifs - Maison Prodige Beauty",
        description: "Menu complet de Maison Prodige Beauty : tresses, box braids, nattes collées, pose de perruque, tissage. Tarifs à partir de 50€. Chevilly-Larue 94550 · À domicile.",
      },
      contact: {
        title: "Contact & Réservation - Maison Prodige Beauty",
        description: "Contactez Fally Christelle Kongo — Maison Prodige Beauty à Chevilly-Larue (94550). Téléphone, email, adresse. Service à domicile, 20 min de Paris.",
      },
    },
    en: {
      services: {
        title: "Services & Pricing - Maison Prodige Beauty",
        description: "Full menu of Maison Prodige Beauty: braids, box braids, glue braids, wig placement, weaves. Prices from €50. Chevilly-Larue 94550 · Home service.",
      },
      contact: {
        title: "Contact & Booking - Maison Prodige Beauty",
        description: "Contact Fally Christelle Kongo — Maison Prodige Beauty in Chevilly-Larue (94550). Phone, email, address. Home service, 20 minutes from Paris.",
      },
    },
  },

  seo: {
    fr: {
      title: "Maison Prodige Beauty · Tresses & Coiffure à Chevilly-Larue (94)",
      description:
        "Fally Christelle Kongo — Coiffeuse passionnée depuis 7 ans à Chevilly-Larue. Tresses, pose de perruque, tissage, nattes collées. Service à domicile, à 20 minutes de Paris. Réservez en ligne.",
    },
    en: {
      title: "Maison Prodige Beauty · Braids & Hairstyling in Chevilly-Larue (94)",
      description:
        "Fally Christelle Kongo — passionate hairdresser for 7 years in Chevilly-Larue. Braids, wig placement, weaves, glue braids. Home service, 20 minutes from Paris. Book online.",
    },
  },

  structuredData: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Maison Prodige Beauty",
    description:
      "Coiffeuse passionnée à Chevilly-Larue (94550). Tresses, pose de perruque, tissage, nattes collées et braids vanille. Service à domicile, 20 min de Paris.",
    url: "https://maison-prodige.sobeauty.business",
    telephone: "+33668125866",
    email: "ackfall8@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Square Martorell",
      addressLocality: "Chevilly-Larue",
      postalCode: "94550",
      addressCountry: "FR",
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    knowsLanguage: ["fr"],
    sameAs: [],
    founder: { "@type": "Person", name: "Fally Christelle Kongo" },
  }),
};

export default content;
