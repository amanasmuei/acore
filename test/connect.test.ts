import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { updateCoreInstructions } from "../src/commands/connect.js";
import { revertCoreInstructions } from "../src/commands/disconnect.js";

describe("connect", () => {
  let tmpDir: string;
  let globalDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-connect-test-"));
    globalDir = path.join(tmpDir, ".acore");
    fs.mkdirSync(globalDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const sampleCore = `# Sage

## Identity
- Role: Sage is Aman's Engineer

## Instructions

### Update Protocol
When user says "update core":
1. Review conversation

### amem Integration (full mode)
When amem MCP tools are available:
- Session start: call \`memory_recall\` to enrich Dynamics with recent patterns
- During session: call \`memory_store\` for significant observations (not trivial exchanges)

### Without amem (standalone mode)
- All updates via "update core" command
`;

  it("updateCoreInstructions replaces amem section with full mode directives", () => {
    fs.writeFileSync(path.join(globalDir, "core.md"), sampleCore);
    const result = updateCoreInstructions(globalDir);
    expect(result).toBe(true);
    const content = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    expect(content).toContain("memory_inject");
    expect(content).toContain("memory_extract");
    expect(content).toContain("amem://corrections");
    // Preserve other sections
    expect(content).toContain("## Identity");
    expect(content).toContain("### Update Protocol");
    expect(content).toContain("### Without amem");
  });

  it("revertCoreInstructions restores standalone directives", () => {
    // First connect
    fs.writeFileSync(path.join(globalDir, "core.md"), sampleCore);
    updateCoreInstructions(globalDir);
    // Then disconnect
    revertCoreInstructions(globalDir);
    const content = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    expect(content).not.toContain("memory_inject");
    expect(content).not.toContain("memory_extract");
    expect(content).toContain("memory_recall");
    expect(content).toContain("memory_store");
  });

  it("returns false when no core.md exists", () => {
    const emptyDir = path.join(tmpDir, "empty");
    fs.mkdirSync(emptyDir, { recursive: true });
    expect(updateCoreInstructions(emptyDir)).toBe(false);
    expect(revertCoreInstructions(emptyDir)).toBe(false);
  });
});
