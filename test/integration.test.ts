import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { writeGlobalConfig, writeLocalContext } from "../src/commands/init.js";
import { buildMergedOutput } from "../src/commands/copy.js";
import { parseSummary } from "../src/commands/show.js";
import { writeUpdate } from "../src/commands/update.js";
import { mergeConfigs, parseMarkdown, findSection } from "../src/lib/merge.js";
import { globalConfigExists, localConfigExists } from "../src/lib/paths.js";
import { loadTemplate, fillTemplate } from "../src/lib/template.js";

describe("integration: full lifecycle", () => {
  let tmpDir: string;
  let globalDir: string;
  let localDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-integration-"));
    globalDir = path.join(tmpDir, "global", ".acore");
    localDir = path.join(tmpDir, "project", ".acore");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("init creates global core.md with filled placeholders", async () => {
    await writeGlobalConfig(globalDir, {
      aiName: "Sage",
      userName: "Aman",
      userRole: "Software Engineer",
      personality: "concise, practical, efficient",
      communication: "lead with the answer",
      values: ["honesty over comfort", "simplicity over cleverness"],
      boundaries: "flags when out of depth",
      role: "developer" as const,
    }, "core");

    const content = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    expect(content).toContain("# Sage");
    expect(content).toContain("Aman");
    expect(content).toContain("Software Engineer");
    expect(content).toContain("concise, practical, efficient");
    expect(content).toContain("honesty over comfort");
    expect(content).not.toContain("{{");
    // Verify all 7 sections exist
    const parsed = parseMarkdown(content);
    const sectionNames = parsed.sections.map(s => s.name);
    expect(sectionNames).toContain("Identity");
    expect(sectionNames).toContain("Relationship");
    expect(sectionNames).toContain("Session");
    expect(sectionNames).toContain("Dynamics");
    expect(sectionNames).toContain("Context Modes");
    expect(sectionNames).toContain("Memory Lifecycle");
    expect(sectionNames).toContain("Instructions");
  });

  it("init creates local context.md with project details", async () => {
    await writeLocalContext(localDir, {
      stack: "TypeScript, React",
      domain: "SaaS",
      focus: "auth system",
    });

    const content = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    expect(content).toContain("TypeScript, React");
    expect(content).toContain("SaaS");
    expect(content).toContain("auth system");
    expect(content).not.toContain("{{");
  });

  it("full lifecycle: init → merge → show", async () => {
    // Step 1: Create global config
    await writeGlobalConfig(globalDir, {
      aiName: "Atlas",
      userName: "Test",
      userRole: "Developer",
      personality: "direct, helpful",
      communication: "concise",
      values: ["honesty over comfort"],
      boundaries: "none",
      role: "developer" as const,
    });

    // Step 2: Create local context
    await writeLocalContext(localDir, {
      stack: "Python, FastAPI",
      domain: "ML",
      focus: "training pipeline",
    });

    // Step 3: Merge
    const globalContent = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    const localContent = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    const merged = mergeConfigs(globalContent, localContent);

    // Verify merge has both global identity and local context
    expect(merged).toContain("# Atlas");
    expect(merged).toContain("direct, helpful");
    expect(merged).toContain("Python, FastAPI");
    expect(merged).toContain("## Identity");
    expect(merged).toContain("## Instructions");

    // Step 4: Parse summary
    const summary = parseSummary(merged);
    expect(summary.aiName).toBe("Atlas");
    expect(summary.userName).toBe("Test");
  });

  it("merge works with global only (no local)", async () => {
    await writeGlobalConfig(globalDir, {
      aiName: "Solo",
      userName: "User",
      userRole: "Engineer",
      personality: "helpful",
      communication: "clear",
      values: ["simplicity over cleverness"],
      boundaries: "none",
      role: "developer" as const,
    });

    const globalContent = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    const merged = mergeConfigs(globalContent, null);
    expect(merged).toContain("# Solo");
    expect(merged).toBe(globalContent);
  });

  it("update writes new content and preserves old via diff", async () => {
    // Create initial local context
    await writeLocalContext(localDir, {
      stack: "Go",
      domain: "Backend",
      focus: "API",
    });

    const oldContent = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    expect(oldContent).toContain("Go");

    // Simulate update
    const newContent = "## Work\n- Stack: Rust\n\n## Session\n- Resume: switched to Rust\n";
    writeUpdate(newContent, localDir);

    const updated = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    expect(updated).toContain("Rust");
    expect(updated).not.toContain("Go");
  });
});

describe("integration: error scenarios", () => {
  it("globalConfigExists returns false for nonexistent path", () => {
    expect(globalConfigExists("/nonexistent/path/that/does/not/exist")).toBe(false);
  });

  it("localConfigExists returns false for nonexistent path", () => {
    expect(localConfigExists("/nonexistent/path/that/does/not/exist")).toBe(false);
  });

  it("template has no unfilled placeholders after full fill", () => {
    const template = loadTemplate("core");
    const filled = fillTemplate(template, {
      AI_NAME: "Test",
      USER_NAME: "User",
      USER_ROLE: "Dev",
      PERSONALITY: "helpful",
      COMMUNICATION: "clear",
      VALUES: "honesty",
      BOUNDARIES: "none",
    });
    expect(filled).not.toContain("{{AI_NAME}}");
    expect(filled).not.toContain("{{USER_NAME}}");
    expect(filled).not.toContain("{{USER_ROLE}}");
    expect(filled).not.toContain("{{PERSONALITY}}");
    expect(filled).not.toContain("{{COMMUNICATION}}");
    expect(filled).not.toContain("{{VALUES}}");
    expect(filled).not.toContain("{{BOUNDARIES}}");
  });

  it("context template has no unfilled placeholders after fill", () => {
    const template = loadTemplate("context");
    const filled = fillTemplate(template, {
      STACK: "TypeScript",
      DOMAIN: "Web",
      FOCUS: "frontend",
      DATE: "2026-03-21",
    });
    expect(filled).not.toContain("{{STACK}}");
    expect(filled).not.toContain("{{DOMAIN}}");
    expect(filled).not.toContain("{{FOCUS}}");
    expect(filled).not.toContain("{{DATE}}");
  });
});

describe("integration: merge edge cases with real templates", () => {
  let tmpDir: string;
  let globalDir: string;
  let localDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-merge-"));
    globalDir = path.join(tmpDir, "global", ".acore");
    localDir = path.join(tmpDir, "project", ".acore");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("merge with real templates produces valid markdown", async () => {
    await writeGlobalConfig(globalDir, {
      aiName: "Sage",
      userName: "Aman",
      userRole: "Engineer",
      personality: "direct",
      communication: "concise",
      values: ["honesty over comfort"],
      boundaries: "none",
      role: "developer" as const,
    }, "core");

    await writeLocalContext(localDir, {
      stack: "TypeScript",
      domain: "SaaS",
      focus: "auth",
    });

    const global = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    const local = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    const merged = mergeConfigs(global, local);

    // Should have local work injected
    expect(merged).toContain("TypeScript");
    // Should NOT have template placeholder
    expect(merged).not.toContain("[expertise, field, or focus area — set per project]");
    // Section order should be preserved
    const parsed = parseMarkdown(merged);
    const names = parsed.sections.map(s => s.name);
    expect(names.indexOf("Identity")).toBeLessThan(names.indexOf("Relationship"));
    expect(names.indexOf("Relationship")).toBeLessThan(names.indexOf("Session"));
    expect(names.indexOf("Session")).toBeLessThan(names.indexOf("Dynamics"));
  });
});
