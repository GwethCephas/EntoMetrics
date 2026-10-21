import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/ui";
import { assumptions, failureCriteria, theoryOfChange } from "~/data/theoryOfChange";

/** Full Theory of Change (Research Hub): connected sequence, assumptions, failure criteria. */
export function TheoryOfChange() {
  return (
    <section id="theory-of-change" aria-labelledby="toc-heading" className="section bg-sunken">
      <div className="container-research">
        <SectionHeader index="Programme logic" title="Theory of Change" id="toc-heading" />
        <Reveal>
          <ol className="mt-10 grid gap-0 lg:grid-cols-5 lg:gap-6">
            {theoryOfChange.map((stage, index) => (
              <li key={stage.title} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-8 last:pb-0 lg:block lg:pb-0">
                {index < theoryOfChange.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-8 bottom-0 w-px bg-forest/30 lg:left-10 lg:right-[-1.5rem] lg:top-[15px] lg:bottom-auto lg:h-px lg:w-auto"
                  />
                ) : null}
                <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-forest bg-sunken font-mono text-[0.75rem] text-forest">
                  {index + 1}
                </span>
                <div className="lg:mt-5 lg:border-t-2 lg:border-forest lg:pt-4">
                  <h3 className="text-[1.0625rem]">{stage.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-70">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-12 grid gap-8 border-t border-ink/15 pt-6 md:grid-cols-12">
          <p className="inline-flex items-center gap-2 font-mono text-label uppercase text-ink md:col-span-4">
            <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
            Assumptions
          </p>
          <ul className="space-y-2 text-[0.9375rem] text-ink md:col-span-7 md:col-start-6">
            {assumptions.map((assumption) => (
              <li key={assumption} className="flex gap-3">
                <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-ink-70" />
                {assumption}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-4 border-t border-ink/15 pt-6 md:grid-cols-12 md:gap-8">
          <p className="label md:col-span-4">Failure criteria</p>
          <p className="measure text-[0.9375rem] text-ink md:col-span-7 md:col-start-6">{failureCriteria}</p>
        </div>
      </div>
    </section>
  );
}
