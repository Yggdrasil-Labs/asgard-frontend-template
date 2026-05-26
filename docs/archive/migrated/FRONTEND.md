# 前端实现说明

本文档汇总当前前端代码库的实现约束。

## 技术栈

- Vue 3 + `<script setup>` + TypeScript
- Vue Router 5
- Pinia 负责 UI 与 shell 状态
- Vue I18n 负责共享文案
- Element Plus 作为基础组件库
- Sass 负责全局样式与 token 层

## 实现倾向

- 优先使用 Composition API 和类型化 props/emits
- 优先使用 schema 与配置对象，而不是页面局部临时分支
- 优先使用职责清晰、边界明确的窄 store
- 优先使用可复用的组件协议，而不是一次性的便捷 prop
- shell 行为优先通过 route metadata 表达，而不是页面条件分支

## 当前前端架构

- 应用启动：`src/main.ts`
- 路由协议与注册：`src/router/`
- shell 渲染与页面承载：`src/app/shell/`、`src/layouts/`
- 可复用组件基元：`src/components/`
- 示例页与验证页：`src/pages/`
- shell 状态：`src/stores/`
- 全局样式与 token：`src/assets/scss/`

## UI 契约

- 公共可复用组件必须在 `docs/components/` 中有 API 文档
- 共享行为优先先定义类型，再落实现
- slot 命名与事件语义应遵循 `docs/components/component-api-conventions.md`
- 如果多个组件共享同一套 field 或 query 协议，应只文档化一次，并在其他组件文档中引用

## 路由与 Shell 规则

- `src/router/app-route-schema.ts` 是当前路由声明事实来源
- `src/router/route-normalizer.ts` 负责补默认值和结构清洗
- `src/router/index.ts` 可以在导航后同步 shell store
- layout 选择统一放在 `AppLayoutRenderer`
- keep-alive 策略必须集中管理，不能泄漏到页面组件

## 测试约束

- 路由协议变化必须补单元测试
- store 行为变化必须补单元测试
- 共享组件行为变化必须补单元测试；如果会影响用户可见流程，需补针对性的 Playwright 覆盖
- 文档中的硬规则，必要时可由测试保护

## 反模式

- 在示例页中直接嵌入 shell 规则
- 公共组件对外暴露的 prop 或 slot 没有文档
- 在 schema 和页面代码里重复维护路由事实
- 本应属于 shell 或全局 token 的样式变量被写成页面私有值
- 在没有稳定使用者之前引入复杂抽象
