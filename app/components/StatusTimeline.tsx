import { TIMELINE_STAGES, type TimelineStage } from "~/data/programmes";

/** Four-stage status timeline; only the true current stage is highlighted. */
export function StatusTimeline({ current }: { current: TimelineStage }) {
  return (
    <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-rule bg-rule sm:grid-cols-4">
      {TIMELINE_STAGES.map((stage, index) => {
        const isCurrent = stage.id === current;
        return (
          <li
            key={stage.id}
            aria-current={isCurrent ? "step" : undefined}
            className={`flex flex-col gap-1 px-4 py-3 ${isCurrent ? "bg-forest text-paper" : "bg-white text-ink-70"}`}
          >
            <span className={`font-mono text-[0.6875rem] ${isCurrent ? "text-paper/80" : ""}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`text-[0.9375rem] ${isCurrent ? "font-semibold" : ""}`}>{stage.label}</span>
            {isCurrent ? (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-paper/85">
                Current stage
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
