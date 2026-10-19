import { DraftNotice } from "~/components/DraftNotice";
import { PageHeader } from "~/components/PageHeader";
import { RichText } from "~/components/RichText";
import { protocolsNote } from "~/data/home";
import { ILLUSTRATIVE_CAPTION } from "~/data/site";
import { governanceStatement } from "~/data/team";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/data-ethics";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Data and Ethics Statement",
    description:
      "How EntoMetrics Africa pre-specifies protocols, reports status honestly and handles research data. Draft, to be reviewed.",
  });

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Pre-specification",
    body: [protocolsNote, governanceStatement],
  },
  {
    heading: "Open protocols",
    body: [
      "Protocols are intended to be published on a public registry so that they can be cited and checked. [PLACEHOLDER — CONFIRM WITH CLIENT: registry (for example OSF or Zenodo) and timing]",
    ],
  },
  {
    heading: "Honest reporting",
    body: [
      "Programme status labels on this site reflect the actual stage of each programme. We do not describe planned work as completed.",
      `Illustrative graphics are labelled: “${ILLUSTRATIVE_CAPTION}”`,
      "Temperature thresholds are provisional until confirmed against the published literature.",
    ],
  },
  {
    heading: "Research data from pilot facilities",
    body: [
      "[PLACEHOLDER — CONFIRM WITH CLIENT: data ownership and sharing agreements with participating facilities, anonymisation, storage and retention]",
    ],
  },
  {
    heading: "Ethical review",
    body: ["[PLACEHOLDER — CONFIRM WITH CLIENT: ethical review arrangements for the welfare and slaughter assays]"],
  },
];

export default function DataEthics() {
  return (
    <>
      <PageHeader eyebrow="Policy" title="Data and Ethics Statement">
        <DraftNotice />
      </PageHeader>
      <div className="container-research section !pt-12">
        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[1.375rem]">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
