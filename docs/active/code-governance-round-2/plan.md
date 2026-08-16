---
updated: 2026-08-16
---

# 计划：代码治理第二批（路由与壳层正确性）

## 范围

基于代码走查第二梯队（M1–M3）：

- M1 keep-alive 缓存静默失效：`<KeepAlive :include>` 按组件 `name` 匹配，缓存键用的是路由名
  （`Home`），而页面组件由 `import.meta.glob('/src/pages/*.vue')` 加载、`__name` 是文件名（`index`），
  二者永不相交，`keepAlive.enabled: true` 时缓存永不命中（已对照 Vue 运行时 getComponentName 源码实证）
- M2 双重路由源漂移：`vue-router/vite` 插件只用于生成 `route-map.d.ts`（其把首页路由名推为 `'/'`，
  与运行时 schema 的 `'Home'` 不一致），typed-router 类型与真实路由名背离
- M3 响应式 UX：`setViewportWidth` 在每次 resize（同带内拖拽）都重置侧栏折叠/抽屉状态；
  断点口径不一致（composable `<=768` 与 CSS `max-width:768px` 都视 768 为移动端，shell 却用 `<768`）

## 方案

### M1：缓存名对齐路由名（改组件加载层，不动页面）

在 `src/router/app-routes.ts` 的 `toRouteRecord` 中，把懒加载解析出的页面组件
用 `defineComponent` 包裹并显式 `name = route.name`，使 KeepAlive 的 include 名与组件名一致。

- 优点：一处改动、页面零侵入；schema 改名时类型/缓存名自动跟随
- 风险：SFC 组件被再包裹一层（spread options），需验证 setup/render/props 透传无损

### M2：删除文件式路由插件，手写 RouteNamedMap（单一事实源）

1. 从 `vite.config.ts` / `vitest.config.ts` 移除 `VueRouter` 插件（保留 `VueRouterAutoImports` 自动导入）
2. 删除 `src/types/route-map.d.ts`
3. 在 `src/types/vue-router.d.ts` 手写 `TypesConfig.RouteNamedMap`，与 `app-route-schema.ts` 严格一致
   （`Home: RouteRecordInfo<'Home', '/', ...>` 等 7 条）
4. 同步文档（ARCHITECTURE / route-and-shell-architecture 中关于插件与 route-map 的说明）

- 收益：运行时路由与类型同源；`router.push({ name: 'Home' })` 类型可用；
  schema 改名时类型不匹配会在编译期暴露
- 风险：手写声明与 schema 若漂移需人工维护——以「type-check 会在改名时告警」兜底

### M3：跨断点才重置形态 + 统一 768 口径

1. `setViewportWidth`：先算 `nextDevice`，与当前 `device` 相同则直接返回（同带内 resize 不触碰折叠/抽屉）
2. 断点统一为「768 含边界 = mobile」：shell 的 `width < 768` 改为 `width <= 768`（与
   `useAppBreakpoint`、5 处 CSS `max-width: 768px` 一致，CSS 零改动）
3. 768/1200 断点常量收敛到 `useAppBreakpoint` 导出，shell 引用之

## 可选速赢（随批附带）

- B4：request.ts 错误判序修正（取消透传 → 超时 → response → request），消除 ECONNABORTED 死分支

## 验证标准

1. `pnpm type-check` / `pnpm lint` / `pnpm test` / `pnpm build` 全绿
2. M1：新增测试证明 `createRouteRecords()` 产出的路由组件 name 与路由名一致
3. M2：`router.push({ name: 'Home' })` 类型合法、运行时路由不变；全量类型检查通过
4. M3：新增 app-shell 测试——同带内 resize 不重置折叠、跨带才重置、768 判定为 mobile
