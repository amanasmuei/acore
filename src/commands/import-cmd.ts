import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalCorePath, globalConfigExists } from "../lib/paths.js";
import { readFromClipboard } from "../lib/clipboard.js";

const MARKER_START = "<!-- acore:start -->";
const MARKER_END = "<!-- acore:end -->";

/**
 * Strip content between acore markers from a file's text.
 * Returns the remaining user-authored content.
 */
function stripAcoreSection(content: string): string {
  const startIdx = content.indexOf(MARKER_START);
  const endIdx = content.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) return content;

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + MARKER_END.length);
  return (before + after).replace(/\n{3,}/g, "\n\n").trim();
}

type ImportSource = "clipboard" | "cursorrules" | "windsurfrules" | "claudemd";

interface SourceOption {
  value: ImportSource;
  label: string;
  filePath?: string;
}

function buildSourceOptions(): SourceOption[] {
  const options: SourceOption[] = [
    { value: "clipboard", label: "Clipboard (paste your existing instructions)" },
  ];

  const cursorrules = path.join(process.cwd(), ".cursorrules");
  if (fs.existsSync(cursorrules)) {
    options.push({
      value: "cursorrules",
      label: ".cursorrules in this project",
      filePath: cursorrules,
    });
  }

  const windsurfrules = path.join(process.cwd(), ".windsurfrules");
  if (fs.existsSync(windsurfrules)) {
    options.push({
      value: "windsurfrules",
      label: ".windsurfrules in this project",
      filePath: windsurfrules,
    });
  }

  const claudemd = path.join(process.cwd(), "CLAUDE.md");
  if (fs.existsSync(claudemd)) {
    options.push({
      value: "claudemd",
      label: "CLAUDE.md in this project",
      filePath: claudemd,
    });
  }

  return options;
}

async function readSource(
  source: ImportSource,
  filePath?: string
): Promise<{ content: string; sourceName: string } | null> {
  switch (source) {
    case "clipboard": {
      try {
        const text = await readFromClipboard();
        if (!text || !text.trim()) {
          p.log.error("Clipboard is empty.");
          return null;
        }
        return { content: text.trim(), sourceName: "clipboard" };
      } catch {
        p.log.error("Could not read from clipboard.");
        return null;
      }
    }
    case "cursorrules":
    case "windsurfrules":
    case "claudemd": {
      if (!filePath || !fs.existsSync(filePath)) {
        p.log.error(`File not found: ${filePath}`);
        return null;
      }
      const raw = fs.readFileSync(filePath, "utf-8");
      const content = stripAcoreSection(raw);
      if (!content.trim()) {
        p.log.warn("File only contains acore-managed content. Nothing to import.");
        return null;
      }
      const name = path.basename(filePath);
      return { content: content.trim(), sourceName: name };
    }
  }
}

function appendImportedPreferences(corePath: string, importedContent: string, sourceName: string): void {
  const existing = fs.readFileSync(corePath, "utf-8");

  const section = [
    "",
    "---",
    "",
    "## Imported Preferences",
    "",
    `> Imported from ${sourceName}. Say "update core" to have your AI consolidate them into the right sections.`,
    "",
    importedContent,
    "",
  ].join("\n");

  fs.writeFileSync(corePath, existing.trimEnd() + "\n" + section, "utf-8");
}

export async function importCommand(): Promise<void> {
  p.intro(pc.bold("acore import") + pc.dim(" — bring your existing AI preferences"));

  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore") + " first."
    );
    process.exit(1);
  }

  const sources = buildSourceOptions();

  const selected = await p.select({
    message: "Import from:",
    options: sources.map((s) => ({ value: s.value, label: s.label })),
  });

  if (p.isCancel(selected)) {
    p.outro(pc.dim("Cancelled."));
    return;
  }

  const sourceOption = sources.find((s) => s.value === selected)!;
  const result = await readSource(selected, sourceOption.filePath);

  if (!result) {
    p.outro(pc.dim("Nothing to import."));
    return;
  }

  // Show preview
  const preview = result.content.length > 500
    ? result.content.slice(0, 500) + pc.dim("\n... (truncated)")
    : result.content;

  p.note(preview, "Found preferences");

  const confirm = await p.confirm({
    message: "Merge into your core.md?",
  });

  if (p.isCancel(confirm) || !confirm) {
    p.outro(pc.dim("Cancelled."));
    return;
  }

  const corePath = getGlobalCorePath();
  appendImportedPreferences(corePath, result.content, result.sourceName);

  p.outro(
    pc.green("Updated ") +
      pc.bold("~/.acore/core.md") +
      pc.green(" with imported preferences")
  );
}
