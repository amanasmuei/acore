import fs from "node:fs";
import path from "node:path";
import { getLocalDir } from "./paths.js";

export type InjectPlatform = "claude-code" | "cursor" | "windsurf" | "chatgpt" | "api" | "other";

interface PlatformConfig {
  platform: InjectPlatform;
}

export function savePlatformConfig(platform: InjectPlatform, localDir?: string): void {
  const dir = localDir || getLocalDir();
  fs.mkdirSync(dir, { recursive: true });
  const config: PlatformConfig = { platform };
  fs.writeFileSync(path.join(dir, "config.json"), JSON.stringify(config, null, 2) + "\n", "utf-8");
}

export function loadPlatformConfig(localDir?: string): PlatformConfig | null {
  const dir = localDir || getLocalDir();
  const configPath = path.join(dir, "config.json");
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function getPlatformFile(platform: InjectPlatform): string | null {
  switch (platform) {
    case "claude-code": return "CLAUDE.md";
    case "cursor": return ".cursorrules";
    case "windsurf": return ".windsurfrules";
    default: return null; // web-based, clipboard only
  }
}

export function isFileBasedPlatform(platform: InjectPlatform): boolean {
  return getPlatformFile(platform) !== null;
}
