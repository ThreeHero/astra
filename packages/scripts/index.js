import webpackReact from "./react-webpack/index.js";

export default {
  webpack: {
    dev: webpackReact.startDev,
    build: webpackReact.startBuild,
  },
};