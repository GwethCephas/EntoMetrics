# Developer notes

How to run, edit, test and deploy the EntoMetrics Africa website. Outstanding client items are tracked in [HANDOVER.md](../HANDOVER.md).

## Run locally

Requires Node.js 22.22 or newer and npm.

```powershell
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload (Cloudflare Workers runtime) |
| `npm run check` | Lint, typecheck, unit tests and production build, in that order |
| `npm run test:e2e` | Playwright end-to-end, accessibility and responsive tests. Run `npx playwright install chromium` once first. |
| `npm run preview` | Build, then serve the production build at http://localhost:4173 |
| `npm run deploy` | Build and deploy to Cloudflare from this machine (after `npx wrangler login`) |

npm 11 blocks dependency install scripts unless approved; approvals live under `allowScripts` in `package.json`. If `npm install` warns about a new `workerd` version, run `npm approve-scripts workerd esbuild`.

## Project layout

```
app/
  root.tsx             HTML document, fonts, canonical/OG tags, JSON-LD
  routes.ts            Route table; one module per page in routes/
  layouts/site.tsx     Header, footer, skip link, 404 and error boundary
  components/          Shared UI (header, footer, buttons, badges, timeline…)
  features/            Story animation, research, about, contact form
  data/                All editable content
  styles/app.css       Tailwind setup and design tokens
workers/app.ts         Cloudflare Worker entry (www redirect, security headers)
scripts/               Asset scripts (logo extraction, photos, OG image)
docs/source/           Original logo PDF and photos
tests/                 Vitest (unit) and Playwright (e2e) suites
```

## Editing content

All copy lives in typed files under [app/data/](../app/data/). Change text there, not in components.

| To change… | Edit |
| --- | --- |
| Programme status or timeline stage | `app/data/programmes.ts` (`status`, `stage`) |
| Published protocol links | `protocolLinks` in `app/data/programmes.ts` |
| Team bios, photos, LinkedIn URLs | `app/data/team.ts`, photos in `app/assets/team/` |
| Telemetry specifications | `app/data/telemetry.ts` |
| Email, social links, legal status | `app/data/site.ts` |
| Home page previews | `app/data/home.ts`, `app/data/story.ts`, `teaser` in `programmes.ts` |
| About page positioning | `app/data/about.ts` |

Content rules from the brief:
- Only use the statuses `PILOT IN PREPARATION`, `IN DEVELOPMENT` or `METHODOLOGY IN DEVELOPMENT` until confirmed otherwise. A unit test enforces this.
- Text in square brackets, such as `[PLACEHOLDER — CONFIRM WITH CLIENT: …]`, is highlighted on the page until replaced.
- Run `npm run check` after content changes.

Regenerate assets (Python with PyMuPDF and Pillow):

```powershell
python -I scripts/extract-logo.py docs/source/entometrics-africa-logo-wordmark.pdf
python -I scripts/process-photos.py
python -I scripts/make-og-image.py
```

## Configuration

[wrangler.jsonc](../wrangler.jsonc) `vars` is the single source of configuration. Nothing in it is secret.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin (`https://entometrics.com`). Used for canonical URLs, the sitemap and structured data. |
| `VITE_FORMSPREE_FORM_ID` | Formspree form ID for the contact form. `vite.config.ts` reads it at build time, so no separate build variable is needed. |

- **Change values in `wrangler.jsonc`, not the Cloudflare dashboard.** Every deploy replaces dashboard variables with this file. If the dashboard shows "Update your Wrangler configuration…", copy the change here.
- **To build without the form ID**, set `VITE_FORMSPREE_FORM_ID=` (empty) in the environment. The form then runs in demonstration mode and sends nothing. The Playwright tests do this, so they never send real enquiries.

## Contact form

React Hook Form validates in the browser with the shared Zod schema (`app/features/contact/schema.ts`). `app/features/contact/formspree.ts` then posts the message to `https://formspree.io/f/<form ID>`. Formspree validates again, filters spam and emails the message to the inbox set on the form in the Formspree dashboard.

- "Message sent" appears only after Formspree accepts the submission.
- A hidden honeypot field rejects simple bots.
- reCAPTCHA must stay **off** in the Formspree form settings, because the site submits with JavaScript.

## Deployment

The site runs on Cloudflare Workers as `entometrics-africa`, on `entometrics.com`; `www.entometrics.com` redirects to it.

- **Automatic:** the GitHub repo is connected to Cloudflare Workers Builds. Every push to `main` builds (`npm run build`) and deploys (`npx wrangler deploy`). Pushes to other branches get a preview URL.
- **Manual:** run `npm run deploy` from this folder. Push the same commit to GitHub too, or the next automatic build will replace it.
- A failed build leaves the previous version live. Workers Builds doesn't run the tests, so run `npm run check` before pushing.
