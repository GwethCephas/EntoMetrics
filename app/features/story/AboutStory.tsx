import { useInView } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { SectionHeader } from "~/components/ui";
import { homeLinks } from "~/data/home";
import { ILLUSTRATIVE_CAPTION } from "~/data/site";
import { storyBeats } from "~/data/story";
import { usePrefersReducedMotion } from "~/lib/usePrefersReducedMotion";
import { BinGrid } from "./BinGrid";
import { Figure } from "./Figure";
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
        <SectionHeader index="About" title="Why this work matters" id="about-heading" onDark layout="stack" />
        <div className="mt-12 flex flex-col gap-20 lg:mt-4 lg:gap-0">
          <Beat
            step={1}
            title={storyBeats.demand.title}
            text={storyBeats.demand.text}
            reduce={reduce}
            figure={{ label: "Fig. 1 · Rearing capacity (abstract)", caption: ILLUSTRATIVE_CAPTION, tone: "outline" }}
          >
            {(play) => <BinGrid play={play} reduce={reduce} />}
          </Beat>
          <Beat
            step={2}
            title={storyBeats.blindSpot.title}
            text={storyBeats.blindSpot.text}
            reduce={reduce}
            figure={{
              label: "Fig. 2 · Substrate temperature against a provisional threshold",
              caption: ILLUSTRATIVE_CAPTION,
              tone: "panel",
              link: homeLinks.telemetry,
            }}
          >
            {(play) => <TelemetryTrace play={play} reduce={reduce} />}
          </Beat>
          <Beat
            step={3}
            title={storyBeats.approach.title}
            text={storyBeats.approach.text}
            reduce={reduce}
            figure={{ label: "Three pillars", tone: "plain" }}
          >
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
  reduce: boolean;
  figure: {
    label: string;
    caption?: string;
    tone: "outline" | "panel" | "plain";
    link?: { label: string; to: string };
  };
  children: (play: boolean) => ReactNode;
}

function Beat({ step, title, text, reduce, figure, children }: BeatProps) {
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { amount: IN_VIEW_AMOUNT, once: true });
  const [run, setRun] = useState(0);

  return (
    <article
      data-beat={step}
      aria-labelledby={`beat-${step}-title`}
      className="grid gap-8 lg:min-h-[65vh] lg:grid-cols-12 lg:items-start lg:gap-12"
    >
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start lg:py-[8vh]">
        <p className="font-mono text-label uppercase text-paper/70">
          <span className="text-paper">{String(step).padStart(2, "0")}</span> / 03
        </p>
        <h3 id={`beat-${step}-title`} className="mt-3 text-[1.625rem] font-medium tracking-[-0.02em] !text-paper lg:text-[2rem]">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-paper/85 lg:max-w-md">{text}</p>
      </div>

      <div className="lg:col-span-7 lg:py-[8vh]">
        <Figure
          figureRef={figureRef}
          played={inView}
          label={figure.label}
          caption={figure.caption}
          tone={figure.tone}
          link={figure.link}
          onReplay={reduce ? undefined : () => setRun((value) => value + 1)}
          replayLabel={`Replay animation: ${title}`}
        >
          <div key={run}>{children(inView)}</div>
        </Figure>
      </div>
    </article>
  );
}
