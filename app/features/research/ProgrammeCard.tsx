import { ReadMore, StatusBadge } from "~/components/ui";
import type { Programme } from "~/data/programmes";

/** Card for the home page research grid (brief §4.5). */
export function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <article className="card card-interactive flex h-full flex-col p-6" aria-labelledby={`prog-${programme.slug}`}>
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={programme.status} tone={programme.badgeTone} />
        <span className="font-mono text-[0.75rem] text-ink-70" aria-hidden>
          {programme.code}
        </span>
      </div>
      <h3 id={`prog-${programme.slug}`} className="mt-5">
        {programme.title}
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-70">{programme.summary}</p>
      <div className="mt-6 border-t border-rule pt-4">
        <ReadMore to={`/research/${programme.slug}`}>
          Read more<span className="sr-only"> about {programme.title}</span>
        </ReadMore>
      </div>
    </article>
  );
}
