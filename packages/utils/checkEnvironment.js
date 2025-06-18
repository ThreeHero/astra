import { satisfies } from "semver";
import { BASIC_NODE_VERSION } from '@thastra/constants';
import chalk from "chalk";
import fs from 'fs'
import path from 'path';

function getPkgJSON() {
  const packagePath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) {
    console.error(
      chalk.red("❌ Error: package.json not found in current directory.")
    );
    process.exit(1);
  }
  const content = fs.readFileSync(packagePath, "utf-8");
  return JSON.parse(content);
}

/**
 * zh-CN: 检查当前环境是否为可执行环境
 * en-US: Check if the current environment is executable
 * @returns {boolean} - 返回 true 如果当前环境是可执行的，否则返回 false
 */
function checkEnvironment() {
  const pkg = getPkgJSON();
  const requiredVersion = pkg.engines?.node || BASIC_NODE_VERSION;
  const currentNodeVersion = process.versions.node
  
  if (!satisfies(currentNodeVersion, requiredVersion)) {
    console.error(
      chalk.red.bold("❌ Error:") +
        chalk.reset(
          ` Required Node.js version ${chalk.green(
            requiredVersion
          )}, but you are using ${chalk.red(currentNodeVersion)}.`
        )
    );
    process.exit(1);
  } 
}

export default checkEnvironment;