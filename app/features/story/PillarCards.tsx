import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { pillars } from "~/data/story";
import { EASE_RESEARCH, FADE_DURATION, PILLAR_STAGGER, RISE_DISTANCE } from "./motion";
import { PillarIcon } from "./PillarIcon";

interface PillarCardsProps {
  play: boolean;
  reduce: boolean;
}

/** Beat 3: the three pillars fade up one after another. */
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
    <ul ref={scope} className="grid gap-3">
      {pillars.map((pillar) => (
        <li
          key={pillar.title}
          data-pillar
          className="flex gap-4 rounded-[var(--radius-card)] border border-paper/25 bg-forest-deep/40 p-5"
          style={reduce ? undefined : { opacity: 0, transform: `translateY(${RISE_DISTANCE}px)` }}
        >
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-signal text-paper">
            <PillarIcon name={pillar.icon} size={20} />
          </span>
          <div>
            <h4 className="text-lg !text-paper">{pillar.title}</h4>
            <p className="mt-1 text-[0.9375rem] text-paper/85">{pillar.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
