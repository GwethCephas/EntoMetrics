import { createContext } from "react-router";

/**
 * Server-side configuration. Set locally in `.dev.vars`, in production with
 * `wrangler secret put` (secrets) or `vars` in wrangler.jsonc (non-secrets).
 * Every value is optional: the site must run with none of them.
 */
export interface ServerEnv {
  SITE_URL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export interface CloudflareContext {
  env: ServerEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}

export const cloudflareContext = createContext<CloudflareContext>({ env: {} });
