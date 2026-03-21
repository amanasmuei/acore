import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { parseMarkdown } from "../lib/merge.js";

export function writeUpdate(
  content: string,
  dir: string,
  isGlobal?: boolean
): void {
  fs.mkdirSync(dir, { recursive: true });
  const filename = isGlobal ? "core.md" : "context.md";
  fs.writeFileSync(path.join(dir, filename), content, "utf-8");
}

export function diffSections(
  oldContent: string | null,
  newContent: string
): string[] {
  if (!oldContent) return ["  + (new file)"];

  const oldParsed = parseMarkdown(oldContent);
  const newParsed = parseMarkdown(newContent);
  const changes: string[] = [];

  const oldNames = new Set(oldParsed.sections.map((s) => s.name));
  const newNames = new Set(newParsed.sections.map((s) => s.name));

  for (const section of newParsed.sections) {
    const oldSection = oldParsed.sections.find((s) => s.name === section.name);
    if (!oldSection) {
      changes.push(pc.green(`  + ${section.name} (new)`));
    } else if (oldSection.content.trim() !== section.content.trim()) {
      changes.push(pc.yellow(`  ~ ${section.name} (modified)`));
    } else {
      changes.push(pc.dim(`  = ${section.name} (unchanged)`));
    }
  }

  for (const name of oldNames) {
    if (!newNames.has(name)) {
      changes.push(pc.red(`  - ${name} (removed)`));
    }
  }

  return changes;
}

export async function updateCommand(options: {
  global?: boolean;
  yes?: boolean;
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

  p.log.info(
    `Paste the AI's updated output below, then press ${pc.bold("Ctrl+D")} when done:`
  );

  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk.toString());
  }
  const input = chunks.join("");

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
  const hasChanges = changes.some((c) => !c.includes("unchanged") && !c.includes("(new file)"));

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
}
