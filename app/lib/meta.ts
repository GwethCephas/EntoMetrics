import type { MetaDescriptor } from "react-router";
import { site } from "~/data/site";

interface PageMetaInput {
  /** Page title without the site suffix. Omit for the home page. */
  title?: string;
  description: string;
}

export function pageMeta({ title, description }: PageMetaInput): MetaDescriptor[] {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
}

/** Normalises SITE_URL (no trailing slash) or returns null when unset/invalid. */
export function normaliseSiteUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}
