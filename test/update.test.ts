import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { writeUpdate, diffSections } from "../src/commands/update.js";

describe("update", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes to local context.md by default", () => {
    const localDir = path.join(tmpDir, ".acore");
    fs.mkdirSync(localDir, { recursive: true });
    const input = "## Session\n- Resume: updated content\n";
    writeUpdate(input, localDir);
    const content = fs.readFileSync(path.join(localDir, "context.md"), "utf-8");
    expect(content).toContain("updated content");
  });

  it("writes to global core.md with global flag", () => {
    const globalDir = path.join(tmpDir, ".acore");
    fs.mkdirSync(globalDir, { recursive: true });
    const input = "# Sage\n## Identity\nupdated identity\n";
    writeUpdate(input, globalDir, true);
    const content = fs.readFileSync(path.join(globalDir, "core.md"), "utf-8");
    expect(content).toContain("updated identity");
  });
});

describe("diffSections", () => {
  it("reports new file when no old content", () => {
    const changes = diffSections(null, "## Session\ncontent\n");
    expect(changes).toHaveLength(1);
    expect(changes[0]).toContain("new file");
  });

  it("detects modified sections", () => {
    const old = "## Session\nold content\n## Work\nsame\n";
    const updated = "## Session\nnew content\n## Work\nsame\n";
    const changes = diffSections(old, updated);
    const sessionChange = changes.find((c) => c.includes("Session"));
    const workChange = changes.find((c) => c.includes("Work"));
    expect(sessionChange).toContain("modified");
    expect(workChange).toContain("unchanged");
  });

  it("detects new sections", () => {
    const old = "## Session\ncontent\n";
    const updated = "## Session\ncontent\n## Patterns\nnew stuff\n";
    const changes = diffSections(old, updated);
    const patternsChange = changes.find((c) => c.includes("Patterns"));
    expect(patternsChange).toContain("new");
  });

  it("detects removed sections", () => {
    const old = "## Session\ncontent\n## Old\nstuff\n";
    const updated = "## Session\ncontent\n";
    const changes = diffSections(old, updated);
    const oldChange = changes.find((c) => c.includes("Old"));
    expect(oldChange).toContain("removed");
  });
});
