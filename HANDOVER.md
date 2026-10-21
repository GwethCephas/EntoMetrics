# Handover notes

These items are missing, unconfirmed or depend on an interpretation. Each one appears on the site as a highlighted placeholder or is described here. They come from brief §9 plus decisions made during the build.

## Brief §9: items to confirm before launch

| # | Item | Current state on the site | Where to change |
| --- | --- | --- | --- |
| 1 | **Legal status**: registered legal form and registration number | Hero and About keep the brief's wording, "independent, non-profit research institution". The footer and the About "Legal status" block show `[PLACEHOLDER — CONFIRM WITH CLIENT …]`. If the organisation is not yet registered, change the wording to "independent research initiative". | `app/data/site.ts`, `app/data/home.ts` (`hero.subheadline`) |
| 2 | **Kenyan standard**: "Kenya's national code of practice for Black Soldier Fly farming" | Shown as in the brief, unnumbered (Programme A card and page). No standard number is named. Confirm with KEBS. | `app/data/programmes.ts` |
| 3 | **Heat-mortality mechanism wording** | Brief wording used on Programme A and the Telemetry page. Needs approval from the scientific advisor. | `app/data/programmes.ts`, `app/routes/telemetry.tsx` |
| 4 | **Domain and email** (`entometrics.org`, `info@entometrics.org`) | Email shown as "Proposed address; delivery not yet confirmed". It is left out of JSON-LD. Canonical URLs are off until `SITE_URL` is set. The form runs in demonstration mode and does not send. | `app/data/site.ts` (`emailVerified`), env vars (see README) |
| 5 | **Photos and bios** | Photos supplied and in use for all four team members. Bios use the brief's exact wording and still need each person's approval. | `app/data/team.ts`, `app/assets/team/` |
| 6 | **Personal LinkedIn links** for all four team members | Shown as `[LINKEDIN: to be supplied]`. The company page (`linkedin.com/company/entometrics-africa`) is linked in the footer, on Contact, and in JSON-LD `sameAs`. | `app/data/team.ts` (`linkedin`) |
| 7 | **Telemetry specifications** | Only the facts stated in the brief are filled in: substrate temperature, 2G SMS, offline-first. Every other row is `TBC`, including the alert threshold. | `app/data/telemetry.ts` |
| 8 | **Protocol publication** (OSF or Zenodo DOIs) | "No protocols have been published yet" on each programme page. | `protocolLinks` in `app/data/programmes.ts` |

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
- **Section headings not specified in the brief.** These are labels only and make no claims; adjust as you like: "About EntoMetrics Africa", "Research programmes", "Theory of Change", "Team", "Work with us", the Telemetry page headings, and the About page title.
- **Collaboration-type options in the contact form.** Research, hardware/telemetry, producer/pilot facility, standards, funding, other. Edit in `app/features/contact/schema.ts`.

## Draft pages (marked "Draft — to be reviewed.")

- **Privacy Policy.** Placeholders: data controller details, email provider, analytics provider, retention period, legal review of applicable data-protection obligations, and the approval date.
- **Data and Ethics Statement.** Placeholders: protocol registry and timing, data agreements with pilot facilities, and ethical review arrangements.

## Not done (by design)

- Nothing has been deployed. No domain has been bought and no email has been configured.
- Analytics are off until `VITE_PLAUSIBLE_DOMAIN` is set. The site sets no cookies, so there is no cookie notice.
