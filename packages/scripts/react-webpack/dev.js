import path from "path";
import {
  DEFAULT_EXTEND_CONFIG_NAME,
  DEFAULT_START_PORT,
} from "@astra/constants";
import { fileURLToPath, pathToFileURL } from "url";
import { existsSync } from "fs";
import devConfig from "./config/dev.config.js";
import { merge } from "webpack-merge";
import webpack from "webpack";
import { findAvailablePort } from "./utils/findAvailablePort.js";
import { getLocalIPAddress } from "./utils/getLocalIPAddress.js";
import { splitWebpackConfig } from "./config/splitWebpackConfig.js";
import express from "express";
import middleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import chalk from "chalk";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startDev(projectRoot) {
  // 用户的配置文件路径
  const userConfigPath = path.resolve(projectRoot, DEFAULT_EXTEND_CONFIG_NAME);
  // 用户的本地配置文件路径 # 防止git冲突 每个人可以有自己的本地配置
  const userLocalConfigPath = path.resolve(projectRoot, "local.config.js");

  let userConfig = {};
  let userLocalConfig = {};
  let config = {};
  

  if (existsSync(userConfigPath)) {
    // 如果用户配置文件存在，则加载它
    userConfig =
      (await import(pathToFileURL(userConfigPath).href)).default || {};
  }
  if (existsSync(userLocalConfigPath)) {
    // 如果用户本地配置文件存在，则加载它
    const userLocalConfig =
      (await import(pathToFileURL(userLocalConfigPath).href)).default || {};
  }
  
  config = merge(devConfig, userConfig, userLocalConfig);
  
  const { validConfig, invalidConfig } = splitWebpackConfig(config);
  
  const tempConfig = {
    resolve: { alias: invalidConfig.alias || {} },
  };
  config = merge(validConfig, tempConfig);
  
  const compiler = webpack(config);
  
  const originPort = invalidConfig.port || DEFAULT_START_PORT;
  const port = await findAvailablePort(originPort);
  if (port !== originPort) {
    console.warn(
      chalk.yellow(
        `端口 ${originPort} 被占用，已自动切换到 ${port}。`
      )
    );
  } 
  
  const app = express();
  app.use(
    middleware(compiler, {
      publicPath: config.output.publicPath || "/",
      stats: "errors-only",
    })
  );
  app.use(
    hotMiddleware(compiler, {
      log: false,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000,
    })
  );

  const localAddress = `http://localhost:${port}`;
  let netAddress = getLocalIPAddress()
  if (!netAddress) {
    console.warn(chalk.yellow('无法获取本地IP地址，可能是因为没有连接到网络或网络配置问题。'));
    netAddress = localAddress;
  } else {
    netAddress = `http://${netAddress}:${port}`;
  }
  
  
  app.listen(port, () => {
    console.log(
      `${chalk.green('🚀')} ${chalk.bold('开发服务器已启动')}\n` +
      `${chalk.gray('>')} ${chalk.cyan(localAddress)}\n` +
      `${chalk.gray('>')} ${chalk.cyan(netAddress)}\n` +
      `${chalk.gray('>')} ${chalk.magenta('热更新')} 已启用，修改文件自动刷新\n` +
      `${chalk.gray('>')} 按 ${chalk.yellow.bold('Ctrl+C')} 停止服务器`
    );
  });
}

