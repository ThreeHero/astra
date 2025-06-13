
# Astra Monorepo Scaffold

> A monorepo scaffold repository for frontend projects integrating project templates, CLI tools, and build scripts to enable efficient and unified development and maintenance.

## Structure

```

/packages
/cli          # CLI tool (astra-cli)
/templates    # Project templates (react-rspack, react-webpack, etc.)
/scripts      # Build and dev scripts (e.g., devServer, build scripts)
package.json    # Root package configuration

````

## Features

- ✅ Manage multiple frontend templates in one repo for fast project initialization  
- ✅ CLI supports template selection, project creation, and config overrides  
- ✅ Fully ESM-based for modern toolchain compatibility  
- ✅ Centralized configuration with default and local overrides (`local.config.js`)  
- ✅ Auto port conflict detection and smart port switching  

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/ThreeHero/astra.git
cd astra
````

2. Install dependencies:

```bash
pnpm install
```


## Roadmap

* Support more frontend templates (Vue, Taro, etc.)
* CLI plugin system for command extension
* Remote template fetching and caching mechanism
* Integration of automated testing and deployment pipelines

---

## Contact

For issues or suggestions.


