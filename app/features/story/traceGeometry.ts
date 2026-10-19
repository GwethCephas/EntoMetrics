/**
 * Geometry for the illustrative temperature trace (brief §4.3, beat 2).
 * Abstract shape only: no units, values or field data.
 */
export interface Point {
  x: number;
  y: number;
}

export const CHART = { width: 480, height: 260, left: 36, right: 464, top: 24, bottom: 220 } as const;

/** SVG y of the dashed threshold line (smaller y = higher temperature). */
export const THRESHOLD_Y = 96;

export const TRACE_POINTS: Point[] = [
  { x: 36, y: 196 },
  { x: 70, y: 190 },
  { x: 104, y: 194 },
  { x: 138, y: 184 },
  { x: 172, y: 186 },
  { x: 206, y: 172 },
  { x: 240, y: 164 },
  { x: 274, y: 146 },
  { x: 308, y: 130 },
  { x: 342, y: 108 },
  { x: 376, y: 82 },
  { x: 410, y: 70 },
  { x: 444, y: 64 },
  { x: 464, y: 62 },
];

export function toPath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}

/**
 * Where the polyline first rises above the threshold, plus that point's
 * fraction of total path length, which sets when the alert pulse plays.
 */
export function thresholdCrossing(points: Point[], thresholdY: number): { point: Point; fraction: number } | null {
  const segmentLengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i]!.x, p.y - points[i]!.y));
  const total = segmentLengths.reduce((sum, len) => sum + len, 0);
  let travelled = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    if (a.y > thresholdY && b.y <= thresholdY) {
      const t = (a.y - thresholdY) / (a.y - b.y);
      const point = { x: a.x + (b.x - a.x) * t, y: thresholdY };
      return { point, fraction: (travelled + segmentLengths[i - 1]! * t) / total };
    }
    travelled += segmentLengths[i - 1]!;
  }
  return null;
}
