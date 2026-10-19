import { describe, expect, it } from "vitest";
import { THRESHOLD_Y, TRACE_POINTS, thresholdCrossing, toPath } from "~/features/story/traceGeometry";

describe("trace geometry", () => {
  it("crosses the threshold exactly once, partway along the trace", () => {
    const crossing = thresholdCrossing(TRACE_POINTS, THRESHOLD_Y);
    expect(crossing).not.toBeNull();
    expect(crossing!.point.y).toBe(THRESHOLD_Y);
    expect(crossing!.fraction).toBeGreaterThan(0.5);
    expect(crossing!.fraction).toBeLessThan(1);
  });

  it("returns null when the trace never crosses", () => {
    expect(thresholdCrossing([{ x: 0, y: 200 }, { x: 10, y: 190 }], 50)).toBeNull();
  });

  it("builds an SVG path", () => {
    expect(toPath([{ x: 0, y: 1 }, { x: 2, y: 3 }])).toBe("M0 1 L2 3");
  });
});
