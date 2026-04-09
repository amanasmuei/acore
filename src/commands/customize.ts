import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { getGlobalDir, getLocalDir, globalConfigExists } from "../lib/paths.js";
import { getArchetypesByRole } from "../lib/archetypes.js";
import { writeGlobalConfig, writeLocalContext } from "./init.js";
import { mergeConfigs, parseMarkdown, findSection } from "../lib/merge.js";
import {
  loadPlatformConfig,
  getPlatformFile,
  isFileBasedPlatform,
  savePlatformConfig,
} from "../lib/platform.js";
import { injectIntoFile } from "../lib/inject.js";
import { commitGlobalConfig } from "../lib/history.js";
import type { AcoreIdentity, UserRole } from "../types.js";
import { USER_ROLES } from "../types.js";
import type { InjectPlatform } from "../lib/platform.js";

async function customizePersonality(globalDir: string): Promise<void> {
  const corePath = path.join(globalDir, "core.md");
  const coreContent = fs.readFileSync(corePath, "utf-8");

  const parsed = parseMarkdown(coreContent);

  // Extract current AI name from preamble heading
  const aiNameMatch = coreContent.match(/^# (.+)$/m);
  const currentAiName = aiNameMatch?.[1] || "Companion";

  // Extract current user name and role from Relationship section
  const relationshipSection = findSection(parsed, "Relationship");
  const userNameMatch = relationshipSection?.content.match(/- Name: (.+)$/m);
  const userRoleMatch = relationshipSection?.content.match(/- Role: (.+)$/m);
  const currentUserName = userNameMatch?.[1] || "";
  const currentUserRole = userRoleMatch?.[1] || "";

  // Detect whether we're on full template (has Dynamics section)
  const hasDynamics = !!findSection(parsed, "Dynamics");
  const templateName: "core" | "core-starter" = hasDynamics ? "core" : "core-starter";

  p.note("Updating AI personality");

  const aiName = (await p.text({
    message: "AI companion name?",
    initialValue: currentAiName,
    validate: (v) => (v.length === 0 ? "Name is required" : undefined),
  })) as string;

  if (p.isCancel(aiName)) {
    p.log.info("Cancelled.");
    return;
  }

  // Ask for role category first
  const selectedRole = (await p.select({
    message: "What role is this AI for?",
    options: USER_ROLES.map((r) => ({ value: r.value, label: r.label, hint: r.hint })),
  })) as UserRole;

  if (p.isCancel(selectedRole)) {
    p.log.info("Cancelled.");
    return;
  }

  // Show role-appropriate archetypes
  const roleArchetypes = selectedRole === "custom" ? [] : getArchetypesByRole(selectedRole);
  const archetypeChoices = [
    ...roleArchetypes.map((a) => ({
      value: a.name,
      label: a.label,
      hint: a.description,
    })),
    { value: "custom", label: "Custom", hint: "define your own traits" },
  ];

  const selectedArchetype = (await p.select({
    message: "Choose personality archetype",
    options: archetypeChoices,
  })) as string;

  if (p.isCancel(selectedArchetype)) {
    p.log.info("Cancelled.");
    return;
  }

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

    if (p.isCancel(personalityInput)) {
      p.log.info("Cancelled.");
      return;
    }

    const communicationInput = (await p.text({
      message: "Describe the communication style",
      placeholder: "ask clarifying questions, use examples",
      validate: (v) => (v.length === 0 ? "Communication style is required" : undefined),
    })) as string;

    if (p.isCancel(communicationInput)) {
      p.log.info("Cancelled.");
      return;
    }

    const valuesInput = (await p.text({
      message: "Core values (comma-separated)",
      placeholder: "honesty over comfort, shipping over perfection",
      validate: (v) => (v.length === 0 ? "At least one value is required" : undefined),
    })) as string;

    if (p.isCancel(valuesInput)) {
      p.log.info("Cancelled.");
      return;
    }

    personality = personalityInput;
    communication = communicationInput;
    values = valuesInput.split(",").map((v) => v.trim()).filter(Boolean);
    // Custom archetypes don't ship with pre-written Fundamental Truths.
    fundamentalTruths = undefined;
  } else {
    const archetype = roleArchetypes.find((a) => a.name === selectedArchetype)!;
    personality = archetype.personality;
    communication = archetype.communication;
    values = archetype.values;
    fundamentalTruths = archetype.fundamentalTruths;
  }

  const roleLabel = USER_ROLES.find((r) => r.value === selectedRole)?.label ?? currentUserRole;

  const boundariesInput = (await p.text({
    message: "Boundaries (what the AI won't do)",
    placeholder: "won't pretend to be human, flags when out of depth",
    defaultValue: "",
  })) as string;

  if (p.isCancel(boundariesInput)) {
    p.log.info("Cancelled.");
    return;
  }

  const identity: AcoreIdentity = {
    aiName,
    userName: currentUserName,
    userRole: roleLabel,
    role: selectedRole,
    personality,
    communication,
    values,
    boundaries: boundariesInput || "won't pretend to be human, flags when out of depth",
    fundamentalTruths,
  };

  const savedPlatform = loadPlatformConfig()?.platform ?? null;
  await writeGlobalConfig(globalDir, identity, templateName, savedPlatform);
  commitGlobalConfig("Updated via acore customize");
  p.log.success(`Updated ${pc.dim("~/.acore/core.md")} with new personality`);
}

