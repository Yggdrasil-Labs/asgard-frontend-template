# 设计

这份文档是设计文档入口页。

## 这里覆盖什么

- 长期设计原则
- shell 与 route 架构选择
- 组件库策略
- 文档系统设计

## 这里不覆盖什么

- 执行计划
- 组件 API 细节
- 产品规格

这些内容分别在 `docs/PLANS.md`、`docs/components/`、`docs/product-specs/`。

## 核心设计文档

- `docs/design-docs/core-beliefs.md`
  仓库中应长期成立的核心设计原则。
- `docs/design-docs/route-and-shell-architecture.md`
  说明 route schema 如何驱动 layout 与 shell 行为。
- `docs/design-docs/component-library-strategy.md`
  说明可复用组件基元应如何演进。
- `docs/design-docs/documentation-system.md`
  说明这套文档为何这样组织，以及后续如何扩展。

## 设计评审清单

引入新抽象时，至少检查：

- 事实来源是否明确
- 是否增加了 shell 与页面耦合
- 是否能被测试验证
- 是否真的具备复用价值
- 是否有唯一权威文档位置

## 何时更新

以下场景应更新设计文档：

- 路由协议变化
- shell 职责迁移
- 组件扩展模式变化
- 文档体系结构变化
