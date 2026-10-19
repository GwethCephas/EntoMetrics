import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { EASE_RESEARCH, TRACE_DURATION } from "./motion";
import { CHART, THRESHOLD_Y, TRACE_POINTS, thresholdCrossing, toPath } from "./traceGeometry";

const tracePath = toPath(TRACE_POINTS);
const crossing = thresholdCrossing(TRACE_POINTS, THRESHOLD_Y)!;
/** The trace draws at constant speed, so the alert fires at this fraction of the draw. */
const alertDelay = TRACE_DURATION * crossing.fraction;

const GOLD = "#BD8D38";
const SIGNAL = "#22A39F";
const INK = "#1A252C";
const AXIS = "rgba(248,249,250,0.35)";
const LABEL = "rgba(248,249,250,0.85)";

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
      // Trace draw via stroke-dashoffset (pathLength is normalised to 1).
      animate(q("[data-trace]"), { strokeDashoffset: [1, 0] }, { duration: TRACE_DURATION, ease: "linear" }),
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

  const chipX = Math.min(crossing.point.x - 46, CHART.right - 104);
  const chipY = THRESHOLD_Y - 52;
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
        shown. Illustrative visualisation. Not field data.
      </desc>

      <g stroke={AXIS} strokeWidth={1}>
        <line x1={CHART.left} y1={CHART.top} x2={CHART.left} y2={CHART.bottom} />
        <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} />
        {[0.25, 0.5, 0.75].map((f) => {
          const x = CHART.left + (CHART.right - CHART.left) * f;
          return <line key={f} x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 4} />;
        })}
      </g>
      <text x={CHART.left} y={CHART.top - 8} fill={LABEL} fontSize={10} letterSpacing="0.06em">
        SUBSTRATE TEMP
      </text>
      <text x={CHART.right} y={CHART.bottom + 20} fill={LABEL} fontSize={10} textAnchor="end" letterSpacing="0.06em">
        TIME
      </text>

      <line
        x1={CHART.left}
        y1={THRESHOLD_Y}
        x2={CHART.right}
        y2={THRESHOLD_Y}
        stroke={GOLD}
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <text x={CHART.left + 6} y={THRESHOLD_Y - 7} fill={LABEL} fontSize={10} letterSpacing="0.06em">
        THRESHOLD (PROVISIONAL)
      </text>

      <path
        data-trace
        d={tracePath}
        pathLength={1}
        fill="none"
        stroke={SIGNAL}
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
        stroke={GOLD}
        strokeWidth={2}
        style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        data-crossing-dot
        cx={crossing.point.x}
        cy={crossing.point.y}
        r={4}
        fill={GOLD}
        style={{ opacity: hidden ? 0 : 1 }}
      />

      <g data-alert-chip style={{ opacity: hidden ? 0 : 1 }}>
        <line
          x1={crossing.point.x}
          y1={crossing.point.y - 6}
          x2={crossing.point.x}
          y2={chipY + 22}
          stroke={GOLD}
          strokeWidth={1}
        />
        <rect x={chipX} y={chipY} width={92} height={22} rx={2} fill={GOLD} />
        <text x={chipX + 46} y={chipY + 15} textAnchor="middle" fill={INK} fontSize={11} fontWeight={500} letterSpacing="0.06em">
          SMS ALERT
        </text>
      </g>
    </svg>
  );
}
