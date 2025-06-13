import scripts from "@astra/scripts";
import chalk from "chalk";

export async function buildCommand(options = {}) {
  const cwd = process.cwd();
  let build = scripts.webpack.build;

  console.log(chalk.blueBright("🚀 启动构建..."));
  build(cwd);
}
