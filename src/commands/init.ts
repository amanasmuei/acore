import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { loadTemplate, fillTemplate } from "../lib/template.js";
import { archetypes } from "../lib/archetypes.js";
import { getGlobalDir, getLocalDir, globalConfigExists, localConfigExists } from "../lib/paths.js";
import { copyToClipboard } from "../lib/clipboard.js";
import { mergeConfigs } from "../lib/merge.js";
import type { AcoreIdentity, AcoreContext } from "../types.js";

export async function writeGlobalConfig(
  globalDir: string,
  identity: AcoreIdentity
): Promise<void> {
  fs.mkdirSync(globalDir, { recursive: true });

  const template = loadTemplate("core");
  const content = fillTemplate(template, {
    AI_NAME: identity.aiName,
    USER_NAME: identity.userName,
    USER_ROLE: identity.userRole,
    PERSONALITY: identity.personality,
    COMMUNICATION: identity.communication,
    VALUES: identity.values.join(", "),
    BOUNDARIES: identity.boundaries,
  });

  fs.writeFileSync(path.join(globalDir, "core.md"), content, "utf-8");
}

export async function writeLocalContext(
  localDir: string,
  context: AcoreContext
): Promise<void> {
  fs.mkdirSync(localDir, { recursive: true });

  const template = loadTemplate("context");
  const today = new Date().toISOString().split("T")[0];
  const content = fillTemplate(template, {
    STACK: context.stack,
    DOMAIN: context.domain,
    FOCUS: context.focus,
    DATE: today,
  });

  fs.writeFileSync(path.join(localDir, "context.md"), content, "utf-8");
}

async function runFullWizard(): Promise<{
  identity: AcoreIdentity;
  context: AcoreContext;
}> {
  const aiName = (await p.text({
    message: "What should your AI be called?",
    placeholder: "Sage",
    validate: (v) => (v.length === 0 ? "Name is required" : undefined),
  })) as string;

  if (p.isCancel(aiName)) process.exit(0);

  const userName = (await p.text({
    message: "What's your name?",
    validate: (v) => (v.length === 0 ? "Name is required" : undefined),
  })) as string;

  if (p.isCancel(userName)) process.exit(0);

  const userRole = (await p.text({
    message: "What do you do?",
    placeholder: "Software Engineer",
    validate: (v) => (v.length === 0 ? "Role is required" : undefined),
  })) as string;

  if (p.isCancel(userRole)) process.exit(0);

  const archetypeOptions = [
    ...archetypes.map((a) => ({
      value: a.name,
      label: `${a.label} — ${a.description}`,
    })),
    { value: "custom", label: "Custom..." },
  ];

  const archetypeChoice = (await p.select({
    message: "Pick a personality archetype:",
    options: archetypeOptions,
  })) as string;

  if (p.isCancel(archetypeChoice)) process.exit(0);

  let personality: string;
  let communication: string;
  let values: string[];

  if (archetypeChoice === "custom") {
    personality = (await p.text({
      message: "Personality traits (comma-separated):",
      placeholder: "curious, direct, pragmatic",
    })) as string;
    if (p.isCancel(personality)) process.exit(0);

    communication = (await p.text({
      message: "Communication style:",
      placeholder: "concise by default, detailed when asked",
    })) as string;
    if (p.isCancel(communication)) process.exit(0);

    const valuesInput = (await p.text({
      message: "Values (comma-separated):",
      placeholder: "honesty over comfort, simplicity over cleverness",
    })) as string;
    if (p.isCancel(valuesInput)) process.exit(0);

    values = valuesInput.split(",").map((v) => v.trim());
  } else {
    const archetype = archetypes.find((a) => a.name === archetypeChoice)!;
    personality = archetype.personality;
    communication = archetype.communication;
    values = archetype.values;
  }

  if (archetypeChoice === "custom") {
    const communicationStyle = (await p.select({
      message: `How should ${aiName} talk to you?`,
      options: [
        { value: "concise by default, detailed when asked", label: "Concise by default, detailed when asked" },
        { value: "always thorough and detailed", label: "Always thorough and detailed" },
        { value: "match my energy and pace", label: "Match my energy and pace" },
      ],
    })) as string;

    if (p.isCancel(communicationStyle)) process.exit(0);
    communication = communicationStyle;
  }

  const selectedValues = (await p.multiselect({
    message: "What matters more?",
    options: [
      { value: "honesty over comfort", label: "Honesty over comfort" },
      { value: "simplicity over cleverness", label: "Simplicity over cleverness" },
      { value: "shipping over perfection", label: "Shipping over perfection" },
      { value: "understanding over speed", label: "Understanding over speed" },
      { value: "safety over velocity", label: "Safety over velocity" },
    ],
    initialValues: values,
  })) as string[];

  if (p.isCancel(selectedValues)) process.exit(0);
  values = selectedValues;

  const boundaries = (await p.text({
    message: "Any hard boundaries for the AI? (optional)",
    placeholder: "won't pretend to be human, flags when out of depth",
    defaultValue: "won't pretend to be human, flags when out of depth",
  })) as string;

  if (p.isCancel(boundaries)) process.exit(0);

  // Platform tip
  const platform = (await p.select({
    message: "Where will you use this? (for tips)",
    options: [
      { value: "claude-code", label: "Claude Code / Cursor / Windsurf" },
      { value: "chatgpt", label: "ChatGPT" },
      { value: "api", label: "API (OpenAI, Anthropic, etc.)" },
      { value: "skip", label: "Skip" },
    ],
  })) as string;

  if (p.isCancel(platform)) process.exit(0);

  // Project context
  const stack = (await p.text({
    message: "What's the tech stack for this project? (optional)",
    placeholder: "TypeScript, React, Next.js",
    defaultValue: "",
  })) as string;

  if (p.isCancel(stack)) process.exit(0);

  const domain = (await p.text({
    message: "What domain is this project in? (optional)",
    placeholder: "SaaS platform",
    defaultValue: "",
  })) as string;

  if (p.isCancel(domain)) process.exit(0);

  const identity: AcoreIdentity = {
    aiName,
    userName,
    userRole,
    personality,
    communication,
    values,
    boundaries,
  };

  const context: AcoreContext = {
    stack: stack || "not specified yet",
    domain: domain || "",
    focus: "",
  };

  return { identity, context };
}

