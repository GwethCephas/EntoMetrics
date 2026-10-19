import { useInView } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { Caption, SectionHeader } from "~/components/ui";
import { ILLUSTRATIVE_CAPTION } from "~/data/site";
import { storyBeats } from "~/data/story";
import { usePrefersReducedMotion } from "~/lib/usePrefersReducedMotion";
import { BinGrid } from "./BinGrid";
import { IN_VIEW_AMOUNT } from "./motion";
import { PillarCards } from "./PillarCards";
import { TelemetryTrace } from "./TelemetryTrace";

/**
 * Home page About section (brief §4.3): three scroll-triggered beats on a
 * Deep Green panel. Each beat plays once at 40% visibility and can be
 * replayed; reduced-motion users get the final state with no movement.
 * No scroll-jacking, parallax or looping.
 */
export function AboutStory() {
  const reduce = usePrefersReducedMotion();

  return (
      <section aria-labelledby="about-heading" className="on-dark bg-forest text-paper" id="about">
        <div className="container-research section">
          <SectionHeader eyebrow="About" title="About EntoMetrics Africa" id="about-heading" onDark />
          <div className="mt-14 flex flex-col gap-20 md:mt-6 md:gap-0">
            <Beat step={1} title={storyBeats.demand.title} text={storyBeats.demand.text} caption={ILLUSTRATIVE_CAPTION} reduce={reduce}>
              {(play) => <BinGrid play={play} reduce={reduce} />}
            </Beat>
            <Beat step={2} title={storyBeats.blindSpot.title} text={storyBeats.blindSpot.text} caption={ILLUSTRATIVE_CAPTION} reduce={reduce}>
              {(play) => <TelemetryTrace play={play} reduce={reduce} />}
            </Beat>
            <Beat step={3} title={storyBeats.approach.title} text={storyBeats.approach.text} reduce={reduce}>
              {(play) => <PillarCards play={play} reduce={reduce} />}
            </Beat>
          </div>
        </div>
      </section>
  );
}

interface BeatProps {
  step: number;
  title: string;
  text: string;
  caption?: string;
  reduce: boolean;
  children: (play: boolean) => ReactNode;
}

function Beat({ step, title, text, caption, reduce, children }: BeatProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const inView = useInView(visualRef, { amount: IN_VIEW_AMOUNT, once: true });
  const [run, setRun] = useState(0);

  return (
    <article
      data-beat={step}
      aria-labelledby={`beat-${step}-title`}
      className="grid gap-8 md:min-h-[88vh] md:grid-cols-12 md:items-start md:gap-12"
    >
      <div className="md:sticky md:top-28 md:col-span-5 md:self-start md:py-[12vh]">
        <p className="font-mono text-label uppercase text-paper/75">
          {String(step).padStart(2, "0")} / 03
        </p>
        <h3 id={`beat-${step}-title`} className="mt-3 text-2xl !text-paper md:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-4 text-paper/90">{text}</p>
      </div>

      <div className="md:col-span-7 md:py-[12vh]">
        <div
          ref={visualRef}
          data-visual
          data-played={inView ? "true" : "false"}
          className="rounded-[var(--radius-card)] border border-paper/20 p-4 sm:p-6"
        >
          <div key={run}>{children(inView)}</div>
          <div className="mt-4 flex min-h-6 flex-wrap items-end justify-between gap-x-6 gap-y-2">
            {reduce ? (
              <span />
            ) : (
              <button
                type="button"
                onClick={() => setRun((value) => value + 1)}
                className="-my-2 inline-flex min-h-11 items-center font-mono text-[0.75rem] uppercase tracking-[0.06em] text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-gold"
                aria-label={`Replay animation: ${title}`}
              >
                Replay
              </button>
            )}
            {caption ? <Caption onDark>{caption}</Caption> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
