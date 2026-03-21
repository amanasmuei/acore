import { describe, it, expect } from "vitest";
import { loadTemplate, fillTemplate } from "../src/lib/template.js";

describe("template", () => {
  it("loadTemplate reads the global template", () => {
    const content = loadTemplate("core");
    expect(content).toContain("{{AI_NAME}}");
    expect(content).toContain("## Identity");
  });

  it("loadTemplate reads the context template", () => {
    const content = loadTemplate("context");
    expect(content).toContain("{{STACK}}");
    expect(content).toContain("## Work");
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
});
