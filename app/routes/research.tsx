import { PageHeader } from "~/components/PageHeader";
import { Reveal } from "~/components/Reveal";
import { StatusTimeline } from "~/components/StatusTimeline";
import { ReadMore, StatusBadge } from "~/components/ui";
import { TheoryOfChange } from "~/features/research/TheoryOfChange";
import { protocolsNote } from "~/data/home";
import { programmes } from "~/data/programmes";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/research";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Research Hub",
    description:
      "Three research programmes: substrate telemetry and thermal-stress mitigation, welfare indicators, and humane slaughter assays for Black Soldier Fly larvae.",
  });

export default function Research() {
  return (
    <>
      <PageHeader
        eyebrow="Research Hub"
        title="Research programmes"
        intro={<p>{protocolsNote}</p>}
      />

      <section aria-label="Programmes" className="section">
        <ol className="container-research flex flex-col gap-6">
          {programmes.map((programme) => (
            <li key={programme.slug}>
              <Reveal>
                <article className="card card-interactive grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8" aria-labelledby={`row-${programme.slug}`}>
                  <div className="md:col-span-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[0.75rem] text-ink-70">Programme {programme.code}</span>
                      <StatusBadge status={programme.status} tone={programme.badgeTone} />
                    </div>
                    <h2 id={`row-${programme.slug}`} className="mt-4 text-[1.5rem] md:text-[1.75rem]">
                      {programme.title}
                    </h2>
                    <p className="mt-3 text-ink-70">{programme.summary}</p>
                    <div className="mt-5">
                      <ReadMore to={`/research/${programme.slug}`}>
                        Programme details<span className="sr-only"> for {programme.title}</span>
                      </ReadMore>
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <p className="label mb-3">Status timeline</p>
                    <StatusTimeline current={programme.stage} />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <TheoryOfChange />
    </>
  );
}
