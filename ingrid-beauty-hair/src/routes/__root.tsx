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
import ingridLogoImg from "@/assets/ingrid-logo.jpeg";

const LOGO_URL = ingridLogoImg;

// Set from Cloudflare dashboard → Analytics → Web Analytics → Add a site
const CF_WEB_ANALYTICS_TOKEN = "";

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Ingrid Beauty Hair",
  "description": "Spécialiste des locs à Andilly (95580). Reprise racines twist et crochet, tressage, coloration. 15 ans d'expérience.",
  "url": "https://ingridbeautyhair.sobeauty.business",
  "telephone": "+33660872886",
  "email": "ingrid.shillingford123@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "16 rue du président Paul Doumer",
    "addressLocality": "Andilly",
    "postalCode": "95580",
    "addressCountry": "FR",
  },
  "image": LOGO_URL,
  "logo": LOGO_URL,
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "knowsLanguage": ["fr", "en", "ht"],
  "sameAs": [
    "https://www.instagram.com/Ingridbeautyhair971",
    "https://www.tiktok.com/@ingridbeautyhair971",
    "https://www.facebook.com/Ingrid%20Beauty%20Hair%20-%20Andilly%20Sarcelles",
  ],
  "founder": { "@type": "Person", "name": "Ingrid Delishys-T" },
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
      { title: "Ingrid Beauty Hair · Spécialiste Locs à Andilly (95)" },
      { name: "description", content: "Ingrid Delishys-T — Spécialiste des locs à Andilly. Reprise racines twist et crochet, tressage, coloration. 15 ans d'expérience. Réservez en ligne." },
      { name: "author", content: "Ingrid Beauty Hair" },
      { property: "og:title", content: "Ingrid Beauty Hair · Spécialiste Locs à Andilly (95)" },
      { property: "og:description", content: "Ingrid Delishys-T — Spécialiste des locs à Andilly. Reprise racines twist et crochet, tressage, coloration. 15 ans d'expérience." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: LOGO_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ingrid Beauty Hair · Spécialiste Locs à Andilly (95)" },
      { name: "twitter:description", content: "Ingrid Delishys-T — Spécialiste des locs à Andilly. 15 ans d'expérience. Réservez en ligne." },
      { name: "twitter:image", content: LOGO_URL },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@500&display=swap" },
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
