import { describe, it, expect } from "vitest";
import { archetypes, getArchetype } from "../src/lib/archetypes.js";

describe("archetypes", () => {
  it("has 5 predefined archetypes", () => {
    expect(archetypes).toHaveLength(5);
  });

  it("each archetype has required fields", () => {
    for (const a of archetypes) {
      expect(a.name).toBeTruthy();
      expect(a.label).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.personality).toBeTruthy();
      expect(a.communication).toBeTruthy();
      expect(a.values.length).toBeGreaterThan(0);
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
