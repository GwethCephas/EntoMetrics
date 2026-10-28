export interface ChangeStage {
  title: string;
  text: string;
}

export const theoryOfChange: ChangeStage[] = [
  {
    title: "Problem",
    text: "Insect farming is expanding in Africa with almost no welfare evidence. Slaughter methods are untested, and heat-stress losses go unmonitored.",
  },
  {
    title: "Activities",
    text: "Onboard 25 pilot facilities with a baseline period; switch on alerts in randomised steps across facilities; estimate mortality with a standard sampling protocol; run a randomised comparison of slaughter methods; register protocols and analysis plans before data collection; engage producers and standard-setters.",
  },
  {
    title: "Outputs",
    text: "An alert system; a micro-climate dataset; an assay dataset; registered protocols and analysis plans; archived code and data.",
  },
  {
    title: "Outcomes",
    text: "Evidence on which harvest method ends responsiveness fastest. Producers act on alerts, which may reduce thermal-stress mortality; because more larvae then reach slaughter, the net welfare effect is reported as unclear.",
  },
  {
    title: "Long-term impact",
    text: "Welfare evidence informs Kenya’s insect-farming standards and can be replicated in other countries.",
  },
];

export const assumptions = [
  "operators respond to alerts",
  "heat-stress mortality is non-negligible at pilot sites",
  "pilot facilities agree to participate and to share anonymised data",
  "alert thresholds are placeholders pending the acute exposure-response work",
];

export const failureCriteria =
  "If excess mortality linked to temperature excursions is negligible at baseline (below 3%), the slaughter assays continue unchanged and the telemetry is repurposed as an operational-efficiency tool.";
