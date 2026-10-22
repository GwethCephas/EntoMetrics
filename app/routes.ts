import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("layouts/site.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("team", "routes/team.tsx"),
    route("research", "routes/research.tsx"),
    route("research/:slug", "routes/programme.tsx"),
    route("telemetry", "routes/telemetry.tsx"),
    route("contact", "routes/contact.tsx"),
    route("privacy", "routes/privacy.tsx"),
    route("data-ethics", "routes/data-ethics.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
] satisfies RouteConfig;
