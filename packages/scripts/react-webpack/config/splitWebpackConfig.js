import { createRequire } from "module";
const require = createRequire(import.meta.url);
/**
 * 将传入对象分为 webpack 支持和不支持的两个配置对象
 * @param {object} config 用户传入的 webpack 配置对象
 * @returns {{ validConfig: object, invalidConfig: object }}
 */
export function splitWebpackConfig(config) {
  const schema = require("webpack/schemas/WebpackOptions.json");
  const validKeys = new Set(Object.keys(schema.properties));
  const validConfig = {};
  const invalidConfig = {};

  for (const key in config) {
    if (validKeys.has(key)) {
      validConfig[key] = config[key];
    } else {
      invalidConfig[key] = config[key];
    }
  }

  return {
    validConfig,
    invalidConfig,
  };
}
