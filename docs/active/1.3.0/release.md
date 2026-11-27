# 1.3.0 版本记录

## 版本摘要

- **版本**：1.3.0
- **状态**：实施中（governance-alignment 已完成本地文档核验，其余需求未开始）
- **目标**：围绕消除技术债提升项目质量：文档治理与后端对齐、建立参考 Mimir 分层设计的本地质检体系、对接后端统一的 `R` 响应契约、核查发布链路。
- **跨项目协同**：`api-contract-r` 依赖 Midgard 1.3.0 的 `error-contract-r` 与 `data-consistency`。契约规则以后端 [HTTP API 响应与错误契约](../../../../midgard-backend-template/docs/design-docs/arch-api-contract.md) 为唯一来源，本仓库不复制。

## 需求交付

需求目录在进入实施并编写计划时建立。

| 需求 | 路径 | 简述 | 依赖 | 状态 |
|------|------|------|------|------|
| governance-alignment | [实施计划](governance-alignment/plan.md) | 核验并归档 3 项无版本需求；文档改为版本化结构；修正技术债清单与后端交叉引用 | 无 | 已完成（文档范围；历史运行验收边界见下文） |
| local-quality-system | `1.3.0/local-quality-system/` | 引入 sonarjs、jscpd、dependency-cruiser、stylelint、knip；`check`/`precheck` 两级入口；覆盖率阈值生效；恢复 husky；`type-check` 与 build 解耦；复核 `pnpm.overrides` | 无 | 未开始 |
| api-contract-r | `1.3.0/api-contract-r/` | 拦截器按 `R` 判定；类型重写；分页与字段级校验错误；编辑回传 `version`；领域错误码交互；后端真实样例驱动测试 | Midgard error-contract-r、data-consistency | 未开始 |
| release-hardening | `1.3.0/release-hardening/` | 按后端同等标准核查发布流程的凭据、版本单调与并发 | 无 | 未开始 |

推荐顺序：governance-alignment 与 local-quality-system 先行（与后端并行），使 api-contract-r 的新代码从一开始即受门禁约束；release-hardening 可随时插入。

### 各需求的范围与验收要点

**governance-alignment**

- 逐项核对 `security-deps-audit-fix`、`code-governance-round-1`、`code-governance-round-2` 的计划范围与实际提交和验证证据；已完成的整体归档到 `docs/archive/`，未完成部分转入 1.3.0 或登记技术债。
- 文档治理向后端对齐：`docs/active/{version}/release.md` 加需求目录；`active/index.md` 按版本导航；`archive/index.md` 补齐归档记录；同步更新 AGENTS.md 中的路径说明。
- 技术债清单核实现有 4 项；修正与后端 TD-009 对应条目的编号引用（错误契约债由 api-contract-r 关闭）；登记 local-quality-system 摸底中发现但本版本不处理的问题。

<a id="local-quality-system"></a>

**local-quality-system**

- 工具：`eslint-plugin-sonarjs`（叠加 antfu 预设，对应 PMD）、`jscpd`（对应 CPD）、`dependency-cruiser`（对应 ArchUnit）、`stylelint`（scss 与 vue）、`knip`（未使用文件、导出与依赖）。配置文件放在各工具默认位置，不做共享包。
- 分层规则：`pages` 可依赖 `components`、`api`、`utils`、`stores`；`components` 不依赖 `pages`、不直接调用 `api`；`utils` 不依赖 `pages`、`components`；禁止循环依赖。`src/` 下另有 `app`、`composables`、`config`、`constants`、`layouts`、`locales`、`router`、`types`，实施时逐一确定其层级后定稿。
- 入口：`pnpm check`（日常：lint:fix 与 type-check，快速、自动修复）；`pnpm precheck`（全量、只检查不修改：lint、type-check、stylelint、jscpd、depcruise、knip、带覆盖率的测试）。
- `type-check` 与 build 解耦：当前先 build 是因为 `src/types/auto-imports.d.ts`、`components.d.ts` 由 Vite 插件生成且被 gitignore（见提交 `1c53764`）。解耦须提供不经完整构建的声明生成方式，或改为提交这两份声明并由检查校验其未过期；不能简单删除 build 步骤导致类型检查缺失声明。
- CI 执行 `pnpm precheck`、`pnpm build`、`pnpm audit`，与本地同一入口。
- 覆盖率：行、分支、函数分别设置阈值，初始值取摸底实测值向下取整，之后只升不降；测试命令带 `--coverage` 使阈值生效。
- husky：pre-commit 执行 lint-staged（eslint、stylelint），commit-msg 执行 commitlint。
- 环境：配置 `engines` 与 `packageManager`，与 `mise.toml` 的 Node 22 一致。
- 存量违规：先摸底记录基线，修复至零违规；误报或刻意写法就近禁用并写明原因；不使用基线文件冻结存量。
- `pnpm.overrides`：逐个尝试移除，前提是 `pnpm audit` 保持 0 个 high 漏洞；无法移除的保留并写明原因。
- 验收：临时分支分别引入重复代码、违反分层、复杂度超标、覆盖率不足、未使用导出、不规范提交信息，对应门禁均返回非零；正常代码 `pnpm precheck` 零违规通过。

