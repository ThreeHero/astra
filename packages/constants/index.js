import path, { dirname } from "path";
import { fileURLToPath } from "url";

// 获取当前文件的路径
export const __filename = fileURLToPath(import.meta.url);
// 获取当前目录的路径
export const __dirname = dirname(__filename);

/**
 * zh-CN: 包名
 * en-US: Package name
 * @type {string}
 */
export const PACKAGE_NAME = "ASTRA";

/**
 * zh-CN: 默认模板名称
 * en-US: Default template name
 */
export const DEFAULT_TEMPLATE_NAME = "react-webpack";

/**
 * zh-CN: 目前支持的模版列表
 * en-US: Currently supported template list
 * @type {string[]}
 */
export const SUPPORTED_TEMPLATES = ["react-webpack"];

/**
 * zh-CN: 启动命令
 * en-US: Start command
 * @type {string}
 */
export const START_COMMAND = "start";

/**
 * zh-CN: 默认扩展的配置名称
 * en-US: Default extended configuration name
 */
export const DEFAULT_EXTEND_CONFIG_NAME = "astra.config.js";

/**
 * zh-CN: 默认启动端口号
 * en-US: Default start port
 * @type {number}
 */
export const DEFAULT_START_PORT = 3000;

/**
 * zh-CN: 基本运行的node版本
 * en-US: Basic running node version
 * @type {string}
 */
export const BASIC_NODE_VERSION = ">=16.0.0";
