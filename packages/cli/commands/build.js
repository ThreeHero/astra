import rwscript from '@thastra/rwscript';
import chalk from "chalk";
import { getTemplate, checkEnvironment, getEnv, ExposeEnv } from "@thastra/utils";

const scripts = {
  'react-webpack': rwscript.startBuild
}


export async function buildCommand(options = {}) {
  checkEnvironment();
  console.log(chalk.blueBright("🚀 启动构建..."));
  getEnv("prod");
  const cwd = process.cwd();
  const template = await getTemplate(cwd);
  let build = scripts[template];

  const env = ExposeEnv();
  build(cwd, env);
}
