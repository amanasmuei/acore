import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadPlatformConfig, getPlatformFile, isFileBasedPlatform } from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { buildMergedOutput } from "./copy.js";
import path from "node:path";

export async function syncCommand(): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error("No acore config found. Run " + pc.bold("acore init") + " first.");
    process.exit(1);
  }

  const config = loadPlatformConfig();
  if (!config || !isFileBasedPlatform(config.platform)) {
    p.log.error("No file-based platform configured. Run " + pc.bold("acore init") + " to set one.");
    process.exit(1);
  }

  const platformFile = getPlatformFile(config.platform)!;
  const filePath = path.join(process.cwd(), platformFile);
  const merged = buildMergedOutput(getGlobalDir(), getLocalDir());

  const result = injectIntoFile(filePath, merged);

  if (result.created) {
    p.log.success(`Created ${pc.dim(platformFile)} with identity`);
  } else {
    p.log.success(`Updated ${pc.dim(platformFile)} with latest identity`);
  }
}
