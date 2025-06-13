# Astra Monorepo 脚手架仓库

> 一个基于 Monorepo 架构的前端脚手架仓库，集成项目模板、CLI 工具和构建脚本，助力高效统一的前端开发与维护。

## 目录结构

```
/packages
/cli          # 脚手架命令行工具（astra-cli）
/templates    # 各类项目模板（react-rspack、react-webpack等）
/scripts      # 构建与启动脚本（如 devServer、build 脚本）
package.json    # monorepo 根包配置

````

## 主要特点

- ✅ 多种前端模板统一管理，快速初始化项目  
- ✅ CLI 支持模板选择、项目创建及配置覆盖  
- ✅ 采用 ESModule 规范，兼容现代工具链  
- ✅ 配置集中管理，支持默认与本地覆盖（local.config.js）  
- ✅ 自动检测端口占用，智能切换可用端口  

## 快速开始

1. 克隆仓库到本地：

```bash
git clone https://github.com/ThreeHero/astra.git
cd astra
````

2. 安装依赖：

```bash
pnpm install
```

## 未来规划

* 支持更多前端模板（如 Vue 等）
* CLI 插件化扩展
* 远程模板拉取与缓存机制
* 集成自动化测试与发布流程

---

## 联系方式

如有问题或建议，欢迎提交 Issue 。


