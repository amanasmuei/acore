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
import { initCommand } from "./init.js";

export async function resetCommand(): Promise<void> {
  const globalDir = getGlobalDir();
  const localDir = getLocalDir();

  if (!globalConfigExists() && !localConfigExists()) {
    p.log.info("No existing config found. Running init...");
    await initCommand({});
    return;
  }

  const confirm = await p.confirm({
    message:
      "This will archive your current config and start fresh. Continue?",
  });

  if (p.isCancel(confirm) || !confirm) {
    p.log.info("Cancelled.");
    return;
  }

  // Archive existing files
  const timestamp = new Date().toISOString().split("T")[0];

  if (globalConfigExists()) {
    const src = path.join(globalDir, "core.md");
    const dest = path.join(globalDir, `core-archive-${timestamp}.md`);
    fs.copyFileSync(src, dest);
    p.log.info(`Archived ${pc.dim("~/.acore/core.md")}`);
  }

  if (localConfigExists()) {
    const src = path.join(localDir, "context.md");
    const dest = path.join(localDir, `context-archive-${timestamp}.md`);
    fs.copyFileSync(src, dest);
    p.log.info(`Archived ${pc.dim(".acore/context.md")}`);
  }

  // Re-run init
  await initCommand({ global: true });
}
