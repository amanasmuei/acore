import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import {
  getGlobalDir,
  getLocalDir,
  globalConfigExists,
  localConfigExists,
} from "../lib/paths.js";
import { parseMarkdown, findSection } from "../lib/merge.js";
import { loadPlatformConfig, isFileBasedPlatform } from "../lib/platform.js";
import { buildMergedOutput } from "./copy.js";

type CheckLevel = "pass" | "warn" | "error" | "info";

interface CheckResult {
  level: CheckLevel;
  message: string;
}

function estimateTokens(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round(words * 1.3);
}

function formatCheck(result: CheckResult): string {
  switch (result.level) {
    case "pass":
      return `  ${pc.green("✔")} ${result.message}`;
    case "warn":
      return `  ${pc.yellow("⚠")} ${result.message}`;
    case "error":
      return `  ${pc.red("✖")} ${result.message}`;
    case "info":
      return `  ${pc.blue("ℹ")} ${result.message}`;
  }
}

export async function doctorCommand(): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore") + " first."
    );
    process.exit(1);
  }

  p.intro(pc.bold("acore doctor") + " — health check");

  const globalDir = getGlobalDir();
  const localDir = getLocalDir();
  const merged = buildMergedOutput(globalDir, localDir);
  const parsed = parseMarkdown(merged);
  const checks: CheckResult[] = [];

  // --- Required sections ---
  const requiredSections = ["Identity", "Relationship", "Session", "Instructions"];
  for (const name of requiredSections) {
    const section = findSection(parsed, name);
    if (section) {
      checks.push({ level: "pass", message: `${name} section present` });
    } else {
      checks.push({ level: "error", message: `${name} section missing` });
    }
  }

  // --- Token count ---
  const tokens = estimateTokens(merged);
  if (tokens > 2500) {
    checks.push({
      level: "error",
      message: `Token count: ${tokens.toLocaleString()} / 2,000 (over limit — consolidate or move details to amem)`,
    });
  } else if (tokens > 1800) {
    checks.push({
      level: "warn",
      message: `Token count: ${tokens.toLocaleString()} / 2,000 (approaching limit)`,
    });
  } else {
    checks.push({
      level: "pass",
      message: `Token count: ${tokens.toLocaleString()} / 2,000`,
    });
  }

  // --- Stale session ---
  const sessionSection = findSection(parsed, "Session");
  if (sessionSection) {
    const resumeMatch = sessionSection.content.match(/- Resume: (.+)$/m);
    const resumeValue = resumeMatch?.[1]?.trim() || "";
    if (
      resumeValue === "[first session]" ||
      resumeValue === "[starting fresh]" ||
      resumeValue.startsWith("[")
    ) {
      checks.push({
        level: "warn",
        message:
          "Session.Resume still contains a placeholder — update after your next conversation",
      });
    }
  }

  // --- Unfilled placeholders in Identity and Relationship ---
  const identitySection = findSection(parsed, "Identity");
  const relationshipSection = findSection(parsed, "Relationship");
  const placeholderRegex = /\[(?!→)[^\]]*\]/g;
  let hasPlaceholders = false;

  if (identitySection) {
    const matches = identitySection.content.match(placeholderRegex);
    if (matches && matches.length > 0) hasPlaceholders = true;
  }
  if (relationshipSection) {
    const matches = relationshipSection.content.match(placeholderRegex);
    if (matches && matches.length > 0) hasPlaceholders = true;
  }

  if (hasPlaceholders) {
    checks.push({
      level: "warn",
      message: "Unfilled placeholders found in Identity or Relationship sections",
    });
  } else {
    checks.push({ level: "pass", message: "No unfilled placeholders" });
  }

  // --- Missing name ---
  if (relationshipSection) {
    const nameMatch = relationshipSection.content.match(/- Name: (.+)$/m);
    const nameValue = nameMatch?.[1]?.trim() || "";
    if (!nameValue || nameValue.startsWith("[")) {
      checks.push({
        level: "warn",
        message: "Relationship.Name is empty or placeholder",
      });
    }
  }

  // --- Old instructions check ---
  const instructionsSection = findSection(parsed, "Instructions");
  if (instructionsSection) {
    if (!instructionsSection.content.includes("Session Awareness")) {
      checks.push({
        level: "warn",
        message:
          "Instructions section missing 'Session Awareness' (pre-0.3.0 template) — run " +
          pc.bold("acore upgrade"),
      });
    }
  }

  // --- Auto-save check ---
  const platformConfig = loadPlatformConfig();
  if (platformConfig && isFileBasedPlatform(platformConfig.platform)) {
    if (instructionsSection) {
      if (instructionsSection.content.includes("Write updated version directly")) {
        checks.push({
          level: "pass",
          message: "Auto-save instructions: enabled",
        });
      } else {
        checks.push({
          level: "warn",
          message:
            "Auto-save not configured for file-based platform — run " +
            pc.bold("acore upgrade"),
        });
      }
    }
  }

  // --- Platform config ---
  const localConfigPath = path.join(localDir, "config.json");
  if (fs.existsSync(localConfigPath)) {
    if (platformConfig) {
      checks.push({
        level: "pass",
        message: `Platform config: ${platformConfig.platform}`,
      });
    }
  } else {
    checks.push({
      level: "warn",
      message:
        "No platform config found — run " +
        pc.bold("acore") +
        " in a project directory to set up",
    });
  }

  // --- Project context ---
  if (localConfigExists()) {
    checks.push({ level: "pass", message: "Project context present" });
  } else {
    checks.push({
      level: "warn",
      message:
        "No project context (.acore/context.md) — run " +
        pc.bold("acore") +
        " in a project to add one",
    });
  }

  // --- Growth suggestions ---
  const dynamicsSection = findSection(parsed, "Dynamics");
  if (!dynamicsSection) {
    checks.push({
      level: "info",
      message:
        "Consider adding Dynamics — run " +
        pc.bold("acore customize") +
        " → Everything",
    });
  }

  const contextModesSection = findSection(parsed, "Context Modes");
  if (!contextModesSection) {
    checks.push({
      level: "info",
      message:
        "Consider adding Context Modes — run " +
        pc.bold("acore customize") +
        " → Everything",
    });
  }

  const memoryLifecycleSection = findSection(parsed, "Memory Lifecycle");
  if (!memoryLifecycleSection) {
    checks.push({
      level: "info",
      message:
        "Consider adding Memory Lifecycle — run " +
        pc.bold("acore customize") +
        " → Everything",
    });
  }

  // --- Scoring ---
  let score = 10;
  for (const check of checks) {
    if (check.level === "error") score -= 2;
    if (check.level === "warn") score -= 1;
  }
  score = Math.max(0, score);

  // --- Output ---
  const lines = ["", ...checks.map(formatCheck), ""];
  p.note(lines.join("\n"), "");

  const scoreColor =
    score >= 8 ? pc.green : score >= 5 ? pc.yellow : pc.red;
  p.log.info(`Score: ${scoreColor(pc.bold(`${score}/10`))}`);

  const hasWarningsOrErrors = checks.some(
    (c) => c.level === "warn" || c.level === "error"
  );
  if (hasWarningsOrErrors) {
    p.log.info(
      `Run ${pc.bold("acore upgrade")} to refresh your templates.`
    );
  }

  p.outro("Done");
}
