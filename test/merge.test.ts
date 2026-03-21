import { describe, it, expect } from "vitest";
import { mergeConfigs, parseMarkdown, findSection } from "../src/lib/merge.js";

const globalContent = `# Sage

## Identity
- Role: Sage is Aman's Software Engineer
- Personality: concise, practical, efficient

---

## Relationship
- Name: Aman
- Role: Software Engineer
- Work: [tech stack, domain — set per project]

---

## Session
- Last updated: [date]
- Resume: [starting fresh]

---

## Dynamics

### Trust & Rapport
- Level: 3

---

## Context Modes

### Default
- Tone: casual-professional

---

## Memory Lifecycle

### Size
- Target: under 2000 tokens

---

## Instructions

### Update Protocol
When user says "update core":
1. Review conversation`;

const localContent = `## Work
- Stack: TypeScript, React, Next.js
- Domain: SaaS platform
- Focus: authentication system

## Session
- Last updated: 2026-03-21
- Resume: Working on OAuth integration
- Active topics: auth flow, user roles
- Recent decisions: chose NextAuth.js

## Project Patterns
- Prefers server components over client components`;

describe("mergeConfigs", () => {
  it("returns global only when no local", () => {
    const result = mergeConfigs(globalContent, null);
    expect(result).toBe(globalContent);
  });

  it("injects local Work into Relationship section", () => {
    const result = mergeConfigs(globalContent, localContent);
    expect(result).toContain("Stack: TypeScript, React, Next.js");
    expect(result).toContain("## Relationship");
  });

  it("replaces global Session with local Session", () => {
    const result = mergeConfigs(globalContent, localContent);
    expect(result).toContain("Working on OAuth integration");
    expect(result).toContain("chose NextAuth.js");
  });

  it("preserves all global sections", () => {
    const result = mergeConfigs(globalContent, localContent);
    expect(result).toContain("## Identity");
    expect(result).toContain("## Dynamics");
    expect(result).toContain("## Context Modes");
    expect(result).toContain("## Memory Lifecycle");
    expect(result).toContain("## Instructions");
  });

  it("appends Project Patterns after Relationship", () => {
    const result = mergeConfigs(globalContent, localContent);
    expect(result).toContain("Prefers server components");
  });

  it("handles local with only Session (no Work, no Patterns)", () => {
    const localSessionOnly = `## Session
- Last updated: 2026-03-21
- Resume: Working on something`;
    const result = mergeConfigs(globalContent, localSessionOnly);
    expect(result).toContain("Working on something");
    // Work line should remain unchanged in Relationship
    expect(result).toContain("- Work: [tech stack, domain");
    expect(result).not.toContain("Project Patterns");
  });

  it("handles local with only Work (no Session)", () => {
    const localWorkOnly = `## Work
- Stack: Python, FastAPI
- Domain: ML pipeline`;
    const result = mergeConfigs(globalContent, localWorkOnly);
    expect(result).toContain("Stack: Python, FastAPI");
    // Session should remain global default
    expect(result).toContain("Resume: [starting fresh]");
  });

  it("handles empty local content string", () => {
    const result = mergeConfigs(globalContent, "");
    // Empty string is falsy, should return global
    expect(result).toContain("## Identity");
    expect(result).toContain("## Session");
  });

  it("handles global without Work line in Relationship", () => {
    const globalNoWork = `# Sage

## Identity
- Role: Engineer

## Relationship
- Name: Aman
- Role: Software Engineer

## Session
- Resume: fresh`;
    const localWithWork = `## Work
- Stack: Rust
- Domain: systems`;
    const result = mergeConfigs(globalNoWork, localWithWork);
    // Work content should be appended to Relationship
    expect(result).toContain("Stack: Rust");
    expect(result).toContain("## Relationship");
  });
});

describe("parseMarkdown", () => {
  it("parses preamble and sections", () => {
    const md = "# Title\n\n## Identity\ncontent1\n\n## Session\ncontent2\n";
    const parsed = parseMarkdown(md);
    expect(parsed.preamble).toContain("# Title");
    expect(parsed.sections).toHaveLength(2);
    expect(parsed.sections[0].name).toBe("Identity");
    expect(parsed.sections[1].name).toBe("Session");
  });

  it("handles empty sections", () => {
    const md = "# Title\n## Empty\n## Next\ncontent\n";
    const parsed = parseMarkdown(md);
    expect(parsed.sections).toHaveLength(2);
    expect(parsed.sections[0].content.trim()).toBe("");
  });

  it("handles sections with similar names", () => {
    const md = "## Session\nfirst\n## Session Notes\nsecond\n";
    const parsed = parseMarkdown(md);
    expect(parsed.sections).toHaveLength(2);
    expect(parsed.sections[0].name).toBe("Session");
    expect(parsed.sections[1].name).toBe("Session Notes");
  });
});

describe("findSection", () => {
  it("finds exact section by name", () => {
    const parsed = parseMarkdown("## Identity\ncontent\n## Relationship\nother\n");
    const section = findSection(parsed, "Identity");
    expect(section?.content).toContain("content");
  });

  it("returns undefined for missing section", () => {
    const parsed = parseMarkdown("## Identity\ncontent\n");
    expect(findSection(parsed, "Missing")).toBeUndefined();
  });
});
