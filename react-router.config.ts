import type { Config } from "@react-router/dev/config";

// Server rendering on Cloudflare Workers. Pre-rendering is not supported by
// @cloudflare/vite-plugin, so every route renders at the edge.
export default {
  ssr: true,
} satisfies Config;
