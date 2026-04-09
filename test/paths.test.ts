import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getGlobalDir,
  getLegacyGlobalDir,
  getLocalDir,
  globalConfigExists,
  localConfigExists,
  formatDisplayPath,
} from "../src/lib/paths.js";
import path from "node:path";
import os from "node:os";

describe("paths", () => {
  // Preserve and clear scope env vars so tests are deterministic regardless
  // of the shell the test suite runs from.
  const savedScope = process.env.AMAN_MCP_SCOPE;
  const savedAcoreScope = process.env.ACORE_SCOPE;

  beforeEach(() => {
    delete process.env.AMAN_MCP_SCOPE;
    delete process.env.ACORE_SCOPE;
  });

  afterEach(() => {
    if (savedScope !== undefined) process.env.AMAN_MCP_SCOPE = savedScope;
    else delete process.env.AMAN_MCP_SCOPE;
    if (savedAcoreScope !== undefined) process.env.ACORE_SCOPE = savedAcoreScope;
    else delete process.env.ACORE_SCOPE;
  });

  it("getGlobalDir returns ~/.acore when no scope is set", () => {
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

  describe("scope-aware paths (v0.7.1)", () => {
    it("honors AMAN_MCP_SCOPE=dev:plugin → ~/.acore/dev/plugin", () => {
      process.env.AMAN_MCP_SCOPE = "dev:plugin";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore", "dev", "plugin"));
    });

    it("honors ACORE_SCOPE as a fallback when AMAN_MCP_SCOPE is unset", () => {
      process.env.ACORE_SCOPE = "prod:agent";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore", "prod", "agent"));
    });

    it("AMAN_MCP_SCOPE takes priority over ACORE_SCOPE when both are set", () => {
      process.env.AMAN_MCP_SCOPE = "dev:plugin";
      process.env.ACORE_SCOPE = "prod:other";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore", "dev", "plugin"));
    });

    it("ignores malformed scopes (no colon) and falls back to legacy", () => {
      process.env.AMAN_MCP_SCOPE = "invalid-no-colon";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore"));
    });

    it("ignores scopes with empty tier or name", () => {
      process.env.AMAN_MCP_SCOPE = ":plugin";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore"));
      process.env.AMAN_MCP_SCOPE = "dev:";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore"));
    });

    it("ignores empty-string scopes", () => {
      process.env.AMAN_MCP_SCOPE = "";
      expect(getGlobalDir()).toBe(path.join(os.homedir(), ".acore"));
    });

    it("getLegacyGlobalDir always returns ~/.acore regardless of scope", () => {
      process.env.AMAN_MCP_SCOPE = "dev:plugin";
      expect(getLegacyGlobalDir()).toBe(path.join(os.homedir(), ".acore"));
    });

    it("globalConfigExists is per-scope (strict) when no dir argument is given", () => {
      // With no dir and a scope set, the check should target the scope path,
      // not the legacy path. A nonexistent scope path returns false even if
      // a legacy file exists.
      process.env.AMAN_MCP_SCOPE = "dev:nonexistent-test-scope";
      expect(globalConfigExists()).toBe(false);
    });
  });

  describe("formatDisplayPath (v0.7.2)", () => {
    const home = os.homedir();

    it("collapses the home directory prefix to ~", () => {
      expect(formatDisplayPath(path.join(home, ".acore", "core.md"))).toBe("~/.acore/core.md");
    });

    it("collapses scope-aware paths too", () => {
      expect(formatDisplayPath(path.join(home, ".acore", "dev", "plugin", "core.md"))).toBe(
        "~/.acore/dev/plugin/core.md"
      );
    });

    it("collapses bare home to ~", () => {
      expect(formatDisplayPath(home)).toBe("~");
    });

    it("leaves non-home paths unchanged", () => {
      expect(formatDisplayPath("/tmp/some/other/path")).toBe("/tmp/some/other/path");
    });

    it("does NOT collapse paths that merely start with the home string but are not under home", () => {
      // e.g. if home is /Users/aman, "/Users/aman-other/x" must NOT become "~-other/x"
      const sibling = home + "-other/x";
      expect(formatDisplayPath(sibling)).toBe(sibling);
    });
  });
});
