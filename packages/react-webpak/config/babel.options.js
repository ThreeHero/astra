import { extname } from "path";
const suffix = [".css", ".less", '.scss'];


const autoCssModule = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { specifiers, source } = path.node;
        const { value } = source;
        if (specifiers.length > 0 && suffix.includes(extname(value))) {
          // 在路径末尾加上 css-modules 用于 webpack 匹配该文件
          source.value = `${value}?css-modules`;
        }
      },
    },
  };
};

function getBabelOptions(isDev = true) {
  // 这里可以根据环境变量或其他条件返回不同的配置
  return {
    // 执行顺序由右往左,所以先处理jsx,最后再试一下babel转换为低版本语法
    presets: [
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
      [
        "@babel/preset-env",
        {
          targets: "defaults",
          modules: false,
          useBuiltIns: "usage",
          // useBuiltIns: false, // 不使用 polyfill
          corejs: 3,
        },
      ],
      [
        "@babel/preset-typeScript",
        {
          isTSX: true,
          allExtensions: true,
        },
      ],
    ],
    plugins: [
      isDev && "react-refresh/babel",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-transform-class-properties", { loose: false }],
      "@babel/plugin-transform-runtime",
      autoCssModule,
    ].filter(Boolean),
  };
  
}

export default getBabelOptions;