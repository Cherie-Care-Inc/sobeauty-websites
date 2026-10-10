import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import appCss from "../styles.css?url";
import content from "@/content";
import type { Lang } from "@/site-content";
import { fetchLive, type LiveByLang } from "@/lib/live";
import { buildSiteData, type SiteData } from "@/lib/site-data";

const { brand, theme, seo, structuredData, cfAnalyticsToken } = content;
const defaultSeo = seo[brand.defaultLang];

// Design tokens on :root — the one place the brand look enters the CSS.
const THEME_STYLE = `:root{--bg:${theme.bg};--fg:${theme.fg};--surface:${theme.surface};--surface-2:${theme.surface2};--muted-fg:${theme.mutedFg};--border:${theme.border};--accent:${theme.accent};--accent-fg:${theme.accentFg};--accent-soft:${theme.accentSoft};--hero-bg:${theme.heroBg};--hero-fg:${theme.heroFg};--hero-muted:${theme.heroMuted};--font-display:${theme.fontDisplay};--font-body:${theme.fontBody};--radius:${theme.radius};}`;

// Live facts, fetched on the server at request time (cached at the edge).
const getLive = createServerFn({ method: "GET" }).handler(async (): Promise<LiveByLang> => {
  try {
    return await fetchLive(content);
  } catch {
    return {};
  }
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => ({ live: await getLive() }),
  staleTime: 5 * 60 * 1000,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: defaultSeo.title },
      { name: "description", content: defaultSeo.description },
      { name: "author", content: brand.name },
      { name: "theme-color", content: theme.bg },
      { property: "og:title", content: defaultSeo.title },
      { property: "og:description", content: defaultSeo.description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: brand.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: defaultSeo.title },
      { name: "twitter:description", content: defaultSeo.description },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: theme.googleFontsUrl },
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
    <html lang={brand.defaultLang}>
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: THEME_STYLE }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        {cfAnalyticsToken && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token":"${cfAnalyticsToken}"}`} />
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
  return <Outlet />;
}

/** The current language (persisted) and the resolved SiteData for the page. */
export function useSite(): { data: SiteData; setLang: (l: Lang) => void } {
  const { live } = Route.useLoaderData();
  const [lang, setLangState] = useState<Lang>(brand.defaultLang);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored && brand.langs.includes(stored)) setLangState(stored);
    } catch { /* storage unavailable */ }
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);
  return { data: buildSiteData(content, live, lang), setLang };
}

function NotFoundComponent() {
  const fr = brand.defaultLang === "fr";
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-fg">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-4 text-muted-fg">{fr ? "Cette page n'existe pas ou a été déplacée." : "This page does not exist or has moved."}</p>
        <Link to="/" className="mt-6 inline-flex rounded-[var(--radius)] bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg">{fr ? "Retour à l'accueil" : "Back home"}</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const fr = brand.defaultLang === "fr";
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-fg">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">{fr ? "Une erreur est survenue" : "Something went wrong"}</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={reset} className="rounded-[var(--radius)] bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg">{fr ? "Réessayer" : "Retry"}</button>
          <a href="/" className="rounded-[var(--radius)] border border-line px-5 py-2.5 text-sm font-semibold">{fr ? "Accueil" : "Home"}</a>
        </div>
      </div>
    </div>
  );
}
