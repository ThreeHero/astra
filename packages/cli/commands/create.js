import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import { execSync } from "child_process";
import inquirer from "inquirer";
import {
  DEFAULT_TEMPLATE_NAME,
  SUPPORTED_TEMPLATES,
  START_COMMAND,
  __dirname
} from "@astra/constants";


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

function generatePkg(name) {
  const pkg = {
    name,
    version: "0.0.1",
    private: true,
    scripts: {
      [START_COMMAND]: "astra-cli dev",
      build: "astra-cli build",
    },
    main: "./src/index.js",
    engines: {
      node: ">=16.0.0",
    },
    dependencies: {
      react: "^18.3.0",
      "react-dom": "^18.3.0",
    },
    devDependencies: {
      "webpack-hot-middleware": "^2.26.1",
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
    },
  };

  return pkg;
}

export async function createCommand(name, options = {}) {
  // Check if the name is valid
  const templateName = await checkTemplateName(options.template);
  // Directory to run command line
  const targetDir = path.resolve(process.cwd(), name);
  // Directory of the template
  const templateDir = path.resolve(__dirname, "../../templates", templateName);

  // Check if the target directory exists
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`❌ 项目 ${chalk.bold(name)} 已存在`));
    process.exit(1);
  }

  console.log(chalk.green(`📁 创建项目: ${chalk.bold(name)}`));
  await fs.copy(templateDir, targetDir);

  const pkg = generatePkg(name);
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
