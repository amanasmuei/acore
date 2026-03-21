import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { writeUpdate, diffSections } from "../src/commands/update.js";

describe("pull helpers", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-pull-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("diffSections detects new file", () => {
    const changes = diffSections(null, "## Identity\ncontent\n");
    expect(changes.some((c) => c.includes("new file"))).toBe(true);
  });

  it("diffSections detects modified section", () => {
    const old = "## Identity\nold content\n";
    const updated = "## Identity\nnew content\n";
    const changes = diffSections(old, updated);
    expect(changes.some((c) => c.includes("modified"))).toBe(true);
  });

  it("diffSections detects unchanged section", () => {
    const content = "## Identity\nsame\n";
    const changes = diffSections(content, content);
    expect(changes.some((c) => c.includes("unchanged"))).toBe(true);
  });

  it("writeUpdate saves to correct directory", () => {
    const dir = path.join(tmpDir, ".acore");
    writeUpdate("# Test", dir, true);
    expect(fs.existsSync(path.join(dir, "core.md"))).toBe(true);
    expect(fs.readFileSync(path.join(dir, "core.md"), "utf-8")).toBe("# Test");
  });

  it("writeUpdate saves context.md when not global", () => {
    const dir = path.join(tmpDir, ".acore");
    writeUpdate("## Session\ntest", dir, false);
    expect(fs.existsSync(path.join(dir, "context.md"))).toBe(true);
  });
});
