import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { BIN_STAGGER } from "./motion";

const COLS = 10;
const ROWS = 5;
const SIZE = 30;
const GAP = 10;
const PAD = 20;

// Ordered column by column so the grid fills left to right.
const bins = Array.from({ length: COLS * ROWS }, (_, i) => ({
  key: i,
  x: PAD + Math.floor(i / ROWS) * (SIZE + GAP),
  y: PAD + (i % ROWS) * (SIZE + GAP),
}));

const WIDTH = PAD * 2 + COLS * SIZE + (COLS - 1) * GAP;
const HEIGHT = PAD * 2 + ROWS * SIZE + (ROWS - 1) * GAP;

interface BinGridProps {
  play: boolean;
  reduce: boolean;
}

/** Beat 1: abstract rearing bins filling left to right (no numbers). */
export function BinGrid({ play, reduce }: BinGridProps) {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  useEffect(() => {
    if (!play || reduce || !scope.current) return;
    const controls = animate(
      scope.current.querySelectorAll("[data-bin]"),
      { fillOpacity: [0, 1] },
      { duration: 0.32, ease: "easeOut", delay: (i: number) => i * BIN_STAGGER },
    );
    return () => controls.stop();
  }, [play, reduce, animate, scope]);

  return (
    <svg
      ref={scope}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-labelledby="bin-grid-title"
    >
      <title id="bin-grid-title">
        Abstract grid of rearing bins filling from left to right, representing scaling demand.
      </title>
      {bins.map((bin) => (
        <rect
          key={bin.key}
          data-bin
          x={bin.x}
          y={bin.y}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill="#F8F9FA"
          stroke="rgba(248,249,250,0.45)"
          strokeWidth={1}
          style={{ fillOpacity: reduce ? 1 : 0 }}
        />
      ))}
    </svg>
  );
}
