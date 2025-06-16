import { pathToFileURL } from "url";
import path from 'path';
import { existsSync } from 'fs';
import { merge } from "lodash-es";
import { DEFAULT_EXTEND_CONFIG_NAME, getPathInfo } from "@astra/constants";

const { __dirname } = getPathInfo(import.meta.url);

async function getUserConfig(isLocal = true, projectRoot = process.cwd()) {

  const userConfigPath = path.resolve(projectRoot, DEFAULT_EXTEND_CONFIG_NAME);
  const userLocalConfigPath = path.resolve(projectRoot, "local.config.js");

  let userConfig = {};
  let userLocalConfig = {};
  let config = {};

  if (existsSync(userConfigPath)) {
    // 如果用户配置文件存在，则加载它
    userConfig =
      (await import(pathToFileURL(userConfigPath).href)).default || {};
  }
  if (existsSync(userLocalConfigPath) && isLocal) {
    // 如果用户本地配置文件存在，则加载它
    userLocalConfig =
      (await import(pathToFileURL(userLocalConfigPath).href)).default || {};
  }

  config = merge(userConfig, userLocalConfig);
  return config;
}

export default getUserConfig;