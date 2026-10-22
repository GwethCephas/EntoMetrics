import { SectionHeader } from "~/components/ui";
import { governanceStatement } from "~/data/team";

/** Year 1 governance and scientific independence (About page). */
export function Governance() {
  return (
    <section aria-labelledby="governance-heading" className="section">
      <div className="container-research">
        <SectionHeader
          index="Governance"
          title="Independence and pre-specification"
          id="governance-heading"
          intro={<p className="text-ink">{governanceStatement}</p>}
        />
      </div>
    </section>
  );
}
