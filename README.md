# EntoMetrics Africa website

Website for EntoMetrics Africa: Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols.

Built from the *EntoMetrics Africa Website Brief (v1.0, October 2026)* and the supplied logo PDF. Outstanding client items are tracked in [HANDOVER.md](HANDOVER.md).

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19, React Router 8 (framework mode, server rendering), TypeScript |
| Build | Vite 8 with `@cloudflare/vite-plugin` (dev and preview run in the real Workers runtime, `workerd`) |
| Styling | Tailwind CSS 4, design tokens in [app/styles/app.css](app/styles/app.css) |
| Animation | Motion for React: `useAnimate` from `motion/react-mini` (Web Animations API) plus `useInView` |
| Icons | lucide-react (plus an inline LinkedIn glyph; lucide v1 no longer ships brand icons) |
| Forms | React Hook Form and Zod 4 (one schema shared by browser and server) |
| Tests | Vitest and Testing Library (unit), Playwright and axe-core (end-to-end, accessibility) |
| Quality | ESLint 10 (flat config, typescript-eslint, react-hooks), `tsc` |
| Hosting | Cloudflare Workers (static assets and server rendering) |

**Version notes**

- **TypeScript 6.0, not 7.** `typescript-eslint` supports TypeScript below 6.1 only.
- **No `@hookform/resolvers`.** Its optional peer dependencies conflict with React Router's dependencies. A 20-line resolver lives in [app/features/contact/zodResolver.ts](app/features/contact/zodResolver.ts).
- **No `eslint-plugin-jsx-a11y`.** It does not support ESLint 10. Accessibility is instead checked against the rendered pages with axe-core in the Playwright suite.
- **`motion/react-mini`, not the full `motion` component API.** The full API (`domAnimation`) is about 28 KB gzipped on its own, which would break the brief's 30 KB animation budget. The APIs used here measure about 4 KB gzipped.
- **No prerendering.** The Cloudflare Vite plugin does not support React Router prerendering, so every page is server-rendered at the edge. Titles, meta tags and direct links to any route all work.

## Running locally (Windows)

Requirements: Node.js 22.22 or newer, and npm. No Cloudflare account, domain or email service is needed.

```powershell
npm install
npm run dev
```

Open **http://localhost:5173**. If that port is busy, Vite picks the next free one and prints it.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload (Workers runtime, port 5173) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates React Router route types, then runs `tsc` |
| `npm run test` | Unit and component tests (Vitest) |
| `npm run build` | Production build into `build/` |
| `npm run preview` | Builds, then serves the production build at http://localhost:4173 |
| `npm run test:e2e` | Playwright end-to-end, accessibility and responsive tests (builds and serves the site itself) |
| `npm run check` | lint, typecheck, test and build in sequence |

Before running the end-to-end tests for the first time, install the test browser:

```powershell
npx playwright install chromium
```

### Install scripts (npm 11)

npm 11 blocks dependency install scripts unless they are approved. The approvals for `workerd` and `esbuild` are recorded under `allowScripts` in `package.json`. If a later `npm install` warns about a new `workerd` version, run `npm approve-scripts workerd esbuild`.

## Project structure

```
app/
  root.tsx                 HTML document, fonts, canonical/OG tags, JSON-LD, analytics hook
  routes.ts                Route table
  layouts/site.tsx         Header, footer, skip link, 404 and error boundary
  routes/                  One module per page, plus sitemap.xml and robots.txt
  components/              Header, Footer, Logo, buttons, badges, timeline, Reveal, RichText
  features/story/          Animated About story (home page, brief §4.3)
  features/research/       Programme cards, Theory of Change
  features/about/          Mission and vision, pillars, team
  features/contact/        Form, Zod schema, server-side submission handler
  data/                    All editable content (see below)
  lib/                     Cloudflare context, meta helpers, reduced-motion hook
  assets/                  Logo SVGs extracted from the PDF, optimised team photos
  styles/app.css           Tailwind setup and design tokens
workers/app.ts             Cloudflare Worker entry (security headers, env → app context)
public/                    favicon.svg, og-image.png
scripts/                   Reproducible asset scripts (logo extraction, photos, OG image)
docs/source/               Original supplied logo PDF and photos
tests/unit, tests/e2e      Vitest and Playwright suites
```

React Router framework mode uses `app/` rather than `src/` as its source directory.

## Editing content

