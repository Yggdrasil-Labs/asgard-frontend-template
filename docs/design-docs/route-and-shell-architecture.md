---
id: design-route-shell
status: verified
owner: ""
tags: [router, shell, layout]
created: 2026-03-28
verified: 2026-05-26
---

# 路由与 Shell 架构

## 目的

说明当前仓库如何从 route schema 派生应用 shell 行为。

## 核心流转

```text
app-route-schema.ts
  -> route-normalizer.ts
  -> normalized route tree
  -> Vue Router records
  -> route-driven shell sync
  -> menu, tabs, keep-alive, title, layout selection
```

## 核心设计决策

路由协议是 shell 行为的共享策略层。

这意味着：

- 页面标题默认值来自 route metadata
- 菜单可见性与排序来自 route metadata
- 标签页开启、关闭、固定策略来自 route metadata
- keep-alive 策略来自 route metadata
- layout 选择来自 route metadata

## 为什么这很重要

如果没有共享策略层，shell 行为就会泄漏到页面组件、布局组件、临时 router guard 和重复工具函数中。

## 当前实现边界

- 协议类型：`src/router/types.ts`
- 本地路由声明：`src/router/app-route-schema.ts`
- 默认值与结构清洗：`src/router/route-normalizer.ts`
- 标准化导出：`src/router/app-route-tree.ts`
- Vue Router records 生成：`src/router/app-routes.ts`
- 导航后的 shell 同步：`src/router/index.ts`

## 与 Store 的关系

store 不负责“发明策略”，它们负责承载由导航和交互派生出来的当前 UI 状态。

- `menu` 负责当前激活项与展开节点
- `tabs` 负责当前打开的页面会话
- `keep-alive` 负责缓存成员与 bust 版本
- `app-shell` 负责响应式 shell 展示状态

## 当前约束

- 当前路由源仍是本地静态声明
- 路由嵌套层级还比较浅
- 尚无后端驱动权限模型

这些约束当前是可接受的，因为协议形状已经能支持未来替换路由来源。

## 修改建议

如果新需求会改变 shell 行为，建议按下面顺序判断：

1. 现有 route metadata 是否已经足够表达？
2. 如果不够，路由协议是否需要增加新字段？
3. 这个字段应该由哪个 store 或 renderer 消费？
4. 应该增加哪些测试来保护新规则？
