<div align="center">

# asgard-frontend-template

[![CI](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml/badge.svg)](https://github.com/Yggdrasil-Labs/asgard-frontend-template/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yggdrasil-Labs/asgard-frontend-template/graph/badge.svg?token=8PGPHIE04N)](https://codecov.io/gh/Yggdrasil-Labs/asgard-frontend-template)

</div>

General frontend template. Asgard——kingdom of gods.

## Project Structure

```
asgard-frontend-template
├── node_modules
├── public              # 静态资源（favicon、manifest 等）
├── src
│   ├── api             # 请求封装与接口模块
|   |   ├── https.ts    # Axios 封装
|   |   ├── request.ts  # 全局拦截器
|   |   └── modules     # 各业务模块API
│   ├── assets          # 静态资源
│   ├── components      # 通用组件
│   ├── composables     # 组合式函数
│   ├── layouts         # 布局
│   ├── locales         # 国际化
│   ├── pages           # 页面
│   ├── router          # 路由
│   ├── stores          # 状态管理
│   ├── types           # 类型声明
│   ├── utils           # 工具类
│   ├── App.vue
│   └── main.ts
├── .env.example        # 环境变量示例
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 项目特色

- ⚡ **现代化技术栈**: Vue 3 + TypeScript + Vite
- 🔧 **开箱即用**: 预配置 ESLint、Prettier、Husky
- 🧪 **完整测试**: Vitest + Playwright + Testing Library
- 🌍 **国际化支持**: Vue I18n 多语言支持
- 📦 **自动导入**: 组件和 API 自动导入
- 🚀 **性能优化**: 代码分割、懒加载、缓存策略
- 🔒 **类型安全**: 完整的 TypeScript 类型定义
- 📱 **响应式设计**: 移动端适配和 PWA 支持

## Core Dependencies

- [@vueuse/core](https://vueuse.org/): 组合式函数工具库
- [axios](https://axios-http.com/zh/docs/intro): 基于promise可以用于浏览器和node.js的网络请求库
- [vue](https://cn.vuejs.org/): 渐进式Javascript框架
- [vue-i18n](https://vue-i18n.intlify.dev/): Vue多语言插件
- [vue-router](https://router.vuejs.org/zh/): Vue路由
- [pinia](https://pinia.vuejs.org/zh/): Vue状态管理库

## Project Setup

```sh
# install dependencies
pnpm install

# serve with hot reload at localhost:5173
pnpm run dev

# build for production with minification
pnpm run build

# lint
pnpm run lint

# run tests
pnpm test

# run tests with coverage
pnpm test:coverage

# run tests in watch mode
pnpm test:watch

# open test UI
pnpm test:ui

# check dependencies
pnpm run dep:check

# dry run release
pnpm run release:dry-run
```
