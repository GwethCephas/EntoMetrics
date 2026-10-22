import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { site } from "./data/site";
import { cloudflareContext } from "./lib/cloudflare";
import { normaliseSiteUrl } from "./lib/meta";
import stylesheet from "./styles/app.css?url";

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: interLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  return { siteUrl: normaliseSiteUrl(env.SITE_URL) };
}

/**
 * Structured data for search engines: the organisation (knowledge panel,
 * logo, social profiles) and the website (site name shown in results).
 */
function structuredData(siteUrl: string | null) {
  const organisation: Record<string, unknown> = {
    "@type": "ResearchOrganization",
    name: site.name,
    alternateName: "EntoMetrics",
    description:
      "Independent research organisation in Nairobi, Kenya, working on Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols.",
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
    sameAs: [site.linkedin, site.instagram],
  };
  if (site.emailVerified) organisation.email = site.email;
  const graph: Record<string, unknown>[] = [organisation];
  // URLs are only published once the domain is configured (SITE_URL).
  if (siteUrl) {
    organisation["@id"] = `${siteUrl}/#organization`;
    organisation.url = siteUrl;
    organisation.logo = `${siteUrl}/logo.png`;
    graph.push({
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: site.name,
      alternateName: "EntoMetrics",
      inLanguage: "en-GB",
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const { pathname } = useLocation();
  const siteUrl = data?.siteUrl ?? null;
  const canonical = siteUrl ? `${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}` : null;

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#15512D" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Meta />
        {canonical ? (
          <>
            <link rel="canonical" href={canonical} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={`${siteUrl}/og-image.png`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="EntoMetrics Africa logo" />
            <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
          </>
        ) : null}
        <Links />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(siteUrl) }} />
        {PLAUSIBLE_DOMAIN ? (
          <script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/** Last-resort boundary; most errors are handled inside the site layout. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <main className="container-research py-24">
      <p className="label">Error {status}</p>
      <h1 className="mt-3">Something went wrong</h1>
      <p className="mt-4 text-ink-70">
        The page could not be displayed. <a className="text-link" href="/">Return to the home page</a>.
      </p>
    </main>
  );
}
