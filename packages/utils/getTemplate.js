// 根据用户配置获取模版信息
import getUserConfig from "./getUserConfig.js";
import { DEFAULT_TEMPLATE_NAME, SUPPORTED_TEMPLATES } from "@thastra/constants";

async function getTemplate(projectRoot) {
  const userConfig = await getUserConfig(false, projectRoot);
  const template = userConfig.template;
  
  if (!template) return DEFAULT_TEMPLATE_NAME; // 默认模版为 react-webpack
  if (SUPPORTED_TEMPLATES.includes(template)) return template;
  return DEFAULT_TEMPLATE_NAME; // 如果用户配置的模版不在支持列表中，则返回默认模版
}

export default getTemplate;