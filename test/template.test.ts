import { describe, it, expect } from "vitest";
import { loadTemplate, fillTemplate, renderFundamentalTruthsBlock } from "../src/lib/template.js";

describe("template", () => {
  it("loadTemplate reads the global template", () => {
    const content = loadTemplate("core");
    expect(content).toContain("{{AI_NAME}}");
    expect(content).toContain("## Identity");
  });

  it("loadTemplate reads the context template", () => {
    const content = loadTemplate("context");
    expect(content).toContain("{{STACK}}");
    expect(content).toContain("## Domain");
  });

  it("loadTemplate reads the starter template", () => {
    const content = loadTemplate("core-starter");
    expect(content).toContain("{{AI_NAME}}");
    expect(content).toContain("## Identity");
    expect(content).toContain("## Instructions");
    expect(content).toContain("## Session");
    expect(content).toContain("### Growth Protocol");
    // Should NOT contain Dynamics, Context Modes, or Memory Lifecycle sections
    expect(content).not.toContain("## Dynamics");
    expect(content).not.toContain("## Context Modes");
    expect(content).not.toContain("## Memory Lifecycle");
  });

  it("fillTemplate replaces all placeholders", () => {
    const template = "# {{AI_NAME}}\nRole: {{USER_NAME}}'s {{USER_ROLE}}";
    const result = fillTemplate(template, {
      AI_NAME: "Sage",
      USER_NAME: "Aman",
      USER_ROLE: "Software Engineer",
    });
    expect(result).toBe("# Sage\nRole: Aman's Software Engineer");
    expect(result).not.toContain("{{");
  });

  it("fillTemplate leaves unknown placeholders unchanged", () => {
    const template = "{{KNOWN}} and {{UNKNOWN}}";
    const result = fillTemplate(template, { KNOWN: "yes" });
    expect(result).toBe("yes and {{UNKNOWN}}");
  });

  it("core-starter template contains UPDATE_INSTRUCTIONS placeholder", () => {
    const content = loadTemplate("core-starter");
    expect(content).toContain("{{UPDATE_INSTRUCTIONS}}");
  });

  it("core template contains UPDATE_INSTRUCTIONS placeholder", () => {
    const content = loadTemplate("core");
    expect(content).toContain("{{UPDATE_INSTRUCTIONS}}");
  });

  describe("renderFundamentalTruthsBlock (v0.7.0)", () => {
    it("returns empty string when truths is undefined", () => {
      expect(renderFundamentalTruthsBlock(undefined)).toBe("");
    });

    it("returns empty string when truths is an empty array", () => {
      expect(renderFundamentalTruthsBlock([])).toBe("");
    });

    it("renders a full markdown section when truths are provided", () => {
      const block = renderFundamentalTruthsBlock([
        "I lead with the answer.",
        "If I don't know, I say so.",
      ]);
      expect(block).toContain("## Fundamental Truths");
      expect(block).toContain("- I lead with the answer.");
      expect(block).toContain("- If I don't know, I say so.");
      // Includes the re-anchor instruction
      expect(block).toContain("Re-read these");
      // Includes trailing horizontal rule so it slots cleanly between sections
      expect(block).toContain("---");
    });

    it("preserves the order of truths", () => {
      const block = renderFundamentalTruthsBlock([
        "truth one",
        "truth two",
        "truth three",
      ]);
      const one = block.indexOf("truth one");
      const two = block.indexOf("truth two");
      const three = block.indexOf("truth three");
      expect(one).toBeGreaterThan(-1);
      expect(one).toBeLessThan(two);
      expect(two).toBeLessThan(three);
    });

    it("template placeholder collapses to nothing when block is empty", () => {
      const template = loadTemplate("core-starter");
      expect(template).toContain("{{FUNDAMENTAL_TRUTHS_BLOCK}}");
      const filled = fillTemplate(template, {
        AI_NAME: "Sage",
        USER_NAME: "Aman",
        USER_ROLE: "Developer",
        PERSONALITY: "pragmatic",
        COMMUNICATION: "lead with answer",
        VALUES: "shipping, simplicity",
        BOUNDARIES: "honest about limits",
        FUNDAMENTAL_TRUTHS_BLOCK: "",
        DATE: "2026-04-09",
        UPDATE_INSTRUCTIONS: "",
      });
      // Placeholder must be fully consumed
      expect(filled).not.toContain("{{FUNDAMENTAL_TRUTHS_BLOCK}}");
      // And the section must NOT appear since block was empty
      expect(filled).not.toContain("## Fundamental Truths");
    });

    it("template placeholder renders a full section when block is populated", () => {
      const template = loadTemplate("core-starter");
      const block = renderFundamentalTruthsBlock([
        "I lead with the answer.",
        "A working solution today beats an elegant one next week.",
      ]);
      const filled = fillTemplate(template, {
        AI_NAME: "Sage",
        USER_NAME: "Aman",
        USER_ROLE: "Developer",
        PERSONALITY: "pragmatic",
        COMMUNICATION: "lead with answer",
        VALUES: "shipping, simplicity",
        BOUNDARIES: "honest about limits",
        FUNDAMENTAL_TRUTHS_BLOCK: block,
        DATE: "2026-04-09",
        UPDATE_INSTRUCTIONS: "",
      });
      expect(filled).toContain("## Fundamental Truths");
      expect(filled).toContain("- I lead with the answer.");
      // Fundamental Truths should appear between Identity and Relationship
      const identityIdx = filled.indexOf("## Identity");
      const truthsIdx = filled.indexOf("## Fundamental Truths");
      const relationshipIdx = filled.indexOf("## Relationship");
      expect(identityIdx).toBeGreaterThan(-1);
      expect(truthsIdx).toBeGreaterThan(identityIdx);
      expect(relationshipIdx).toBeGreaterThan(truthsIdx);
    });

    it("both templates contain the FUNDAMENTAL_TRUTHS_BLOCK placeholder", () => {
      expect(loadTemplate("core-starter")).toContain("{{FUNDAMENTAL_TRUTHS_BLOCK}}");
      expect(loadTemplate("core")).toContain("{{FUNDAMENTAL_TRUTHS_BLOCK}}");
    });
  });
});