<a id="api-contract-r"></a>

**api-contract-r**

- 重写 `src/utils/api/request.ts`：先判定 HTTP 状态与 `R.code`，统一抛出 `ApiError{code, message, httpStatus, traceId, details?}`；保留超时、取消、网络错误的既有判序。
- 重写 `src/types/api/response.ts`：`R<T>`、`PageResult<T>`、`ValidationErrorData`。
- Customer 页面：分页参数改为 `pageIndex`/`pageSize`；编辑回传 `version`；`00004` 的字段错误映射到 ProForm 字段；`21001` 高亮邮箱字段；`21002` 提示数据已被修改并提供刷新操作。
- 验收：以后端集成测试导出的真实 JSON 样例驱动拦截器与 Customer API 单元测试，覆盖成功、`20001`、`21001`、`21002`、`00004`、400、500、超时、取消、网络错误。

**release-hardening**

- 核查 `.github/workflows/release.yml`、`create-tag.yml` 与 Dockerfile 的凭据处理、版本单调性与并发协调。
- 发现问题时按后端 release-hardening 方式修复并在 fork 演练；无问题时记录核查结论并关闭。

## 独立交付

暂无。

## 最终验证摘要

### governance-alignment（2026-11-27）

- 已按 [计划](governance-alignment/plan.md) 核验三个历史无版本需求并迁入 [legacy 归档](../../archive/index.md#legacy-requirements)，保留原计划字节内容，另附逐项实现、提交、验证来源与剩余项。未追认版本，历史记录归档不等于当前运行验收通过。
- 已统一版本导航、AGENTS 路径与文档系统说明，修正 QUALITY_SCORE 的失效入口；核验原有 4 项债务，更新 override 现状，并新增 [错误契约债](../tech-debt-tracker.md#api-contract-r)，修复后端 TD-009 对前端不存在的“第 10 项”的引用。
- 历史证据：keep-alive 最终由 f1ffafd 改为文件名映射；type-check 由 1c53764 增加 build 前置。244ddd0 提交说明记载当时审计与门禁通过，未找到原始审计报告，不作为当前安全或 CI 结论。
- 运行验收剩余项：local-quality-system 承接当前安装、类型检查、单测、构建与审计，并补核生产产物日志；api-contract-r 承接响应消费与 B4 判序回归。浏览器缓存/HMR 没有本次验证证据；Bifrost 仍沿用本版本排除范围。
- 本地文档验证：docs-evolve 的 lint-docs.mjs 退出 0（0 错误、0 警告）；检查本批 15 份 Markdown 的 66 个相对链接与锚点均可达，三个原计划与 HEAD 字节一致；git diff --check 通过。docs/generated 仅有注册表，本次没有改变其数据源，未手改生成文档。
- 验证边界：本批未修改源码、锁文件或 CI，未运行应用门禁、安全审计、浏览器/E2E 或远端 CI；历史验收未闭合项继续由交付说明及技术债追踪。

## 风险与遗留债务

- **外部依赖**：api-contract-r 需等待 Midgard 1.3.0 契约落地并导出真实样例。
- **已接受的跨项目破坏**：契约变更后，Bifrost E2E 现有 Customer CRUD spec 将失败；1.3.0 不修改 Bifrost，验收不包含 E2E 通过（用户于 2026-11-11 规划时确认）。
- **存量违规规模未知**：local-quality-system 的工作量取决于摸底结果；某类违规数量过大时单独讨论处理方式。
- **本版本不处理**：动态路由源、示例页职责拆分、前端规则共享包。
