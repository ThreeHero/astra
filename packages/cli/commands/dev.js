import scripts from '@astra/scripts';
import chalk from 'chalk';
import { getTemplate, checkEnvironment, getEnv, ExposeEnv } from "@astra/utils";

export async function devCommand(options = {}) {
  checkEnvironment()
  console.log(chalk.blueBright("🚀 启动开发服务器..."));
  getEnv('dev')
  const cwd = process.cwd();
  const template = await getTemplate(cwd);
  let dev = scripts[template].dev;

  const env = ExposeEnv();
  dev(cwd, env)
}

