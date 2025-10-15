# asgard-frontend-template

General frontend template. Asgard——kingdom of gods.

## Project Structure

```
asgard-frontend-template
├── node_modules
├── public
├── src
│   ├── assets          # 静态资源
│   ├── components      # 组件
│   ├── layouts         # 布局
│   ├── locales         # 国际化
│   ├── pages           # 页面
│   ├── router          # 路由
│   ├── stores          # 状态管理
│   ├── types           # 类型声明
│   ├── utils           # 工具类
│   ├── App.vue
│   └── main.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Core Dependencies

- [vue](https://cn.vuejs.org/): 渐进式Javascript框架
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
