# 1.3.0 版本记录

## 版本摘要

- **版本**：1.3.0
- **状态**：实施中（governance-alignment、local-quality-system 与 api-contract-r 已本地实现；真实 HTTP 与远端 CI 待验证，release-hardening 未开始）
- **目标**：围绕消除技术债提升项目质量：文档治理与后端对齐、建立参考 Mimir 分层设计的本地质检体系、对接后端统一的 `R` 响应契约、核查发布链路。
- **跨项目协同**：`api-contract-r` 依赖 Midgard 1.3.0 的 `error-contract-r` 与 `data-consistency`。契约规则以后端 [HTTP API 响应与错误契约](../../../../midgard-backend-template/docs/design-docs/arch-api-contract.md) 为唯一来源，本仓库不复制。

## 需求交付

需求目录在进入实施并编写计划时建立。

| 需求 | 路径 | 简述 | 依赖 | 状态 |
|------|------|------|------|------|
| governance-alignment | [实施计划](governance-alignment/plan.md) | 核验并归档 3 项无版本需求；文档改为版本化结构；修正技术债清单与后端交叉引用 | 无 | 已完成（文档范围；历史运行验收边界见下文） |
| local-quality-system | [实施计划](local-quality-system/plan.md) | 引入 sonarjs、jscpd、dependency-cruiser、stylelint、knip；`check`/`check:full` 两级入口；覆盖率阈值生效；恢复 husky；`type-check` 与 build 解耦；复核 `pnpm.overrides` | 无 | 已实现，本地全量门禁通过；远端 CI 待验证 |
| api-contract-r | [需求](api-contract-r/spec.md) · [设计](api-contract-r/design.md) · [计划](api-contract-r/plan.md) | 拦截器按 `R` 判定；类型重写；分页与字段级校验错误；编辑回传 `version`；领域错误码交互；后端来源明确的契约样例驱动测试 | Midgard error-contract-r、data-consistency（本地已实现） | 已实现，本地全量门禁通过；真实 HTTP 待验收 |
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
- 入口：`pnpm check`（日常：lint:fix 与 type-check，快速、自动修复）；`pnpm check:full`（全量、只检查不修改：lint、type-check、stylelint、jscpd、depcruise、knip、带覆盖率的测试）。
- 入口命名已于 2026-11-27 确认为 check/check:full：pnpm 10 会把 precheck 作为 check 的前置脚本，不采用该命名。
- `type-check` 与 build 解耦：当前先 build 是因为 `src/types/auto-imports.d.ts`、`components.d.ts` 由 Vite 插件生成且被 gitignore（见提交 `1c53764`）。解耦须提供不经完整构建的声明生成方式，或改为提交这两份声明并由检查校验其未过期；本方案采用跟踪声明并在全量检查中校验漂移，Vitest 不覆盖生产声明。不能简单删除 build 步骤导致类型检查缺失声明。
- CI 执行 `pnpm check:full`、`pnpm build`、`pnpm audit`，与本地同一入口。
- 覆盖率：行、分支、函数分别设置阈值，初始阈值经用户确认取摸底实测值向下取整：行 31%、分支 28%、函数 24%，启用后只升不降；替换当前未在 CI 执行的行 60% 阈值；测试命令带 `--coverage` 使阈值生效。
- husky：pre-commit 执行 lint-staged（eslint、stylelint），commit-msg 执行 commitlint。
- 环境：配置 `engines` 与 `packageManager`，与 `mise.toml` 的 Node 22 一致。
- 存量违规：先摸底记录基线，修复至零违规；误报或刻意写法就近禁用并写明原因；不使用基线文件冻结存量。
- `pnpm.overrides`：逐个尝试移除，前提是 `pnpm audit` 保持 0 个 high 漏洞；无法移除的保留并写明原因。
- 验收：临时普通副本分别引入重复代码、违反分层、复杂度超标、覆盖率不足、未使用导出、不规范提交信息，对应门禁均返回非零；正常代码 `pnpm check:full` 零违规通过。

<a id="api-contract-r"></a>

**api-contract-r**

