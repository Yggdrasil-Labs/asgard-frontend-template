# qiankun 开发工具与调试说明

## Vue DevTools

- **主应用**: 以主应用模式运行 (`pnpm dev:main`) 时, Vue DevTools 会识别主应用根实例, 可查看组件树、Pinia、Vue Router。
- **子应用**:
  - 子应用**独立运行** (`pnpm dev:micro`) 时, DevTools 与普通 Vue 应用一致。
  - 子应用**被主应用加载**时, 部分环境下 DevTools 可能只显示主应用; 若需单独调试子应用, 可先用 `pnpm dev:micro` 在独立端口调试, 再在主应用中联调。

## Pinia DevTools

- 主应用与子应用各自使用独立 Pinia 实例, 在 DevTools 中会显示为不同的 store 树。
- 子应用独立运行时, 仅能看到该子应用的 store; 在主应用内加载时, 主应用与子应用的 store 可能同时存在, 通过 store 名称区分。

## qiankun 调试日志开关

通过环境变量 `VITE_QIANKUN_DEBUG` 控制主应用侧 qiankun 生命周期与启动日志:

- **开启**: 在 `.env` 或主应用模式对应的 env 中设置 `VITE_QIANKUN_DEBUG=true`, 将输出:
  - 主应用启动完成
  - 子应用列表与数量
  - 各子应用 beforeLoad / beforeMount / afterMount / beforeUnmount / afterUnmount 日志
- **关闭**: `VITE_QIANKUN_DEBUG=false` 或不设置, 仅在有错误时输出 `[qiankun] 子应用异常` 等错误信息。

**示例** (主应用本地调试):

```bash
# .env.main 或 启动前设置
VITE_QIANKUN_DEBUG=true
```

然后执行 `pnpm dev:main`。

## 子应用加载失败时的错误信息

子应用加载或运行报错时, 主应用会在:

1. **控制台**: 输出 `[qiankun] 子应用异常` 及 `appName`、`entry`、`message`、`stack`。
2. **页面**: 子应用容器内展示错误 overlay, 包含子应用名称、入口地址、错误消息与堆栈, 便于定位问题。

错误信息由主应用 `qiankun-error` 事件与容器组件联动自动展示, 无需额外配置。
