import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { writeUpdate } from "../src/commands/update.js";

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
