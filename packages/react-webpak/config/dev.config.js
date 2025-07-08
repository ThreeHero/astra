import path from "path";
import { merge } from "webpack-merge";
import config from "./base.js";
import webpack from 'webpack';
import getLoaders from "./loaders.js";
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { getPathInfo } from '@thastra/constants'

const { __dirname } = getPathInfo(import.meta.url);

export default merge(config, {
  entry: [
    // 热更新客户端
    "webpack-hot-middleware/client?reload=true&noInfo=true",
    // 用户的入口文件
    path.resolve(process.cwd(), "./src/index.js"),
  ],
  // 开发环境配置
  mode: "development",
  devtool: "eval-cheap-module-source-map", // 源码调试模式
  module: {
    rules: getLoaders(true), // 获取开发环境的加载器
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, "../../node_modules"), // 兼容本地开发的依赖
      path.resolve(__dirname, '../../../../node_modules'),
      path.resolve(__dirname, '../../../../node_modules/.pnpm'),
    ],
  },
});
