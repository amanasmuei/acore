import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getMcpConfigPath, removeAmemEntry } from "../lib/mcp-config.js";
import { getGlobalDir, globalConfigExists } from "../lib/paths.js";
import { parseMarkdown, reassemble } from "../lib/merge.js";
import type { Platform } from "../lib/mcp-config.js";

const STANDALONE_INSTRUCTIONS = `### amem Integration (full mode)
When amem MCP tools are available:
- Session start: call \`memory_recall\` to enrich Dynamics with recent patterns
- During session: call \`memory_store\` for significant observations (not trivial exchanges)
- Session end: call \`memory_context\` to get consolidation candidates, apply lifecycle rules
- Overflow: when core.md approaches size limit, move details to amem via \`memory_store\`, keep \`[→ amem: topic]\` pointer
`;

export function revertCoreInstructions(globalDir: string): boolean {
  const corePath = path.join(globalDir, "core.md");
  if (!fs.existsSync(corePath)) return false;

  const content = fs.readFileSync(corePath, "utf-8");
  const parsed = parseMarkdown(content);

  const instructionsSection = parsed.sections.find((s) => s.name === "Instructions");
  if (!instructionsSection) return false;

  const amemRegex = /### amem Integration[^\n]*\n[\s\S]*?(?=###|$)/;
  if (amemRegex.test(instructionsSection.content)) {
    instructionsSection.content = instructionsSection.content.replace(
      amemRegex,
      STANDALONE_INSTRUCTIONS
    );
  }

  const updated = reassemble(parsed);
  fs.writeFileSync(corePath, updated, "utf-8");
  return true;
}

export async function disconnectCommand(): Promise<void> {
  const confirm = await p.confirm({
    message: "Remove amem integration?",
  });

  if (p.isCancel(confirm) || !confirm) {
    p.log.info("Cancelled.");
    return;
  }

  // Try removing from all platform configs
  const platforms: { name: Platform; label: string }[] = [
    { name: "claude-code", label: "Claude Code" },
    { name: "cursor", label: "Cursor" },
    { name: "windsurf", label: "Windsurf" },
  ];

  let removed = false;
  for (const { name, label } of platforms) {
    const configPath = getMcpConfigPath(name);
    if (removeAmemEntry(configPath)) {
      p.log.success(`Removed amem from ${label} config`);
      removed = true;
    }
  }

  if (!removed) {
    p.log.info("amem was not found in any platform config.");
  }

  // Revert core.md
  if (globalConfigExists()) {
    const globalDir = getGlobalDir();
    revertCoreInstructions(globalDir);
    p.log.success("Reverted core.md Instructions to standalone mode");
  }

  p.log.info("Disconnected. amem memories are preserved — reconnect anytime with " + pc.bold("acore connect"));
}
