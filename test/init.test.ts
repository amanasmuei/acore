import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// We test the buildGlobalConfig and buildLocalConfig helpers
// The interactive prompts are mocked in integration tests

describe("init helpers", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writeGlobalConfig creates ~/.acore/core.md", async () => {
    const { writeGlobalConfig } = await import("../src/commands/init.js");
    const globalDir = path.join(tmpDir, ".acore");

    await writeGlobalConfig(globalDir, {
      aiName: "Sage",
      userName: "Aman",
      userRole: "Software Engineer",
      personality: "concise, practical, efficient",
      communication: "lead with the answer",
      values: ["simplicity over cleverness"],
      boundaries: "flags when out of depth",
    });

    const corePath = path.join(globalDir, "core.md");
    expect(fs.existsSync(corePath)).toBe(true);

    const content = fs.readFileSync(corePath, "utf-8");
    expect(content).toContain("# Sage");
    expect(content).toContain("Aman");
    expect(content).toContain("concise, practical, efficient");
    expect(content).not.toContain("{{");
  });

  it("writeLocalContext creates .acore/context.md", async () => {
    const { writeLocalContext } = await import("../src/commands/init.js");
    const localDir = path.join(tmpDir, ".acore");

    await writeLocalContext(localDir, {
      stack: "TypeScript, React",
      domain: "SaaS",
      focus: "auth system",
    });

    const contextPath = path.join(localDir, "context.md");
    expect(fs.existsSync(contextPath)).toBe(true);

    const content = fs.readFileSync(contextPath, "utf-8");
    expect(content).toContain("TypeScript, React");
    expect(content).not.toContain("{{");
  });

  it("writeGlobalConfig works with starter template", async () => {
    const { writeGlobalConfig } = await import("../src/commands/init.js");
    const globalDir = path.join(tmpDir, ".acore");

    await writeGlobalConfig(globalDir, {
      aiName: "Companion",
      userName: "Aman",
      userRole: "Developer",
      personality: "curious, supportive, adaptive",
      communication: "concise by default, detailed when asked",
      values: ["honesty over comfort", "simplicity over cleverness"],
      boundaries: "won't pretend to be human, flags when out of depth",
    }, "core-starter");

    const corePath = path.join(globalDir, "core.md");
    expect(fs.existsSync(corePath)).toBe(true);

    const content = fs.readFileSync(corePath, "utf-8");
    expect(content).toContain("# Companion");
    expect(content).toContain("Aman");
    expect(content).not.toContain("## Dynamics");
    expect(content).toContain("### Growth Protocol");
  });
});
