import { readFileSync } from "node:fs";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

/** Reads a `vars` entry from wrangler.jsonc (full-line `//` comments only). */
function wranglerVar(name: string): string | undefined {
  const source = readFileSync(new URL("./wrangler.jsonc", import.meta.url), "utf8");
  const config = JSON.parse(source.replace(/^\s*\/\/.*$/gm, "")) as { vars?: Record<string, string> };
  return config.vars?.[name];
}

export default defineConfig(({ mode }) => {
  // The Formspree ID is compiled into the client. wrangler.jsonc is the single
  // source; an explicit environment value (even empty, as the e2e tests set)
  // takes precedence so builds can opt out of sending real mail.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const formspreeFormId =
    "VITE_FORMSPREE_FORM_ID" in env ? env.VITE_FORMSPREE_FORM_ID : (wranglerVar("VITE_FORMSPREE_FORM_ID") ?? "");

  return {
    server: { port: 5173, strictPort: false },
    preview: { port: 4173 },
    resolve: { tsconfigPaths: true },
    define: {
      "import.meta.env.VITE_FORMSPREE_FORM_ID": JSON.stringify(formspreeFormId),
      // Sitemap <lastmod>: the day this build was made.
      "import.meta.env.VITE_BUILD_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), tailwindcss(), reactRouter()],
  };
});
