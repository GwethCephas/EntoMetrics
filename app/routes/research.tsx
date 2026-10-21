import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { PageHeader } from "~/components/PageHeader";
import { StatusTimeline } from "~/components/StatusTimeline";
import { ProgrammeCode, StatusBadge } from "~/components/ui";
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
      <PageHeader eyebrow="Research Hub" title="Research programmes" intro={<p>{protocolsNote}</p>} />

      <section aria-label="Programmes" className="section">
        <ol className="container-research">
          {programmes.map((programme) => (
            <li key={programme.slug} className="border-t border-ink/15 last:border-b">
              <article
                className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-12"
                aria-labelledby={`row-${programme.slug}`}
              >
                <div className="flex items-start gap-4 md:col-span-1 md:block">
                  <ProgrammeCode code={programme.code} size="lg" />
                </div>
                <div className="md:col-span-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[0.75rem] text-ink-70">Programme {programme.code}</span>
                    <StatusBadge status={programme.status} tone={programme.badgeTone} />
                  </div>
                  <h2 id={`row-${programme.slug}`} className="mt-4 text-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)]">
                    {programme.title}
                  </h2>
                  <p className="measure mt-4 text-ink-70">{programme.summary}</p>
                  <Link
                    to={`/research/${programme.slug}`}
                    className="group mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-forest underline decoration-forest/35 decoration-1 underline-offset-4 hover:decoration-gold focus-visible:decoration-gold"
                  >
                    Programme details<span className="sr-only"> for {programme.title}</span>
                    <ArrowRight aria-hidden size={16} className="nudge" />
                  </Link>
                </div>
                <div className="md:col-span-3 md:col-start-10 md:border-l md:border-rule md:pl-6 md:pt-1">
                  <p className="label mb-4">Status timeline</p>
                  <StatusTimeline current={programme.stage} orientation="vertical" />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <TheoryOfChange />
    </>
  );
}
