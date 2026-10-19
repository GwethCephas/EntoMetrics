import { cloudflareContext } from "~/lib/cloudflare";
import { normaliseSiteUrl } from "~/lib/meta";
import { publicPaths } from "~/lib/routes";
import type { Route } from "./+types/sitemap";

export function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  // Falls back to the request origin until SITE_URL (the confirmed domain) is set.
  const origin = normaliseSiteUrl(env.SITE_URL) ?? new URL(request.url).origin;
  const urls = publicPaths()
    .map((path) => `  <url><loc>${origin}${path}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
