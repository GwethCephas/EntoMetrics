import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/ui";
import { pillars } from "~/data/story";
import { PillarIcon } from "~/features/story/PillarIcon";

/** Static version of the three pillars for the About page. */
export function PillarsList() {
  return (
    <section aria-labelledby="pillars-heading" className="section border-t border-rule">
      <div className="container-research">
        <SectionHeader eyebrow="Approach" title="Three pillars" id="pillars-heading" />
        <Reveal className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] border border-signal text-forest">
                <PillarIcon name={pillar.icon} size={22} />
              </span>
              <h3 className="mt-5">{pillar.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-70">{pillar.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
