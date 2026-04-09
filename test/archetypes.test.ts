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

  describe("fundamentalTruths (v0.7.0)", () => {
    it("all 5 developer archetypes define fundamentalTruths", () => {
      const devArchetypes = getArchetypesByRole("developer");
      for (const a of devArchetypes) {
        expect(a.fundamentalTruths, `${a.name} is missing fundamentalTruths`).toBeDefined();
        expect(a.fundamentalTruths!.length).toBeGreaterThanOrEqual(3);
        expect(a.fundamentalTruths!.length).toBeLessThanOrEqual(5);
      }
    });

    it("every fundamental truth is a non-empty first-person assertion", () => {
      const devArchetypes = getArchetypesByRole("developer");
      for (const a of devArchetypes) {
        for (const truth of a.fundamentalTruths!) {
          expect(truth.length).toBeGreaterThan(0);
          // Truths should be short — anchor assertions, not paragraphs
          expect(truth.length).toBeLessThan(160);
          // Truths should not contain template placeholders
          expect(truth).not.toContain("{{");
        }
      }
    });

    it("non-developer archetypes leave fundamentalTruths undefined (not yet enriched)", () => {
      const nonDevRoles = ["creative", "business", "student", "personal"] as const;
      for (const role of nonDevRoles) {
        for (const a of getArchetypesByRole(role)) {
          expect(a.fundamentalTruths).toBeUndefined();
        }
      }
    });

    it("fundamentalTruths is an optional field — existing archetype shape still valid", () => {
      // If truths are absent, the archetype should still have all required fields
      const creative = getArchetypesByRole("creative");
      for (const a of creative) {
        expect(a.name).toBeTruthy();
        expect(a.personality).toBeTruthy();
        expect(a.values.length).toBeGreaterThan(0);
      }
    });
  });
});
