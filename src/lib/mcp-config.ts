import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export type Platform = "claude-code" | "cursor" | "windsurf";

const AMEM_ENTRY = {
  command: "npx",
  args: ["-y", "@aman_asmuei/amem"],
};

export function getMcpConfigPath(platform: Platform): string {
  switch (platform) {
    case "claude-code":
      return path.join(os.homedir(), ".claude", "settings.json");
    case "cursor":
      return path.join(process.cwd(), ".cursor", "mcp.json");
    case "windsurf":
      return path.join(os.homedir(), ".windsurf", "mcp.json");
  }
}

export function readMcpConfig(configPath: string): Record<string, unknown> {
  if (!fs.existsSync(configPath)) return {};
  const content = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(content);
}

export function hasAmemEntry(configPath: string): boolean {
  const config = readMcpConfig(configPath);
  const servers = (config.mcpServers ?? {}) as Record<string, unknown>;
  return "amem" in servers;
}

export function addAmemEntry(configPath: string): boolean {
  const config = readMcpConfig(configPath);
  const servers = (config.mcpServers ?? {}) as Record<string, unknown>;

  if ("amem" in servers) return false; // already exists

  servers.amem = AMEM_ENTRY;
  config.mcpServers = servers;

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return true;
}

export function removeAmemEntry(configPath: string): boolean {
  if (!fs.existsSync(configPath)) return false;

  const config = readMcpConfig(configPath);
  const servers = (config.mcpServers ?? {}) as Record<string, unknown>;

  if (!("amem" in servers)) return false;

  delete servers.amem;
  config.mcpServers = servers;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return true;
}

export function detectAmemConnection(): { connected: boolean; platform?: string } {
  const platforms: { name: Platform; label: string }[] = [
    { name: "claude-code", label: "Claude Code" },
    { name: "cursor", label: "Cursor" },
    { name: "windsurf", label: "Windsurf" },
  ];

  for (const { name, label } of platforms) {
    const configPath = getMcpConfigPath(name);
    if (hasAmemEntry(configPath)) {
      return { connected: true, platform: label };
    }
  }

  return { connected: false };
}
