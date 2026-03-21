import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";

export function writeUpdate(
  content: string,
  dir: string,
  isGlobal?: boolean
): void {
  fs.mkdirSync(dir, { recursive: true });
  const filename = isGlobal ? "core.md" : "context.md";
  fs.writeFileSync(path.join(dir, filename), content, "utf-8");
}

export async function updateCommand(options: {
  global?: boolean;
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

  p.log.info(
    `Paste the AI's updated output below, then press ${pc.bold("Ctrl+D")} when done:`
  );

  // Read from stdin
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk.toString());
  }
  const input = chunks.join("");

  if (!input.trim()) {
    p.log.error("No input received.");
    process.exit(1);
  }

  writeUpdate(input, targetDir, isGlobal);
  p.log.success(`Updated ${pc.dim(targetFile)}`);
}
