import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { copyCommand } from "./commands/copy.js";
import { showCommand } from "./commands/show.js";
import { updateCommand } from "./commands/update.js";
import { resetCommand } from "./commands/reset.js";
import { connectCommand } from "./commands/connect.js";
import { disconnectCommand } from "./commands/disconnect.js";

declare const __VERSION__: string;

const program = new Command();

program
  .name("acore")
  .description("The identity layer for AI companions")
  .version(__VERSION__)
  .action(() => initCommand({}));

program
  .command("init")
  .description("Set up your AI identity (interactive wizard)")
  .option("--global", "Re-run identity wizard only")
  .action((options) => initCommand(options));

program
  .command("copy")
  .description("Copy merged identity to clipboard")
  .action(() => copyCommand());

program
  .command("show")
  .description("View your current config summary")
  .action(() => showCommand());

program
  .command("update")
  .description("Save AI's updated output back to config")
  .option("--global", "Update global identity instead of project context")
  .option("-y, --yes", "Skip confirmation")
  .action((options) => updateCommand(options));

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

program.parse();
