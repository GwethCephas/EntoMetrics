/**
 * Organisation-wide facts. Edit here; components read from this file.
 * Anything not yet confirmed by the client is marked as a placeholder.
 */
export const site = {
  name: "EntoMetrics Africa",
  tagline: "Insect welfare science and micro-climate telemetry",
  location: "Nairobi, Kenya",
  /** Proposed address from the brief. Ownership and delivery not yet confirmed. */
  email: "info@entometrics.com",
  emailVerified: false,
  linkedin: "https://www.linkedin.com/company/entometrics-africa/",
  instagram: "https://www.instagram.com/entometrics_africa/",
  legalStatus: {
    organisationType: "[PLACEHOLDER — CONFIRM WITH CLIENT: registered legal form]",
    registrationNumber: "[PLACEHOLDER — CONFIRM WITH CLIENT: registration number]",
  },
  registrationLine: "[PLACEHOLDER — CONFIRM WITH CLIENT: registered legal form and registration number]",
  copyright: "© 2026 EntoMetrics Africa. All rights reserved.",
} as const;

export const ILLUSTRATIVE_CAPTION = "Illustrative visualisation. Not field data.";
