import rwscript from '@thastra/rwscript';
import chalk from 'chalk';
import { getTemplate, checkEnvironment, getEnv, ExposeEnv } from "@thastra/utils";

const scripts = {
  'react-webpack': rwscript.startDev
}

export async function devCommand(options = {}) {
  checkEnvironment()
  console.log(chalk.blueBright("🚀 启动开发服务器..."));
  getEnv('dev')
  const cwd = process.cwd();
  const template = await getTemplate(cwd);
  let dev = scripts[template];

  const env = ExposeEnv();
  dev(cwd, env)
}

