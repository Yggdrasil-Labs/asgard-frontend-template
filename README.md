# asgard-frontend-template

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

## Core Dependencies

- [axios](https://axios-http.com/zh/docs/intro): 基于promise可以用于浏览器和node.js的网络请求库
- [vue](https://cn.vuejs.org/): 渐进式Javascript框架
- [vue-i18n](https://vue-i18n.intlify.dev/): Vue多语言插件
- [vue-router](https://router.vuejs.org/zh/): Vue路由

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

# check dependencies
pnpm run dep:check

# dry run release
pnpm run release:dry-run
```
