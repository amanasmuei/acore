import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { savePlatformConfig, loadPlatformConfig, getPlatformFile, isFileBasedPlatform } from "../src/lib/platform.js";

describe("platform", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-platform-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("saves and loads platform config", () => {
    savePlatformConfig("claude-code", tmpDir);
    const config = loadPlatformConfig(tmpDir);
    expect(config?.platform).toBe("claude-code");
  });

  it("returns null when no config exists", () => {
    expect(loadPlatformConfig(tmpDir)).toBeNull();
  });

  it("getPlatformFile returns correct file for each platform", () => {
    expect(getPlatformFile("claude-code")).toBe("CLAUDE.md");
    expect(getPlatformFile("cursor")).toBe(".cursorrules");
    expect(getPlatformFile("windsurf")).toBe(".windsurfrules");
    expect(getPlatformFile("chatgpt")).toBeNull();
    expect(getPlatformFile("api")).toBeNull();
    expect(getPlatformFile("other")).toBeNull();
  });

  it("isFileBasedPlatform returns true for file-based platforms", () => {
    expect(isFileBasedPlatform("claude-code")).toBe(true);
    expect(isFileBasedPlatform("cursor")).toBe(true);
    expect(isFileBasedPlatform("windsurf")).toBe(true);
    expect(isFileBasedPlatform("chatgpt")).toBe(false);
    expect(isFileBasedPlatform("api")).toBe(false);
  });
});
