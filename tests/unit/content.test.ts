import { describe, expect, it } from "vitest";
import { positioning } from "~/data/about";
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

  it("has five team members with clean, client-supplied LinkedIn profiles", () => {
    expect(team.map((m) => m.name)).toEqual(["Clinton Adoga", "Paul Murani", "Mary Wairimu", "Fernán Gizzi", "Cephas Gweth"]);
    for (const m of team) {
      expect(m.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[a-z0-9-]+$/);
      expect(m.responsibilities.length).toBeGreaterThan(40);
    }
  });

  it("keeps the brief's exact positioning copy for the About page", () => {
    expect(positioning.headline).toBe(
      "Pioneering Black Soldier Fly welfare science, micro-climate telemetry, and humane rearing protocols in the Global South.",
    );
    expect(positioning.statement).toBe(
      "EntoMetrics Africa is an independent, non-profit research institution headquartered in Nairobi, Kenya.",
    );
  });

  it("gives every programme a short home-page teaser without forbidden labels", () => {
    for (const p of programmes) {
      expect(p.teaser.length).toBeGreaterThan(20);
      expect(p.teaser.length).toBeLessThan(p.summary.length + 1);
      expect(p.teaser).not.toMatch(FORBIDDEN);
    }
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