All copy lives in typed files under [app/data/](app/data/). Components read from these files, so content changes don't touch component code.

| To change… | Edit |
| --- | --- |
| A programme status or timeline stage | [app/data/programmes.ts](app/data/programmes.ts): `status` and `stage` |
| A published protocol link | `protocolLinks` on the programme in `programmes.ts` |
| Team bios, photos, LinkedIn URLs | [app/data/team.ts](app/data/team.ts). Put photos in `app/assets/team/` |
| Telemetry specification values | [app/data/telemetry.ts](app/data/telemetry.ts) |
| Email, legal status, registration line | [app/data/site.ts](app/data/site.ts) |
| Home page copy (short previews) | [app/data/home.ts](app/data/home.ts), [app/data/story.ts](app/data/story.ts), `teaser` in [app/data/programmes.ts](app/data/programmes.ts) |
| Institutional positioning (About H1 and lead) | [app/data/about.ts](app/data/about.ts) |

**Content rules (brief §8)**

- Only use the statuses `PILOT IN PREPARATION`, `IN DEVELOPMENT` or `METHODOLOGY IN DEVELOPMENT` until the client confirms a change. A unit test fails on `ACTIVE`, `LIVE` or `COMPLETED`.
- Text in square brackets such as `[PLACEHOLDER — CONFIRM WITH CLIENT: …]` is highlighted on the page automatically. Replace it with confirmed content.
- After content changes, run `npm run check`.

### Regenerating assets

```powershell
python -I scripts/extract-logo.py docs/source/entometrics-africa-logo-wordmark.pdf   # needs PyMuPDF
python -I scripts/process-photos.py                                                 # needs Pillow
python -I scripts/make-og-image.py                                                  # needs PyMuPDF + Pillow
```

## Environment variables

Nothing is required for local development. Never commit real values.

| Name | Where | Secret | Purpose |
| --- | --- | --- | --- |
| `SITE_URL` | `wrangler.jsonc` `vars` (production), `.dev.vars` (local) | no | Public origin, e.g. `https://entometrics.com`. Enables canonical URLs, absolute OG image and JSON-LD `url`. |
| `VITE_FORMSPREE_FORM_ID` | `.env` (local) / build variable (Workers Builds) | no (public) | Formspree form ID for the contact form. Empty = demonstration mode, nothing is sent. |
| `VITE_PLAUSIBLE_DOMAIN` | `.env` / build environment | no (public) | Enables Plausible analytics (optional, cookie-free) |

Templates: [.dev.vars.example](.dev.vars.example) (server) and [.env.example](.env.example) (build time). `VITE_*` values are compiled into the browser bundle, so they must never hold secrets. A Formspree form ID is public by design (it appears in any HTML form that posts to Formspree).

- **Set `SITE_URL` in `wrangler.jsonc`, not the dashboard.** Every `wrangler deploy` (including Workers Builds) replaces dashboard-set variables with the values in `wrangler.jsonc`, so a value set only in the dashboard is lost on the next deploy.
- **`VITE_*` variables are read at build time.** Restart `npm run dev` after editing `.env`. In production, set them as build variables in Workers Builds.

## Contact form (Formspree)

