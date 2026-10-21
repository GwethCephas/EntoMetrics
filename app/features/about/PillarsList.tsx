import { SectionHeader } from "~/components/ui";
import { pillars } from "~/data/story";
import { PillarIcon } from "~/features/story/PillarIcon";

/** The three pillars in ruled columns (About page). */
export function PillarsList() {
  return (
    <section aria-labelledby="pillars-heading" className="section bg-sunken">
      <div className="container-research">
        <SectionHeader index="Approach" title="Three pillars" id="pillars-heading" />
        <ol className="mt-10 grid gap-0 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, index) => (
            <li key={pillar.title} className="border-t border-ink/15 py-6 md:py-0 md:pt-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-signal text-forest">
                  <PillarIcon name={pillar.icon} size={19} />
                </span>
                <span aria-hidden className="font-mono text-[0.75rem] text-ink-70">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5">{pillar.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-70">{pillar.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
