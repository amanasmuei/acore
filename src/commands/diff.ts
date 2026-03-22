import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, globalConfigExists } from "../lib/paths.js";
import { parseMarkdown } from "../lib/merge.js";

interface FieldChange {
  type: "added" | "removed" | "changed";
  key: string;
  oldValue?: string;
  newValue?: string;
}

interface SectionDiff {
  name: string;
  status: "added" | "removed" | "changed" | "unchanged";
  fields: FieldChange[];
}

/**
 * Parse key-value fields from a section's content.
 * Handles lines like "- Key: value" and "- Key: value1, value2"
 */
function parseFields(content: string): Map<string, string> {
  const fields = new Map<string, string>();
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^[-*]\s+(.+?):\s+(.+)$/);
    if (match) {
      fields.set(match[1].trim(), match[2].trim());
    }
  }

  return fields;
}

/**
 * Compute field-level diffs between two sections.
 */
function diffFields(oldContent: string, newContent: string): FieldChange[] {
  const oldFields = parseFields(oldContent);
  const newFields = parseFields(newContent);
  const changes: FieldChange[] = [];

  // Check for added and changed fields
  for (const [key, newValue] of newFields) {
    const oldValue = oldFields.get(key);
    if (oldValue === undefined) {
      changes.push({ type: "added", key, newValue });
    } else if (oldValue !== newValue) {
      changes.push({ type: "changed", key, oldValue, newValue });
    }
  }

  // Check for removed fields
  for (const [key, oldValue] of oldFields) {
    if (!newFields.has(key)) {
      changes.push({ type: "removed", key, oldValue });
    }
  }

  return changes;
}

/**
 * Build a detailed diff between two versions of core.md.
 */
export function buildDetailedDiff(
  oldContent: string,
  newContent: string
): SectionDiff[] {
  const oldParsed = parseMarkdown(oldContent);
  const newParsed = parseMarkdown(newContent);
  const diffs: SectionDiff[] = [];

  const oldNames = new Set(oldParsed.sections.map((s) => s.name));
  const newNames = new Set(newParsed.sections.map((s) => s.name));

  for (const section of newParsed.sections) {
    const oldSection = oldParsed.sections.find((s) => s.name === section.name);
    if (!oldSection) {
      diffs.push({
        name: section.name,
        status: "added",
        fields: [],
      });
    } else if (oldSection.content.trim() !== section.content.trim()) {
      const fields = diffFields(oldSection.content, section.content);
      diffs.push({
        name: section.name,
        status: "changed",
        fields,
      });
    } else {
      diffs.push({
        name: section.name,
        status: "unchanged",
        fields: [],
      });
    }
  }

  for (const name of oldNames) {
    if (!newNames.has(name)) {
      diffs.push({
        name,
        status: "removed",
        fields: [],
      });
    }
  }

  return diffs;
}

/**
 * Format detailed diff for display.
 */
export function formatDiff(diffs: SectionDiff[]): string {
  const lines: string[] = [];
  let sectionsChanged = 0;
  let fieldsUpdated = 0;

  for (const diff of diffs) {
    if (diff.status === "unchanged") continue;

    sectionsChanged++;

    if (diff.status === "added") {
      lines.push("");
      lines.push(pc.green(`  ${diff.name}`));
      lines.push(pc.green(`    + (new section)`));
      fieldsUpdated++;
    } else if (diff.status === "removed") {
      lines.push("");
      lines.push(pc.red(`  ${diff.name}`));
      lines.push(pc.red(`    - (section removed)`));
      fieldsUpdated++;
    } else if (diff.status === "changed") {
      lines.push("");
      lines.push(`  ${pc.bold(diff.name)}`);

      if (diff.fields.length === 0) {
        // Content changed but no structured field changes detected
        lines.push(pc.yellow(`    ~ (content modified)`));
        fieldsUpdated++;
      } else {
        for (const field of diff.fields) {
          fieldsUpdated++;
          if (field.type === "added") {
            lines.push(
              pc.green(`    + ${field.key}: ${field.newValue}`)
            );
          } else if (field.type === "removed") {
            lines.push(
              pc.red(`    - ${field.key}: ${field.oldValue}`)
            );
          } else if (field.type === "changed") {
            lines.push(
              pc.yellow(
                `    ~ ${field.key}: ${field.oldValue} → ${field.newValue}`
              )
            );
          }
        }
      }
    }
  }

  if (sectionsChanged === 0) {
    return pc.dim("  No changes detected.");
  }

  lines.push("");
  lines.push(
    pc.dim(
      `  ${sectionsChanged} section${sectionsChanged !== 1 ? "s" : ""} changed, ${fieldsUpdated} field${fieldsUpdated !== 1 ? "s" : ""} updated`
    )
  );

  return lines.join("\n");
}

export function diffCommand(): void {
  const header = pc.bold("acore diff") + " — see what changed";
  console.log(`\n${pc.cyan("◆")} ${header}\n`);

  if (!globalConfigExists()) {
    p.log.error(
      "No acore config found. Run " + pc.bold("acore") + " first."
    );
    process.exit(1);
  }

  const globalDir = getGlobalDir();
  const currentPath = path.join(globalDir, "core.md");
  const prevPath = path.join(globalDir, "core.md.prev");

  if (!fs.existsSync(prevPath)) {
    p.log.warning(
      "No previous version found. Run " +
        pc.bold("acore pull") +
        " or " +
        pc.bold("acore upgrade") +
        " to create a diff baseline."
    );
    return;
  }

  const currentContent = fs.readFileSync(currentPath, "utf-8");
  const prevContent = fs.readFileSync(prevPath, "utf-8");

  if (currentContent === prevContent) {
    console.log(pc.dim("  No changes since last update."));
    return;
  }

  const diffs = buildDetailedDiff(prevContent, currentContent);
  console.log(formatDiff(diffs));
}
