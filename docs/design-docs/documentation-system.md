---
id: design-doc-system
status: verified
owner: ""
tags: [docs, harness]
created: 2026-03-28
verified: 2026-05-26
---

# 文档系统

## 目的

说明为什么这个仓库的文档要按分层系统来组织。

## 设计原则

文档系统应像一张可以逐层深入的地图，而不是一本巨大的手册。

## 结构

- `AGENTS.md`：轻量导航（< 100 行）
- `ARCHITECTURE.md`：顶层地图
- `docs/DOMAINS.md`：业务领域划分
- `docs/design-docs/`：长期设计决策
- `docs/active/`：活跃需求与技术债
- `docs/archive/`：版本归档
- `docs/generated/`：自动生成物
- `docs/references/`：外部参考
- `docs/components/`：组件契约
- `docs/skills/`：项目级工作流 skill

## 为什么这种形状更适合 AI

- 入口足够小
- 事实按主题分组
- 文档可按需阅读
- 参考信息可独立更新
- 执行历史与长期设计分离

## 写作文档的规则

- 一份文档尽量只讲一个主题
- 开头先写清楚目的和范围
- 细节不要重复抄写，优先链接到更深层的权威文档
- 记录当前真实状态，而不是未来愿景
- 在合适的地方写明更新触发条件

## 维护规则

当改动落地后，优先更新“拥有该事实”的最窄文档。如果这次改动改变了整个仓库的整体理解，还应同步更新 `ARCHITECTURE.md` 或相应顶层索引页。
