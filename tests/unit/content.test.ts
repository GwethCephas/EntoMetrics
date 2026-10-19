import { describe, expect, it } from "vitest";
import { PROGRAMME_STATUSES, programmes } from "~/data/programmes";
import { theoryOfChange } from "~/data/theoryOfChange";
import { team } from "~/data/team";
import { telemetrySpecs } from "~/data/telemetry";

const FORBIDDEN = /\b(ACTIVE|LIVE|COMPLETED)\b/;

describe("content accuracy rules", () => {
  it("uses only approved programme statuses", () => {
    for (const p of programmes) {
      expect(PROGRAMME_STATUSES).toContain(p.status);
      expect(p.status).not.toMatch(FORBIDDEN);
    }
  });

  it("uses gold only for the first programme badge", () => {
    expect(programmes.map((p) => p.badgeTone)).toEqual(["gold", "grey", "grey"]);
  });

  it("does not mark any programme as published or in progress", () => {
    for (const p of programmes) expect(["planned", "in-preparation"]).toContain(p.stage);
  });

  it("keeps the alert threshold unconfirmed", () => {
    const threshold = telemetrySpecs.find((r) => r.parameter === "Alert threshold");
    expect(threshold?.value).toBe("TBC");
    expect(telemetrySpecs.some((r) => /\d+\s*°?C/.test(r.value))).toBe(false);
  });

  it("has four team members and no fabricated profile links", () => {
    expect(team.map((m) => m.name)).toEqual(["Clinton Adoga", "Paul Murani", "Mary Wairimu", "Fernán Gizzi"]);
    for (const m of team) expect(m.linkedin).toBeNull();
  });

  it("has a five-stage theory of change", () => {
    expect(theoryOfChange.map((s) => s.title)).toEqual([
      "Problem",
      "Activities",
      "Outputs",
      "Outcomes",
      "Long-term impact",
    ]);
  });
});
