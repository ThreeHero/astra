import path from "path";
import { DEFAULT_START_PORT } from "@astra/constants";
import { getUserConfig } from "@astra/utils";
import devConfig from "./config/dev.config.js";
import { merge } from "webpack-merge";
import webpack from "webpack";
import express from "express";
import middleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import chalk from "chalk";
import { findAvailablePort, getLocalIPAddress, splitWebpackConfig, integrationConfig } from './utils/index.js'

export async function startDev(projectRoot, env) {

  let config = {};
  
  const userConfig = await getUserConfig(true, projectRoot);
  config = merge(devConfig, userConfig);
  
  const { validConfig, invalidConfig } = splitWebpackConfig(config);
  
  const tempConfig = integrationConfig(invalidConfig, env);
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
    // spinner.succeed('开发服务器已启动'); // 停止 spinner
    console.log(
      `${chalk.green('🚀')} ${chalk.bold('开发服务器已启动')}\n` +
      `${chalk.gray('>')} ${chalk.cyan(localAddress)}\n` +
      `${chalk.gray('>')} ${chalk.cyan(netAddress)}\n` +
      `${chalk.gray('>')} 按 ${chalk.yellow.bold('Ctrl+C')} 停止服务器`
    );
  });
}

