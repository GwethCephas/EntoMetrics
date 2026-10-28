/**
 * Research programmes. To update a status, change `status` and `stage` here.
 * Only use statuses the client has confirmed (brief §8). To link a published
 * protocol, add it to `protocolLinks` once it has a public registry DOI.
 */

export const PROGRAMME_STATUSES = [
  "PILOT IN PREPARATION",
  "IN DEVELOPMENT",
  "METHODOLOGY IN DEVELOPMENT",
] as const;
export type ProgrammeStatus = (typeof PROGRAMME_STATUSES)[number];

export const TIMELINE_STAGES = [
  { id: "planned", label: "Planned" },
  { id: "in-preparation", label: "In preparation" },
  { id: "in-progress", label: "In progress" },
  { id: "published", label: "Published" },
] as const;
export type TimelineStage = (typeof TIMELINE_STAGES)[number]["id"];

export interface ProtocolLink {
  label: string;
  url: string;
}

export interface Programme {
  slug: string;
  code: "A" | "B" | "C";
  title: string;
  status: ProgrammeStatus;
  /** Gold is reserved for the first card (brief §4.5). */
  badgeTone: "gold" | "grey";
  stage: TimelineStage;
  /** Card text, verbatim from the brief. */
  summary: string;
  /** One-sentence home page preview, condensed from the card text. */
  teaser: string;
  question: string[];
  method: string[];
  plannedOutputs: string[];
  protocolLinks: ProtocolLink[];
}

export const programmes: Programme[] = [
  {
    slug: "substrate-telemetry",
    code: "A",
    title: "Substrate Telemetry and Thermal-Stress Mitigation",
    status: "PILOT IN PREPARATION",
    badgeTone: "gold",
    stage: "in-preparation",
    teaser:
      "Developing offline-first substrate probes designed to send SMS alerts when bed temperatures exceed critical thresholds.",
    summary:
      "Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds get too hot, large numbers of larvae can die unmonitored. We are developing ruggedised, offline-first substrate probes for tropical farm conditions. The system will send automated SMS alerts to facility operators over 2G, with dual-SIM failover and a 4G fallback, so they can adjust aeration and ventilation. A local alarm will also work with no network at all. Data from the pilot is intended to inform practical, evidence-based guidance for Kenya’s national insect production code of practice (KS 2921).",
    question: [
      "Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds get too hot, large numbers of larvae can die unmonitored.",
    ],
    method: [
      "We are developing ruggedised, offline-first substrate probes for tropical farm conditions. The system will send automated SMS alerts to facility operators over 2G, with dual-SIM failover and a 4G fallback, so they can adjust aeration and ventilation. A local alarm will also work with no network at all.",
      "Planned activities: onboard 25 pilot facilities with a baseline period; switch on alerts in randomised steps across facilities; estimate mortality with a standard sampling protocol.",
      "Alert thresholds are placeholders pending the acute exposure-response work.",
      "If excess mortality linked to temperature excursions is negligible at baseline (below 3%), the slaughter assays continue unchanged and the telemetry is repurposed as an operational-efficiency tool.",
      "Data from the pilot is intended to inform practical, evidence-based guidance for Kenya’s national insect production code of practice (KS 2921).",
    ],
    plannedOutputs: ["An alert system", "A micro-climate dataset", "Registered protocols and analysis plans"],
    protocolLinks: [],
  },
  {
    slug: "welfare-indicators",
    code: "B",
    title: "Behavioural and Physiological Welfare Indicators",
    status: "IN DEVELOPMENT",
    badgeTone: "grey",
    stage: "planned",
    teaser: "Developing low-cost on-farm tools to assess physiological and behavioural welfare indicators.",
    summary:
      "Developing scalable, low-cost on-farm assessment tools to map physiological and behavioural welfare indicators across the larval life cycle.",
    question: [
      "Developing scalable, low-cost on-farm assessment tools to map physiological and behavioural welfare indicators across the larval life cycle.",
    ],
    method: [],
    plannedOutputs: [],
    protocolLinks: [],
  },
  {
    slug: "humane-slaughter",
    code: "C",
    title: "Humane Slaughter and Loss-of-Responsiveness Assays",
    status: "METHODOLOGY IN DEVELOPMENT",
    badgeTone: "grey",
    stage: "planned",
    teaser: "A planned randomised comparison of common harvest methods against pre-specified behavioural endpoints.",
    summary:
      "A planned randomised comparison of common commercial slaughter methods (boiling, blanching, rapid cooling, and chilling followed by freezing) against pre-specified behavioural endpoints, including time to irreversible loss of responsiveness. Loss of responsiveness is a behavioural proxy and does not establish loss of capacity to suffer.",
    question: [
      "Which harvest method ends responsiveness fastest?",
    ],
    method: [
      "A planned randomised comparison of common commercial slaughter methods (boiling, blanching, rapid cooling, and chilling followed by freezing) against pre-specified behavioural endpoints, including time to irreversible loss of responsiveness. Loss of responsiveness is a behavioural proxy and does not establish loss of capacity to suffer.",
      "Assay protocols and the statistical analysis plan are pre-specified, time-stamped and registered publicly before data collection, and recovery scoring is blind to treatment. The advisor then runs the pre-specified analysis and archives the code and data so that anyone can re-run it.",
    ],
    plannedOutputs: ["An assay dataset", "Registered protocols and analysis plans", "Archived code and data"],
    protocolLinks: [],
  },
];

export function getProgramme(slug: string | undefined): Programme | undefined {
  return programmes.find((p) => p.slug === slug);
}
