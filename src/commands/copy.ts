import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { mergeConfigs } from "../lib/merge.js";
import { copyToClipboard } from "../lib/clipboard.js";
import { loadPlatformConfig, getPlatformFile, isFileBasedPlatform } from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";

export function buildMergedOutput(
  globalDir: string,
  localDir: string
): string {
  const globalPath = path.join(globalDir, "core.md");
  const localPath = path.join(localDir, "context.md");

  const globalContent = fs.readFileSync(globalPath, "utf-8");
  const localContent = fs.existsSync(localPath)
    ? fs.readFileSync(localPath, "utf-8")
    : null;

  return mergeConfigs(globalContent, localContent);
}

export async function copyCommand(): Promise<void> {
  const globalDir = getGlobalDir();

  if (!globalConfigExists()) {
    p.log.error("No acore config found. Run " + pc.bold("acore init") + " first.");
    process.exit(1);
  }

  const localDir = getLocalDir();
  const merged = buildMergedOutput(globalDir, localDir);

  const tokenEstimate = Math.round(merged.split(/\s+/).length * 1.3);

  const config = loadPlatformConfig();

  if (config && isFileBasedPlatform(config.platform)) {
    const platformFile = getPlatformFile(config.platform)!;
    const filePath = path.join(process.cwd(), platformFile);
    const result = injectIntoFile(filePath, merged);
    const action = result.created ? "Created" : "Updated";
    p.log.success(`${action} ${pc.dim(platformFile)} (${pc.dim(`~${tokenEstimate} tokens`)})`);
  } else {
    const copied = await copyToClipboard(merged);
    if (copied) {
      p.log.success(
        `Copied core.md to clipboard (${pc.dim(`~${tokenEstimate} tokens`)})`
      );
    } else {
      // Fallback: print to stdout
      console.log(merged);
      p.log.warning("Could not access clipboard — printed above instead");
    }
  }
}
