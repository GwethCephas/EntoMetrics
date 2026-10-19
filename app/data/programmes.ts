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
  question: string[];
  method: string[];
  plannedOutputs: string[];
  protocolLinks: ProtocolLink[];
}

const PLACEHOLDER = "[PLACEHOLDER — CONFIRM WITH CLIENT";

export const programmes: Programme[] = [
  {
    slug: "substrate-telemetry",
    code: "A",
    title: "Substrate Telemetry and Thermal-Stress Mitigation",
    status: "PILOT IN PREPARATION",
    badgeTone: "gold",
    stage: "in-preparation",
    summary:
      "Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds exceed critical temperature thresholds, large numbers of larvae can die unmonitored. We are developing ruggedised, offline-first substrate probes for tropical farm conditions. Operating over low-bandwidth 2G networks, the system will send automated SMS alerts to facility operators so they can adjust aeration and ventilation. Data from the pilot is intended to inform practical, evidence-based guidance for Kenya’s national code of practice for Black Soldier Fly farming.",
    question: [
      "Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds exceed critical temperature thresholds, large numbers of larvae can die unmonitored.",
      `${PLACEHOLDER}: formal research question and primary outcome]`,
    ],
    method: [
      "We are developing ruggedised, offline-first substrate probes for tropical farm conditions. Operating over low-bandwidth 2G networks, the system will send automated SMS alerts to facility operators so they can adjust aeration and ventilation.",
      "Planned activities: deploy offline SMS temperature sensors; onboard pilot facilities with a baseline period; count mortality using a standard protocol.",
      "Temperature thresholds are provisional until confirmed against the published literature.",
      "If baseline thermal-stress mortality proves negligible, the programme shifts emphasis to the slaughter assays and standardisation work.",
    ],
    plannedOutputs: ["An alert system", "A micro-climate dataset", "Published protocols"],
    protocolLinks: [],
  },
  {
    slug: "welfare-indicators",
    code: "B",
    title: "Behavioural and Physiological Welfare Indicators",
    status: "IN DEVELOPMENT",
    badgeTone: "grey",
    stage: "planned",
    summary:
      "Developing scalable, low-cost on-farm assessment tools to map physiological and behavioural welfare indicators across the larval life cycle.",
    question: [
      "Developing scalable, low-cost on-farm assessment tools to map physiological and behavioural welfare indicators across the larval life cycle.",
      `${PLACEHOLDER}: formal research question]`,
    ],
    method: [`${PLACEHOLDER}: assessment method and indicators]`],
    plannedOutputs: [`${PLACEHOLDER}: planned outputs for this programme]`],
    protocolLinks: [],
  },
  {
    slug: "humane-slaughter",
    code: "C",
    title: "Humane Slaughter and Loss-of-Responsiveness Assays",
    status: "METHODOLOGY IN DEVELOPMENT",
    badgeTone: "grey",
    stage: "planned",
    summary:
      "Planned randomised comparison of common commercial harvest methods (boiling, blanching, rapid cooling) against pre-specified behavioural endpoints, including time to irreversible loss of responsiveness.",
    question: [
      "Which harvest method ends responsiveness fastest?",
      `${PLACEHOLDER}: confirm formal research question wording]`,
    ],
    method: [
      "Planned randomised comparison of common commercial harvest methods (boiling, blanching, rapid cooling) against pre-specified behavioural endpoints, including time to irreversible loss of responsiveness.",
      "Assay protocols and the statistical analysis plan are pre-specified before data collection, video scoring is blinded, and the advisor reviews the final analysis.",
    ],
    plannedOutputs: ["An assay dataset", "Published protocols"],
    protocolLinks: [],
  },
];

export function getProgramme(slug: string | undefined): Programme | undefined {
  return programmes.find((p) => p.slug === slug);
}
