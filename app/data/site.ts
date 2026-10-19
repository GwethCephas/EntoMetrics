/**
 * Organisation-wide facts. Edit here; components read from this file.
 * Anything not yet confirmed by the client is marked as a placeholder.
 */
export const site = {
  name: "EntoMetrics Africa",
  tagline: "Insect welfare science and micro-climate telemetry",
  location: "Nairobi, Kenya",
  /** Proposed address from the brief. Ownership and delivery not yet confirmed. */
  email: "info@entometrics.org",
  emailVerified: false,
  linkedin: "https://www.linkedin.com/company/entometrics-africa/",
  /**
   * The brief's wording. If the organisation is not yet registered as a
   * non-profit, change to "independent research initiative" (brief §9).
   */
  legalDescriptor: "independent, non-profit research institution",
  legalStatus: {
    organisationType: "[PLACEHOLDER — CONFIRM WITH CLIENT: registered legal form]",
    registrationNumber: "[PLACEHOLDER — CONFIRM WITH CLIENT: registration number]",
  },
  registrationLine: "[PLACEHOLDER — CONFIRM WITH CLIENT: registered legal form and registration number]",
  copyright: "© 2026 EntoMetrics Africa. All rights reserved.",
} as const;

export const ILLUSTRATIVE_CAPTION = "Illustrative visualisation. Not field data.";
