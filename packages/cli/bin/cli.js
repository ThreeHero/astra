#!/usr/bin/env node
import { Command } from "commander";
import fs from 'fs'
import path from 'path';
import { DEFAULT_TEMPLATE_NAME, getPathInfo } from "@thastra/constants";
import { createCommand } from "../commands/create.js";
import { devCommand } from "../commands/dev.js";
import { buildCommand } from "../commands/build.js";

const { __dirname } = getPathInfo(import.meta.url);

function getVersion() {
  try {
    const pkgPath = path.resolve(__dirname, "../package.json");
    const content = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(content);
    return pkg.version;
  } catch (error) {
    console.error("Error reading version:", error);
    return "0.0.0";
  }
}



/**
 * zh-CN: CLI 命令行工具
 * en-US: CLI command line tool
 */
const program = new Command();

program
  .name("astra-cli")
  .description("✨ Astra CLI command line tool")
  .version(getVersion());
  
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