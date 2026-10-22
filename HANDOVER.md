# Handover notes

These items are missing, unconfirmed or depend on an interpretation. Each one appears on the site as a highlighted placeholder or is described here. They come from brief §9 plus decisions made during the build.

## Brief §9: items to confirm before launch

| # | Item | Current state on the site | Where to change |
| --- | --- | --- | --- |
| 1 | **Legal status**: registered legal form and registration number | The About page keeps the brief's wording, "independent, non-profit research institution". The footer and the About "Legal status" block show `[PLACEHOLDER — CONFIRM WITH CLIENT …]`. If the organisation is not yet registered, change the wording to "independent research initiative". | `app/data/site.ts`, `app/data/about.ts` (`positioning.statement`) |
| 2 | **Kenyan standard**: "Kenya's national code of practice for Black Soldier Fly farming" | Shown as in the brief, unnumbered (Programme A card and page). No standard number is named. Confirm with KEBS. | `app/data/programmes.ts` |
| 3 | **Heat-mortality mechanism wording** | Brief wording used on Programme A and the Telemetry page. Needs approval from the scientific advisor. | `app/data/programmes.ts`, `app/routes/telemetry.tsx` |
| 4 | **Domain and email** (`entometrics.com`, `info@entometrics.com`) | Done: the site is live on entometrics.com (www redirects to it). The email is marked confirmed and listed in JSON-LD. **Make sure info@entometrics.com actually receives mail** (e.g. Cloudflare Email Routing). Contact-form enquiries go through Formspree to cfreeka18@gmail.com. | `app/data/site.ts`, `wrangler.jsonc` |
| 5 | **Photos and bios** | Photos supplied and in use for all four team members. Bios use the brief's exact wording and still need each person's approval. | `app/data/team.ts`, `app/assets/team/` |
| 6 | **Personal LinkedIn links** for all four team members | Shown as `[LINKEDIN: to be supplied]`. The company page (`linkedin.com/company/entometrics-africa`) is linked in the footer, on Contact, and in JSON-LD `sameAs`. | `app/data/team.ts` (`linkedin`) |
| 7 | **Telemetry specifications** | Only the facts stated in the brief are filled in: substrate temperature, 2G SMS, offline-first. Every other row is `TBC`, including the alert threshold. | `app/data/telemetry.ts` |
| 8 | **Protocol publication** (OSF or Zenodo DOIs) | "No protocols have been published yet" on each programme page. | `protocolLinks` in `app/data/programmes.ts` |

## Home page deviates from brief §4/§10 by agreement

The brief's acceptance checklist asks for the home page sections "in the order of Section 4 with the exact copy". As agreed during the UI refinement (October 2026), the home page is now a concise overview. The section order is unchanged, but each section is a short preview that links to the page holding the brief's exact copy.

| Home section | Home page now shows | Brief's exact copy now lives on |
| --- | --- | --- |
| Hero | New copy: "Advancing insect welfare through science and sensing." with a shorter supporting sentence. The status panel is unchanged. | About page H1 and lead (`app/data/about.ts`) |
| About story | Unchanged copy; redesigned figures | Home (still) |
| Mission and vision | The verbatim opening clause of each, with a link | About page (full statements) |
| Research grid | Title, status and a one-sentence teaser per programme | Research Hub (full card text); programme pages |
| Theory of Change | The five stage titles, with a link | Research Hub (full text, assumptions, failure criteria) |
| Team | Photos, names and roles, with a link | About page (bios, governance line) |
| Collaboration | Unchanged | — |

**Needs client approval:** the new hero copy (`app/data/home.ts`), and the three programme teasers (`teaser` in `app/data/programmes.ts`). Both are condensed from the brief and add no new claims.

## Interpretations to confirm

- **Timeline stage for Programmes B and C.**
  - The brief's statuses ("In development", "Methodology in development") don't map directly onto the four-stage timeline (Planned / In preparation / In progress / Published).
  - B and C are set to **Planned**. Programme A is **In preparation**, from "Pilot in preparation".
- **Programme page sections (Question / Method / Planned outputs).**
  - Built only from the brief's card text and the Theory of Change lines.
  - Programme C's question ("Which harvest method ends responsiveness fastest?") is taken from the Theory of Change outcome.
  - Formal research questions, plus Programme B's method and outputs, are placeholders.
- **Header logo: horizontal lockup.**
  - Only a stacked logo was supplied. The header and footer use a **derived horizontal lockup**: the original mark and wordmark vectors side by side, with the wordmark scaled up as a unit so it is legible at 48px.
  - Shapes and colours are unchanged. **Deviation from the agreed plan:** the plan approved before the build said the mark and wordmark would keep their relative scale. At that scale the wordmark is only about 6px tall in a 48px header, so the wordmark was scaled up (about 2.2×) during the build. The client has not seen this lockup; it needs **client and brand approval**.
  - A designer-produced horizontal lockup can replace `app/assets/logo/logo-horizontal.svg`.
- **Favicon.** The capsule and hexagons cropped from the mark (`public/favicon.svg`), with no redrawing. Needs approval, or supply an icon-only file.
- **Reversed (white) logo.** Not supplied. The footer stays light rather than using a recoloured logo.
- **Logo colours versus the brief's tokens.**
  - The logo PDF uses #14532D (green) and #C88A1E (gold). The brief's tokens are #15512D and #BD8D38.
  - The logo keeps its own colours and the UI uses the brief's tokens. Confirm the master values.
- **Section headings not specified in the brief.** These are labels only and make no claims; adjust as you like: "Why this work matters" (home About story), "Research programmes", "Theory of Change", "Team", "Work with us", the figure labels in the story ("Fig. 1 · Rearing capacity (abstract)", "Fig. 2 · Substrate temperature against a provisional threshold"), and the Telemetry page headings.
- **Animated story layout.** Brief §4.3 stacks the story below 768px, with each beat about one viewport tall. The story now stacks below 1024px, because at tablet widths the trace's SVG labels became illegible beside the text column. Each beat is about 65% of the viewport tall on desktop, to avoid large empty gaps.
- **Hero eyebrow repeats the status strip.** The new hero eyebrow ("Independent research · Nairobi, Kenya") repeats two of the three items in the brief's status strip directly below it. Both are kept: the strip is required by the brief, and the eyebrow was requested copy. Remove one if the repetition is unwanted (`hero.eyebrow` in `app/data/home.ts`).
- **Collaboration-type options in the contact form.** Research, hardware/telemetry, producer/pilot facility, standards, funding, other. Edit in `app/features/contact/schema.ts`.

## Draft pages (marked "Draft — to be reviewed.")

- **Privacy Policy.** Placeholders: data controller details, Formspree data-processing terms, analytics provider, retention period, legal review of applicable data-protection obligations, and the approval date.
- **Data and Ethics Statement.** Placeholders: protocol registry and timing, data agreements with pilot facilities, and ethical review arrangements.

## Not done (by design)

- Nothing has been deployed. No domain has been bought and no email has been configured.
- Analytics are off until `VITE_PLAUSIBLE_DOMAIN` is set. The site sets no cookies, so there is no cookie notice.
