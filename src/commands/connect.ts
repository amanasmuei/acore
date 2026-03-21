import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getMcpConfigPath, addAmemEntry, hasAmemEntry } from "../lib/mcp-config.js";
import { getGlobalDir, globalConfigExists } from "../lib/paths.js";
import { parseMarkdown, reassemble } from "../lib/merge.js";
import type { Platform } from "../lib/mcp-config.js";

const FULL_MODE_INSTRUCTIONS = `### amem Integration (full mode)
When amem MCP tools are available:
- Session start: call \`memory_inject\` with current topic to load corrections and decisions
- Session start: read \`amem://corrections\` resource for hard constraints
- During session: call \`memory_store\` for corrections (type: "correction", confidence: 1.0), decisions (type: "decision"), and patterns (type: "pattern")
- During session: call \`memory_recall\` before asking user to repeat something
- Session end: call \`memory_context\` to review what was learned
- Batch save: use \`memory_extract\` to store multiple learnings at once
- Overflow: when core.md approaches size limit, move details to amem via \`memory_store\`, keep \`[→ amem: topic]\` pointer
`;

export function updateCoreInstructions(globalDir: string): boolean {
  const corePath = path.join(globalDir, "core.md");
  if (!fs.existsSync(corePath)) return false;

  const content = fs.readFileSync(corePath, "utf-8");
  const parsed = parseMarkdown(content);

  const instructionsSection = parsed.sections.find((s) => s.name === "Instructions");
  if (!instructionsSection) return false;

  // Replace the amem integration subsection
  const amemRegex = /### amem Integration[^\n]*\n[\s\S]*?(?=###|$)/;
  if (amemRegex.test(instructionsSection.content)) {
    instructionsSection.content = instructionsSection.content.replace(
      amemRegex,
      FULL_MODE_INSTRUCTIONS
    );
  }

  const updated = reassemble(parsed);
  fs.writeFileSync(corePath, updated, "utf-8");
  return true;
}

export async function connectCommand(): Promise<void> {
  p.intro(pc.bold("acore + amem") + " — unified ecosystem");

  if (!globalConfigExists()) {
    p.log.error("No acore config found. Run " + pc.bold("acore") + " first.");
    process.exit(1);
  }

  const platform = (await p.select({
    message: "Which platform are you using?",
    options: [
      { value: "claude-code", label: "Claude Code" },
      { value: "cursor", label: "Cursor" },
      { value: "windsurf", label: "Windsurf" },
    ],
  })) as Platform;

  if (p.isCancel(platform)) process.exit(0);

  const configPath = getMcpConfigPath(platform);

  if (hasAmemEntry(configPath)) {
    p.log.info("amem is already configured for this platform.");
  } else {
    const added = addAmemEntry(configPath);
    if (added) {
      p.log.success(`Added amem to ${pc.dim(configPath)}`);
    }
  }

  // Update core.md Instructions
  const globalDir = getGlobalDir();
  const updated = updateCoreInstructions(globalDir);
  if (updated) {
    p.log.success("Updated core.md Instructions with amem directives");
  }

  p.outro("acore + amem are now connected. Your AI will auto-recall and auto-store memories.");
}
