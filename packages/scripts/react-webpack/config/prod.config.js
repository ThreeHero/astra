import path from "path";
import { merge } from "webpack-merge";
import config from "./base.js";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import getLoaders from "./loaders.js";

export default merge(config, {
  // 生产环境配置
  mode: "production",
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"], // 删除console.log
          },
        },
      }),
    ],
  },
  module: {
    rules: getLoaders(false), // 获取开发环境的加载器
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "./public"), // 复制public下文件
          to: path.resolve(process.cwd(), "./dist"), // 复制到dist目录中
          noErrorOnMissing: true, // 找不到文件时不报错
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css", // 抽离css的输出目录和名称
    }),
  ],
});
