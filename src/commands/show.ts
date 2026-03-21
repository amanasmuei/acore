import * as p from "@clack/prompts";
import pc from "picocolors";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { buildMergedOutput } from "./copy.js";
import { detectAmemConnection } from "../lib/mcp-config.js";

export interface CoreSummary {
  aiName: string;
  userName: string;
  userRole: string;
  personality: string;
  trustLevel: string;
  trustTrajectory: string;
  lastUpdated: string;
  resume: string;
  activeTopics: string;
}

export function parseSummary(content: string): CoreSummary {
  const get = (pattern: RegExp): string => {
    const match = content.match(pattern);
    return match?.[1]?.trim() || "";
  };

  return {
    aiName: get(/^# (.+)$/m),
    userName: get(/- Name: (.+)$/m),
    userRole: get(/- Role: .+ is .+'s (.+)$/m) || get(/- Role: (.+)$/m),
    personality: get(/- Personality: (.+)$/m),
    trustLevel: get(/- Level: (.+)$/m),
    trustTrajectory: get(/- Trajectory: (.+)$/m),
    lastUpdated: get(/- Last updated: (.+)$/m),
    resume: get(/- Resume: (.+)$/m),
    activeTopics: get(/- Active topics: (.+)$/m),
  };
}

export async function showCommand(): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error("No acore config found. Run " + pc.bold("acore init") + " first.");
    process.exit(1);
  }

  const globalDir = getGlobalDir();
  const localDir = getLocalDir();
  const merged = buildMergedOutput(globalDir, localDir);
  const summary = parseSummary(merged);

  const tokenEstimate = Math.round(merged.split(/\s+/).length * 1.3);
  const amemStatus = detectAmemConnection();

  const lines = [
    "",
    `  ${pc.bold(summary.aiName)} — core.md`,
    "",
    `  Identity: ${summary.personality || "not set"}`,
    `  User: ${summary.userName} (${summary.userRole})`,
    summary.trustLevel
      ? `  Trust: ${summary.trustLevel}/5 (${summary.trustTrajectory})`
      : "",
    summary.lastUpdated ? `  Last updated: ${summary.lastUpdated}` : "",
    summary.resume && summary.resume !== "[starting fresh]"
      ? `  Resume: ${summary.resume}`
      : "",
    summary.activeTopics && summary.activeTopics !== "[current threads]"
      ? `  Active: ${summary.activeTopics}`
      : "",
    "",
    amemStatus.connected
      ? `  amem: ${pc.green("configured")} (${amemStatus.platform})`
      : `  amem: ${pc.dim("not connected")} — run ${pc.bold("acore connect")}`,
    "",
    `  ${pc.dim(`${tokenEstimate} tokens`)}`,
    "",
  ].filter(Boolean);

  p.note(lines.join("\n"), "");
}
