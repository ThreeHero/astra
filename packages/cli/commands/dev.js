import scripts from '@astra/scripts';
import chalk from 'chalk';

export async function devCommand(options = {}) {
  const cwd = process.cwd();
  let dev = scripts.webpack.dev;

  console.log(chalk.blueBright("🚀 启动开发服务器..."));
  dev(cwd)
}