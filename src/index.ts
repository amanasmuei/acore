import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { showCommand } from "./commands/show.js";
import { customizeCommand } from "./commands/customize.js";
import { pullCommand } from "./commands/pull.js";
import { resetCommand } from "./commands/reset.js";
import { connectCommand } from "./commands/connect.js";
import { disconnectCommand } from "./commands/disconnect.js";
import { globalConfigExists } from "./lib/paths.js";

declare const __VERSION__: string;

const program = new Command();

program
  .name("acore")
  .description("The identity layer for AI companions")
  .version(__VERSION__)
  .action(() => {
    // Smart default: first run → setup, subsequent → show status
    if (globalConfigExists()) {
      showCommand();
    } else {
      initCommand({});
    }
  });

// Primary commands
program
  .command("show")
  .description("View your current identity summary")
  .action(() => showCommand());

program
  .command("customize")
  .description("Personalize your AI identity")
  .action(() => customizeCommand());

program
  .command("pull")
  .description("Save AI's updated output and re-sync platform config")
  .option("--global", "Update global identity instead of project context")
  .option("--clipboard", "Read from clipboard instead of stdin")
  .option("-y, --yes", "Skip confirmation")
  .option("--sync-only", "Re-inject into platform file without reading new content")
  .action((options) => pullCommand(options));

program
  .command("reset")
  .description("Archive current config and start fresh")
  .action(() => resetCommand());

program
  .command("connect")
  .description("Connect acore with amem for automated memory")
  .action(() => connectCommand());

program
  .command("disconnect")
  .description("Remove amem integration")
  .action(() => disconnectCommand());

// Hidden backward-compat aliases
program
  .command("init", { hidden: true })
  .option("--global", "Re-run identity wizard only")
  .action((options) => initCommand(options));

program
  .command("update", { hidden: true })
  .option("--global", "Update global identity")
  .option("-y, --yes", "Skip confirmation")
  .action((options) => pullCommand(options));

program
  .command("sync", { hidden: true })
  .action(() => pullCommand({ syncOnly: true }));

program
  .command("copy", { hidden: true })
  .action(async () => {
    const { copyCommand } = await import("./commands/copy.js");
    copyCommand();
  });

program.parse();
