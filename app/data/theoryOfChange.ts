export interface ChangeStage {
  title: string;
  text: string;
}

export const theoryOfChange: ChangeStage[] = [
  {
    title: "Problem",
    text: "Insect farming is expanding in Africa with almost no welfare evidence; heat-stress losses go unmonitored; slaughter methods are untested.",
  },
  {
    title: "Activities",
    text: "Deploy offline SMS temperature sensors; onboard pilot facilities with a baseline period; count mortality using a standard protocol; run a randomised comparison of slaughter methods; engage producers and standard-setters.",
  },
  {
    title: "Outputs",
    text: "An alert system; a micro-climate dataset; an assay dataset; published protocols.",
  },
  {
    title: "Outcomes",
    text: "Producers act on alerts, reducing thermal-stress mortality; evidence on which harvest method ends responsiveness fastest.",
  },
  {
    title: "Long-term impact",
    text: "Welfare evidence informs Kenya’s insect-farming standards and can be replicated in other countries.",
  },
];

export const assumptions = [
  "operators respond to alerts",
  "heat-stress mortality is non-negligible at pilot sites",
  "pilot facilities agree to participate",
  "temperature thresholds are confirmed against the published literature (provisional)",
];

export const failureCriteria =
  "If baseline thermal-stress mortality proves negligible, the programme shifts emphasis to the slaughter assays and standardisation work.";
