import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { getGlobalDir, globalConfigExists } from "../lib/paths.js";
import { commitGlobalConfig } from "../lib/history.js";

interface HistoryEntry {
  hash: string;
  date: string;
  message: string;
}

function getHistory(): HistoryEntry[] {
  const dir = getGlobalDir();
  const gitDir = path.join(dir, ".git");

  if (!fs.existsSync(gitDir)) {
    return [];
  }

  try {
    const output = execFileSync(
      "git",
      ["log", "--format=%h %ai %s", "--", "core.md"],
      { cwd: dir, encoding: "utf-8" },
    );

    return output
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        // Format: hash YYYY-MM-DD HH:MM:SS +ZZZZ message
        const match = line.match(/^(\S+)\s+(\d{4}-\d{2}-\d{2})\s+\S+\s+\S+\s+(.+)$/);
        if (!match) return null;
        return {
          hash: match[1],
          date: match[2],
          message: match[3],
        };
      })
      .filter((entry): entry is HistoryEntry => entry !== null);
  } catch {
    return [];
  }
}

function getFileAtCommit(hash: string): string | null {
  const dir = getGlobalDir();
  try {
    return execFileSync("git", ["show", `${hash}:core.md`], {
      cwd: dir,
      encoding: "utf-8",
    });
  } catch {
    return null;
  }
}

export async function historyCommand(options: {
  restore?: string;
}): Promise<void> {
  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore") + " first.",
    );
    process.exit(1);
  }

  const entries = getHistory();

  if (options.restore) {
    // Restore mode
    const hash = options.restore;
    const entry = entries.find((e) => e.hash === hash);

    if (!entry) {
      p.log.error(`Version ${pc.bold(hash)} not found. Run ${pc.bold("acore history")} to see available versions.`);
      process.exit(1);
    }

    const oldContent = getFileAtCommit(hash);
    if (!oldContent) {
      p.log.error(`Could not read version ${pc.bold(hash)}.`);
      process.exit(1);
    }

    const globalDir = getGlobalDir();
    const corePath = path.join(globalDir, "core.md");
    const currentContent = fs.readFileSync(corePath, "utf-8");

    if (oldContent === currentContent) {
      p.log.info("That version is identical to the current one. Nothing to restore.");
      return;
    }

    p.intro(pc.bold("acore history --restore") + " — roll back your identity");

    p.log.info(`Restoring from: ${pc.dim(entry.date)} — ${entry.message}`);

    // Show a simple before/after summary
    const currentLines = currentContent.split("\n").length;
    const oldLines = oldContent.split("\n").length;
    p.log.message(`  Current: ${currentLines} lines`);
    p.log.message(`  Restore: ${oldLines} lines (from ${entry.date})`);

    const confirm = await p.confirm({
      message: "Replace current core.md with this version?",
      initialValue: false,
    });

    if (p.isCancel(confirm) || !confirm) {
      p.log.info("Cancelled.");
      return;
    }

    fs.writeFileSync(corePath, oldContent, "utf-8");
    commitGlobalConfig(`Restored from ${entry.date} (${hash})`);
    p.log.success(`Restored core.md to version from ${pc.dim(entry.date)}`);

    p.outro("Done.");
    return;
  }

  // List mode
  p.intro(pc.bold("acore history") + " — your relationship timeline");

  if (entries.length === 0) {
    p.log.info("No history yet. History is recorded automatically when you use acore commands.");
    p.outro("");
    return;
  }

  const lines = entries.map(
    (e) => `  ${pc.dim(e.date)}  ${e.message}  ${pc.dim(`(${e.hash})`)}`,
  );

  console.log("");
  for (const line of lines) {
    console.log(line);
  }
  console.log("");

  const earliest = entries[entries.length - 1].date;
  p.log.info(
    `${entries.length} version${entries.length === 1 ? "" : "s"} · earliest: ${earliest}`,
  );
  console.log("");
  console.log(
    `  Run ${pc.bold("acore history --restore <hash>")} to roll back to a version`,
  );
  console.log("");

  p.outro("");
}
