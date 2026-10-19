import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/ui";
import { assumptions, failureCriteria, theoryOfChange } from "~/data/theoryOfChange";

function Arrow() {
  return (
    <div aria-hidden className="flex items-center justify-center text-forest lg:w-6 lg:shrink-0">
      <svg viewBox="0 0 24 24" width="20" height="20" className="rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M3 12h17M14 6l6 6-6 6" />
      </svg>
    </div>
  );
}

export function TheoryOfChange() {
  return (
    <section aria-labelledby="toc-heading" className="section border-t border-rule">
      <div className="container-research">
        <SectionHeader eyebrow="Programme logic" title="Theory of Change" id="toc-heading" />
        <Reveal>
          <ol className="mt-10 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
            {theoryOfChange.map((stage, index) => (
              <li key={stage.title} className="flex flex-col gap-2 lg:flex-1 lg:flex-row lg:gap-0">
                {index > 0 ? <Arrow /> : null}
                <div className="rounded-[var(--radius-card)] border border-forest bg-white p-5 lg:flex-1">
                  <p className="font-mono text-[0.75rem] text-ink-70">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-lg">{stage.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-[var(--radius-card)] border border-rule bg-white p-5">
            <p className="inline-flex items-center gap-2 font-mono text-label uppercase text-ink">
              <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
              Assumptions
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[0.9375rem] text-ink-70">
              {assumptions.map((assumption, index) => (
                <li key={assumption}>
                  {assumption}
                  {index < assumptions.length - 1 ? <span aria-hidden className="ml-2">·</span> : null}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 max-w-4xl text-[0.9375rem] text-ink-70">
            <span className="font-semibold text-ink">Failure criteria: </span>
            {failureCriteria}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
