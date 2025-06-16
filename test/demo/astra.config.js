const path = require('path')
module.exports = {
  port: 8000,
  alias: {
    "@components": path.resolve(__dirname, "../src/components"),
    "@utils": path.resolve(__dirname, "../src/utils"),
  },
};
