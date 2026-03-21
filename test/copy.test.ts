import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { buildMergedOutput } from "../src/commands/copy.js";

describe("copy", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns global content when no local exists", () => {
    const globalDir = path.join(tmpDir, "global");
    fs.mkdirSync(globalDir, { recursive: true });
    fs.writeFileSync(path.join(globalDir, "core.md"), "# Sage\n## Identity\n");

    const result = buildMergedOutput(globalDir, "/nonexistent");
    expect(result).toContain("# Sage");
  });

  it("merges global and local when both exist", () => {
    const globalDir = path.join(tmpDir, "global");
    const localDir = path.join(tmpDir, "local");
    fs.mkdirSync(globalDir, { recursive: true });
    fs.mkdirSync(localDir, { recursive: true });
    fs.writeFileSync(
      path.join(globalDir, "core.md"),
      "# Sage\n## Identity\ntest\n---\n## Session\nglobal session\n"
    );
    fs.writeFileSync(
      path.join(localDir, "context.md"),
      "## Session\nlocal session\n"
    );

    const result = buildMergedOutput(globalDir, localDir);
    expect(result).toContain("local session");
  });
});
