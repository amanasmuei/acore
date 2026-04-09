import path from "node:path";
import os from "node:os";
import fs from "node:fs";

/**
 * Get the canonical global directory for acore config.
 *
 * Engine-v1 scope-aware: when `AMAN_MCP_SCOPE` or `ACORE_SCOPE` is set to
 * a "tier:name" value (e.g. "dev:plugin"), config is written to
 * `~/.acore/<tier>/<name>/`. This matches the path convention used by
 * `arules`, `aman-mcp`, and `aman-plugin`.
 *
 * When no scope is set, falls back to the legacy single-tenant
 * `~/.acore/` path. Existing installs keep working unchanged.
 */
export function getGlobalDir(): string {
  const home = os.homedir();
  const scope = process.env.AMAN_MCP_SCOPE || process.env.ACORE_SCOPE;
  if (scope && scope.includes(":")) {
    const [tier, name] = scope.split(":");
    if (tier && name) {
      return path.join(home, ".acore", tier, name);
    }
  }
  return path.join(home, ".acore");
}

/**
 * The legacy single-tenant global directory, ignoring any scope env var.
 * Useful for migration tooling and backwards-compatible reads.
 */
export function getLegacyGlobalDir(): string {
  return path.join(os.homedir(), ".acore");
}

export function getGlobalCorePath(): string {
  return path.join(getGlobalDir(), "core.md");
}

export function getLocalDir(): string {
  return path.join(process.cwd(), ".acore");
}

export function getLocalContextPath(): string {
  return path.join(getLocalDir(), "context.md");
}

export function globalConfigExists(dir?: string): boolean {
  const corePath = dir
    ? path.join(dir, "core.md")
    : getGlobalCorePath();
  return fs.existsSync(corePath);
}

export function localConfigExists(dir?: string): boolean {
  const contextPath = dir
    ? path.join(dir, "context.md")
    : getLocalContextPath();
  return fs.existsSync(contextPath);
}

/**
 * Format an absolute path for display in CLI logs.
 *
 * Collapses the home directory prefix to `~` so messages stay short
 * and readable regardless of which scope is in effect.
 *
 * Examples:
 *   /Users/aman/.acore/core.md              → ~/.acore/core.md
 *   /Users/aman/.acore/dev/plugin/core.md   → ~/.acore/dev/plugin/core.md
 *   /tmp/some-other-path                    → /tmp/some-other-path (unchanged)
 */
export function formatDisplayPath(absolutePath: string): string {
  const home = os.homedir();
  if (absolutePath.startsWith(home + path.sep)) {
    return "~" + absolutePath.slice(home.length);
  }
  if (absolutePath === home) return "~";
  return absolutePath;
}
