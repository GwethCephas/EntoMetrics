import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/ui";
import { protocolsNote } from "~/data/home";
import { programmes } from "~/data/programmes";
import { ProgrammeCard } from "./ProgrammeCard";

export function ResearchGrid() {
  return (
    <section id="programmes" aria-labelledby="programmes-heading" className="section border-t border-rule">
      <div className="container-research">
        <SectionHeader eyebrow="Research Hub" title="Research programmes" id="programmes-heading" />
        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme.slug} programme={programme} />
          ))}
        </Reveal>
        <p className="mt-6 text-[0.9375rem] italic text-ink-70">{protocolsNote}</p>
      </div>
    </section>
  );
}
