import { PageHeader } from "~/components/PageHeader";
import { MissionVision } from "~/features/about/MissionVision";
import { PillarsList } from "~/features/about/PillarsList";
import { TeamGrid } from "~/features/about/TeamGrid";
import { positioning } from "~/data/about";
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
      <PageHeader eyebrow="About Us" title={positioning.headline} intro={<p>{positioning.statement}</p>} wide />
      <MissionVision />
      <PillarsList />
      <TeamGrid />
    </>
  );
}