async function runProjectWizard(globalDir: string): Promise<AcoreContext> {
  const globalCore = fs.readFileSync(
    path.join(globalDir, "core.md"),
    "utf-8"
  );

  // Extract AI name and user name from global config
  const aiNameMatch = globalCore.match(/^# (.+)$/m);
  const userNameMatch = globalCore.match(/- Name: (.+)$/m);
  const aiName = aiNameMatch?.[1] || "your AI";
  const userName = userNameMatch?.[1] || "you";

  p.note(`Identity loaded: ${pc.bold(aiName)} + ${pc.bold(userName)}`);

  const stack = (await p.text({
    message: "What's the tech stack for this project?",
    placeholder: "TypeScript, React, Next.js",
    validate: (v) => (v.length === 0 ? "Tech stack is required" : undefined),
  })) as string;

  if (p.isCancel(stack)) process.exit(0);

  const domain = (await p.text({
    message: "What domain is this project in? (optional)",
    placeholder: "SaaS platform",
    defaultValue: "",
  })) as string;

  if (p.isCancel(domain)) process.exit(0);

  const focus = (await p.text({
    message: "What are you working on? (optional)",
    placeholder: "authentication system",
    defaultValue: "",
  })) as string;

  if (p.isCancel(focus)) process.exit(0);

  return { stack, domain: domain || "", focus: focus || "" };
}

function showPlatformTip(platform: string): void {
  const tips: Record<string, string> = {
    "claude-code": "Add to your project's CLAUDE.md file.\n  Claude Code reads it automatically.",
    chatgpt: "Go to Settings → Personalization → Custom Instructions.\n  Paste the clipboard contents there.",
    api: 'Pass as the "system" message in your API call.',
  };

  const tip = tips[platform];
  if (tip) {
    const amemTip = "\n\n  Want auto-memory? Run:\n  npx @aman_asmuei/amem";
    p.note(tip + amemTip, "Platform tip");
  }
}

export async function initCommand(options: { global?: boolean }): Promise<void> {
  p.intro(pc.bold("acore") + " — give your AI a soul");

  const globalDir = getGlobalDir();
  const localDir = getLocalDir();
  const hasGlobal = globalConfigExists();

  if (options.global || !hasGlobal) {
    // Full wizard
    const { identity, context } = await runFullWizard();

    await writeGlobalConfig(globalDir, identity);
    p.log.success(`Created ${pc.dim("~/.acore/core.md")} (identity)`);

    if (context.stack && context.stack !== "not specified yet") {
      await writeLocalContext(localDir, context);
      p.log.success(`Created ${pc.dim(".acore/context.md")} (project)`);
    }

    // Merge and copy
    const globalContent = fs.readFileSync(
      path.join(globalDir, "core.md"),
      "utf-8"
    );
    const localPath = path.join(localDir, "context.md");
    const localContent = fs.existsSync(localPath)
      ? fs.readFileSync(localPath, "utf-8")
      : null;

    const merged = mergeConfigs(globalContent, localContent);
    const copied = await copyToClipboard(merged);

    if (copied) {
      p.log.success("Copied to clipboard");
    } else {
      p.log.warning("Could not copy to clipboard — print with: acore show");
    }

    p.outro("Paste into your AI's system prompt. That's it.");
  } else {
    // Project-only wizard
    if (localConfigExists()) {
      const overwrite = await p.confirm({
        message: ".acore/context.md already exists. Overwrite?",
      });
      if (p.isCancel(overwrite) || !overwrite) {
        p.log.info("Cancelled.");
        return;
      }
    }

    const context = await runProjectWizard(globalDir);
    await writeLocalContext(localDir, context);
    p.log.success(`Created ${pc.dim(".acore/context.md")}`);

    // Merge and copy
    const globalContent = fs.readFileSync(
      path.join(globalDir, "core.md"),
      "utf-8"
    );
    const localContent = fs.readFileSync(
      path.join(localDir, "context.md"),
      "utf-8"
    );
    const merged = mergeConfigs(globalContent, localContent);
    const copied = await copyToClipboard(merged);

    if (copied) {
      p.log.success("Copied to clipboard");
    }

    p.outro("Paste into your AI's system prompt. That's it.");
  }
}
