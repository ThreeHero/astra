import scripts from '@astra/scripts';
import chalk from 'chalk';
import { getTemplate, checkEnvironment } from "@astra/utils";

export async function devCommand(options = {}) {
  checkEnvironment()
  const cwd = process.cwd();
  const template = await getTemplate(cwd);
  let dev = scripts[template].dev;

  console.log(chalk.blueBright("🚀 启动开发服务器..."));
  dev(cwd)
}

