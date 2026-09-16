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

const CF_WEB_ANALYTICS_TOKEN = "";

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Djanie Beauty",
  "description": "Spécialiste nattes, tissage et french manucure à Paris 10e. Studio au coeur du boulevard de Strasbourg.",
  "url": "https://djanie-beauty.sobeauty.business",
  "telephone": "+33758838363",
  "email": "bambaadja594@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "36 boulevard de Strasbourg",
    "addressLocality": "Paris",
    "postalCode": "75010",
    "addressCountry": "FR",
  },
  "image": "https://djanie-beauty.sobeauty.business/",
  "logo": "https://djanie-beauty.sobeauty.business/",
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "knowsLanguage": ["fr"],
  "sameAs": [
    "https://www.tiktok.com/@adja19853",
  ],
  "founder": { "@type": "Person", "name": "Adja Bamba" },
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
      { title: "Djanie Beauty · Nattes & Tissage Paris 10e" },
      { name: "description", content: "Adja Bamba — spécialiste nattes, tissage et french manucure au 36 boulevard de Strasbourg, Paris 10e (Château d'Eau). Réservez en ligne." },
      { name: "author", content: "Djanie Beauty" },
      { property: "og:title", content: "Djanie Beauty · Nattes & Tissage Paris 10e" },
      { property: "og:description", content: "Studio de coiffure afro au coeur de Paris. Nattes lace, nattes collées, tissage, french manucure. 6 ans d'expérience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Djanie Beauty · Nattes & Tissage Paris 10e" },
      { name: "twitter:description", content: "Studio nattes & tissage Paris 10e. Réservez en ligne." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Dancing+Script:wght@500&family=Inter:wght@300;400;500;600&display=swap" },
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
