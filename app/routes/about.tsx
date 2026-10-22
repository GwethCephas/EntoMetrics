import { PageHeader } from "~/components/PageHeader";
import { MissionVision } from "~/features/about/MissionVision";
import { PillarsList } from "~/features/about/PillarsList";
import { Governance } from "~/features/about/Governance";
import { positioning } from "~/data/about";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "About Us",
    description:
      "Mission, vision, approach and governance of EntoMetrics Africa, an independent research organisation in Nairobi, Kenya.",
  });

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Us" title={positioning.headline} intro={<p>{positioning.statement}</p>} wide />
      <MissionVision />
      <PillarsList />
      <Governance />
    </>
  );
}
