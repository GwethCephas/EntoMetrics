import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { pillars } from "~/data/story";
import { EASE_RESEARCH, FADE_DURATION, PILLAR_STAGGER, RISE_DISTANCE } from "./motion";
import { PillarIcon } from "./PillarIcon";

interface PillarCardsProps {
  play: boolean;
  reduce: boolean;
}

/** Beat 3: the three pillars as a ruled list, fading up one after another. */
export function PillarCards({ play, reduce }: PillarCardsProps) {
  const [scope, animate] = useAnimate<HTMLUListElement>();

  useEffect(() => {
    if (!play || reduce || !scope.current) return;
    const controls = animate(
      scope.current.querySelectorAll("[data-pillar]"),
      { opacity: [0, 1], transform: [`translateY(${RISE_DISTANCE}px)`, "translateY(0px)"] },
      { duration: FADE_DURATION, ease: EASE_RESEARCH, delay: (i: number) => i * PILLAR_STAGGER },
    );
    return () => controls.stop();
  }, [play, reduce, animate, scope]);

  return (
    <ul ref={scope} className="divide-y divide-paper/15 border-y border-paper/15">
      {pillars.map((pillar, index) => (
        <li
          key={pillar.title}
          data-pillar
          className="grid grid-cols-[auto_1fr] gap-x-4 py-5 sm:grid-cols-[2.5rem_auto_1fr] sm:gap-x-5"
          style={reduce ? undefined : { opacity: 0, transform: `translateY(${RISE_DISTANCE}px)` }}
        >
          <span aria-hidden className="hidden pt-1 font-mono text-[0.75rem] text-paper/75 sm:block">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-signal text-paper">
            <PillarIcon name={pillar.icon} size={18} />
          </span>
          <div>
            <h4 className="!text-paper">{pillar.title}</h4>
            <p className="mt-1 text-[0.9375rem] text-paper/85">{pillar.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
