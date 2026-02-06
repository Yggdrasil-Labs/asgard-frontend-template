# qiankun 快速开始

本文档帮助你在约 10 分钟内基于本模板以**主应用**或**子应用**模式启动项目。

## 前置条件

- Node.js >= 22.14.0
- pnpm 10.28.0
- 已克隆本仓库并完成 `pnpm install`

## 场景一：独立应用（默认）

不启用微前端，与普通 Vue SPA 一致：

```bash
pnpm install
pnpm dev
```

浏览器访问 http://localhost:5173 。

## 场景二：主应用（微前端容器）

主应用负责注册和加载子应用，默认端口 5174。

### 步骤

1. **使用主应用模式启动**

   ```bash
   pnpm dev:main
   ```

   将读取 `.env.main`（`VITE_APP_MODE=main`、`VITE_PORT=5174`），访问 http://localhost:5174 。

2. **注册子应用**

   编辑 `src/config/apps.js`，配置子应用的 `name`、`entry`、`activeRule` 等。开发环境可将 `entry` 设为子应用开发地址，例如 `//localhost:5173/`。

3. **本地联调子应用**

   再开一个终端，以子应用模式启动（见场景三），子应用运行在 5173，主应用从 5174 加载该子应用。

## 场景三：子应用（微前端子应用）

子应用可独立运行，也可被主应用加载，默认端口 5173。

### 步骤

1. **配置子应用名称与路径**

   复制 `.env.micro` 或新建 `.env`，设置：

   ```bash
   VITE_APP_MODE=micro
   VITE_APP_NAME=micro-app-1
   VITE_APP_PUBLIC_PATH=/micro-app-1/
   VITE_PORT=5173
   ```

2. **启动子应用**

   ```bash
   pnpm dev:micro
   ```

   访问 http://localhost:5173 可独立运行；主应用在 `apps.js` 中配置 `activeRule: '/micro-app-1'` 和对应 `entry` 后即可加载该子应用。

3. **与主应用联调**

   - 终端 1：`pnpm dev:main`（主应用 5174）
   - 终端 2：`pnpm dev:micro`（子应用 5173）
   - 浏览器打开主应用，进入子应用路由（如 `/micro-app-1`）即可看到子应用内容。

## 常用命令汇总

| 命令            | 说明           | 默认端口 |
|----------------|----------------|----------|
| `pnpm dev`     | 独立应用开发   | 5173     |
| `pnpm dev:main`   | 主应用开发     | 5174     |
| `pnpm dev:micro`  | 子应用开发     | 5173     |
| `pnpm dev:standalone` | 独立应用（显式） | 5173 |
| `pnpm build`   | 独立应用构建   | -        |
| `pnpm build:main`  | 主应用构建  | -        |
| `pnpm build:micro` | 子应用构建  | -        |

## 下一步

- [配置说明](./configuration.md)：环境变量与 `qiankun.js`、`apps.js` 详解
- [开发指南](./development.md)：联调、HMR、DevTools、常见问题
- [部署指南](./deployment.md)：构建、Docker、nginx、CI/CD
