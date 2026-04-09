import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { loadTemplate, fillTemplate, renderFundamentalTruthsBlock } from "../lib/template.js";
import { getDefaultArchetype, getArchetypesByRole } from "../lib/archetypes.js";
import { getGlobalDir, getLocalDir, globalConfigExists, localConfigExists } from "../lib/paths.js";
import { copyToClipboard } from "../lib/clipboard.js";
import { savePlatformConfig, getPlatformFile, isFileBasedPlatform, type InjectPlatform } from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";
import { detectPlatform, detectStack, detectUserName, detectUserRole, detectDomain } from "../lib/detect.js";
import { getUpdateInstructions } from "../lib/instructions.js";
import { commitGlobalConfig } from "../lib/history.js";
import { buildMergedOutput } from "./copy.js";
import type { AcoreIdentity, AcoreContext, UserRole } from "../types.js";
import { USER_ROLES } from "../types.js";

export async function writeGlobalConfig(
  globalDir: string,
  identity: AcoreIdentity,
  templateName: "core" | "core-starter" = "core-starter",
  platform?: InjectPlatform | null,
): Promise<void> {
  fs.mkdirSync(globalDir, { recursive: true });

  // Save backup for `acore diff`
  const corePath = path.join(globalDir, "core.md");
  if (fs.existsSync(corePath)) {
    fs.copyFileSync(corePath, path.join(globalDir, "core.md.prev"));
  }

  const template = loadTemplate(templateName);
  const content = fillTemplate(template, {
    AI_NAME: identity.aiName,
    USER_NAME: identity.userName,
    USER_ROLE: identity.userRole,
    PERSONALITY: identity.personality,
    COMMUNICATION: identity.communication,
    VALUES: identity.values.join(", "),
    BOUNDARIES: identity.boundaries,
    FUNDAMENTAL_TRUTHS_BLOCK: renderFundamentalTruthsBlock(identity.fundamentalTruths),
    DATE: new Date().toISOString().split("T")[0],
    UPDATE_INSTRUCTIONS: getUpdateInstructions(platform ?? null),
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

async function runQuickSetup(): Promise<{
  identity: AcoreIdentity;
  context: AcoreContext;
  platform: InjectPlatform | null;
}> {
  // Try git config first for zero-question setup
  let userName = detectUserName();

  if (!userName) {
    const prompted = (await p.text({
      message: "What's your name?",
      validate: (v) => (v.length === 0 ? "Name is required" : undefined),
    })) as string;

    if (p.isCancel(prompted)) process.exit(0);
    userName = prompted;
  }

  const platform = detectPlatform();
  const detectedRole = detectUserRole();
  const domain = detectDomain(detectedRole);

  // Confirm role (pre-selected to detected value) — user can change it here
  // instead of finding out later via `acore customize`.
  const roleOptions = USER_ROLES.filter((r) => r.value !== "custom").map((r) => ({
    value: r.value,
    label: r.label,
    hint: r.hint,
  }));

  const role = (await p.select({
    message: "What role should your AI help with?",
    initialValue: detectedRole,
    options: roleOptions,
  })) as UserRole;

  if (p.isCancel(role)) process.exit(0);

  // Offer 5 archetype presets for this role, plus a Custom escape hatch.
  const roleArchetypes = getArchetypesByRole(role);
  const defaultArchetypeName = getDefaultArchetype(role).name;
  const archetypeOptions = [
    ...roleArchetypes.map((a) => ({
      value: a.name,
      label: a.label,
      hint: a.description,
    })),
    { value: "custom", label: "Custom", hint: "define your own traits" },
  ];

  const selectedArchetype = (await p.select({
    message: "Choose your AI's personality",
    initialValue: defaultArchetypeName,
    options: archetypeOptions,
  })) as string;

  if (p.isCancel(selectedArchetype)) process.exit(0);

  let personality: string;
  let communication: string;
  let values: string[];
  let fundamentalTruths: string[] | undefined;

  if (selectedArchetype === "custom") {
    const personalityInput = (await p.text({
      message: "Describe the personality",
      placeholder: "curious, direct, witty",
      validate: (v) => (v.length === 0 ? "Personality is required" : undefined),
    })) as string;

    if (p.isCancel(personalityInput)) process.exit(0);

    const communicationInput = (await p.text({
      message: "Describe the communication style",
      placeholder: "ask clarifying questions, use examples",
      validate: (v) => (v.length === 0 ? "Communication style is required" : undefined),
    })) as string;

    if (p.isCancel(communicationInput)) process.exit(0);

    const valuesInput = (await p.text({
      message: "Core values (comma-separated)",
      placeholder: "honesty over comfort, shipping over perfection",
      validate: (v) => (v.length === 0 ? "At least one value is required" : undefined),
    })) as string;

    if (p.isCancel(valuesInput)) process.exit(0);

    personality = personalityInput;
    communication = communicationInput;
    values = valuesInput
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    // Custom archetypes don't ship with pre-written Fundamental Truths.
    fundamentalTruths = undefined;
  } else {
    const archetype =
      roleArchetypes.find((a) => a.name === selectedArchetype) ?? getDefaultArchetype(role);
    personality = archetype.personality;
    communication = archetype.communication;
    values = archetype.values;
    fundamentalTruths = archetype.fundamentalTruths;
  }

  const roleLabel = USER_ROLES.find((r) => r.value === role)?.label ?? "Professional";

  const identity: AcoreIdentity = {
    aiName: "Companion",
    userName,
    userRole: roleLabel,
    role,
    personality,
    communication,
    values,
    boundaries: "won't pretend to be human, flags when out of depth",
    fundamentalTruths,
  };

  const context: AcoreContext = {
    stack: domain || "not specified yet",
    domain: "",
    focus: "",
  };

  return { identity, context, platform };
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
    message: "What's your expertise or tools for this project?",
    placeholder: "e.g. TypeScript, React / creative writing / financial analysis",
    validate: (v) => (v.length === 0 ? "Expertise is required" : undefined),
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

function platformLabel(platform: InjectPlatform): string {
  const labels: Record<string, string> = {
    "claude-code": "Claude Code",
    cursor: "Cursor",
    windsurf: "Windsurf",
    chatgpt: "ChatGPT",
    api: "API",
    other: "Other",
  };
  return labels[platform] || platform;
}

function showOnboardingCard(): void {
  const card = [
    "",
    `  ${pc.green("✔")} Your AI knows you now. Just start talking.`,
    "",
    `  ${pc.bold("acore show")}        See your identity`,
    `  ${pc.bold("acore customize")}   Change anything`,
    "",
  ];
  p.note(card.join("\n"), "");
}

export async function initCommand(options: { global?: boolean }): Promise<void> {
  p.intro(pc.bold("acore") + " — give your AI a soul");

  const globalDir = getGlobalDir();
  const localDir = getLocalDir();
  const hasGlobal = globalConfigExists();

  if (options.global || !hasGlobal) {
    // Quick setup — 1 question
    const { identity, context, platform } = await runQuickSetup();

    await writeGlobalConfig(globalDir, identity, "core-starter", platform);
    commitGlobalConfig("Created via acore init");
    p.log.success(`Created ${pc.dim("~/.acore/core.md")} (identity)`);

    if (context.stack && context.stack !== "not specified yet") {
      await writeLocalContext(localDir, context);
      p.log.success(`Created ${pc.dim(".acore/context.md")} (project)`);
    }

    // Show inferred summary
    const inferredParts = [identity.userName];
    if (identity.userRole) inferredParts.push(identity.userRole);
    if (context.stack && context.stack !== "not specified yet") inferredParts.push(context.stack);
    p.log.info(`Inferred: ${pc.dim(inferredParts.join(" · "))}`);

    const effectivePlatform: InjectPlatform = platform || "other";

    // Save platform config
    savePlatformConfig(effectivePlatform, localDir);

    // Merge and deliver (includes kit.md if akit is installed)
    const merged = buildMergedOutput(globalDir, localDir);

    if (isFileBasedPlatform(effectivePlatform)) {
      const platformFile = getPlatformFile(effectivePlatform)!;
      const filePath = path.join(process.cwd(), platformFile);
      const result = injectIntoFile(filePath, merged);
      if (result.created) {
        p.log.success(`Created ${pc.dim(platformFile)} with identity`);
      } else {
        p.log.success(`Updated ${pc.dim(platformFile)} with latest identity`);
      }
    } else {
      const copied = await copyToClipboard(merged);
      if (copied) {
        p.log.success("Copied to clipboard");
      } else {
        p.log.warning("Could not copy to clipboard — run: acore copy");
      }
    }

    p.log.info(`Platform: ${platformLabel(effectivePlatform)}`);

    showOnboardingCard();

    p.outro("Ready.");
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

    // Auto-detect platform instead of asking
    const platform: InjectPlatform = detectPlatform() || "other";

    // Save platform config
    savePlatformConfig(platform, localDir);

    // Merge and deliver (includes kit.md if akit is installed)
    const merged = buildMergedOutput(globalDir, localDir);

    if (isFileBasedPlatform(platform)) {
      const platformFile = getPlatformFile(platform)!;
      const filePath = path.join(process.cwd(), platformFile);
      const result = injectIntoFile(filePath, merged);
      if (result.created) {
        p.log.success(`Created ${pc.dim(platformFile)} with identity`);
      } else {
        p.log.success(`Updated ${pc.dim(platformFile)} with latest identity`);
      }
    } else {
      const copied = await copyToClipboard(merged);
      if (copied) {
        p.log.success("Copied to clipboard");
      } else {
        p.log.warning("Could not copy to clipboard — run: acore copy");
      }
    }

    if (isFileBasedPlatform(platform)) {
      p.outro("For Claude Code, Cursor, and Windsurf — identity is auto-injected into your config file. For other platforms, it's copied to your clipboard.");
    } else {
      p.outro("Paste into your AI's system prompt. That's it.");
    }
  }
}
