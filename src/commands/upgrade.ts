import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { writeGlobalConfig } from "./init.js";
import { parseMarkdown, findSection, mergeConfigs } from "../lib/merge.js";
import { loadPlatformConfig, getPlatformFile, isFileBasedPlatform } from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";
import { commitGlobalConfig } from "../lib/history.js";
import type { AcoreIdentity } from "../types.js";

function extractIdentity(content: string): AcoreIdentity {
  const parsed = parseMarkdown(content);
  const aiNameMatch = content.match(/^# (.+)$/m);
  const relSection = findSection(parsed, "Relationship");
  const idSection = findSection(parsed, "Identity");

  return {
    aiName: aiNameMatch?.[1] || "Companion",
    userName: relSection?.content.match(/- Name: (.+)$/m)?.[1] || "",
    userRole: relSection?.content.match(/- Role: (.+)$/m)?.[1] || "",
    role: "custom" as const,
    personality: idSection?.content.match(/- Personality: (.+)$/m)?.[1] || "curious, supportive, adaptive",
    communication: idSection?.content.match(/- Communication: (.+)$/m)?.[1] || "explore ideas together, match your energy",
    values: idSection?.content.match(/- Values: (.+)$/m)?.[1]?.split(",").map((v) => v.trim()).filter(Boolean) || ["understanding over speed"],
    boundaries: idSection?.content.match(/- Boundaries: (.+)$/m)?.[1] || "won't pretend to be human, flags when out of depth",
  };
}

export async function upgradeCommand(): Promise<void> {
  p.intro(pc.bold("acore upgrade") + " — refresh your templates with the latest features");

  if (!globalConfigExists()) {
    p.log.error("No acore config found. Run " + pc.bold("acore") + " first.");
    process.exit(1);
  }

  const globalDir = getGlobalDir();
  const corePath = path.join(globalDir, "core.md");
  const coreContent = fs.readFileSync(corePath, "utf-8");

  // Check if already upgraded
  if (coreContent.includes("Write updated version directly")) {
    p.log.info("Already on the latest template (auto-save instructions present).");
    p.outro("Nothing to do.");
    return;
  }

  // Detect template type
  const parsed = parseMarkdown(coreContent);
  const hasDynamics = !!findSection(parsed, "Dynamics");
  const templateName: "core" | "core-starter" = hasDynamics ? "core" : "core-starter";

  // Extract identity
  const identity = extractIdentity(coreContent);

  // Get saved platform
  const savedPlatform = loadPlatformConfig()?.platform ?? null;

  p.log.info(`Current template: ${pc.bold(templateName)}`);
  p.log.info(`Platform: ${pc.bold(savedPlatform || "not set")}`);
  p.log.info(`Identity: ${pc.bold(identity.aiName)} + ${pc.bold(identity.userName)}`);

  if (isFileBasedPlatform(savedPlatform!)) {
    p.log.info(`Upgrade includes: ${pc.green("auto-save")} — AI writes directly to your files`);
  } else {
    p.log.info(`Upgrade includes: updated session awareness and instructions`);
  }

  const confirm = await p.confirm({
    message: "Regenerate core.md with latest template?",
    initialValue: true,
  });

  if (p.isCancel(confirm) || !confirm) {
    p.log.info("Cancelled.");
    return;
  }

  // Regenerate
  await writeGlobalConfig(globalDir, identity, templateName, savedPlatform);
  commitGlobalConfig("Updated via acore upgrade");
  p.log.success(`Upgraded ${pc.dim("~/.acore/core.md")} to latest template`);

  // Re-sync platform file
  const localDir = getLocalDir();
  const config = loadPlatformConfig();
  if (config && isFileBasedPlatform(config.platform)) {
    const globalContent = fs.readFileSync(corePath, "utf-8");
    const localContextPath = path.join(localDir, "context.md");
    const localContent = fs.existsSync(localContextPath)
      ? fs.readFileSync(localContextPath, "utf-8")
      : null;
    const merged = mergeConfigs(globalContent, localContent);

    const platformFile = getPlatformFile(config.platform)!;
    const filePath = path.join(process.cwd(), platformFile);
    injectIntoFile(filePath, merged);
    p.log.success(`Synced to ${pc.dim(platformFile)}`);
  }

  p.outro("Done.");
}
