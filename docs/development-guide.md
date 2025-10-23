# 开发指南

本指南将帮助您快速了解 Asgard Frontend Template 的项目结构、技术栈和开发流程。

## 📁 项目结构

```
asgard-frontend-template/
├── public/                 # 静态资源目录
├── src/                   # 源代码目录
│   ├── api/               # API 接口层
│   ├── assets/            # 静态资源
│   ├── components/        # 通用组件
│   ├── composables/       # 组合式函数
│   ├── config/            # 配置文件
│   ├── constants/         # 常量定义
│   ├── locales/           # 国际化资源
│   ├── pages/             # 页面组件（自动路由）
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── tests/                 # 测试文件
└── docs/                  # 项目文档
```

## 🛠 技术栈

### 核心框架

- **Vue 3.5+**: 渐进式 JavaScript 框架
- **TypeScript 5.9+**: 类型安全的 JavaScript 超集
- **Vite 7+**: 下一代前端构建工具

### 路由与状态管理

- **Vue Router 4**: Vue.js 官方路由管理器
- **unplugin-vue-router**: 基于文件系统的自动路由
- **Pinia**: Vue 3 状态管理库

### 开发工具

- **ESLint**: 代码质量检查工具
- **@antfu/eslint-config**: Anthony Fu 的 ESLint 配置
- **Prettier**: 代码格式化工具
- **Husky**: Git hooks 工具

### 测试框架

- **Vitest**: 基于 Vite 的单元测试框架
- **Playwright**: 端到端测试工具
- **@testing-library/vue**: Vue 组件测试工具

### 国际化与样式

- **Vue I18n**: Vue.js 国际化插件
- **Sass**: CSS 预处理器

### 工具库

- **@vueuse/core**: Vue 组合式函数工具库
- **Axios**: HTTP 客户端库
- **unplugin-auto-import**: 自动导入插件

## 🚀 开发流程

### 1. 环境准备

确保您的开发环境满足以下要求：

- **Node.js**: >= 22.14.0
- **pnpm**: >= 10.18.3 (推荐包管理器)
- **Git**: 最新版本

### 2. 项目初始化

```bash
# 克隆项目
git clone <repository-url>
cd asgard-frontend-template

# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env.local
```

### 3. 开发命令

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

### 4. 开发工作流

1. **创建功能分支**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发功能**
   - 编写代码
   - 添加测试
   - 运行 `pnpm lint` 检查代码质量
   - 运行 `pnpm test` 确保测试通过

3. **提交代码**

   ```bash
   git add .
   git commit -m "feat: add new feature #issueID"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔧 配置说明

### 环境变量

项目支持多环境配置，通过 `.env` 文件管理：

```bash
# .env.local (本地开发)
VITE_API_BASE_URL=http://localhost:8080
VITE_PORT=5173
```

### 路径别名

项目配置了以下路径别名：

- `@`: `src/` 目录
- `@components`: `src/components/` 目录
- `@locales`: `src/locales/` 目录
- `@scss`: `src/assets/scss/` 目录

### 自动导入

项目启用了以下自动导入功能：

- **Vue API**: `ref`, `computed`, `watch` 等
- **Vue Router**: `useRouter`, `useRoute` 等
- **Pinia**: `useStore` 等
- **VueUse**: `useLocalStorage`, `useDark` 等
- **组件**: `src/components/` 下的组件自动导入

## ❓ 常见问题

### Q: 如何添加新的页面？

A: 在 `src/pages/` 目录下创建 Vue 文件，系统会自动生成对应的路由。

### Q: 如何添加新的组件？

A: 在 `src/components/` 目录下创建 Vue 文件，组件会自动导入，无需手动 import。

### Q: 如何配置新的环境变量？

A: 在 `.env` 文件中添加变量，变量名必须以 `VITE_` 开头才能在客户端使用。

## 📚 相关文档

- [编码规范](./coding-standards.md) - 详细的编码规范和最佳实践
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [部署指南](./deployment-guide.md) - 构建和部署流程

---

**下一步**: 查看 [编码规范](./coding-standards.md) 了解详细的开发规范。
