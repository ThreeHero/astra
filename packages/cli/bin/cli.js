#!/usr/bin/env node
import { Command } from "commander";
import { DEFAULT_TEMPLATE_NAME } from "@astra/constants";
import { createCommand } from "../commands/create.js";
import { devCommand } from "../commands/dev.js";
import { buildCommand } from "../commands/build.js";

/**
 * zh-CN: CLI 命令行工具
 * en-US: CLI command line tool
 */
const program = new Command();

program
  .name("astra-cli")
  .description("✨ Astra CLI command line tool")
  .version("0.0.1");
  
program
  .command('create')
  .alias('c')
  .argument('<project-name>', 'Project name')
  .option('-t, --template <template>', 'Template to use', DEFAULT_TEMPLATE_NAME)
  .action(createCommand)
  
program
  .command("dev")
  .description("Start the development server")
  .action(devCommand);

program
  .command("build")
  .description("Build the project for production")
  .action(buildCommand);

program.parse(process.argv);