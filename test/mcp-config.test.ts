import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { addAmemEntry, removeAmemEntry, hasAmemEntry, readMcpConfig } from "../src/lib/mcp-config.js";

describe("mcp-config", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acore-mcp-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates config file when it doesn't exist", () => {
    const configPath = path.join(tmpDir, "settings.json");
    addAmemEntry(configPath);
    expect(fs.existsSync(configPath)).toBe(true);
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    expect(config.mcpServers.amem.command).toBe("npx");
  });

  it("adds amem to existing config without overwriting", () => {
    const configPath = path.join(tmpDir, "settings.json");
    fs.writeFileSync(configPath, JSON.stringify({ mcpServers: { other: { command: "test" } }, someKey: "preserved" }, null, 2));
    addAmemEntry(configPath);
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    expect(config.mcpServers.amem).toBeDefined();
    expect(config.mcpServers.other).toBeDefined();
    expect(config.someKey).toBe("preserved");
  });

  it("returns false when amem already exists", () => {
    const configPath = path.join(tmpDir, "settings.json");
    addAmemEntry(configPath);
    const result = addAmemEntry(configPath);
    expect(result).toBe(false);
  });

  it("hasAmemEntry returns true when configured", () => {
    const configPath = path.join(tmpDir, "settings.json");
    addAmemEntry(configPath);
    expect(hasAmemEntry(configPath)).toBe(true);
  });

  it("hasAmemEntry returns false when not configured", () => {
    const configPath = path.join(tmpDir, "settings.json");
    expect(hasAmemEntry(configPath)).toBe(false);
  });

  it("removeAmemEntry removes amem and preserves other entries", () => {
    const configPath = path.join(tmpDir, "settings.json");
    fs.writeFileSync(configPath, JSON.stringify({ mcpServers: { amem: { command: "npx" }, other: { command: "test" } } }, null, 2));
    const removed = removeAmemEntry(configPath);
    expect(removed).toBe(true);
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    expect(config.mcpServers.amem).toBeUndefined();
    expect(config.mcpServers.other).toBeDefined();
  });

  it("removeAmemEntry returns false when amem not present", () => {
    const configPath = path.join(tmpDir, "settings.json");
    fs.writeFileSync(configPath, JSON.stringify({ mcpServers: {} }, null, 2));
    expect(removeAmemEntry(configPath)).toBe(false);
  });
});
