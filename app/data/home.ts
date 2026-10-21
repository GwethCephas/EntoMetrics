/**
 * Home page copy. The home page is an overview: each section is a short
 * preview that links to the page holding the full, brief-exact content
 * (see HANDOVER.md, "Home page deviates from brief §4/§10 by agreement").
 */

export const hero = {
  eyebrow: "Independent research · Nairobi, Kenya",
  headline: "Advancing insect welfare through science and sensing.",
  supporting:
    "EntoMetrics Africa investigates Black Soldier Fly welfare and develops evidence-led approaches to humane rearing in the Global South.",
  primaryCta: { label: "Explore our research", to: "/research" },
  secondaryCta: { label: "Our approach", to: "/#about" },
};

/** Static status panel (brief §4.1), exact wording. */
export const statusPanel = {
  heading: "PROGRAMME STATUS",
  lines: [
    { label: "Telemetry pilot", value: "in preparation", indicator: true },
    { label: "Welfare assays", value: "methodology in development", indicator: false },
  ],
};

export const statusStrip = ["Nairobi, Kenya", "Independent research", "Open protocols: forthcoming"];

/** Full statements (brief §4.4). Shown in full on About; previewed on Home. */
export const mission = {
  heading: "Our Mission",
  text: "To reduce systemic welfare risks in insect bioconversion systems by equipping the Global South’s alternative protein sector with empirical biological insights, localised hardware telemetry and scientifically validated production frameworks.",
  /** Verbatim opening clause used on the home page. */
  preview: "To reduce systemic welfare risks in insect bioconversion systems…",
};

export const vision = {
  heading: "Our Vision",
  text: "A global agricultural paradigm where invertebrate welfare is fundamentally integrated into industrial production, establishing resource-efficient protein systems that respect the physiological boundaries of the billions of organisms within them.",
  preview: "A global agricultural paradigm where invertebrate welfare is fundamentally integrated into industrial production…",
};

export const homeLinks = {
  missionVision: { label: "Read our mission and vision", to: "/about" },
  research: { label: "All research programmes", to: "/research" },
  theoryOfChange: { label: "See the full theory of change", to: "/research#theory-of-change" },
  team: { label: "Meet the team", to: "/about#team" },
  telemetry: { label: "How the telemetry is designed to work", to: "/telemetry" },
};

export const collaboration = {
  text: "EntoMetrics Africa is an independent research organisation. We welcome collaboration with entomologists, invertebrate welfare scientists, hardware engineers and agricultural research groups.",
  cta: "Inquire About Collaborations",
};

export const protocolsNote =
  "Protocols and statistical analysis plans will be published before data collection begins.";
