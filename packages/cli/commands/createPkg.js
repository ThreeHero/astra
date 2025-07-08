import { START_COMMAND, DEFAULT_TEMPLATE_NAME } from '@thastra/constants';


function generatePkg(name) {
  const pkg = {
    name,
    version: "0.1.0",
    private: true,
    scripts: {
      [START_COMMAND]: "astra-cli dev",
      build: "astra-cli build",
      format: "prettier --write .",
    },
    main: "./src/index.js",
    engines: {
      node: ">=16.0.0",
    },
    dependencies: {
      react: "^18.3.0",
      "react-dom": "^18.3.0",
      "@thastra/common": "latest",
    },
    devDependencies: {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@thastra/rwscript": "latest",
      prettier: "^3.3.3",
    },
    prettier: {
      useTabs: false,
      tabWidth: 2,
      printWidth: 100,
      singleQuote: true,
      trailingComma: "none",
      semi: false,
      arrowParens: "avoid",
    },
    browserslist: [">0.5%", "last 2 versions", "not dead", "not op_mini all"],
  };

  return pkg;
}

export default {
  [DEFAULT_TEMPLATE_NAME]: generatePkg,
};