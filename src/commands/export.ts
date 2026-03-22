import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, globalConfigExists } from "../lib/paths.js";
import { parseSummary } from "./show.js";
import { archetypes } from "../lib/archetypes.js";
import { loadPlatformConfig } from "../lib/platform.js";
import { copyToClipboard } from "../lib/clipboard.js";

const BASE_URL = "https://amanasmuei.github.io/acore/";

/**
 * Match a personality string from core.md against known archetypes.
 * Returns the archetype name (e.g. "pragmatist") or "collaborator" as default.
 */
function matchArchetype(personality: string): string {
  if (!personality) return "collaborator";
  const lower = personality.toLowerCase();
  for (const a of archetypes) {
    // Check if the personality string matches the archetype's personality description
    if (lower === a.personality.toLowerCase()) return a.name;
    // Check if the personality string contains key words from the archetype
    const keywords = a.personality.toLowerCase().split(",").map((k) => k.trim());
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount >= 2) return a.name;
  }
  // Fallback: check for partial single-keyword matches
  for (const a of archetypes) {
    const keywords = a.personality.toLowerCase().split(",").map((k) => k.trim());
    if (keywords.some((kw) => lower.includes(kw))) return a.name;
  }
  return "collaborator";
}

/**
 * Map platform names from config.json to web wizard platform values.
 */
function mapPlatform(platform: string | null): string {
  if (!platform) return "";
  const mapping: Record<string, string> = {
    "claude-code": "claude-code",
    cursor: "cursor",
    windsurf: "windsurf",
    chatgpt: "chatgpt",
    other: "other",
  };
  return mapping[platform] || "";
}

export async function exportCommand(): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore") + " first."
    );
    process.exit(1);
  }

  const globalDir = getGlobalDir();
  const corePath = path.join(globalDir, "core.md");
  const content = fs.readFileSync(corePath, "utf-8");
  const summary = parseSummary(content);

  const archetype = matchArchetype(summary.personality);
  const platformConfig = loadPlatformConfig();
  const platform = mapPlatform(platformConfig?.platform ?? null);

  // Build URL with query params
  const params = new URLSearchParams();
  if (summary.userName) params.set("name", summary.userName);
  if (summary.aiName) params.set("ai", summary.aiName);
  if (archetype) params.set("personality", archetype);
  if (platform) params.set("platform", platform);

  const url = BASE_URL + "?" + params.toString();

  // Copy to clipboard
  const copied = await copyToClipboard(url);

  // Display nicely
  const lines = [
    "",
    `  ${pc.bold("Shareable identity link")}`,
    "",
    `  ${pc.cyan(url)}`,
    "",
    copied
      ? `  ${pc.green("Copied to clipboard")}`
      : `  ${pc.yellow("Could not copy to clipboard")}`,
    "",
    `  ${pc.dim("Anyone with this link can create the same AI personality.")}`,
    "",
  ];

  p.note(lines.join("\n"), "");
}
