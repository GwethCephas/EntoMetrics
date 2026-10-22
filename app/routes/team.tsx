import { PageHeader } from "~/components/PageHeader";
import { TeamGrid } from "~/features/about/TeamGrid";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/team";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Team",
    description:
      "The EntoMetrics Africa team: leadership, hardware and telemetry engineering, field operations, data platform and independent scientific advice.",
  });

export default function Team() {
  return (
    <>
      <PageHeader eyebrow="EntoMetrics Africa" title="Meet the team" />
      <section aria-label="Team members" className="section">
        <div className="container-research">
          <TeamGrid />
        </div>
      </section>
    </>
  );
}
