import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { injectIntoFile, removeFromFile, hasAcoreSection } from "../src/lib/inject.js";

describe("inject", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-inject-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates new file with markers when file doesn't exist", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    const result = injectIntoFile(filePath, "# Sage\nidentity content");
    expect(result.created).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("<!-- acore:start -->");
    expect(content).toContain("# Sage");
    expect(content).toContain("<!-- acore:end -->");
  });

  it("appends to existing file without overwriting", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "# My Project Rules\n\nDo not use any type.\n");
    injectIntoFile(filePath, "# Sage\nidentity");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("# My Project Rules");
    expect(content).toContain("Do not use any type.");
    expect(content).toContain("<!-- acore:start -->");
    expect(content).toContain("# Sage");
  });

  it("replaces existing acore section on re-inject", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "# Rules\n\n<!-- acore:start -->\nold content\n<!-- acore:end -->\n");
    injectIntoFile(filePath, "new content");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("new content");
    expect(content).not.toContain("old content");
    expect(content).toContain("# Rules");
  });

  it("removeFromFile removes acore section", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "# Rules\n\n<!-- acore:start -->\nstuff\n<!-- acore:end -->\n\n# More\n");
    const removed = removeFromFile(filePath);
    expect(removed).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).not.toContain("acore:start");
    expect(content).toContain("# Rules");
    expect(content).toContain("# More");
  });

  it("removeFromFile deletes file if only acore content", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "<!-- acore:start -->\nstuff\n<!-- acore:end -->\n");
    removeFromFile(filePath);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("removeFromFile returns false when no markers", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "# Rules\nno markers here\n");
    expect(removeFromFile(filePath)).toBe(false);
  });

  it("hasAcoreSection detects markers", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "<!-- acore:start -->\nstuff\n<!-- acore:end -->\n");
    expect(hasAcoreSection(filePath)).toBe(true);
  });

  it("hasAcoreSection returns false without markers", () => {
    const filePath = path.join(tmpDir, "CLAUDE.md");
    fs.writeFileSync(filePath, "no markers\n");
    expect(hasAcoreSection(filePath)).toBe(false);
  });
});
