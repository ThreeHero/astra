import scripts from "@astra/scripts";
import chalk from "chalk";
import { getTemplate, checkEnvironment, getEnv, ExposeEnv } from "@astra/utils";

export async function buildCommand(options = {}) {
  checkEnvironment();
  console.log(chalk.blueBright("🚀 启动构建..."));
  getEnv("prod");
  const cwd = process.cwd();
  let build = scripts.webpack.build;

  const env = ExposeEnv();
  build(cwd, env);
}
