import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const LOGO_URL = "";

// Set from Cloudflare dashboard → Analytics → Web Analytics → Add a site
const CF_WEB_ANALYTICS_TOKEN = "";

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Maison Prodige Beauty",
  "description": "Coiffeuse passionnée à Chevilly-Larue (94550). Tresses, pose de perruque, tissage, nattes collées et braids vanille. Service à domicile, 20 min de Paris.",
  "url": "https://maison-prodige.sobeauty.business",
  "telephone": "+33668125866",
  "email": "ackfall8@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Square Martorell",
    "addressLocality": "Chevilly-Larue",
    "postalCode": "94550",
    "addressCountry": "FR",
  },
  "image": LOGO_URL || undefined,
  "logo": LOGO_URL || undefined,
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "knowsLanguage": ["fr"],
  "sameAs": [],
  "founder": { "@type": "Person", "name": "Fally Christelle Kongo" },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Une erreur est survenue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maison Prodige Beauty · Tresses & Coiffure à Chevilly-Larue (94)" },
      { name: "description", content: "Fally Christelle Kongo — Coiffeuse passionnée depuis 7 ans à Chevilly-Larue. Tresses, pose de perruque, tissage, nattes collées. Service à domicile, à 20 minutes de Paris. Réservez en ligne." },
      { name: "author", content: "Maison Prodige Beauty" },
      { property: "og:title", content: "Maison Prodige Beauty · Tresses & Coiffure à Chevilly-Larue (94)" },
      { property: "og:description", content: "Fally Christelle Kongo — Tresses, perruques, tissage et nattes collées à Chevilly-Larue. Service à domicile, 20 min de Paris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maison Prodige Beauty · Tresses & Coiffure à Chevilly-Larue (94)" },
      { name: "twitter:description", content: "Fally Christelle Kongo — Coiffeuse à Chevilly-Larue. Tresses, perruques, tissage. 7 ans d'expérience. Réservez en ligne." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@500&display=swap" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
        {CF_WEB_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${CF_WEB_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
