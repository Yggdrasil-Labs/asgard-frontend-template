# 本地质检体系实施计划

**归属版本**：1.3.0（用户指定）

## 目标与上下文

在当前 Vue 3 工程建立可阻断的本地/CI 质检入口，落实 [版本范围](../release.md#local-quality-system)。本轮摸底结果见同一版本记录的验证摘要；方案就绪不代表已安装工具或已修复存量。

本需求属于工程质检能力，使用一份自包含计划说明命令、规则与验收；不新增业务接口或数据模型，不为文件数量增加独立 Spec/Design。

## 已确认决策与行为契约

- 用户已确认入口为 `pnpm check` / `pnpm check:full`。pnpm 10.34.7 会将 precheck 自动作为 check 的前置脚本，故不新增名为 precheck 的脚本，不改变全局生命周期配置。
- `check`：只运行 lint:fix 与独立 type-check，允许格式修复；不触发全量门禁。`check:full`：顺序执行 lint、type-check、stylelint、jscpd、depcruise、knip、test:coverage 及生成声明漂移检查；各子项失败使入口非零，源码与受控声明内容不被修改。
- 覆盖率统计 TS/TSX/Vue 源码，排除声明文件，不把 SCSS 作为可执行代码。用户已确认 lines=31、branches=28、functions=24 为初始百分比阈值，启用后只升不降；替换当前未在 CI 执行的 lines=60。不得缩小统计范围掩盖覆盖不足。
- 声明解耦采用跟踪 `src/types/auto-imports.d.ts`、`components.d.ts` 的方案：type-check 直接运行 vue-tsc，干净检出无需先 build。全量检查从无旧声明的临时普通副本按生产配置重新生成并比对，防止 append 保留过期条目；Vitest 不覆盖生产声明。独立轻量生成器需要维护额外扫描流程，本批不选该路径。
- 新工具只作为本项目 devDependencies 接入，配置放默认位置；不创建共享规则包，不升级框架/核心工具链以迁就检查器。具体版本以 Node 22、现有 ESLint/Vite/TS 的 engines/peer 兼容性及锁文件解析为准，不能直接全部选 latest。
- 存量问题在摸底后修至零；误报及有依据的例外需最小范围配置/就近说明。禁止用基线文件、全局禁用规则、任意忽略目录或提高阈值隐藏问题。
- 依赖审计阻断 high/critical；当前 moderate 需保留来源与处置结论，不把“无 high”写成“0 漏洞”。override 逐个复核，不能强行跨主版本替换传递依赖。

## 依赖边界

规则扫描生产 src，并覆盖 .vue 脚本、TS 别名、类型边及动态路由装载；测试作为调用方，不套生产分层限制。循环按文件依赖判定，不能按目录聚合图判环。

| 职责 | 允许与禁止的边界 |
| --- | --- |
| 启动 main/App | 可装配 router、shell、状态、国际化、初始化与样式；其他源码不反向依赖启动入口 |
| pages | 可组合 components/api/utils/stores、共享类型、配置及协议；不定义 shell 策略 |
| components | 可复用 UI/composable/类型/工具与框架能力；禁止 pages、业务 api、shell 状态及项目 router 实现，允许 vue-router 的通用 query/跳转能力 |
| api | 依赖 HTTP 工具与 API 类型，不依赖 UI/shell |
| app/shell、layouts | 同一 shell 渲染职责组，允许内部组合并读取 stores、路由协议与 UI；不直接依赖 pages |
| stores | 表达 shell 状态；允许断点和基础协议，精确放行 app/shell/route-cache.ts，不能放行整个 renderer 目录 |
| router | 协议文件只依赖协议/共享类型；index.ts 可同步 store，仅 app-routes.ts 的 glob 可装载 pages |
| composables | useAppBreakpoint 为纯 UI 能力；useI18n 为国际化适配。组件应直接导入纯 UI 文件，避免经混合 barrel 间接引入初始化 |
| config/constants | 基础配置，不依赖 UI、shell 或业务请求 |
| locales | 文案、类型、国际化初始化分清职责；允许语言属性工具的现有单向文件边 |
| types | 共享协议及路由扩展，允许明确的类型引用例外；不能假设整个目录均无运行时代码 |
| utils | 允许 config、共享类型和 Locale 类型；禁止 pages/components、业务 api 和 shell 实现 |

保留精确类型例外：router/types.ts、stores/menu.ts、types/vue-router.d.ts → components/icon/icon.types.ts；types/index.ts、types/vue-router.d.ts 的路由协议引用。`~icons/*` 仅作为精确虚拟模块例外，不全局忽略无法解析依赖。静态摸底的 198 条边不是 dependency-cruiser 已生效的证据。

## 任务

任务串行 T1 → T2 → T3 → T4，共享 package.json、锁文件、配置和验证入口由同一实施者协调，不并行写入。

### T1：接入检查器并测量真实存量

- Modify：`package.json`、`pnpm-lock.yaml`，添加 sonarjs、jscpd、dependency-cruiser、stylelint、knip 及必要 Vue/SCSS 解析与配置依赖；保留 pnpm 10.34.7，核对 Node 22 的 engines 下限。
- Modify：`eslint.config.js`，保留 antfu，显式启用 sonarjs 认知复杂度规则（阈值 15）及其兼容的推荐规则；避免重复插件注册和同义规则重复报告。
- Create：`.jscpd.json`，扫描 src 中的 TS/TSX/Vue/SCSS，minTokens=100、minLines=10、重复比例阈值 0；不把测试夹具或生成声明计入生产重复率。
- Create：`.dependency-cruiser.cjs`，编码上述依赖边界与文件循环检查；验证 Vue、别名、type-only、glob、模板自动组件的实际解析范围。若原生扫描遗漏必须保护的边，只增加必要 Vue 分析依赖或局部补充检查，不将盲区声称为已覆盖。
- Create：`stylelint.config.mjs`，使用兼容的 SCSS 规则与 Vue style custom syntax，覆盖独立 SCSS 及 Vue style；不将 Vue template/script 作为 CSS 解析。
- Create：`knip.json`，以应用启动、配置、测试及 Vite 动态入口确定可达性，检测未使用文件、导出和依赖；对自动导入、图标、Vue 模板及公共组件契约给出精确依据，不将全部 exports 标为忽略。

验收：各工具在本地锁定安装中可执行，Node/peer 兼容且 frozen-lockfile 安装可复现；分别输出真实违规数量和位置。当前两项 cyclomatic complexity 探针不替代 sonarjs 测量。规则配置应先以正常/最小违规夹具确认有效，不能因“正常代码零报告”判定已生效。

### T2：类型声明、覆盖率和两级命令

- Modify：`.gitignore`，移除两份生成声明的忽略项；Create（纳入版本管理）：`src/types/auto-imports.d.ts`、`src/types/components.d.ts`，从空声明的生产配置生成。
- Modify：`vite.config.ts`、`vitest.config.ts`，确保生产声明确定性生成，测试运行不重写生产声明；覆盖率 include 仅 TS/TSX/Vue，补齐三个阈值。可同步将两配置的 __dirname 改为当前 Node 22 支持的 import.meta.dirname，消除已观察到的 native loader 警告，不屏蔽警告。
- Create：`scripts/check-generated-types.mjs`，作为长期的声明漂移检查入口；只复制必要源码/配置到临时普通副本，复用已安装依赖，不复制实际 .env/凭据、不安装依赖。重新生成后比对受控声明，失败非零；副本产物不写入源码树。
- Modify：`package.json`，添加各检查器子命令及 check/check:full/test:coverage/types:check；type-check 移除完整 build 前置。lint 与检查类命令均不使用 --fix；只有 check 的 lint:fix 自动修复。门禁规则使用阻断级别，ESLint lint 设置 --max-warnings=0，避免只打印警告却返回成功。

验收：新鲜普通检出副本不先 build 可 type-check；删去声明中的有效条目或留入过期条目，types:check 均失败且不自动修改文件；Vitest 前后声明哈希相同；覆盖率报告无 SCSS 解析错误，任一指标不足使 test:coverage 非零。types:check 内部生产构建仅用于完整漂移校验，日常 type-check 不承担该构建成本。

### T3：存量修复与依赖复核

- Modify（按 T1 实报位置）：`src/**` 与 `tests/unit/**`，仅修规则触发的重复、复杂度、分层、样式、无用代码；必要时补回归测试。已知可能热点为 route-normalizer.ts、utils/api/request.ts；不得预判 sonarjs 必然报告二者。
- 可将仅消费断点的组件从 composables barrel 改为直接导入 useAppBreakpoint；保留路由缓存辅助函数、图标类型及公开组件导出的精确例外。
- Modify：`package.json`、`pnpm-lock.yaml`，逐个尝试移除 override；审计须保持无 high/critical，并通过受影响门禁。保留项及 moderate 问题的原因写入技术债，不引入不兼容主版本覆盖。
- Modify：`docs/active/tech-debt-tracker.md`，记录 override 的实测结论及获准留待后续的问题；不能仅因门禁通过就删除尚未满足关闭条件的债务。

验收：check:full 零违规；有效例外有原因且范围最小；公开组件、shell、HTTP 和页面交互语义保持不变。若某类存量修复需要大规模职责拆分、改变公共契约、升级核心依赖或超出本版本范围，先汇报实际数量/路径和处理选项，重新对齐，不以批量禁用替代修复。

### T4：钩子、CI 与反向验收

- Modify：`.husky/pre-commit`、`.husky/commit-msg`，启用 lint-staged / commitlint；完善 package.json 的 lint-staged，使 ESLint 与 stylelint 处理对应暂存文件，明确修复模式。
- Modify：`.github/workflows/ci.yml`，固定既有 Node 22/pnpm 配置，执行 frozen-lockfile 安装、pnpm check:full、pnpm build、pnpm audit --audit-level=high；本地与 CI 使用相同门禁，不保留旧的无覆盖率测试作为唯一证明。
- Modify：`README.md`、`AGENTS.md` 的命令说明；`docs/RELIABILITY.md` 同步新增验证层与 CI 门禁的机制事实（该文档明确要求此类变化同步），限本批入口及验证边界，不改稳定性目标或 shell 假设；`docs/active/1.3.0/release.md` 记录真实交付、门禁结果及盲区。不把本地 YAML/命令验证称为远端 CI 通过。

验收：在临时普通副本或独立夹具中分别引入：lint/认知复杂度、SCSS/Vue style 违规、重复代码、反向依赖及循环、未使用文件/导出/依赖、覆盖率不足、声明漂移。相应工具与全量入口返回非零；不规范提交信息及暂存文件违规单独通过 hook 的临时消息/暂存夹具验证，不要求 check:full 检查不存在的提交消息，不创建真实提交，也不动用户索引。

同时证明：正常 check 不自动运行 check:full；check:full 前后受控源文件/声明哈希不变，CI 流程使用相同入口，生产构建仍成功且请求 DEV 日志标记不进入产物。原始日志/临时探针留在系统临时目录，仓库只保留持续复用的配置、声明校验脚本与必要回归测试。

## 实施边界

本轮授权为摸底与方案，不包含上述工具安装、依赖或源码实施。后续获准实施时可在契约内决定兼容版本和普通实现细节；更换检查器、阈值下降、缩小受检范围、改变架构原则或业务行为须重新对齐。不得顺带实施 api-contract-r、调整后端/Bifrost、提交或推送。
