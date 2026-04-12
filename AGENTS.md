# AGENTS.md

这个仓库同时服务于人类开发者与编码智能体。请把它当作导航页，而不是说明书全集。

## 仓库使命

`asgard-frontend-template` 是一个基于 Vue 3 + TypeScript + Vite 的前端模板，重点在：

- 基于 schema 的路由与 shell 布局
- 面向后台场景的可复用 UI 基元
- 国际化、规范、发布与验证的默认工程能力

它是可持续演进的模板工程，不是一次性的演示代码集合。

## 建议阅读顺序

开始工作时，只读当前任务需要的最小文档集合。

1. `ARCHITECTURE.md`
   顶层结构与事实来源边界。
2. `docs/FRONTEND.md`
   前端实现约束。
3. `docs/design-docs/` 或 `docs/product-specs/` 中的一篇聚焦文档
   按改动区域选择。
4. `docs/PLANS.md`
   中大型工作前阅读，理解计划如何记录。
5. `README.md`
   仅用于安装、脚本和背景补充，不作为事实来源。

## 事实来源

- 产品定位与模板目标：`docs/PRODUCT_SENSE.md`
- 架构与分层：`ARCHITECTURE.md`、`docs/design-docs/`
- 公共组件 API 行为：`docs/components/*.md`
- 执行状态与技术债务：`docs/exec-plans/`
- 生成物与外部参考：`docs/generated/`、`docs/references/`

如果两份文档冲突，优先采用更具体、且更靠近实际代码的那一份；仍不确定时，以代码和测试为准。

## 项目事实

- 运行时：Node.js `>= 22.14.0`
- 包管理器：`pnpm@10.32.1`
- 技术栈：Vue 3.5、Vue Router 5、Pinia、Vue I18n、Element Plus
- 构建工具：Vite 7
- 测试层次：
  - 单元与集成测试：Vitest
  - 端到端测试：Playwright
- 发布流程：Conventional Commits + Release Please

## 环境说明

- 在 WSL 中，如果 Node 环境未自动加载，先执行 `source ~/.nvm/nvm.sh` 再使用 `pnpm`。
- 当前机器可用 OpenJDK 17，但它不是本仓库的主运行时。

## 对智能体的工作约定

- 保持 `AGENTS.md` 简短，长期细节放到 `docs/`
- 优先更新已有聚焦文档，不新增“大杂烩文档”
- 公共组件 API 只保留一个权威文档位置
- 保持 schema 驱动的 shell 模型，页面组件不自行定义 shell 策略
- 关键 UX 变更要同时校验运行结果和文档
- 引入新抽象时，说明：为什么存在、事实来源在哪、明确不处理什么

## 目录地图

- `src/app/shell/`
  shell 渲染器与 route-cache。
- `src/router/`
  路由协议、schema、标准化与 router record 生成。
- `src/stores/`
  shell 与 UI 状态 store。
- `src/components/`
  可复用组件基元。
- `src/pages/`
  挂载到 route schema 上的示例页。
- `docs/components/`
  公共组件契约。
- `docs/design-docs/`
  长期设计决策。
- `docs/product-specs/`
  模板能力与用户结果。
- `docs/exec-plans/`
  活跃工作、已完成计划与技术债。
- `docs/references/`
  面向 AI 的紧凑参考。

## 常用命令

```bash
source ~/.nvm/nvm.sh
pnpm install
pnpm lint
pnpm type-check
pnpm test:e2e
```

## 文档维护规则

- 改动架构时，同时更新 `ARCHITECTURE.md` 和对应的 `docs/design-docs/` 文档。
- 改动用户可感知能力或模板工作流时，更新 `docs/product-specs/`。
- 开始或完成重要工作时，更新 `docs/exec-plans/`；只有当计划流程或目录约定变化时，才更新 `docs/PLANS.md`。
- 引入新的运维依赖或部署假设时，更新 `docs/references/` 或 `docs/generated/`。
- 改动安装方式、常用命令、目录总览或仓库入口说明时，再同步更新 `README.md`。

## 不要这样做

- 不要把这个文件写成冗长的规则清单。
- 不要把过时架构写成当前事实。
- 不要为仓库中尚不存在的系统提前写“想象中的文档”。
- 不要把示例页当成真实业务模块。
