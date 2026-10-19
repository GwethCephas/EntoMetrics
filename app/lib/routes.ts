import { programmes } from "~/data/programmes";

/** Public, indexable paths (used by sitemap.xml). */
export function publicPaths(): string[] {
  return [
    "/",
    "/about",
    "/research",
    ...programmes.map((p) => `/research/${p.slug}`),
    "/telemetry",
    "/contact",
    "/privacy",
    "/data-ethics",
  ];
}
