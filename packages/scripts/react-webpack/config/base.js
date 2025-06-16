import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpackBar from "webpackbar";
import { PACKAGE_NAME, __dirname } from "@astra/constants";


export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "static/js/[name].[fullhash:8].js",
    clean: true, // 构建时清理 dist 文件夹
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@": path.join(process.cwd(), "./src"),
      "#": path.join(process.cwd(), "./public"), // 静态资源
    },
    modules: [path.resolve(process.cwd(), "./node_modules")],
  },
  stats: "errors-only",
  plugins: [
    new webpackBar({
      name: PACKAGE_NAME, // 打包进度条名称
      color: "#61dafb", // 进度条颜色
      // basic: true, // 基础模式
      minimal: true,
      summary: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), "./index.html"), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
  ].filter(Boolean), // 过滤掉 null 值
};
