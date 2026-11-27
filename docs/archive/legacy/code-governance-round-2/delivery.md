# 第二批代码治理：历史交付核验

- 整理日期：2026-11-27；版本归属：未记录，不追认版本。
- 结论：M1–M3 及附带 B4 已有实现和测试源码；原 M1 方案被后续评审修正替代。归档历史记录，不代表当前单测、类型检查或浏览器缓存验收已通过。
- 原始输入：[计划原文](plan.md)（保持不变）。

## 范围与证据

| 原范围 | 最终实现及提交证据 |
| --- | --- |
| M1 keep-alive | `37f4dee` 初版使用组件包装并设置路由名；`f1ffafd` 撤销包装，改在 [route-cache.ts](../../../../src/app/shell/route-cache.ts) 将路由名映射到 SFC 文件名，include 使用该名称，缓存键仍保留路由名语义。[app-routes.ts](../../../../src/router/app-routes.ts) 直接返回懒加载器，页面不得用 defineOptions 自定义 name。 |
| M1 验收变化 | [app-routes 单测](../../../../tests/unit/router/app-routes.spec.ts) 现断言 Home→index、fullPath 提取及未知名称回退；不再要求组件 name 等于路由名。测试源码存在，本次未执行；未核验真实浏览器缓存/HMR。 |
| M2 文件式路由移除 | `37f4dee` 从 Vite/Vitest 配置移除文件式路由插件；[vue-router.d.ts](../../../../src/types/vue-router.d.ts) 手写七项 RouteNamedMap，与当前 [schema](../../../../src/router/app-route-schema.ts) 的名称/路径逐项一致。二者仍需同步维护，不将旧计划“同源”描述扩大为自动生成或自动检测所有漂移的保证。 |
| M3 断点与状态 | `0a9b238`、`f1ffafd` 在 [app-shell.ts](../../../../src/stores/app-shell.ts) 仅跨设备形态重置状态；[useAppBreakpoint.ts](../../../../src/composables/useAppBreakpoint.ts) 定义 <=768 mobile、<1200 tablet、其余 desktop。现有 [app-shell 单测](../../../../tests/unit/stores/app-shell.spec.ts) 覆盖 768、1200、同带状态保持和跨带重置。 |
| B4 错误判序 | `a609a1d` 在 [request.ts](../../../../src/utils/api/request.ts) 中按取消透传→超时→response→request 处理，避免超时落入网络连接错误。 |

## 验证边界与后续归属

- Git diff 与当前源码可核验上述实现和测试变更；提交说明不是测试运行原始日志。本次未执行 lint/type-check/test/build、浏览器或 Bifrost E2E。
- [local-quality-system](../../../active/1.3.0/release.md#local-quality-system) 承接当前类型检查与单测回归；未来若要声明浏览器缓存/HMR 行为验收，需单独取得实际运行证据，本次不补造。
- B4 的判序由 [api-contract-r](../../../active/1.3.0/release.md#api-contract-r) 保留并补齐取消、超时、网络错误回归。Bifrost E2E 不纳入 1.3.0 验收，沿用版本记录中的范围决定。
