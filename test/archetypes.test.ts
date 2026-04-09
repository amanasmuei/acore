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

  describe("fundamentalTruths", () => {
    // Roles enriched with Fundamental Truths (as of v0.7.2).
    // Adding a new enriched role = add it here + its population test below.
    const ENRICHED_ROLES = ["developer", "personal"] as const;
    const PENDING_ROLES = ["creative", "business", "student"] as const;

    it.each(ENRICHED_ROLES)("all 5 %s archetypes define fundamentalTruths", (role) => {
      const roleArchetypes = getArchetypesByRole(role);
      expect(roleArchetypes.length).toBe(5);
      for (const a of roleArchetypes) {
        expect(a.fundamentalTruths, `${a.name} is missing fundamentalTruths`).toBeDefined();
        expect(a.fundamentalTruths!.length).toBeGreaterThanOrEqual(3);
        expect(a.fundamentalTruths!.length).toBeLessThanOrEqual(5);
      }
    });

    it("every fundamental truth is a short non-empty first-person assertion", () => {
      for (const role of ENRICHED_ROLES) {
        for (const a of getArchetypesByRole(role)) {
          for (const truth of a.fundamentalTruths!) {
            expect(truth.length).toBeGreaterThan(0);
            // Anchor assertions, not paragraphs
            expect(truth.length).toBeLessThan(160);
            // No template placeholders
            expect(truth).not.toContain("{{");
          }
        }
      }
    });

    it("pending roles leave fundamentalTruths undefined (deferred to follow-up releases)", () => {
      for (const role of PENDING_ROLES) {
        for (const a of getArchetypesByRole(role)) {
          expect(a.fundamentalTruths).toBeUndefined();
        }
      }
    });

    it("fundamentalTruths is an optional field — existing archetype shape still valid for pending roles", () => {
      const creative = getArchetypesByRole("creative");
      for (const a of creative) {
        expect(a.name).toBeTruthy();
        expect(a.personality).toBeTruthy();
        expect(a.values.length).toBeGreaterThan(0);
      }
    });

    // v0.7.2 smoke test — The Companion is the user's own archetype and must
    // always carry truths through releases.
    it("The Companion (user's archetype) has ≥3 Fundamental Truths", () => {
      const companion = getArchetype("companion");
      expect(companion?.fundamentalTruths).toBeDefined();
      expect(companion!.fundamentalTruths!.length).toBeGreaterThanOrEqual(3);
    });
  });
});
