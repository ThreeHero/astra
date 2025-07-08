import path from 'path';
import getBabelOptions from './babel.options.js';
import MiniCssExtractPlugin from "mini-css-extract-plugin";


const cssModulesLoader = {
  loader: "css-loader",
  options: {
    sourceMap: false,
    // 开启 CSS Modules
    modules: {
      mode: "local",
      localIdentName: "[name]__[local]--[hash:base64:8]",
      exportLocalsConvention: "dashes",
    },
  },
};

function exposeLoaders(isDev) {
  
  const miniCssLoader = isDev ? "style-loader" : MiniCssExtractPlugin.loader;
  return [
    {
      test: /\.([jt]sx?)$/,
      exclude: /node_modules/,
      use: [
        // 'thread-loader', // 使用多线程加载器提高编译速度
        {
          loader: "babel-loader",
          options: getBabelOptions(isDev), // 获取babel配置
        },
      ],
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      oneOf: [
        {
          // 配合auto-css-modules
          resourceQuery: /css-modules/,
          use: [miniCssLoader, cssModulesLoader, "postcss-loader"],
        },
        {
          use: [miniCssLoader, "css-loader", "postcss-loader"],
        },
      ],
    },
    {
      test: /\.less$/,
      exclude: /node_modules/,
      oneOf: [
        {
          resourceQuery: /css-modules/,
          use: [
            miniCssLoader,
            cssModulesLoader,
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          use: [miniCssLoader, "css-loader", "postcss-loader", "less-loader"],
        },
      ],
    },
    {
      test: /\.(png|jpe?g|gif)(\?.*)?$/,
      type: "asset",
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64位
        },
      },
      generator: {
        filename: "static/images/[name][ext]", // 文件输出目录和命名
      },
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: "asset",
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64位
        },
      },
      generator: {
        filename: "static/medias/[name][ext]", // 文件输出目录和命名
      },
    },
    { test: /\.svg$/i, type: "asset" },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      type: "asset",
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64位
        },
      },
      generator: {
        filename: "static/fonts/[name][ext]", // 文件输出目录和命名
      },
    },
    {
      test: /\.txt/,
      type: "asset/source",
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64位
        },
      },
      generator: {
        filename: "static/texts/[name][ext]", // 文件输出目录和命名
      },
    },
  ];
}

export default exposeLoaders;