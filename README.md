<div align="center">

# asgard-frontend-template

[![CI](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml/badge.svg)](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml)
[![Release Please](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/release-please.yml/badge.svg)](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/release-please.yml)

</div>

基于 Vue 3 + Vite + JavaScript 的纯首页前端模板，无测试、无登录，适合快速起步。

## 📋 环境要求

- **Node.js**: >= 22.14.0
- **pnpm**: 10.28.0
- **操作系统**: Windows、macOS、Linux

## 📁 项目结构

```
asgard-frontend-template
├── .github/            # GitHub 配置
│   ├── workflows/      # CI/CD 工作流
│   │   ├── ci.yml                  # 代码检查
│   │   ├── release-please.yml      # 自动化发布流程
│   │   ├── create-tag.yml          # 创建 Git Tag
│   │   └── release.yml             # 发布构建
│   ├── release-please-config.json
│   └── .release-please-manifest.json
├── .husky/             # Git Hooks
├── public/             # 静态资源
├── src/
│   ├── api/            # 请求封装与接口模块
│   ├── assets/scss/    # 样式文件
│   ├── components/     # 通用组件
│   ├── composables/    # 组合式函数
│   ├── config/         # 配置文件
│   ├── constants/      # 常量定义
│   ├── locales/        # 国际化资源
│   ├── pages/          # 页面组件（仅 index 首页，自动路由）
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理（Pinia）
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   └── main.js         # 应用入口
├── .env.example        # 环境变量示例
├── eslint.config.js    # ESLint 配置
├── index.html          # HTML 入口
├── package.json        # 项目依赖
└── vite.config.js      # Vite 配置
```

## 🎯 项目特色

- ⚡ **Vue 3 + Vite + JavaScript**：无 TypeScript，上手简单
- 🔧 **开箱即用**：ESLint、Prettier、Husky、Commitlint
- 🌍 **国际化**：Vue I18n，语言切换
- 📦 **自动导入**：组件与 API 自动导入
- 🛣️ **文件路由**：`unplugin-vue-router` 仅首页
- 💾 **Pinia**：状态管理 + 持久化（当前无业务 Store）
- 🎨 **Sass**：样式方案

**说明**：本模板不包含单元测试、E2E 测试与用户登录；需要时可自行接入。

## 📦 核心依赖

### 生产依赖

- Vue `^3.5.x`、Vue Router `^4.6.x`、Pinia `^3.0.x`、pinia-plugin-persistedstate、Vue I18n、@vueuse/core、Axios

### 开发依赖

- Vite `^7.x`、@vitejs/plugin-vue、ESLint、@antfu/eslint-config、Sass、unplugin-vue-router、unplugin-auto-import、unplugin-vue-components、Husky、Commitlint

## 🚀 快速开始

```bash
pnpm install
pnpm dev
```

开发服务器默认：http://localhost:5173

### 常用命令

```bash
pnpm dev          # 开发
pnpm build        # 构建
pnpm preview      # 预览构建结果
pnpm lint        # ESLint 检查
pnpm lint:fix    # ESLint 自动修复
```

## 微前端支持 (qiankun)

本模板支持以 **主应用**、**子应用** 或 **独立应用** 三种模式运行，基于 [qiankun](https://qiankun.umijs.org/) 微前端方案；默认不启用，保持与单体应用一致。

- **主应用**：`pnpm dev:main`（端口 5174），注册并加载子应用
- **子应用**：`pnpm dev:micro`（端口 5173），可独立运行或被主应用加载
- **独立应用**：`pnpm dev` / `pnpm dev:standalone`，与普通 SPA 相同

**快速开始**：[docs/qiankun/quick-start.md](docs/qiankun/quick-start.md)
**配置与开发**：[docs/qiankun/configuration.md](docs/qiankun/configuration.md)、[docs/qiankun/development.md](docs/qiankun/development.md)
**部署与最佳实践**：[docs/qiankun/deployment.md](docs/qiankun/deployment.md)、[docs/qiankun/best-practices.md](docs/qiankun/best-practices.md)
**示例**：[examples/main-app/](examples/main-app/README.md)、[examples/micro-app/](examples/micro-app/README.md)

## 📝 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/)：`feat:`、`fix:`、`docs:`、`refactor:`、`chore:` 等。

## 📄 开源协议

[MIT License](LICENSE)
