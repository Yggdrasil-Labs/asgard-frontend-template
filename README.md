<div align="center">

# asgard-frontend-template

[![CI](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml/badge.svg)](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yggdrasil-Labs/asgard-frontend-template/graph/badge.svg?token=8PGPHIE04N)](https://codecov.io/gh/Yggdrasil-Labs/asgard-frontend-template)
[![Release Please](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/release-please.yml/badge.svg)](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/release-please.yml)

</div>

General frontend template. Asgard——kingdom of gods.

## 📋 环境要求

- **Node.js**: >= 22.14.0
- **pnpm**: 10.28.0
- **操作系统**: Windows、macOS、Linux

## 📁 项目结构

```
asgard-frontend-template
├── .github/            # GitHub 配置
│   ├── workflows/      # CI/CD 工作流
│   │   ├── ci.yml                  # 代码检查与类型检查
│   │   ├── release-please.yml      # 自动化发布流程
│   │   ├── create-tag.yml          # 创建 Git Tag
│   │   └── release.yml             # 发布构建
│   ├── release-please-config.json  # Release Please 配置
│   └── .release-please-manifest.json # 版本追踪
├── .cursor/            # Cursor 编辑器规则
├── .husky/             # Git Hooks
├── public/             # 静态资源（favicon、manifest 等）
├── src/
│   ├── api/            # 请求封装与接口模块
│   │   ├── http.ts     # Axios 封装
│   │   ├── request.ts  # 全局拦截器
│   │   └── modules/    # 各业务模块 API
│   ├── assets/         # 静态资源
│   │   └── scss/       # 样式文件
│   ├── components/     # 通用组件
│   ├── composables/    # 组合式函数
│   ├── config/         # 配置文件
│   ├── constants/      # 常量定义
│   ├── locales/        # 国际化资源
│   ├── pages/          # 页面组件（自动路由）
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理（Pinia）
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   └── main.ts         # 应用入口
├── tests/              # 测试文件
│   ├── e2e/            # 端到端测试（Playwright）
│   │   ├── pages/      # Page Object 模式
│   │   └── specs/      # 测试用例
│   └── setup/          # 测试配置
├── .env.example        # 环境变量示例
├── .gitignore
├── commitlint.config.js # 提交信息规范配置
├── eslint.config.js    # ESLint 配置
├── index.html          # HTML 入口
├── package.json        # 项目依赖
├── playwright.config.ts # Playwright 配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── vitest.config.ts    # Vitest 配置
```

## 🎯 项目特色

### 核心技术

- ⚡ **现代化技术栈**: Vue 3.5 + TypeScript 5.9 + Vite 7
- 🔧 **开箱即用**: 预配置 ESLint、Prettier、Husky、Commitlint
- 🧪 **完整测试**: Playwright 端到端测试 + Page Object 模式
- 🌍 **国际化支持**: Vue I18n 多语言支持，内置中英文切换
- 📦 **自动导入**: 组件和 API 自动导入，无需手动 import
- 🛣️ **文件路由**: 基于 `unplugin-vue-router` 的文件系统路由
- 💾 **状态管理**: Pinia + 持久化插件，支持本地存储
- 🎨 **样式方案**: Sass + Modern Normalize，提供丰富的样式工具

### 开发体验

- 🚀 **快速启动**: 一键安装依赖即可启动开发服务器
- 🔒 **类型安全**: 完整的 TypeScript 类型定义和类型检查
- 📝 **代码规范**: 遵循 `@antfu/eslint-config` 规范，支持自动修复
- 🔄 **Git 规范**: Conventional Commits + Release Please 自动化发布
- 🎯 **路径别名**: 预配置多个路径别名，简化导入路径
- 📚 **完善文档**: 详细的 Cursor Rules 文档，助力 AI 辅助开发

### 工程化

- 🔄 **CI/CD**: GitHub Actions 自动化测试、发布
- 📦 **依赖管理**: 使用 pnpm，支持依赖检查和更新
- 🏷️ **版本管理**: Release Please 自动化版本管理和变更日志
- 🧹 **代码质量**: Pre-commit hooks 确保代码质量
- 🔍 **多环境支持**: 开发、测试、生产环境配置
- 📊 **测试覆盖**: E2E 测试覆盖关键业务流程

## 📦 核心依赖

### 生产依赖

- [Vue](https://cn.vuejs.org/) `^3.5.26` - 渐进式 JavaScript 框架
- [Vue Router](https://router.vuejs.org/zh/) `^4.6.4` - Vue 官方路由管理器
- [Pinia](https://pinia.vuejs.org/zh/) `^3.0.4` - Vue 状态管理库
- [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) `^4.7.1` - Pinia 持久化插件
- [Vue I18n](https://vue-i18n.intlify.dev/) `^11.2.8` - Vue 国际化插件
- [@vueuse/core](https://vueuse.org/) `^14.1.0` - Vue 组合式函数工具库
- [Axios](https://axios-http.com/zh/docs/intro) `^1.13.2` - HTTP 客户端库

### 开发依赖

- [TypeScript](https://www.typescriptlang.org/) `~5.9.3` - JavaScript 超集
- [Vite](https://cn.vitejs.dev/) `^7.3.1` - 下一代前端构建工具
- [Vitest](https://vitest.dev/) `^4.0.16` - 单元测试框架
- [Playwright](https://playwright.dev/) `^1.57.0` - 端到端测试工具
- [ESLint](https://eslint.org/) `^9.39.2` - 代码检查工具
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) `^6.7.3` - ESLint 配置
- [Sass](https://sass-lang.com/) `^1.97.2` - CSS 预处理器
- [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) `^0.19.2` - 文件系统路由
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) `^20.3.0` - API 自动导入
- [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) `^30.0.0` - 组件自动导入

## 🚀 快速开始

### 安装依赖

```bash
# 安装依赖
pnpm install
```

### 开发命令

```bash
# 启动开发服务器（http://localhost:5173）
pnpm dev

# 启动测试环境开发服务器
pnpm dev:test

# 构建生产版本
pnpm build

# 构建测试环境版本
pnpm build:test

# 预览构建结果
pnpm preview

# 预览测试环境构建结果
pnpm preview:test
```

### 代码质量

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check
```

### 测试

```bash
# 运行 E2E 测试
pnpm test
# 或
pnpm test:e2e

# 以 UI 模式运行 E2E 测试
pnpm test:e2e:ui
```

### 依赖管理

```bash
# 检查依赖更新
pnpm dep:check

# 更新依赖（交互式）
pnpm dep:update
```

## 📝 开发规范

### 提交规范

项目采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 新功能
git commit -m "feat(scope): 添加通用模板能力"

# Bug 修复
git commit -m "fix(scope): 修复路由跳转问题"

# 文档更新
git commit -m "docs: 更新 README"

# 代码重构
git commit -m "refactor(scope): 重构公共组件结构"

# 性能优化
git commit -m "perf(scope): 优化图片加载"

# 测试相关
git commit -m "test: 添加首页交互测试"

# 构建相关
git commit -m "build: 更新 Vite 配置"

# CI 相关
git commit -m "ci: 更新 GitHub Actions 工作流"

# 其他变更
git commit -m "chore: 更新依赖"
```

### 发布流程

项目使用 [Release Please](https://github.com/googleapis/release-please) 自动化版本管理：

1. **提交代码**: 使用规范的提交信息推送到 `main` 分支
2. **自动创建 Release PR**: Release Please 自动创建/更新 Release PR
3. **预览变更**: 在 Release PR 中查看版本号和 CHANGELOG
4. **合入发布**: 当准备好发布时，合入 Release PR
5. **自动发布**: 自动创建 Git Tag 和 GitHub Release

## 🔧 配置说明

### 路径别名

```typescript
// vite.config.ts 配置示例
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@locales': '/src/locales',
      '@scss': '/src/assets/scss',
    },
  },
})
```

### 自动导入

以下 API 和组件无需手动导入：

- **Vue API**: `ref`, `computed`, `watch`, `onMounted` 等
- **Vue Router**: `useRouter`, `useRoute` 等
- **Pinia**: `defineStore`, `storeToRefs` 等
- **VueUse**: `useLocalStorage`, `useDark` 等
- **组件**: `src/components/` 下的所有组件

### 环境变量

创建 `.env.local` 文件（参考 `.env.example`）：

```env
# 应用标题
VITE_APP_TITLE=Asgard Frontend Template

# API 基础路径
VITE_API_BASE_URL=https://api.example.com

# 其他配置...
```

**注意**: 只有以 `VITE_` 开头的变量才能在客户端使用。

## 📚 相关文档

- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Playwright 文档](https://playwright.dev/)

## 📄 开源协议

[MIT License](LICENSE)
