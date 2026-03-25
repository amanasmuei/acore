import { describe, it, expect } from "vitest";
import { archetypes, getArchetype, getArchetypesByRole } from "../src/lib/archetypes.js";

describe("archetypes", () => {
  it("has 25 predefined archetypes (5 per role)", () => {
    expect(archetypes).toHaveLength(25);
    expect(getArchetypesByRole("developer")).toHaveLength(5);
    expect(getArchetypesByRole("creative")).toHaveLength(5);
    expect(getArchetypesByRole("business")).toHaveLength(5);
    expect(getArchetypesByRole("student")).toHaveLength(5);
    expect(getArchetypesByRole("personal")).toHaveLength(5);
  });

  it("each archetype has required fields", () => {
    for (const a of archetypes) {
      expect(a.name).toBeTruthy();
      expect(a.label).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.personality).toBeTruthy();
      expect(a.communication).toBeTruthy();
      expect(a.values.length).toBeGreaterThan(0);
      expect(a.role).toBeTruthy();
    }
  });

  it("getArchetype returns correct archetype by name", () => {
    const pragmatist = getArchetype("pragmatist");
    expect(pragmatist?.label).toBe("The Pragmatist");
  });

  it("getArchetype returns undefined for unknown name", () => {
    expect(getArchetype("nonexistent")).toBeUndefined();
  });
});
