import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { detectPlatform, detectStack, detectRole } from "../src/lib/detect.js";

describe("detect", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-detect-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // ─── detectPlatform ───────────────────────────────────────────────────────

  describe("detectPlatform", () => {
    it("returns null when no platform files exist", () => {
      expect(detectPlatform(tmpDir)).toBeNull();
    });

    it("detects claude-code from CLAUDE.md", () => {
      fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
      expect(detectPlatform(tmpDir)).toBe("claude-code");
    });

    it("detects cursor from .cursorrules", () => {
      fs.writeFileSync(path.join(tmpDir, ".cursorrules"), "rules\n");
      expect(detectPlatform(tmpDir)).toBe("cursor");
    });

    it("detects windsurf from .windsurfrules", () => {
      fs.writeFileSync(path.join(tmpDir, ".windsurfrules"), "rules\n");
      expect(detectPlatform(tmpDir)).toBe("windsurf");
    });

    it("reads saved platform from .acore/config.json", () => {
      const acoreDir = path.join(tmpDir, ".acore");
      fs.mkdirSync(acoreDir);
      fs.writeFileSync(
        path.join(acoreDir, "config.json"),
        JSON.stringify({ platform: "cursor" })
      );
      // Also have CLAUDE.md — config.json wins
      fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
      expect(detectPlatform(tmpDir)).toBe("cursor");
    });

    it("returns null when config.json has no platform field", () => {
      const acoreDir = path.join(tmpDir, ".acore");
      fs.mkdirSync(acoreDir);
      fs.writeFileSync(path.join(acoreDir, "config.json"), JSON.stringify({}));
      expect(detectPlatform(tmpDir)).toBeNull();
    });

    it("falls back to file detection when config.json is malformed", () => {
      const acoreDir = path.join(tmpDir, ".acore");
      fs.mkdirSync(acoreDir);
      fs.writeFileSync(path.join(acoreDir, "config.json"), "not-json{{{");
      fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
      expect(detectPlatform(tmpDir)).toBe("claude-code");
    });

    it("prefers CLAUDE.md over .cursorrules when both exist (no config.json)", () => {
      fs.writeFileSync(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
      fs.writeFileSync(path.join(tmpDir, ".cursorrules"), "rules\n");
      expect(detectPlatform(tmpDir)).toBe("claude-code");
    });
  });

  // ─── detectStack ─────────────────────────────────────────────────────────

  describe("detectStack", () => {
    it("returns empty string when no manifest files exist", () => {
      expect(detectStack(tmpDir)).toBe("");
    });

    it("detects TypeScript from tsconfig.json", () => {
      fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), "{}");
      fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ dependencies: {} }));
      expect(detectStack(tmpDir)).toContain("TypeScript");
    });

    it("detects Rust from Cargo.toml", () => {
      fs.writeFileSync(path.join(tmpDir, "Cargo.toml"), "[package]\n");
      expect(detectStack(tmpDir)).toBe("Rust");
    });

    it("detects Go from go.mod", () => {
      fs.writeFileSync(path.join(tmpDir, "go.mod"), "module example.com/foo\n");
      expect(detectStack(tmpDir)).toBe("Go");
    });

    it("detects Python from pyproject.toml", () => {
      fs.writeFileSync(path.join(tmpDir, "pyproject.toml"), "[tool.poetry]\n");
      expect(detectStack(tmpDir)).toBe("Python");
    });

    it("detects Python from requirements.txt", () => {
      fs.writeFileSync(path.join(tmpDir, "requirements.txt"), "requests\n");
      expect(detectStack(tmpDir)).toBe("Python");
    });

    it("detects Ruby from Gemfile", () => {
      fs.writeFileSync(path.join(tmpDir, "Gemfile"), "source 'https://rubygems.org'\n");
      expect(detectStack(tmpDir)).toBe("Ruby");
    });

    it("detects Java from pom.xml", () => {
      fs.writeFileSync(path.join(tmpDir, "pom.xml"), "<project/>\n");
      expect(detectStack(tmpDir)).toBe("Java");
    });

    it("detects Java from build.gradle", () => {
      fs.writeFileSync(path.join(tmpDir, "build.gradle"), "plugins {}\n");
      expect(detectStack(tmpDir)).toBe("Java");
    });

    it("detects Kotlin from build.gradle.kts", () => {
      fs.writeFileSync(path.join(tmpDir, "build.gradle.kts"), "plugins {}\n");
      expect(detectStack(tmpDir)).toBe("Kotlin");
    });

    it("detects Swift from Package.swift", () => {
      fs.writeFileSync(path.join(tmpDir, "Package.swift"), "// swift-tools-version:5.5\n");
      expect(detectStack(tmpDir)).toBe("Swift");
    });

    it("detects React from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { react: "^18.0.0" } })
      );
      const result = detectStack(tmpDir);
      expect(result).toContain("React");
      expect(result).toContain("JavaScript");
    });

    it("detects Next.js from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { next: "^14.0.0" } })
      );
      const result = detectStack(tmpDir);
      expect(result).toContain("Next.js");
    });

    it("detects Vue from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { vue: "^3.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Vue");
    });

    it("detects Nuxt from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { nuxt: "^3.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Nuxt");
    });

    it("detects Svelte from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { svelte: "^4.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Svelte");
    });

    it("detects Express from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { express: "^4.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Express");
    });

    it("detects Fastify from package.json devDependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ devDependencies: { fastify: "^4.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Fastify");
    });

    it("detects Hono from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { hono: "^3.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("Hono");
    });

    it("detects NestJS from package.json dependencies", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { "@nestjs/core": "^10.0.0" } })
      );
      expect(detectStack(tmpDir)).toContain("NestJS");
    });

    it("prepends TypeScript (not JavaScript) when tsconfig.json exists alongside package.json", () => {
      fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), "{}");
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { express: "^4.0.0" } })
      );
      const result = detectStack(tmpDir);
      expect(result).toContain("TypeScript");
      expect(result).not.toContain("JavaScript");
    });

    it("includes JavaScript when package.json exists without tsconfig.json", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { express: "^4.0.0" } })
      );
      const result = detectStack(tmpDir);
      expect(result).toContain("JavaScript");
      expect(result).not.toContain("TypeScript");
    });

    it("returns empty string for plain package.json with no recognized deps", () => {
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { lodash: "^4.0.0" } })
      );
      expect(detectStack(tmpDir)).toBe("");
    });

    it("handles malformed package.json gracefully", () => {
      fs.writeFileSync(path.join(tmpDir, "package.json"), "{{bad json");
      expect(() => detectStack(tmpDir)).not.toThrow();
    });

    it("returns comma-separated string for multiple detections", () => {
      fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), "{}");
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ dependencies: { next: "^14.0.0", express: "^4.0.0" } })
      );
      const result = detectStack(tmpDir);
      expect(result).toContain("TypeScript");
      expect(result).toContain("Next.js");
      expect(result).toContain("Express");
      expect(result).toMatch(/,/);
    });
  });

  // ─── detectRole ──────────────────────────────────────────────────────────

  describe("detectRole", () => {
    it("returns Professional when no manifest files exist", () => {
      expect(detectRole(tmpDir)).toBe("Professional");
    });

    it("returns Developer when package.json exists", () => {
      fs.writeFileSync(path.join(tmpDir, "package.json"), "{}");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when tsconfig.json exists", () => {
      fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), "{}");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when Cargo.toml exists", () => {
      fs.writeFileSync(path.join(tmpDir, "Cargo.toml"), "[package]\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when go.mod exists", () => {
      fs.writeFileSync(path.join(tmpDir, "go.mod"), "module foo\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when pyproject.toml exists", () => {
      fs.writeFileSync(path.join(tmpDir, "pyproject.toml"), "[tool]\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when requirements.txt exists", () => {
      fs.writeFileSync(path.join(tmpDir, "requirements.txt"), "requests\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when Gemfile exists", () => {
      fs.writeFileSync(path.join(tmpDir, "Gemfile"), "source 'https://rubygems.org'\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when pom.xml exists", () => {
      fs.writeFileSync(path.join(tmpDir, "pom.xml"), "<project/>\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when build.gradle exists", () => {
      fs.writeFileSync(path.join(tmpDir, "build.gradle"), "plugins {}\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when build.gradle.kts exists", () => {
      fs.writeFileSync(path.join(tmpDir, "build.gradle.kts"), "plugins {}\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });

    it("returns Developer when Package.swift exists", () => {
      fs.writeFileSync(path.join(tmpDir, "Package.swift"), "// swift\n");
      expect(detectRole(tmpDir)).toBe("Developer");
    });
  });
});
