import type { ReactNode, Ref } from "react";
import { Caption, ReadMore } from "~/components/ui";

interface FigureProps {
  /** Mono figure label, e.g. "Fig. 2 · Substrate temperature (illustrative)". */
  label: string;
  caption?: string;
  /** Omit to hide the Replay control (reduced motion, or non-replayable). */
  onReplay?: () => void;
  replayLabel?: string;
  link?: { label: string; to: string };
  /** "outline": hairline frame; "panel": deeper green panel; "plain": no frame. */
  tone?: "outline" | "panel" | "plain";
  figureRef?: Ref<HTMLElement>;
  played?: boolean;
  children: ReactNode;
}

/** Frame for the story's illustrative graphics, on the dark story panel. */
export function Figure({
  label,
  caption,
  onReplay,
  replayLabel,
  link,
  tone = "outline",
  figureRef,
  played,
  children,
}: FigureProps) {
  return (
    <figure
      ref={figureRef}
      data-visual
      data-played={played ? "true" : "false"}
      className={
        tone === "plain"
          ? ""
          : `rounded-[var(--radius-card)] p-4 sm:p-6 ${
              tone === "panel" ? "bg-forest-deep ring-1 ring-paper/10" : "border border-paper/20"
            }`
      }
    >
      <p className="mb-4 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-paper/75">
        <span aria-hidden className="h-px w-6 bg-paper/40" />
        {label}
      </p>
      {children}
      <figcaption
        className={`mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 ${tone === "plain" ? "" : "border-t border-paper/15 pt-3"}`}
      >
        {onReplay ? (
          <button
            type="button"
            onClick={onReplay}
            className="-my-2 inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-paper underline decoration-paper/40 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-gold focus-visible:decoration-gold"
            aria-label={replayLabel}
          >
            <svg aria-hidden viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v3h3" />
            </svg>
            Replay
          </button>
        ) : (
          <span />
        )}
        {caption ? <Caption onDark>{caption}</Caption> : null}
      </figcaption>
      {link ? (
        <div className="mt-4">
          <ReadMore to={link.to} onDark>
            {link.label}
          </ReadMore>
        </div>
      ) : null}
    </figure>
  );
}
