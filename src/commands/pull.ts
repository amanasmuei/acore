import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { loadPlatformConfig, getPlatformFile, isFileBasedPlatform } from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";
import { buildMergedOutput } from "./copy.js";
import { readFromClipboard } from "../lib/clipboard.js";
import { diffSections, writeUpdate } from "./update.js";

export async function pullCommand(options: {
  global?: boolean;
  clipboard?: boolean;
  yes?: boolean;
  syncOnly?: boolean;
}): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore init") + " first."
    );
    process.exit(1);
  }

  const isGlobal = options.global || false;
  const targetDir = isGlobal ? getGlobalDir() : getLocalDir();
  const targetFile = isGlobal ? "~/.acore/core.md" : ".acore/context.md";
  const filename = isGlobal ? "core.md" : "context.md";
  const existingPath = path.join(targetDir, filename);

  // --sync-only: just re-inject into platform file, skip reading input
  if (options.syncOnly) {
    const config = loadPlatformConfig();
    if (!config || !isFileBasedPlatform(config.platform)) {
      p.log.error(
        "No file-based platform configured. Run " +
          pc.bold("acore init") +
          " to set one."
      );
      process.exit(1);
    }

    const platformFile = getPlatformFile(config.platform)!;
    const filePath = path.join(process.cwd(), platformFile);
    const merged = buildMergedOutput(getGlobalDir(), getLocalDir());
    const result = injectIntoFile(filePath, merged);

    if (result.created) {
      p.log.success(`Created ${pc.dim(platformFile)} with identity`);
    } else {
      p.log.success(`Synced to ${pc.dim(platformFile)}`);
    }
    return;
  }

  let input: string;

  if (options.clipboard) {
    // Try clipboard, fall back to stdin on error
    try {
      input = await readFromClipboard();
      if (!input.trim()) {
        throw new Error("Clipboard is empty");
      }
      p.log.info("Read from clipboard.");
    } catch {
      p.log.warning("Could not read from clipboard — falling back to stdin.");
      p.log.info(
        `Paste the AI's updated output below, then press ${pc.bold("Ctrl+D")} when done:`
      );
      const chunks: string[] = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk.toString());
      }
      input = chunks.join("");
    }
  } else {
    // Default: read from stdin
    p.log.info(
      `Paste the AI's updated output below, then press ${pc.bold("Ctrl+D")} when done:`
    );
    const chunks: string[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk.toString());
    }
    input = chunks.join("");
  }

  if (!input.trim()) {
    p.log.error("No input received.");
    process.exit(1);
  }

  // Read existing content for diff
  const oldContent = fs.existsSync(existingPath)
    ? fs.readFileSync(existingPath, "utf-8")
    : null;

  // Show diff
  const changes = diffSections(oldContent, input);
  const hasChanges = changes.some(
    (c) => !c.includes("unchanged") && !c.includes("(new file)")
  );

  if (!hasChanges && oldContent) {
    p.log.info("No changes detected.");
    return;
  }

  p.log.message("Changes detected:");
  for (const change of changes) {
    console.log(change);
  }

  // Confirm unless --yes
  if (!options.yes) {
    const confirm = await p.confirm({
      message: "Save changes?",
      initialValue: true,
    });

    if (p.isCancel(confirm) || !confirm) {
      p.log.info("Cancelled.");
      return;
    }
  }

  writeUpdate(input, targetDir, isGlobal);
  p.log.success(`Updated ${pc.dim(targetFile)}`);

  // Auto-sync to platform file if file-based platform configured
  const config = loadPlatformConfig();
  if (config && isFileBasedPlatform(config.platform)) {
    const merged = buildMergedOutput(getGlobalDir(), getLocalDir());
    const platformFile = getPlatformFile(config.platform)!;
    const filePath = path.join(process.cwd(), platformFile);
    injectIntoFile(filePath, merged);
    p.log.success(`Synced to ${pc.dim(platformFile)}`);
  }
}
