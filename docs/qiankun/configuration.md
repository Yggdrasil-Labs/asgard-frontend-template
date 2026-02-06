# qiankun 配置说明

本文档说明所有与 qiankun 相关的配置项：环境变量、`src/config/qiankun.js`、`src/config/apps.js` 以及 Vite 中的相关配置。

## 环境变量

所有以 `VITE_` 开头的变量会在构建时注入前端，可在代码中通过 `import.meta.env.VITE_*` 访问。

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `VITE_APP_MODE` | string | `standalone` | 运行模式：`main` 主应用、`micro` 子应用、`standalone` 独立应用 |
| `VITE_APP_NAME` | string | - | 子应用唯一名称，仅 `micro` 模式必填，如 `micro-app-1` |
| `VITE_APP_PUBLIC_PATH` | string | `/` | 子应用部署的公共路径，仅 `micro` 模式使用，需以 `/` 开头和结尾，如 `/micro-app-1/` |
| `VITE_MAIN_APP_URL` | string | - | 主应用地址，仅子应用开发联调时可选使用 |
| `VITE_QIANKUN_DEBUG` | string | `false` | 设为 `true` 时输出主应用侧 qiankun 生命周期与启动日志 |
| `VITE_PORT` | number | 主应用 5174 / 子应用 5173 / 独立 5173 | 开发服务器端口 |

模板中已提供 `.env.example`、`.env.main`、`.env.micro` 示例，可按需复制或修改。

## src/config/qiankun.js

主应用侧 qiankun 全局配置，仅在 `VITE_APP_MODE=main` 时生效。

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sandbox.strictStyleIsolation` | boolean | `false` | 是否使用 Shadow DOM 严格样式隔离，可能影响部分 UI 库 |
| `sandbox.experimentalStyleIsolation` | boolean | `true` | 实验性样式隔离（CSS Scoping），推荐开启 |
| `prefetch` | boolean \| string \| string[] | `true` | 预加载策略：`true` 首个子应用挂载后预加载其他，`'all'` 启动后预加载全部，数组为指定应用，`false` 不预加载 |
| `singular` | boolean | `true` | 是否单例模式，同一时间只渲染一个子应用 |
| `errorHandler` | function | 见文件 | 全局错误处理，主应用已增强为输出详情并触发 `qiankun-error` 事件供容器展示 |

详见 [qiankun start 配置](https://qiankun.umijs.org/zh/api#start-opts)。

## src/config/apps.js

主应用子应用注册列表，仅在主应用模式下被读取。每个子应用配置项如下：

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 子应用唯一标识 |
| `entry` | string | 是 | 子应用入口地址，开发/生产可不同（如 `import.meta.env.DEV ? '//localhost:5173/' : '//cdn.example.com/micro-app-1/'`） |
| `container` | string | 是 | 挂载容器 CSS 选择器，通常为 `#subapp-viewport` |
| `activeRule` | string \| function | 是 | 激活路由规则，如 `'/micro-app-1'` 或函数返回 boolean |
| `props` | object | 否 | 传给子应用的数据，常用 `basename`（子应用路由前缀）、`eventBus`（主应用注入的事件总线）、`globalState` |

主应用会在注册时自动注入 `eventBus`，子应用在 `mount(props)` 中可访问 `props.basename`、`props.eventBus` 等。

## Vite 配置相关

- **模式与端口**：通过 `vite --mode main` / `vite --mode micro` 加载 `.env.main` / `.env.micro`，主应用默认端口 5174，子应用默认 5173。
- **子应用构建**：当 `VITE_APP_MODE=micro` 时，`vite.config.js` 会启用 library 模式，输出 UMD，并设置 `base`、CORS、`cssCodeSplit: false` 等，详见项目内 `vite.config.js` 注释。
- **主应用/独立应用构建**：使用标准 SPA 构建，无额外 qiankun 特例。

如需自定义端口，在对应 `.env` 或 `.env.main` / `.env.micro` 中设置 `VITE_PORT` 即可。
