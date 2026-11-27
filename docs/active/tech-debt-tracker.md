---
updated: 2026-11-27
---

# 技术债跟踪

本文档用于记录已明确存在、但暂时还没有升级成独立计划的技术债。

## 使用方式

- 债务必须真实且可行动
- 当代码和文档都修正后，应移除
- 一旦进入正式执行，应关联版本化独立计划；在满足关闭条件前保留条目
- 对外引用使用条目的显式锚点，避免依赖易变的展示序号

## 当前债务清单

<a id="static-route-source"></a>

### 1. 路由来源仍是静态本地声明

状态：开放

原因：

- route schema 当前仍硬编码在 `src/router/app-route-schema.ts`

目标状态：

- 在保留现有路由协议的前提下，为未来可能的动态路由源预留演进空间

<a id="demo-validation-coupling"></a>

### 2. 示例页仍承担了一部分验证职责

状态：开放

原因：

- 示例页既是展示面，也是共享组件行为的验证面

目标状态：

- 保持示例页有参考价值，但不让它们演变成隐藏业务容器

<a id="generated-docs"></a>

### 3. 生成型文档仍然较薄

状态：开放

原因：

- 仓库当前没有数据库 schema，也没有真正的工件生成流水线

目标状态：

- 只有在出现真实、值得入库的机器派生工件后，才扩展 `docs/generated/`

<a id="dependency-overrides"></a>

### 4. pnpm.overrides 锁定的安全版本需定期复核

状态：开放

原因：

- 2026-11-27 质检实施已逐项尝试移除 9 条覆盖。defu、form-data、happy-dom、immutable、lodash、nanoid、picomatch 共 7 条已移除；新锁文件的合并审计仍无 high/critical。
- 保留 `micromark-extension-math@3.1.0>katex=0.18.2`：单项移除会新增 1 个 low；保留 `oxfmt@0.35.0>tinypool=2.1.2`：单项移除会引入 2 个 critical。两条仍需随上游修复复核，不强行跨主版本更新。
- 当前尚有 1 个 moderate：minimatch（GHSA-g3hv-75wg-m249），来自 antfu→typescript-eslint 链；本批未以不兼容覆盖替换，保留待上游兼容更新。无 high/critical 不等于无漏洞。
- 历史修复见 [交付核验](../archive/legacy/security-deps-audit-fix/delivery.md)；本批验证与实际范围见 [1.3.0 版本记录](1.3.0/release.md#local-quality-system)。

目标状态：

- 上游工具链（eslint、commitlint、vite 等）升级后，逐个尝试移除对应 override 并验证 `pnpm audit` 仍为 0 漏洞
- 或改为兼容的范围约束并保持审计通过，不能仅靠放宽版本范围认定安全
- 由 [1.3.0 local-quality-system](1.3.0/release.md#local-quality-system) 承接，记录当前安装、门禁与审计结果，不复用历史 CI 结论

<a id="api-contract-r"></a>

### 5. 前后端响应与错误契约不一致

状态：开放（后端已有隔离合同实现，前端未对接）

原因：

- 当前 src/utils/api/request.ts 仍按 success、errCode、errMessage 消费 COLA 信封；src/types/api/response.ts 仍是旧响应/分页结构
- Customer 请求仍使用 page/size，编辑请求未携带 version；与后端统一 R、pageIndex/pageSize 及后续版本控制约定不一致
- 这是 [Midgard TD-009](../../../midgard-backend-template/docs/active/tech-debt-tracker.md#td-009前后端错误响应契约不一致) 的前端对应项；[公共 HTTP API 契约](../../../midgard-backend-template/docs/design-docs/arch-api-contract.md) 为规则唯一来源，本清单不复制字段定义

目标状态与关闭条件：

- 由 [1.3.0 api-contract-r](1.3.0/release.md#api-contract-r) 对接信封、分页、字段错误和版本冲突；后端 data-consistency 的 version/真实冲突仍是前置依赖
- 使用来源明确的后端受管序列化/standalone fixture 验证前端消费，覆盖成功、20001、21001、21002、校验、404 协议及 500 系统错误，保留业务码与安全消息；取消、超时、网络错误回归同时保留
- 至少一次真实 HTTP 消费链路验证后再与 TD-009 协同关闭；不把隔离 fixture、错误映射或本地单测等同真实并发、数据库或自动装配验证
- 真实 HTTP 可人工验证，不要求新增集成测试或修改 Bifrost E2E；证据不齐时保持开放
