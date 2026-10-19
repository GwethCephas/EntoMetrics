import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflareContext, type ServerEnv } from "../app/lib/cloudflare";

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

export default {
  async fetch(request: Request, env: ServerEnv, ctx: WorkerExecutionContext) {
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, waitUntil: (p) => ctx.waitUntil(p) });
    const response = await requestHandler(request, context);
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(securityHeaders)) {
      if (!headers.has(key)) headers.set(key, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
