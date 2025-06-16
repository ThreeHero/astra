import path from "path";
import buildConfig from "./config/prod.config.js";
import { getUserConfig } from "@astra/utils";
import { merge } from "webpack-merge";
import webpack from "webpack";
import chalk from "chalk";
import { splitWebpackConfig } from "./config/splitWebpackConfig.js";


export async function startBuild(projectRoot) {
  const userConfig = await getUserConfig(false, projectRoot);

  let config = {};

  config = merge(buildConfig, userConfig);

  const { validConfig, invalidConfig } = splitWebpackConfig(config);
  
  const tempConfig = {
    resolve: { alias: invalidConfig.alias || {} },
  };
  config = merge(validConfig, tempConfig);
  
  const compiler = webpack(config);
  
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(chalk.red("❌ 关闭编译器失败："), closeErr);
        }
        // 关闭之后再处理 run 的结果
        if (err) {
          console.error(chalk.red("❌ 构建失败：\n"), err);
          return reject(err);
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
          console.error(chalk.red("❌ 编译错误:"));
          info.errors.forEach((e) =>
            console.error(chalk.red(JSON.stringify(e, null, 2)))
          );
          return reject(new Error("Astra 编译错误"));
        }

        if (stats.hasWarnings()) {
          console.warn(chalk.yellow("⚠️ 编译警告:"));
          info.warnings.forEach((w) =>
            console.warn(chalk.yellow(JSON.stringify(w, null, 2)))
          );
        }

        console.log(chalk.green("✅ 编译成功"));
        resolve(stats);
      });
    })
  })
}
