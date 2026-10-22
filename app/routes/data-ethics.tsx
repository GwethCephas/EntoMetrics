import { PolicyPage, type PolicySection } from "~/components/PolicyPage";
import { protocolsNote } from "~/data/home";
import { governanceStatement } from "~/data/team";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/data-ethics";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Data and Ethics Statement",
    description:
      "How EntoMetrics Africa pre-specifies protocols, reports status honestly and handles research data. Draft, to be reviewed.",
  });

const sections: PolicySection[] = [
  {
    heading: "Pre-specification",
    body: [protocolsNote, governanceStatement],
  },
  {
    heading: "Open protocols",
    body: [
      "Protocols are intended to be published on a public registry so that they can be cited and checked.",
    ],
  },
  {
    heading: "Honest reporting",
    body: [
      "Programme status labels on this site reflect the actual stage of each programme. We do not describe planned work as completed.",
      "Temperature thresholds are provisional until confirmed against the published literature.",
    ],
  },
];

export default function DataEthics() {
  return (
    <PolicyPage
      title="Data and Ethics Statement"
      sections={sections}
    />
  );
}
