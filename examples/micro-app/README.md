# 子应用示例

本示例演示如何基于 asgard-frontend-template 以**子应用模式**运行，支持独立运行和被主应用加载两种方式。

## 使用方式

本目录为配置示例，不包含完整代码。请先克隆 [asgard-frontend-template](https://github.com/Yggdrasil-Labs/asgard-frontend-template)，再按下列步骤应用子应用配置。

### 1. 配置子应用环境变量

在项目根目录使用或复制 `.env.micro`，并设置子应用名称与部署路径，例如：

```bash
VITE_APP_MODE=micro
VITE_APP_NAME=micro-app-1
VITE_APP_PUBLIC_PATH=/micro-app-1/
VITE_PORT=5173
```

或新建 `.env` 写入上述内容。`VITE_APP_NAME` 需与主应用 `apps.js` 中注册的 `name` 一致；`VITE_APP_PUBLIC_PATH` 需与子应用最终部署路径一致（以 `/` 开头和结尾）。

### 2. 启动子应用

```bash
pnpm install
pnpm dev:micro
```

访问 http://localhost:5173 可**独立运行**子应用（与普通 SPA 一致）。当主应用根据 `activeRule` 加载该子应用时，会注入 `props`（如 `basename`、`eventBus`），子应用会以被加载模式运行。

### 3. 与主应用联调

- 终端 1：在主应用项目中执行 `pnpm dev:main`（主应用 5174）
- 终端 2：在本项目（子应用）中执行 `pnpm dev:micro`（子应用 5173）
- 主应用 `src/config/apps.js` 中配置该子应用：`entry` 开发环境为 `//localhost:5173/`，`activeRule` 如 `/micro-app-1`，`props.basename` 为 `/micro-app-1`

浏览器打开主应用，进入对应子应用路由即可看到子应用内容。

### 4. 路由与状态

- 子应用路由 base 由主应用通过 `props.basename` 传入，模板已在 `src/qiankun/micro.js` 的 `mount` 中调用 `createAppRouter(basename)`，无需额外配置。
- 子应用拥有独立 Pinia 实例，卸载时会清理；跨应用通信使用主应用注入的 `props.eventBus` 或 `props.globalState`。

## 构建与部署

```bash
pnpm build:micro
```

构建产物为 UMD 格式，输出在 `dist/`。部署时需保证：

- 资源路径与 `VITE_APP_PUBLIC_PATH` 一致
- 若被主应用跨域加载，部署该子应用的 nginx 需返回 CORS 头（可使用模板提供的 `nginx.micro.conf`）

详见 [部署指南](../../docs/qiankun/deployment.md)。

## 参考

- [快速开始](../../docs/qiankun/quick-start.md)
- [配置说明](../../docs/qiankun/configuration.md)
- [开发指南](../../docs/qiankun/development.md)
