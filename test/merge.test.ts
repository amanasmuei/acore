import { describe, it, expect } from "vitest";
import { mergeConfigs } from "../src/lib/merge.js";

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
});
