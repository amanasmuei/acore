import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Create temp dirs that act as "home" and "project"
let tmpHome: string;
let tmpProject: string;

beforeEach(() => {
  tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), "acore-eco-test-"));
  tmpProject = fs.mkdtempSync(path.join(os.tmpdir(), "acore-eco-proj-"));
  // Mock os.homedir to return tmpHome
  vi.spyOn(os, "homedir").mockReturnValue(tmpHome);
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(tmpHome, { recursive: true, force: true });
  fs.rmSync(tmpProject, { recursive: true, force: true });
});

function setupCore(content: string): string {
  const globalDir = path.join(tmpHome, ".acore");
  fs.mkdirSync(globalDir, { recursive: true });
  fs.writeFileSync(path.join(globalDir, "core.md"), content);
  return globalDir;
}

function setupEcosystemFile(
  dir: string,
  filename: string,
  content: string
): void {
  const fullDir = path.join(tmpHome, dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(path.join(fullDir, filename), content);
}

const CORE_CONTENT = "# Sage\n\n## Identity\nI am a test AI.\n";

describe("buildMergedOutput ecosystem integration", () => {
  it("returns only core content when no ecosystem files exist", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("# Sage");
    expect(result).toContain("## Identity");
    expect(result).not.toContain("---\n\n");
  });

  it("appends kit.md with --- separator when it exists", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");
    setupEcosystemFile(".akit", "kit.md", "# Dev Kit\nTools and configs.");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("# Sage");
    expect(result).toContain("---\n\n# Dev Kit\nTools and configs.");
  });

  it("appends flow.md with --- separator when it exists", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");
    setupEcosystemFile(".aflow", "flow.md", "# Workflow\nStep 1: plan.");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("---\n\n# Workflow\nStep 1: plan.");
  });

  it("appends rules.md with --- separator when it exists", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");
    setupEcosystemFile(".arules", "rules.md", "# Rules\nNo magic numbers.");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("---\n\n# Rules\nNo magic numbers.");
  });

  it("appends skills.md with --- separator when it exists", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");
    setupEcosystemFile(".askill", "skills.md", "# Skills\nTypeScript expert.");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("---\n\n# Skills\nTypeScript expert.");
  });

  it("appends all ecosystem files in correct order: kit, flow, rules, skills", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");

    setupEcosystemFile(".akit", "kit.md", "# Kit Content");
    setupEcosystemFile(".aflow", "flow.md", "# Flow Content");
    setupEcosystemFile(".arules", "rules.md", "# Rules Content");
    setupEcosystemFile(".askill", "skills.md", "# Skills Content");

    const result = buildMergedOutput(globalDir, localDir);

    // All ecosystem content should be present
    expect(result).toContain("# Kit Content");
    expect(result).toContain("# Flow Content");
    expect(result).toContain("# Rules Content");
    expect(result).toContain("# Skills Content");

    // Verify order: kit before flow before rules before skills
    const kitIndex = result.indexOf("# Kit Content");
    const flowIndex = result.indexOf("# Flow Content");
    const rulesIndex = result.indexOf("# Rules Content");
    const skillsIndex = result.indexOf("# Skills Content");

    expect(kitIndex).toBeLessThan(flowIndex);
    expect(flowIndex).toBeLessThan(rulesIndex);
    expect(rulesIndex).toBeLessThan(skillsIndex);

    // Each should be preceded by a --- separator
    const separatorCount = (result.match(/---\n\n/g) || []).length;
    expect(separatorCount).toBe(4);
  });

  it("silently skips missing ecosystem files and includes only existing ones", async () => {
    const { buildMergedOutput } = await import("../src/commands/copy.js");
    const globalDir = setupCore(CORE_CONTENT);
    const localDir = path.join(tmpProject, ".acore");

    // Only create kit and skills, skip flow and rules
    setupEcosystemFile(".akit", "kit.md", "# Kit Here");
    setupEcosystemFile(".askill", "skills.md", "# Skills Here");

    const result = buildMergedOutput(globalDir, localDir);

    expect(result).toContain("# Kit Here");
    expect(result).toContain("# Skills Here");
    expect(result).not.toContain("# Flow");
    expect(result).not.toContain("# Rules");

    // Kit should still come before skills
    const kitIndex = result.indexOf("# Kit Here");
    const skillsIndex = result.indexOf("# Skills Here");
    expect(kitIndex).toBeLessThan(skillsIndex);

    // Only 2 ecosystem separators (plus any from core content)
    const parts = result.split("---");
    // core content has no ---, so we expect exactly 2 separators = 3 parts
    expect(parts.length).toBe(3);
  });
});
