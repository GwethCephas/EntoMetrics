import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { EASE_RESEARCH, TRACE_DURATION } from "./motion";
import { CHART, THRESHOLD_Y, TRACE_POINTS, thresholdCrossing, toPath } from "./traceGeometry";

const tracePath = toPath(TRACE_POINTS);
const crossing = thresholdCrossing(TRACE_POINTS, THRESHOLD_Y)!;
/** The threshold appears first; the trace then draws at constant speed. */
const THRESHOLD_LEAD = 0.35;
const alertDelay = THRESHOLD_LEAD + TRACE_DURATION * crossing.fraction;

const GRID_YS = [60, 100, 140, 180];
const CHIP_W = 112;
const CHIP_H = 26;
const TICK_FRACTIONS = [0.25, 0.5, 0.75];

interface TelemetryTraceProps {
  play: boolean;
  reduce: boolean;
}

/**
 * Beat 2: an illustrative temperature-style trace crossing a provisional
 * threshold. Deliberately has no axis values: it is not field data.
 */
export function TelemetryTrace({ play, reduce }: TelemetryTraceProps) {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  useEffect(() => {
    if (!play || reduce || !scope.current) return;
    const root = scope.current;
    const q = (selector: string) => root.querySelector(selector)!;
    const controls = [
      animate(q("[data-threshold]"), { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut" }),
      // Trace draw via stroke-dashoffset (pathLength is normalised to 1).
      animate(
        q("[data-trace]"),
        { strokeDashoffset: [1, 0] },
        { duration: TRACE_DURATION, delay: THRESHOLD_LEAD, ease: "linear" },
      ),
      animate(q("[data-crossing-dot]"), { opacity: [0, 1] }, { duration: 0.2, delay: alertDelay }),
      // Single gold pulse: plays once, never loops.
      animate(
        q("[data-pulse]"),
        { opacity: [0.9, 0], transform: ["scale(1)", "scale(4)"] },
        { duration: 0.9, delay: alertDelay, ease: "easeOut" },
      ),
      animate(
        q("[data-alert-chip]"),
        { opacity: [0, 1], transform: ["translateY(6px)", "translateY(0px)"] },
        { duration: 0.5, delay: alertDelay + 0.15, ease: EASE_RESEARCH },
      ),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [play, reduce, animate, scope]);

  const chipX = Math.min(crossing.point.x - CHIP_W / 2, CHART.right - CHIP_W);
  const chipY = THRESHOLD_Y - 58;
  const hidden = !reduce;

  return (
    <svg
      ref={scope}
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      className="h-auto w-full font-mono"
      role="img"
      aria-labelledby="trace-title trace-desc"
    >
      <title id="trace-title">Illustrative temperature trace crossing an alert threshold</title>
      <desc id="trace-desc">
        A line rises from left to right and crosses a dashed threshold line, at which point an SMS alert is
        shown.
      </desc>

      {/* Faint gridlines and value-free ticks */}
      <g className="stroke-paper/10" strokeWidth={1}>
        {GRID_YS.map((y) => (
          <line key={y} x1={CHART.left} y1={y} x2={CHART.right} y2={y} />
        ))}
      </g>
      <g className="stroke-paper/40" strokeWidth={1}>
        <line x1={CHART.left} y1={CHART.top} x2={CHART.left} y2={CHART.bottom} />
        <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} />
        {TICK_FRACTIONS.map((f) => {
          const x = CHART.left + (CHART.right - CHART.left) * f;
          return <line key={f} x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 4} />;
        })}
        {GRID_YS.map((y) => (
          <line key={y} x1={CHART.left - 4} y1={y} x2={CHART.left} y2={y} />
        ))}
      </g>
      <text x={CHART.left} y={CHART.top - 8} className="fill-paper/80" fontSize={13} letterSpacing="0.06em">
        SUBSTRATE TEMP
      </text>
      <text x={CHART.right} y={CHART.bottom + 20} className="fill-paper/80" fontSize={13} textAnchor="end" letterSpacing="0.06em">
        TIME
      </text>

      <g data-threshold style={{ opacity: hidden ? 0 : 1 }}>
        <line
          x1={CHART.left}
          y1={THRESHOLD_Y}
          x2={CHART.right}
          y2={THRESHOLD_Y}
          className="stroke-gold"
          strokeWidth={1.5}
          strokeDasharray="6 5"
        />
        <text x={CHART.left + 8} y={THRESHOLD_Y + 20} className="fill-paper/85" fontSize={13} letterSpacing="0.06em">
          THRESHOLD (PROVISIONAL)
        </text>
      </g>

      <path
        data-trace
        d={tracePath}
        pathLength={1}
        fill="none"
        className="stroke-signal"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
        style={{ strokeDashoffset: hidden ? 1 : 0 }}
      />

      <circle
        data-pulse
        cx={crossing.point.x}
        cy={crossing.point.y}
        r={4}
        fill="none"
        className="stroke-gold"
        strokeWidth={2}
        style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        data-crossing-dot
        cx={crossing.point.x}
        cy={crossing.point.y}
        r={4}
        className="fill-gold"
        style={{ opacity: hidden ? 0 : 1 }}
      />

      {/* SMS ALERT chip: gold fill with dark text for contrast */}
      <g data-alert-chip style={{ opacity: hidden ? 0 : 1 }}>
        <line
          x1={crossing.point.x}
          y1={crossing.point.y - 6}
          x2={crossing.point.x}
          y2={chipY + CHIP_H}
          className="stroke-gold"
          strokeWidth={1}
        />
        <rect x={chipX} y={chipY} width={CHIP_W} height={CHIP_H} rx={2} className="fill-gold" />
        <text x={chipX + CHIP_W / 2} y={chipY + 18} textAnchor="middle" className="fill-ink" fontSize={14} fontWeight={500} letterSpacing="0.06em">
          SMS ALERT
        </text>
      </g>
    </svg>
  );
}
