import webpackReact from "./react-webpack/index.js";

export default {
  'react-webpack': {
    dev: webpackReact.startDev,
    build: webpackReact.startBuild,
  },
};