/**
 * Where a request should be permanently redirected so every page has exactly
 * one public URL, or null if it is already canonical. Rules apply only to the
 * production host (from SITE_URL) and its www alias, never to localhost.
 *
 * - http → https
 * - www.entometrics.com → entometrics.com
 * - /about/ → /about (trailing slash removed, except the home page)
 */
export function canonicalRedirect(requestUrl: string, siteUrl: string | null | undefined): string | null {
  if (!siteUrl) return null;
  let site: URL;
  try {
    site = new URL(siteUrl);
  } catch {
    return null;
  }
  const url = new URL(requestUrl);
  const host = site.hostname;
  if (url.hostname !== host && url.hostname !== `www.${host}`) return null;

  const target = new URL(url.toString());
  target.protocol = site.protocol;
  target.hostname = host;
  target.port = site.port;
  if (target.pathname.length > 1 && target.pathname.endsWith("/")) {
    target.pathname = target.pathname.replace(/\/+$/, "") || "/";
  }
  return target.toString() === url.toString() ? null : target.toString();
}
