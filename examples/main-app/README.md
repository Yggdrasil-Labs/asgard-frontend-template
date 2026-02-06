# 主应用示例

本示例演示如何基于 asgard-frontend-template 以**主应用模式**运行，并注册多个子应用。

## 使用方式

本目录为配置示例，不包含完整代码。请先克隆 [asgard-frontend-template](https://github.com/Yggdrasil-Labs/asgard-frontend-template)，再按下列步骤应用主应用配置。

### 1. 使用主应用模式启动

模板已内置主应用支持，直接使用主应用脚本即可：

```bash
pnpm install
pnpm dev:main
```

默认访问 http://localhost:5174 。主应用会读取 `src/config/apps.js` 注册子应用。

### 2. 配置子应用列表

编辑项目根目录下的 `src/config/apps.js`，按需添加或修改子应用配置，例如：

```javascript
export default [
  {
    name: 'micro-app-1',
    entry: import.meta.env.DEV ? '//localhost:5173/' : 'https://your-cdn.com/micro-app-1/',
    container: '#subapp-viewport',
    activeRule: '/micro-app-1',
    props: { basename: '/micro-app-1' },
  },
  {
    name: 'micro-app-2',
    entry: import.meta.env.DEV ? '//localhost:5175/' : 'https://your-cdn.com/micro-app-2/',
    container: '#subapp-viewport',
    activeRule: '/micro-app-2',
    props: { basename: '/micro-app-2' },
  },
]
```

开发环境 `entry` 指向子应用开发服务器地址；生产环境指向部署后的子应用入口 URL。

### 3. 布局与容器

主应用布局已提供子应用挂载容器，见 `src/pages/MainAppLayout.vue` 中的 `<QiankunContainer />`。路由需将主应用壳子路由指向该布局，子应用路由由 qiankun 根据 `activeRule` 激活。

### 4. 本地联调多个子应用

- 终端 1：`pnpm dev:main`（主应用 5174）
- 终端 2：`pnpm dev:micro`（子应用 1，端口 5173，需在子应用项目中设置 `VITE_APP_NAME=micro-app-1` 等）
- 终端 3：再起一个子应用（不同端口，如 5175），并在 `apps.js` 中配置对应 entry

浏览器打开主应用，通过导航进入不同子应用路由即可联调。

## 构建与部署

```bash
pnpm build:main
```

构建产物在 `dist/`，使用 nginx 等托管并配置 History 路由即可。详见 [部署指南](../../docs/qiankun/deployment.md)。

## 参考

- [快速开始](../../docs/qiankun/quick-start.md)
- [配置说明](../../docs/qiankun/configuration.md)
- [开发指南](../../docs/qiankun/development.md)