async function customizePlatform(): Promise<void> {
  p.note("Updating platform settings");

  const platform = (await p.select({
    message: "Which platform do you use?",
    options: [
      { value: "claude-code", label: "Claude Code", hint: "injects into CLAUDE.md" },
      { value: "cursor", label: "Cursor", hint: "injects into .cursorrules" },
      { value: "windsurf", label: "Windsurf", hint: "injects into .windsurfrules" },
      { value: "chatgpt", label: "ChatGPT", hint: "copy to clipboard" },
      { value: "api", label: "API", hint: "copy to clipboard" },
      { value: "other", label: "Other", hint: "copy to clipboard" },
    ],
  })) as InjectPlatform;

  if (p.isCancel(platform)) {
    p.log.info("Cancelled.");
    return;
  }

  const localDir = getLocalDir();
  savePlatformConfig(platform, localDir);
  p.log.success(`Platform set to ${pc.bold(platform)}`);
}

async function customizeContext(): Promise<void> {
  p.note("Updating project context");

  const localDir = getLocalDir();
  const contextPath = path.join(localDir, "context.md");

  // Try to read existing context for initialValues
  let currentStack = "";
  let currentDomain = "";
  let currentFocus = "";

  if (fs.existsSync(contextPath)) {
    const contextContent = fs.readFileSync(contextPath, "utf-8");
    const stackMatch = contextContent.match(/- (?:Stack|Expertise): (.+)$/m);
    const domainMatch = contextContent.match(/- (?:Domain|Field): (.+)$/m);
    const focusMatch = contextContent.match(/- Focus: (.+)$/m);
    currentStack = stackMatch?.[1] || "";
    currentDomain = domainMatch?.[1] || "";
    currentFocus = focusMatch?.[1] || "";
  }

  const stack = (await p.text({
    message: "Your expertise or tools for this project?",
    placeholder: "e.g. TypeScript, React / creative writing / financial analysis",
    initialValue: currentStack,
    validate: (v) => (v.length === 0 ? "Expertise is required" : undefined),
  })) as string;

  if (p.isCancel(stack)) {
    p.log.info("Cancelled.");
    return;
  }

  const domain = (await p.text({
    message: "Domain for this project? (optional)",
    placeholder: "SaaS platform",
    initialValue: currentDomain,
    defaultValue: "",
  })) as string;

  if (p.isCancel(domain)) {
    p.log.info("Cancelled.");
    return;
  }

  const focus = (await p.text({
    message: "What are you working on? (optional)",
    placeholder: "authentication system",
    initialValue: currentFocus,
    defaultValue: "",
  })) as string;

  if (p.isCancel(focus)) {
    p.log.info("Cancelled.");
    return;
  }

  await writeLocalContext(localDir, {
    stack,
    domain: domain || "",
    focus: focus || "",
  });

  p.log.success(`Updated ${pc.dim(".acore/context.md")} with new project context`);
}