- 重写 `src/utils/api/request.ts`：先判定 HTTP 状态与 `R.code`，统一抛出 `ApiError{code, message, httpStatus, traceId, details?}`；保留超时、取消、网络错误的既有判序。
- 重写 `src/types/api/response.ts`：`R<T>`、`PageResult<T>`、`ValidationErrorData`。
- Customer 页面：分页参数改为 `pageIndex`/`pageSize`；编辑回传 `version`；`00004` 的字段错误映射到 ProForm 字段；`21001` 高亮邮箱字段；`21002` 提示数据已被修改并提供刷新操作。
- 验收：以后端受管序列化/standalone 输出的 JSON fixture 驱动拦截器与 Customer API 单元测试，覆盖成功、`20001`、`21001`、`21002`、`00004`、400、500、超时、取消、网络错误。

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

### local-quality-system 摸底（2026-11-27）

- 基准：前端 HEAD dfe458c，起始工作区干净；WSL、实际 Node 22.23.3、pnpm 10.34.7。现有工具链 ESLint 10.13.0、Vite 8.3.5、Vitest/coverage-v8 5.0.5、vue-tsc 3.3.14；本轮未安装或升级依赖。
- 原生命令实测：pnpm lint 退出 0（约 6.63 秒）；pnpm type-check 退出 0（约 9.23 秒，含一次成功生产构建）；pnpm test 退出 0，29 文件/95 测试通过（约 3.44 秒）。计时为本机单次观测，不承诺性能目标。
- 开启 coverage 后仍为 95 项通过，但命令因现有行阈值 60% 未达而退出 1。原 include=src/** 还将 SCSS 送入脚本解析器；以命令行将 include 收窄为 src/**/*.{ts,tsx,vue} 后，解析警告消除，覆盖率为行 31.15%（620/1990）、分支 28.42%（369/1298）、函数 24.93%（197/790）、语句 30.35%（653/2151）。全量入口与阈值尚未实施，不能记为门禁通过。
- 覆盖率复现：pnpm test --coverage.enabled --coverage.include='src/**/*.{ts,tsx,vue}' --coverage.reportsDirectory=<临时报告目录> --coverage.reporter=text --coverage.reporter=json-summary；相关 CLI 选项见 [Vitest coverage 文档](https://vitest.dev/config/coverage.html)。普通 CI 的 pnpm test 当前不启用覆盖率。
- 补充只读检查：生产构建的 23 份 JS 中，request.ts 的 5 类 DEV 日志标记均无匹配；这只证明本次产物无这些标记，不代表浏览器运行验收。已有 hooks wrapper 可用，但 pre-commit/commit-msg 只有注释；当前 ESLint 有效配置未启用 sonarjs/复杂度规则。
- 临时 ESLint cyclomatic complexity>15 探针报告两个热点：route-normalizer.ts=22、utils/api/request.ts=19。该指标与 Sonar 认知复杂度不同，不作为 sonarjs 实际违规数。
- 静态扫描 95 份 TS/Vue（不含两份生成声明），识别 198 条唯一内部文件边；含/不含类型两图均无循环，现有四类禁止边为 0。模板、动态字符串及转换后图存在方法边界；未运行 dependency-cruiser，不能声称其门禁已验证。
- pnpm 生命周期最小夹具证实 precheck 会在 check 前自动执行；用户选择 check/check:full。用户另确认覆盖率初始 31/28/24，接入后只升不降。
- 当前 pnpm audit --registry=https://registry.npmjs.org --json：0 high/critical、1 moderate（minimatch，来自 antfu→typescript-eslint 链；GHSA-g3hv-75wg-m249）。无阈值限制的 audit 退出 1，不写作 0 漏洞。沙箱内最初被代理连接 EPERM 阻断，结果来自获准的沙箱外只读调用；未修改 override。
- 新检查器及 Vue/SCSS 解析配套尚未安装，真实违规规模与版本兼容性留实施 T1 实测；本次只形成 [计划](local-quality-system/plan.md)，不把静态探针当作新工具报告。运行日志、JSON/LCOV 与探针均在临时目录，不入库；远端 CI、Bifrost E2E 和真实 HTTP 未验证。

### local-quality-system 本地实施与验收（2026-11-27）

- 已接入 SonarJS 4.2.3（antfu 配套规则同时覆盖 Vue 脚本）、jscpd 5.4.3、dependency-cruiser 18.9.0、Stylelint 17.16.0/SCSS 配置 17.0.0、Knip 6.48.0；实际版本以锁文件为准。Stylelint 18 初装存在 peer 不匹配，改选 Node 22 兼容组合并刷新两个 csstools 传递依赖；未升级应用框架。
- 已建立 check/check:full；type-check 独立于 build，两份生成声明纳入版本管理。types:generate/types:check 在无旧声明的临时副本按生产配置生成/比对；Vitest 和普通 build 不写声明。Node 声明为 ^22.22.2 || ^24.15.0 || >=26.0.0，匹配现有工具链要求；最终验收固定使用 Node 22.23.3、pnpm 10.34.7。
- 首轮真实存量：Vue 脚本 SonarJS 1 处重复函数；jscpd 3 组重复；Stylelint 在对齐现有 BEM 后 169 条；Knip 结果逐项核对后保留公开模板入口，仅清理无消费者的内部导出、旧 E2E 索引和无用聚合文件。精确例外及理由见 [README](../../../README.md#代码质量)。
- 修复采用共享字段分组、示例日期字段工厂和 shell 按钮 mixin；字段分组新增 2 项回归，覆盖隐藏字段影响的分组顺序、空组、引用及输入保持。样式保留 Safari 15 媒体查询/前缀和已有无障碍 clip 语义，不更改 R 响应契约。
- 原生分层图补充 glob/模板组件/已知 locale JSON 边，再执行完整文件图循环检查。最终图为 192 条内部原生边（72 条类型边）、7 条 glob、1 条模板自动组件、2 条 locale 资源，0 违规；不把目录双向引用当文件循环。未知动态表达式明确失败，支持边界见脚本及工程夹具。
- 最终本地 check、check:full、build 均退出 0，前后受控文件与声明哈希一致；check 未串联全量入口。全量门禁包含 **30 个单测文件 / 97 项测试**及 **18 项工程夹具测试**，全部通过。行覆盖率 **31.68%（623/1966）**、分支 **29.19%（376/1288）**、函数 **25.41%（199/783）**，通过用户确认的 31/28/24 门槛；语句覆盖率 30.89%，未设置额外语句阈值。
- 临时普通副本逐项负例均命中预期工具并使全量入口非零：SCSS/Vue style、认知复杂度、重复代码、反向依赖、循环、未使用文件/导出/依赖、覆盖不足、声明多余/缺失。完整依赖夹具还覆盖 glob/模板参与的循环。暂存错误样式和仅 warning 的 ESLint 夹具使 pre-commit 失败；非法提交消息被拒绝，合法中文 Conventional Commit 消息通过，未创建提交或改用户索引。
- 最终 manifest/锁文件在无 node_modules 的临时目录完成离线 frozen-lockfile 安装；干净普通副本无需先 build 即通过 type-check 和 types:check。生产 JS 未包含 request.ts 的五类 DEV 日志标记，此证据不等同浏览器运行验证。
- 9 条 override 已逐项试移除，7 条在合并验证后移除；KaTeX（移除新增 low）及 tinypool（移除引入 critical）保留，原因及剩余 moderate 由 [技术债第 4 项](../tech-debt-tracker.md#dependency-overrides) 追踪。移除未使用 SARIF formatter、冗余 Iconify 直接依赖；保留有历史修复及当前 Element Plus 源码证据的 @vue/shared。
- 最终锁文件审计：pnpm audit --registry=https://registry.npmjs.org --json 返回 1 moderate、0 high/critical；退出 1 来自未限制等级的审计策略，不是无漏洞。首次最终请求发生 ECONNRESET，重试取得上述有效报告。
- 文档校验与 git diff --check 通过；新增/调整相对链接可达。README 原有 MIT License 链接的 LICENSE 目标缺失（HEAD 已有同一失效链接），未创建或修改许可证；这是本批之外的已有文档问题。
- CI 已统一执行 frozen install → check:full → build → high/critical audit；hook 实际启用。YAML/本地验证不代表远端 CI 已执行；真实浏览器、Bifrost E2E、后端与消费者验收不在本次结果内。
- 独立审查发现的 Node engines 范围与 lint-staged 警告放行问题均已修正并复核；原始维度均 4/5，无未解决发现。中途沙箱 spawnSync EPERM 通过获准的沙箱外本地验收解决，未改测试策略绕过失败；最终日志和临时夹具保存在 /tmp/asgard-quality-final，不入库。

### 分阶段交付核验（2026-11-28）

- 源码清理阶段使用真实暂存快照和该阶段锁文件，在临时普通目录离线安装后运行 lint、构建型 type-check 及测试；97 项测试通过。工具链阶段的独立暂存快照通过离线安装、check:full 和生产构建，包含 97 项单测与 18 项工程测试。
- 提交前补充修复：lint-staged 的 ESLint 命令增加 --no-warn-ignored，避免已配置忽略的文档提示被零警告策略误拦截；显式文档检查返回 0，console.log 警告夹具仍返回非零。真实代码 warning 继续阻断提交。
- CI 配置已核对命令链、触发范围与只读权限；本地提交不代表远端 CI、发布或消费者验收已完成。

### api-contract-r（2026-11-28）

- 按[方案](api-contract-r/plan.md)完成 R/PageResult/校验详情与运行时 guard，统一 HTTP/code 成功判定及 ApiError；普通 JSON 不接受旧信封，完整 AxiosResponse 边界保留。HEAD/OPTIONS/blob/arraybuffer 明确使用 raw；取消、超时、网络、协议与业务错误分层，无自动写重试。
- Customer API 五接口同步分页和整数 version；页面新增列表时序与回包纠正、删除末页单次退页、保存防重、冲突保留输入、确认刷新、失败/删除/取消恢复及弹窗会话隔离。缺失/耗尽版本禁止保存，后端 404 与 HTTP200/20001 不混淆。
- ProForm 新增 setFieldErrors/clearFieldErrors，只匹配 schema 可见精确字段；服务端消息独立持有，未改值失焦/本地依赖校验成功不会隐藏，相同消息可重复显示。支持字段变化、reset/setFieldsValue/submit/clearValidate 范围清理，组件不依赖业务 API；公开文档已同步。
- 从干净后端 af03830 的现有 CustomerHttpContractTest/CustomerResponseSerializationTest 在临时副本重新编译并执行，93 项隔离测试通过，捕获 76 个响应，选取 16 份 JSON。复放的 16 份规范化样例逐字节一致，仅规范化 timestamp、traceId 保留 null。来源、HTTP状态、场景和复现命令见 [fixtures](../../../tests/fixtures/api-contract-r/README.md)；原后端工作区未改，21002 样例仅验证错误映射，不代表真实并发。
- TDD 观察到旧 success 判定误放行、旧二层分页消费、页面无版本/冲突恢复、字段错误 API 与清理遗漏的失败；独立审查发现取消仅按 code 识别会误报，已用 axios.isCancel 同步并取得新增 Red/Green。API 85 项、Customer 21 项、服务端字段错误 14 项新增定向回归与原有测试合并执行。
- 最终 Node 22.23.5 / pnpm 10.34.7 下 pnpm check:full、pnpm build 退出0；**38 个单测文件 / 217 项测试、18 项工程测试全部通过**。行覆盖率 **52.03%（1089/2093）**、分支 **48.36%（723/1495）**、函数 **43.83%（359/819）**，通过既有31/28/24阈值；门禁与构建执行期间全部输入哈希一致；随后四份收尾文档单独更新并做文档校验，源码/测试/声明仍与成功验收快照匹配。types:check 与生产配置声明匹配，不需修改两份受控声明。无新增依赖或锁文件变更。
- 真实 Element Plus 校验测试暴露外部 async-validator 默认导出互操作问题，Vitest 最小配置 inline 两依赖，使真实校验器执行，未 mock 校验行为。首轮全并发 coverage 中路由冷导入超时，单测独跑成功；实测限制 maxWorkers=4 后全部在原5000ms阈值内通过，未提高timeout。types:check 在沙箱 spawnSync EPERM，获准沙箱外运行最终门禁通过，不把环境拒绝当通过。
- 本地127.0.0.1:8080未运行后端，未启动服务、部署或迁移数据库；真实 HTTP、数据库/自动装配、浏览器/Bifrost E2E、远端CI及消费者验收未验证。前端错误契约债与后端TD-009继续开放；这里只声明本地实现与隔离消费测试完成，不声明联调完成。原始本地日志位于 /tmp/asgard-api-r，未入库。

## 风险与遗留债务

- **外部依赖**：Midgard error-contract-r/data-consistency 已本地实现；api-contract-r 实施时采集来源明确的受管序列化/standalone fixture，真实应用/V2迁移与HTTP消费验收单独记录。
- **已接受的跨项目破坏**：契约变更后，Bifrost E2E 现有 Customer CRUD spec 将失败；1.3.0 不修改 Bifrost，验收不包含 E2E 通过（用户于 2026-11-11 规划时确认）。
- **规则覆盖边界**：本批现有存量已清理；新的动态模块表达式或组件解析方式需要扩展明确的图分析支持，不能以本轮零违规推断未来语法均已覆盖。
- **本版本不处理**：动态路由源、示例页职责拆分、前端规则共享包。
