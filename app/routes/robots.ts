import { cloudflareContext } from "~/lib/cloudflare";
import { normaliseSiteUrl } from "~/lib/meta";
import type { Route } from "./+types/robots";

export function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  const origin = normaliseSiteUrl(env.SITE_URL) ?? new URL(request.url).origin;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
