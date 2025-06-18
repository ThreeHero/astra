import { config } from "dotenv";
import fs from 'fs'
import path from 'path';
import { PACKAGE_NAME } from '@thastra/constants';

/**
 * zh-CN: 获取环境变量
 * en-US: Get environment variables
 */
export function getEnv(environment = 'dev') {
  let envFile = `.env.${environment}`;
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
  }
}

/**
 * zh-CN: 暴露环境变量
 * en-US: Expose environment variables
 */
export function ExposeEnv() {
  let res = {}
  const env = process.env;
  Object.keys(env).forEach((key) => {
    // zh-CN: 只暴露以 PACKAGE_NAME_ 开头的环境变量
    // en-US: Only expose environment variables that start with PACKAGE_NAME_
    if (key.startsWith(PACKAGE_NAME + "_")) {
      let tempKey = key.replace(PACKAGE_NAME + "_", "");
      res[tempKey] = env[key];
    }
  });
  return res
}