import { TIMELINE_STAGES, type TimelineStage } from "~/data/programmes";

/**
 * Four-stage status stepper. Only the true current stage is highlighted, and
 * it is marked in text ("Current stage") as well as colour.
 */
export function StatusTimeline({
  current,
  orientation = "responsive",
}: {
  current: TimelineStage;
  /** "responsive": vertical on small screens, horizontal from `sm`. */
  orientation?: "responsive" | "vertical";
}) {
  // Breakpoint-prefixed classes only apply in responsive mode.
  const h = (classes: string) => (orientation === "vertical" ? "" : classes);
  const currentIndex = TIMELINE_STAGES.findIndex((stage) => stage.id === current);

  return (
    <ol className={`grid gap-0 ${h("sm:grid-cols-4")}`} aria-label="Programme status timeline">
      {TIMELINE_STAGES.map((stage, index) => {
        const isCurrent = index === currentIndex;
        const isPast = index < currentIndex;
        const isLast = index === TIMELINE_STAGES.length - 1;
        return (
          <li
            key={stage.id}
            aria-current={isCurrent ? "step" : undefined}
            className={`relative flex gap-3 pb-5 last:pb-0 ${h("sm:flex-col sm:gap-2.5 sm:pb-0 sm:pr-3")}`}
          >
            {!isLast ? (
              <span
                aria-hidden
                className={`absolute left-[5px] top-4 bottom-0 w-px ${h("sm:left-4 sm:right-0 sm:top-[5px] sm:bottom-auto sm:h-px sm:w-auto")} ${
                  isPast ? "bg-forest/45" : "bg-rule"
                }`}
              />
            ) : null}
            <span
              aria-hidden
              className={`relative z-10 mt-[5px] h-[11px] w-[11px] shrink-0 rounded-full border ${h("sm:mt-0")} ${
                isCurrent
                  ? "border-forest bg-forest ring-4 ring-forest/15"
                  : isPast
                    ? "border-forest/45 bg-forest/45"
                    : "border-rule-strong bg-surface"
              }`}
            />
            <span className="flex flex-col">
              <span className={`text-[0.875rem] leading-snug ${isCurrent ? "font-semibold text-ink" : "text-ink-70"}`}>
                {stage.label}
              </span>
              {isCurrent ? (
                <span className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-forest">
                  Current stage
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
