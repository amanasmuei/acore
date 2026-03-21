import { describe, it, expect } from "vitest";
import { getGlobalDir, getLocalDir, globalConfigExists, localConfigExists } from "../src/lib/paths.js";
import path from "node:path";
import os from "node:os";

describe("paths", () => {
  it("getGlobalDir returns ~/.acore", () => {
    const result = getGlobalDir();
    expect(result).toBe(path.join(os.homedir(), ".acore"));
  });

  it("getLocalDir returns .acore in cwd", () => {
    const result = getLocalDir();
    expect(result).toBe(path.join(process.cwd(), ".acore"));
  });

  it("globalConfigExists returns false when no file", () => {
    const result = globalConfigExists("/nonexistent/path");
    expect(result).toBe(false);
  });

  it("localConfigExists returns false when no file", () => {
    const result = localConfigExists("/nonexistent/path");
    expect(result).toBe(false);
  });
});
