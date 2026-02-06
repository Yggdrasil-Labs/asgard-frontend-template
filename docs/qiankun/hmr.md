# qiankun 环境下的热更新 (HMR) 验证说明

本文档记录 qiankun 微前端场景下 HMR 的验证场景和预期结果。

## 验证环境

- 主应用: `pnpm dev:main` (端口 5174)
- 子应用: `pnpm dev:micro` (端口 5173)
- 独立应用: `pnpm dev` 或 `pnpm dev:standalone` (端口 5173)

## 验证场景与结果

### 1. 主应用开发模式下的 HMR

**步骤**: 以主应用模式启动 (`pnpm dev:main`), 修改主应用内任意 Vue/JS 文件并保存。

**预期**: 浏览器无刷新更新, 控制台出现 `[vite] hmr update` 或类似日志, 页面内容即时更新。

**配置**: `vite.config.js` 中主应用 server 已配置 `hmr: { overlay: true }`, `watch` 默认开启。

---

### 2. 子应用开发模式下的 HMR

**步骤**: 以子应用模式单独启动 (`pnpm dev:micro`), 修改子应用内任意 Vue/JS 文件并保存。

**预期**: 浏览器无刷新更新, 子应用页面内容即时更新。

**配置**: 子应用 server 已配置 `hmr: { overlay: true }`, `cors: true` 与 `Access-Control-Allow-Origin` 便于被主应用加载时也能建立 HMR 连接。

---

### 3. 主应用加载子应用时的 HMR

**步骤**:

1. 终端 1: `pnpm dev:main` (主应用 5174)
2. 终端 2: `pnpm dev:micro` (子应用 5173)
3. 浏览器访问主应用并进入子应用路由 (如 `/micro-app-1`)
4. 修改子应用源码并保存

**预期**:

- **主应用自身修改**: 主应用区域 HMR 生效, 子应用区域不变。
- **子应用修改**: 视 Vite HMR 与 qiankun 的配合情况, 可能为整页刷新或子应用区域更新; 若出现整页刷新, 属 qiankun 沙箱与 HMR 的已知限制, 可接受。

**说明**: 子应用作为 UMD 被主应用拉取时, 其开发态 HMR 依赖主应用与子应用之间的 WebSocket/EventSource 连接; 若遇 HMR 不生效, 可优先在子应用独立端口 (`pnpm dev:micro`) 下开发, 联调时再通过主应用访问。

---

## 配置要点

- 主应用与子应用均启用 `hmr: { overlay: true }`, 错误时显示 overlay。
- 子应用开发服务器已开启 CORS, 便于主应用跨域加载并建立 HMR 连接。
- 端口约定: 主应用 5174, 子应用 5173, 与 `src/config/apps.js` 中开发环境 entry 一致。

## 问题排查

- 若主应用或子应用单独运行时 HMR 不生效: 检查是否修改了非 Vite 监听范围内的文件, 或防火墙/代理拦截了 HMR WebSocket。
- 若主应用加载子应用时仅整页刷新: 可视为当前 qiankun + Vite 的折中行为, 开发时建议多用子应用独立模式 (`pnpm dev:micro`) 以获得稳定 HMR。
