import { describe, it, expect } from "vitest";
import { buildDetailedDiff, formatDiff } from "../src/commands/diff.js";

describe("buildDetailedDiff", () => {
  it("detects unchanged sections", () => {
    const content = "## Session\n- Last updated: 2026-03-20\n";
    const diffs = buildDetailedDiff(content, content);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].status).toBe("unchanged");
  });

  it("detects added sections", () => {
    const old = "## Session\n- Last updated: 2026-03-20\n";
    const updated = "## Session\n- Last updated: 2026-03-20\n## Dynamics\n- Trust level: 3\n";
    const diffs = buildDetailedDiff(old, updated);
    const dynamics = diffs.find((d) => d.name === "Dynamics");
    expect(dynamics?.status).toBe("added");
  });

  it("detects removed sections", () => {
    const old = "## Session\n- Last updated: 2026-03-20\n## Old\n- stuff: here\n";
    const updated = "## Session\n- Last updated: 2026-03-20\n";
    const diffs = buildDetailedDiff(old, updated);
    const removed = diffs.find((d) => d.name === "Old");
    expect(removed?.status).toBe("removed");
  });

  it("detects changed fields within a section", () => {
    const old = "## Session\n- Last updated: 2026-03-20\n- Resume: working on auth\n";
    const updated = "## Session\n- Last updated: 2026-03-22\n- Resume: finished auth, starting payments\n";
    const diffs = buildDetailedDiff(old, updated);
    const session = diffs.find((d) => d.name === "Session");
    expect(session?.status).toBe("changed");
    expect(session?.fields).toHaveLength(2);

    const dateField = session?.fields.find((f) => f.key === "Last updated");
    expect(dateField?.type).toBe("changed");
    expect(dateField?.oldValue).toBe("2026-03-20");
    expect(dateField?.newValue).toBe("2026-03-22");
  });

  it("detects added fields within a section", () => {
    const old = "## Relationship\n- Name: Aman\n";
    const updated = "## Relationship\n- Name: Aman\n- Communication: prefers bullet points\n";
    const diffs = buildDetailedDiff(old, updated);
    const rel = diffs.find((d) => d.name === "Relationship");
    expect(rel?.status).toBe("changed");
    const added = rel?.fields.find((f) => f.key === "Communication");
    expect(added?.type).toBe("added");
    expect(added?.newValue).toBe("prefers bullet points");
  });

  it("detects removed fields within a section", () => {
    const old = "## Relationship\n- Name: Aman\n- Temp: something\n";
    const updated = "## Relationship\n- Name: Aman\n";
    const diffs = buildDetailedDiff(old, updated);
    const rel = diffs.find((d) => d.name === "Relationship");
    expect(rel?.status).toBe("changed");
    const removed = rel?.fields.find((f) => f.key === "Temp");
    expect(removed?.type).toBe("removed");
  });
});

describe("formatDiff", () => {
  it("shows no changes message when nothing changed", () => {
    const diffs = [{ name: "Session", status: "unchanged" as const, fields: [] }];
    const output = formatDiff(diffs);
    expect(output).toContain("No changes detected");
  });

  it("includes section count and field count summary", () => {
    const diffs = buildDetailedDiff(
      "## Session\n- Last updated: 2026-03-20\n- Resume: old\n",
      "## Session\n- Last updated: 2026-03-22\n- Resume: new\n"
    );
    const output = formatDiff(diffs);
    expect(output).toContain("1 section changed");
    expect(output).toContain("2 fields updated");
  });

  it("includes section and field names in output", () => {
    const diffs = buildDetailedDiff(
      "## Session\n- Resume: old\n",
      "## Session\n- Resume: new\n"
    );
    const output = formatDiff(diffs);
    expect(output).toContain("Session");
    expect(output).toContain("Resume");
  });
});
