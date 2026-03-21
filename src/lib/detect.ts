import fs from "node:fs";
import path from "node:path";
import type { InjectPlatform } from "./platform.js";

const CODE_MANIFESTS = [
  "package.json",
  "tsconfig.json",
  "Cargo.toml",
  "go.mod",
  "pyproject.toml",
  "requirements.txt",
  "Gemfile",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Package.swift",
];

const FRAMEWORK_DEPS: Array<[string, string]> = [
  ["react", "React"],
  ["next", "Next.js"],
  ["vue", "Vue"],
  ["nuxt", "Nuxt"],
  ["svelte", "Svelte"],
  ["express", "Express"],
  ["fastify", "Fastify"],
  ["hono", "Hono"],
  ["@nestjs/core", "NestJS"],
];

function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Detect which AI platform is in use for the given directory.
 * Priority:
 *   1. .acore/config.json (saved platform)
 *   2. CLAUDE.md → "claude-code"
 *   3. .cursorrules → "cursor"
 *   4. .windsurfrules → "windsurf"
 *   5. null
 */
export function detectPlatform(cwd?: string): InjectPlatform | null {
  const dir = cwd ?? process.cwd();

  // 1. Check saved config
  const configPath = path.join(dir, ".acore", "config.json");
  if (exists(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (typeof parsed.platform === "string" && parsed.platform.length > 0) {
        return parsed.platform as InjectPlatform;
      }
    } catch {
      // malformed JSON — fall through to file detection
    }
  }

  // 2. File-based detection
  if (exists(path.join(dir, "CLAUDE.md"))) return "claude-code";
  if (exists(path.join(dir, ".cursorrules"))) return "cursor";
  if (exists(path.join(dir, ".windsurfrules"))) return "windsurf";

  return null;
}

/**
 * Detect the tech stack for the given directory.
 * Returns a comma-separated string of detected technologies, or empty string.
 */
export function detectStack(cwd?: string): string {
  const dir = cwd ?? process.cwd();
  const parts: string[] = [];

  const hasTs = exists(path.join(dir, "tsconfig.json"));
  const hasPackageJson = exists(path.join(dir, "package.json"));

  // Non-JS/TS languages (checked before JS ecosystem)
  if (hasTs) parts.push("TypeScript");
  if (exists(path.join(dir, "Cargo.toml"))) parts.push("Rust");
  if (exists(path.join(dir, "go.mod"))) parts.push("Go");
  if (
    exists(path.join(dir, "pyproject.toml")) ||
    exists(path.join(dir, "requirements.txt"))
  ) {
    parts.push("Python");
  }
  if (exists(path.join(dir, "Gemfile"))) parts.push("Ruby");
  if (exists(path.join(dir, "pom.xml")) || exists(path.join(dir, "build.gradle"))) {
    parts.push("Java");
  }
  if (exists(path.join(dir, "build.gradle.kts"))) parts.push("Kotlin");
  if (exists(path.join(dir, "Package.swift"))) parts.push("Swift");

  // JS/TS ecosystem — parse package.json for frameworks
  if (hasPackageJson) {
    let pkgDeps: Record<string, string> = {};
    try {
      const raw = fs.readFileSync(path.join(dir, "package.json"), "utf-8");
      const pkg = JSON.parse(raw) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      pkgDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch {
      // malformed package.json — skip framework detection
    }

    const frameworks: string[] = [];
    for (const [dep, label] of FRAMEWORK_DEPS) {
      if (dep in pkgDeps) {
        frameworks.push(label);
      }
    }

    if (frameworks.length > 0) {
      // Prepend JavaScript only if TypeScript wasn't already added
      if (!hasTs) {
        parts.push("JavaScript");
      }
      parts.push(...frameworks);
    }
  }

  return parts.join(", ");
}

/**
 * Detect the user role based on presence of code manifests.
 * Returns "Developer" if any manifest exists, else "Professional".
 */
export function detectRole(cwd?: string): string {
  const dir = cwd ?? process.cwd();
  const hasManifest = CODE_MANIFESTS.some((manifest) =>
    exists(path.join(dir, manifest))
  );
  return hasManifest ? "Developer" : "Professional";
}
