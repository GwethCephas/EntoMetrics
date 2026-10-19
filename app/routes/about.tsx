import { PageHeader } from "~/components/PageHeader";
import { RichText } from "~/components/RichText";
import { SectionHeader } from "~/components/ui";
import { MissionVision } from "~/features/about/MissionVision";
import { PillarsList } from "~/features/about/PillarsList";
import { TeamGrid } from "~/features/about/TeamGrid";
import { site } from "~/data/site";
import { governanceStatement } from "~/data/team";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "About Us",
    description:
      "Mission, vision, approach, governance and team of EntoMetrics Africa, an independent research organisation in Nairobi, Kenya.",
  });

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="An independent research organisation in Nairobi, Kenya"
        intro={<p>EntoMetrics Africa is an {site.legalDescriptor} headquartered in {site.location}.</p>}
      />
      <MissionVision />
      <PillarsList />

      <section aria-labelledby="governance-heading" className="section border-t border-rule">
        <div className="container-research grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Governance" title="Independence and pre-specification" id="governance-heading" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg leading-relaxed">{governanceStatement}</p>
          </div>
        </div>
      </section>

      <TeamGrid />

      <section aria-labelledby="legal-heading" className="section border-t border-rule">
        <div className="container-research grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Legal status" title="Registration" id="legal-heading" />
          </div>
          <dl className="card divide-y divide-rule md:col-span-7 md:col-start-6">
            <div className="grid gap-1 p-5 sm:grid-cols-3">
              <dt className="label">Organisation type</dt>
              <dd className="sm:col-span-2">
                <RichText text={site.legalStatus.organisationType} />
              </dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-3">
              <dt className="label">Registration number</dt>
              <dd className="sm:col-span-2">
                <RichText text={site.legalStatus.registrationNumber} />
              </dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-3">
              <dt className="label">Location</dt>
              <dd className="sm:col-span-2">{site.location}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
