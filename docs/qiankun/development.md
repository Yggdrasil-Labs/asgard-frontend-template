# qiankun 开发指南

本文档说明主应用与子应用的本地开发、联调、调试及常见问题。

## 本地启动

- **独立应用**：`pnpm dev` 或 `pnpm dev:standalone`，默认 http://localhost:5173
- **主应用**：`pnpm dev:main`，默认 http://localhost:5174
- **子应用**：`pnpm dev:micro`，默认 http://localhost:5173

端口可通过对应 `.env` 中的 `VITE_PORT` 修改。

## 多应用联调

1. 终端 1：`pnpm dev:main`（主应用 5174）
2. 终端 2：`pnpm dev:micro`（子应用 5173，需在 `src/config/apps.js` 中配置该子应用的 `entry` 为 `//localhost:5173/` 和对应 `activeRule`）
3. 浏览器打开主应用，通过导航进入子应用路由（如 `/micro-app-1`）

子应用开发服务器已开启 CORS，主应用可跨域加载其资源。

## HMR（热更新）

- 主应用、子应用**单独**以 `dev:main` / `dev:micro` 运行时，Vite HMR 正常工作。
- **主应用加载子应用**时，子应用代码变更可能触发整页刷新，属 qiankun + Vite 的常见折中；若需稳定 HMR，可优先在子应用独立端口下开发，再在主应用中做集成验证。

详见 [HMR 验证说明](./hmr.md)。

## DevTools 与调试

- **Vue DevTools / Pinia DevTools**：主应用、子应用独立运行时与普通 Vue 项目一致；主应用内嵌子应用时，DevTools 可能主要显示主应用，可多用子应用独立模式调试。
- **qiankun 日志**：主应用下在 `.env.main` 或环境中设置 `VITE_QIANKUN_DEBUG=true`，可输出子应用生命周期等日志。

详见 [DevTools 与调试说明](./devtools.md)。

## 路由与状态

- **路由**：子应用通过 `mount(props)` 接收 `props.basename`，在 `src/router/index.js` 的 `createAppRouter(base)` 中传入，保证子应用路由带正确前缀。主应用路由需为子应用留出 `activeRule` 匹配空间（如 `/micro-app-1`、`/micro-app-1/*`）。
- **状态**：主应用与子应用各自使用独立 Pinia 实例；子应用卸载时会清理实例。跨应用通信使用主应用注入的 `props.eventBus` 或 `props.globalState`（若主应用实现）。

## 样式隔离

主应用通过 qiankun 的 `experimentalStyleIsolation: true` 做样式隔离，子应用样式会被加前缀，减少对主应用的污染。若使用强隔离（如 Shadow DOM），需在 `src/config/qiankun.js` 中调整 `sandbox` 配置，并注意部分 UI 库的兼容性。

## 常见问题

### 子应用白屏或加载失败

- 确认主应用 `apps.js` 中该子应用的 `entry` 可访问（开发时为 `//localhost:5173/` 等）。
- 查看控制台是否有 CORS 或 404 错误；子应用开发服务器需开启 CORS（模板已配置）。
- 主应用容器会监听 `qiankun-error` 事件并展示错误 overlay，可查看子应用名称、入口、报错信息与堆栈。

### 子应用路由错乱

- 确认主应用在 `props` 中传入的 `basename` 与子应用 `activeRule` 一致（如 `/micro-app-1`），且子应用使用 `createAppRouter(basename)` 创建路由。

### 主应用/子应用端口冲突

- 主应用默认 5174，子应用默认 5173，避免同时跑两个子应用在同一端口。若需多子应用联调，可为每个子应用使用不同端口并在 `apps.js` 中配置对应 `entry`。

### 构建后子应用资源 404

- 检查子应用 `VITE_APP_PUBLIC_PATH` 与部署路径一致（如部署在 `/micro-app-1/` 则设为 `/micro-app-1/`）；生产环境 `entry` 需指向可访问的完整入口 URL。

更多构建与部署说明见 [部署指南](./deployment.md)。
