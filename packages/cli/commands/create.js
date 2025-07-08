import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import { execSync } from "child_process";
import inquirer from "inquirer";
import createPkg from "./createPkg.js";
import {
  DEFAULT_TEMPLATE_NAME,
  SUPPORTED_TEMPLATES,
  getPathInfo,
} from "@thastra/constants";

const { __dirname } = getPathInfo(import.meta.url);

/**
 * zh-CN: 检查模板名称是否有效
 * en-US: Check if the template name is valid
 * @param {string|undefined} templateName
 * @returns {string}
 */
async function checkTemplateName(templateName) {
  const defaultTemplateName = DEFAULT_TEMPLATE_NAME;
  // If the passed templateName does not exist
  if (!templateName || typeof templateName !== "string") {
    return defaultTemplateName;
  }
  // If the passed templateName is not in the supported templates list
  if (!SUPPORTED_TEMPLATES.includes(templateName)) {
    // 判断node版本 需要大于18
    if (process.version < "v18.0.0") {
      console.error(
        chalk.red(`❌ Node.js ${process.version}不受支持，请使用 Node.js 18 或更高版本`)
      );
      process.exit(1);
    }
    const answer = await inquirer.prompt({
      type: "list",
      name: "template",
      message: "Please select a currently supported template:\n",
      choices: SUPPORTED_TEMPLATES,
      default: defaultTemplateName,
    });
    templateName = answer.template;
  }
  return templateName;
}

export async function createCommand(name, options = {}) {
  // Check if the name is valid
  const templateName = await checkTemplateName(options.template);
  // Directory to run command line
  const targetDir = path.resolve(process.cwd(), name);
  // Directory of the template
  const templateDir = path.join(__dirname, "../templates", templateName);

  // Check if the target directory exists
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`❌ 项目 ${chalk.bold(name)} 已存在`));
    process.exit(1);
  }

  console.log(chalk.green(`📁 创建项目: ${chalk.bold(name)}`));
  await fs.copy(templateDir, targetDir);

  const pkg = createPkg[templateName](name);
  await fs.writeJSON(path.join(targetDir, "package.json"), pkg, { spaces: 2 });

  console.log(chalk.blue("📦 安装依赖中..."));
  execSync("npm install", { cwd: targetDir, stdio: "inherit" });

  console.log(chalk.greenBright("✅ 项目创建成功！"));
  console.log(chalk.cyanBright("👉 进入项目: ") + chalk.bold(`cd ${name}`));
  console.log(
    chalk.magentaBright("🚀 启动开发环境: ") +
      chalk.bold("npm run " + START_COMMAND)
  );
}
