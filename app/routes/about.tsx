import { PageHeader } from "~/components/PageHeader";
import { RichText } from "~/components/RichText";
import { SectionHeader } from "~/components/ui";
import { MissionVision } from "~/features/about/MissionVision";
import { PillarsList } from "~/features/about/PillarsList";
import { TeamGrid } from "~/features/about/TeamGrid";
import { positioning } from "~/data/about";
import { site } from "~/data/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "About Us",
    description:
      "Mission, vision, approach, governance and team of EntoMetrics Africa, an independent research organisation in Nairobi, Kenya.",
  });

const legalRows = [
  { label: "Organisation type", value: site.legalStatus.organisationType },
  { label: "Registration number", value: site.legalStatus.registrationNumber },
  { label: "Location", value: site.location },
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Us" title={positioning.headline} intro={<p>{positioning.statement}</p>} wide />
      <MissionVision />
      <PillarsList />
      <TeamGrid />

      <section aria-labelledby="legal-heading" className="section bg-sunken">
        <div className="container-research">
          <SectionHeader index="Legal status" title="Registration" id="legal-heading" />
          <dl className="mt-8 border-b border-ink/15 md:ml-[calc((100%+2rem)*6/12)]">
            {legalRows.map((row) => (
              <div key={row.label} className="grid gap-1 border-t border-ink/15 py-4 sm:grid-cols-3 sm:gap-4">
                <dt className="label pt-0.5">{row.label}</dt>
                <dd className="sm:col-span-2">
                  <RichText text={row.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
