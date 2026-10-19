import { data } from "react-router";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/not-found";

// Unmatched URLs throw a 404 so the response status is correct; the site
// layout's ErrorBoundary renders the page.
export function loader() {
  throw data(null, { status: 404 });
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Page not found", description: "The requested page could not be found." });

export default function NotFound() {
  return null;
}
