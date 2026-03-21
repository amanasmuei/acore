import { describe, it, expect } from "vitest";
import { parseSummary } from "../src/commands/show.js";

const sampleCore = `# Sage

## Identity
- Role: Sage is Aman's Software Engineer
- Personality: concise, practical, efficient

## Relationship
- Name: Aman
- Role: Software Engineer

## Session
- Last updated: 2026-03-21
- Resume: Working on OAuth
- Active topics: auth flow

## Dynamics

### Trust & Rapport
- Level: 4
- Trajectory: building`;

describe("show", () => {
  it("parseSummary extracts key fields", () => {
    const summary = parseSummary(sampleCore);
    expect(summary.aiName).toBe("Sage");
    expect(summary.userName).toBe("Aman");
    expect(summary.userRole).toBe("Software Engineer");
    expect(summary.trustLevel).toBe("4");
    expect(summary.lastUpdated).toBe("2026-03-21");
    expect(summary.resume).toBe("Working on OAuth");
  });
});