async function customizeEverything(globalDir: string): Promise<void> {
  await customizePersonality(globalDir);
  await customizePlatform();
  await customizeContext();

  // Check if currently on starter template and offer upgrade
  const corePath = path.join(globalDir, "core.md");
  const coreContent = fs.readFileSync(corePath, "utf-8");
  const parsed = parseMarkdown(coreContent);
  const hasDynamics = !!findSection(parsed, "Dynamics");

  if (!hasDynamics) {
    const upgrade = await p.confirm({
      message: "You're using the starter template. Upgrade to the full template with Dynamics and Memory sections?",
    });

    if (!p.isCancel(upgrade) && upgrade) {
      // Re-extract identity from updated core.md to write with full template
      const updatedContent = fs.readFileSync(corePath, "utf-8");
      const updatedParsed = parseMarkdown(updatedContent);
      const aiNameMatch = updatedContent.match(/^# (.+)$/m);
      const relSection = findSection(updatedParsed, "Relationship");
      const userNameMatch = relSection?.content.match(/- Name: (.+)$/m);
      const userRoleMatch = relSection?.content.match(/- Role: (.+)$/m);
      const identitySection = findSection(updatedParsed, "Identity");
      const personalityMatch = identitySection?.content.match(/- Personality: (.+)$/m);
      const communicationMatch = identitySection?.content.match(/- Communication: (.+)$/m);
      const valuesMatch = identitySection?.content.match(/- Values: (.+)$/m);
      const boundariesMatch = identitySection?.content.match(/- Boundaries: (.+)$/m);

      const identity: AcoreIdentity = {
        aiName: aiNameMatch?.[1] || "Companion",
        userName: userNameMatch?.[1] || "",
        userRole: userRoleMatch?.[1] || "",
        role: "custom",
        personality: personalityMatch?.[1] || "curious, supportive, adaptive",
        communication: communicationMatch?.[1] || "explore ideas together, match your energy",
        values: valuesMatch?.[1]?.split(",").map((v) => v.trim()).filter(Boolean) || ["understanding over speed"],
        boundaries: boundariesMatch?.[1] || "won't pretend to be human, flags when out of depth",
      };

      const savedPlatform = loadPlatformConfig()?.platform ?? null;
      await writeGlobalConfig(globalDir, identity, "core", savedPlatform);
      commitGlobalConfig("Upgraded to full template via acore customize");
      p.log.success("Upgraded to full template with Dynamics and Memory sections");
    }
  }
}

async function resyncPlatformFile(globalDir: string): Promise<void> {
  const localDir = getLocalDir();
  const platformConfig = loadPlatformConfig(localDir);

  if (!platformConfig || !isFileBasedPlatform(platformConfig.platform)) {
    return;
  }

  const globalCorePath = path.join(globalDir, "core.md");
  const localContextPath = path.join(localDir, "context.md");

  if (!fs.existsSync(globalCorePath)) return;

  const globalContent = fs.readFileSync(globalCorePath, "utf-8");
  const localContent = fs.existsSync(localContextPath)
    ? fs.readFileSync(localContextPath, "utf-8")
    : null;

  const merged = mergeConfigs(globalContent, localContent);

  const platformFile = getPlatformFile(platformConfig.platform)!;
  const filePath = path.join(process.cwd(), platformFile);
  const result = injectIntoFile(filePath, merged);

  if (result.created) {
    p.log.success(`Created ${pc.dim(platformFile)} with updated identity`);
  } else {
    p.log.success(`Updated ${pc.dim(platformFile)} with latest identity`);
  }
}

export async function customizeCommand(): Promise<void> {
  p.intro(pc.bold("acore customize") + " — personalize your AI companion");

  if (!globalConfigExists()) {
    p.log.error(
      "No global config found. Run " + pc.bold("acore") + " first."
    );
    process.exit(1);
  }

  const globalDir = getGlobalDir();

  const choice = (await p.select({
    message: "What would you like to customize?",
    options: [
      {
        value: "personality",
        label: "AI personality",
        hint: "name, archetype, traits, values",
      },
      {
        value: "platform",
        label: "Platform settings",
        hint: "Claude Code, Cursor, Windsurf, etc.",
      },
      {
        value: "context",
        label: "Project context",
        hint: "stack, domain, focus",
      },
      {
        value: "everything",
        label: "Everything",
        hint: "go through all settings",
      },
    ],
  })) as string;

  if (p.isCancel(choice)) {
    p.log.info("Cancelled.");
    return;
  }

  switch (choice) {
    case "personality":
      await customizePersonality(globalDir);
      break;
    case "platform":
      await customizePlatform();
      break;
    case "context":
      await customizeContext();
      break;
    case "everything":
      await customizeEverything(globalDir);
      break;
  }

  // Re-sync platform file if file-based platform is configured
  await resyncPlatformFile(globalDir);

  p.outro("Done.");
}