Messages are delivered by [Formspree](https://formspree.io). The recipient address is set in the Formspree dashboard, not in this code. Enquiries are to go to **cfreeka18@gmail.com**.

**How it works**
- React Hook Form validates the fields in the browser with the shared Zod schema ([app/features/contact/schema.ts](app/features/contact/schema.ts)) and shows errors inline.
- [app/features/contact/formspree.ts](app/features/contact/formspree.ts) posts the validated message as JSON to `https://formspree.io/f/<form ID>`, with `_replyto` (so replies go to the sender) and a `_subject`.
- Formspree validates again on its side and filters spam. Its field errors are mapped back onto the form fields.
- A hidden honeypot field silently rejects simple bots before anything is sent.
- "Message sent" appears only after Formspree accepts the submission. Network or Formspree errors show "Not delivered" and keep the user's text.
- **Without `VITE_FORMSPREE_FORM_ID`, nothing is sent.** The page shows "Demonstration mode", and a valid submission returns *"Validated, not sent"*.

**One-time setup**
1. Sign up or log in at [formspree.io](https://formspree.io) with **cfreeka18@gmail.com**, and verify that address when Formspree emails you. Alternatively, use another account and add cfreeka18@gmail.com as a verified linked email.
2. Create a new form (for example "EntoMetrics Africa website"). Set its target email to cfreeka18@gmail.com.
3. Copy the form ID: the last part of the endpoint `https://formspree.io/f/<form ID>`.
4. In the form's settings, **turn reCAPTCHA off.** This site submits with JavaScript, and Formspree's reCAPTCHA only works with plain HTML posts or a custom reCAPTCHA key. Spam protection comes from the honeypot plus Formspree's built-in spam filtering.
5. Locally, create `.env` in the project root with `VITE_FORMSPREE_FORM_ID=<form ID>`, then restart `npm run dev`. In production, add the same variable as a build variable in Workers Builds.
6. Send a test enquiry from http://localhost:5173/contact. Formspree may ask you to confirm the first submission by email; after that, messages arrive in the inbox.

Automated tests never send real enquiries: the Playwright build forces `VITE_FORMSPREE_FORM_ID` to empty, and unit tests mock the network.

## Deploying to Cloudflare (later)

Nothing has been deployed yet. When you're ready:

1. **Create the Git repository.** Push this project to GitHub (or GitLab).
2. **Connect it to Cloudflare.**
   - In the Cloudflare dashboard, go to Workers & Pages → Create → Import a repository, and pick the repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
   - The build writes `build/server/wrangler.json`, which `wrangler deploy` picks up automatically. It includes the static assets directory.
   - Alternatively, deploy from your machine with `npx wrangler login`, then `npm run deploy`.
3. **Preview deployments.** Workers Builds creates a preview URL for each non-production branch or pull request. From the command line, `npm run deploy:preview` uploads a version without promoting it.
4. **Configure variables.** Set `SITE_URL` in `wrangler.jsonc` `vars` and commit it. Don't set it in the dashboard, because the next deploy would overwrite it. Set `VITE_FORMSPREE_FORM_ID` (and optionally `VITE_PLAUSIBLE_DOMAIN`) as **build variables** in Workers Builds, because they are compiled in at build time. No secrets are needed.
5. **Connect the custom domain.** Once the domain is registered and on Cloudflare DNS: Worker → Settings → Domains & Routes → Add custom domain (e.g. `entometrics.com` and `www.entometrics.com`). Then set `SITE_URL` to match.
6. **Set up email.**
   - Contact-form delivery is handled by Formspree (see "Contact form" above). After a custom domain is connected, add it to the form's allowed domains in Formspree if you restrict submissions by domain.
   - Separately, confirm that `info@entometrics.com` (the address shown on the site) receives mail, for example via Cloudflare Email Routing or a mailbox provider.
7. **Spam limits.** Formspree applies its own spam filtering and plan limits. Check the form's submission quota for your Formspree plan.
8. **Run production smoke tests.**
   - Every page loads, including direct loads of `/research/substrate-telemetry`.
   - `/does-not-exist` returns 404.
   - `/sitemap.xml` and `/robots.txt` show the real domain.
   - Page source contains the canonical tag.
   - Send a real test enquiry and confirm it arrives at cfreeka18@gmail.com.
   - Run Lighthouse on the live URL.
   - Check the JSON-LD with Google's Rich Results Test.

## Launch checklist

- [ ] **Domain:** `entometrics.com` registered, connected, `SITE_URL` set.
- [ ] **Email:** Formspree form created for cfreeka18@gmail.com, reCAPTCHA off, `VITE_FORMSPREE_FORM_ID` set as a build variable, real test enquiry received. `info@entometrics.com` working and `site.emailVerified` set to `true` in `app/data/site.ts`.
- [ ] **Legal:** registered legal form and number confirmed and added to `site.ts`. If not yet registered, change "non-profit research institution" to "independent research initiative" (`positioning.statement` in `app/data/about.ts`). Privacy Policy and Data and Ethics Statement reviewed and the "Draft" notices removed.
- [ ] **Science:** programme statuses and timeline stages confirmed; the Kenyan code-of-practice wording confirmed with KEBS; heat-mortality mechanism wording approved by the scientific advisor; threshold values remain provisional.
- [ ] **Content:** all `[PLACEHOLDER …]`, `[PHOTO …]` and `[LINKEDIN …]` markers resolved (see HANDOVER.md).
- [ ] **Forms:** production submission tested end to end through Formspree.
- [ ] **Quality:** `npm run check` and `npm run test:e2e` pass; Lighthouse run on the live site.
