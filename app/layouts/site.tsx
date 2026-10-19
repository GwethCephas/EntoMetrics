import type { ReactNode } from "react";
import { isRouteErrorResponse, Link, Outlet } from "react-router";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { ButtonLink } from "~/components/ui";
import type { Route } from "./+types/site";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-[var(--radius-card)] bg-forest px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function SiteLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (!notFound && import.meta.env.DEV) console.error(error);

  return (
    <Shell>
      <div className="container-research py-20 md:py-28">
        <p className="label">{notFound ? "Error 404" : "Error"}</p>
        <h1 className="mt-3 max-w-3xl">{notFound ? "Page not found" : "Something went wrong"}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-70">
          {notFound
            ? "The page you requested does not exist or has moved."
            : "The page could not be displayed. Please try again later."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/">Go to the home page</ButtonLink>
          <ButtonLink to="/research" variant="secondary">
            Research Hub
          </ButtonLink>
        </div>
        <p className="mt-10 text-[0.9375rem] text-ink-70">
          Looking for something specific? <Link className="text-link" to="/contact">Contact us</Link>.
        </p>
      </div>
    </Shell>
  );
}
