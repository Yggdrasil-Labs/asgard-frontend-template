# 文档治理对齐实施计划

**归属版本**：1.3.0（用户指定）

## 目标与范围

核验三个历史无版本需求，保留可追溯的交付证据；建立按版本组织的活跃需求导航，修正技术债与跨项目引用。本需求仅调整文档，不修改运行时代码、依赖、测试、CI 或发布流程。

## 背景与关键决策

- 版本范围以 [1.3.0 版本记录](../release.md) 为准；当前 index、release 中已有规划内容须保留。
- `security-deps-audit-fix`、`code-governance-round-1`、`code-governance-round-2` 的原计划位于无版本目录，计划本身不是完成证据。核对最终提交和当前源码，尤其后续修正，区分已实现、历史验证、当前验证与未知。
- 旧需求不追认版本：核验后移至 `docs/archive/legacy/<原需求名>/`，原计划正文保留，另在同目录 `delivery.md` 说明证据与后续事项；这不是归档 1.3.0。
- 已实现但缺少验收证据的旧工作可作为“历史记录归档，验收未闭合”保存，必须明确登记剩余项，不能标记验收通过。未实现项分流到已有 1.3.0 需求或技术债，不补做业务改动。
- 活跃版本的 `release.md` 拥有交付状态与验证摘要；`plan.md` 保持静态。技术债条目使用显式稳定锚点供跨项目引用。
- API 样例来源约定的修正留给 `api-contract-r`；不借本次治理更改其他需求的行为范围。

## 任务与依赖

按 T1 → T2 → T3 → T4 顺序执行，共享索引和技术债文件串行修改。

### T1：核验旧需求

读取三个旧目录下的 `plan.md`、相关 Git 提交及其后续修正、当前代码与测试。逐项记录需求目标、最终实现、提交证据、已有验证及未知。不得把历史审计、测试源码存在、提交描述当作当前 CI 或当前依赖安全结论。

验收：三个需求的每项范围均有明确结论；未闭合项明确分流到 `local-quality-system`、`api-contract-r` 或技术债。证据不足时显式保留待验证状态。

### T2：保存历史与统一导航

文件操作：

- Move：`docs/active/{security-deps-audit-fix,code-governance-round-1,code-governance-round-2}/plan.md` → `docs/archive/legacy/<原需求名>/plan.md`，原正文不改写。
- Create：各归档目录的 `delivery.md`，记录 T1 的逐项目标核验、证据边界和剩余项。
- Modify：`docs/archive/index.md`，单列无版本历史需求，记录本次整理日期、证据与保留期限；不伪造原交付日期。
- Modify：`docs/active/index.md`，按版本导航，旧需求从 active 移除，链接历史归档。
- Modify：`AGENTS.md`、`docs/design-docs/documentation-system.md`，说明 `active/{version}/release.md`、需求目录、archive/legacy 及技术债的职责。仅维护文档组织，不改架构依赖方向。
- Modify：`docs/QUALITY_SCORE.md`，将旧技术债路径修正为 `docs/active/tech-debt-tracker.md`。

验收：原计划字节内容与移动前一致；三个旧目录不再位于 active；活跃版本仍保持 1.3.0；新增目录及导航链接存在，AGENTS 不超过 100 行；不移动已有 `archive/migrated/` 内容。

### T3：对齐技术债与版本记录

文件操作：

- Modify：`docs/active/tech-debt-tracker.md`，核验并保留现有 4 项，更新已漂移描述，增加错误契约债及稳定锚点，声明其与后端 TD-009 的对应关系和关闭条件。
- Modify：`../midgard-backend-template/docs/active/tech-debt-tracker.md`，仅将 TD-009 的“前端第 10 项”改为新条目的精确锚点链接，保留其余后端内容。
- Modify：`docs/active/1.3.0/release.md`，链接本计划，记录本次治理交付、实际验证及历史残余事项，不改写其他需求范围，不将整个版本标记完成。

验收：技术债与代码事实相符，既有条目不凭推测关闭；TD-009 两端互链可达；错误契约债保留前端消费测试及真实 HTTP 链路验证的关闭条件。此次未运行安全审计，不声称 0 漏洞；local-quality-system 后续摸底产生的债务由该需求登记。

### T4：文档校验与收尾

读取 `docs/generated/` 判断本次是否影响源生成物；未改变源事实则不手改生成文档。

验收：

- 在前端仓库运行 `node /home/yangyang/.codex/skills/docs-evolve/scripts/lint-docs.mjs`，退出码为 0。
- 检查本次新增、修改、移动文档的相对 Markdown 链接及新增锚点；已有无关失效链接单独报告，不扩展为全库修复。
- 搜索活跃文档与 AGENTS，旧需求路径及失效技术债路径不再作为现行入口；归档历史原文不强行改写。
- `git diff --check` 通过；核对最终修改仅涉及上述文档及同范围内必要的链接修正。无源码、锁文件、生成文档、Git 提交或远端写入。

## 决策边界

可自行选择证据展示方式、稳定锚点命名和相邻链接的必要修正。发现旧需求存在功能缺陷，仅记录并分流；不在本批修复。改变公共契约、架构规则、依赖、版本归属或扩大归档范围时重新对齐。用户授权本地实施不包含提交、推送或发布。
