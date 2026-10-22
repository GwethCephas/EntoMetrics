// Notify IndexNow search engines (Bing, Yandex, Seznam, Naver…) of the site's
// pages after a deploy. Google does not use IndexNow; use Search Console.
//
// Usage: npm run indexnow            (submits every URL in the live sitemap)
// The key file public/<KEY>.txt must already be live on the site.

import { readdirSync } from "node:fs";

const SITE = "https://entometrics.com";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file (public/<32 hex chars>.txt) not found");
const key = keyFile.replace(/\.txt$/, "");

const live = await fetch(`${SITE}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) {
  throw new Error(`Key file ${SITE}/${keyFile} is not live yet; deploy first.`);
}

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("No URLs found in the sitemap");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
// 200 = accepted, 202 = accepted (key validation pending).
console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URLs`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}
