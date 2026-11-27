# 第一批代码治理：历史交付核验

- 整理日期：2026-11-27；版本归属：未记录，不追认版本。
- 结论：H1–H4 的实现可追溯；历史验收记录不完整，本次仅核对源码与提交，未复跑应用门禁。
- 原始输入：[计划原文](plan.md)（保持不变）。

## 范围与证据

| 原范围 | 最终实现及提交证据 |
| --- | --- |
| H1 类型检查真实化 | `4d976f3` 指向 tsconfig.app.json 并修正类型；`1c53764` 后续为自动生成声明增加 build 前置。当前 [type-check 入口](../../../../package.json) 是 pnpm build 后运行 vue-tsc，不能归档成“已与构建解耦”。 |
| H2 HTTP 返回类型与 ApiError | `29d0193` 使 [HTTP 包装器](../../../../src/utils/api/http.ts) 返回 AxiosResponse，增加 [ApiError](../../../../src/utils/api/error.ts)，移除相关 as any 补丁；`586b95d` 补分页类型与解包。当前仍消费 COLA 信封，R 契约对接不属于旧批次完成范围。 |
| H3 日志、环境变量与示例 | `29d0193`、`586b95d` 将 [请求日志](../../../../src/utils/api/request.ts) 限于 import.meta.env.DEV 且不打印数据载荷；`344e17d`、`586b95d` 在 [env](../../../../src/config/env.ts) 中使生产缺失/空白 API 地址时抛错，并清理 .env.example。 |
| H4 /api 约定 | `344e17d`、`fc7309c` 统一 baseURL 只到 origin、接口路径自带 /api；[Customer API](../../../../src/api/modules/customer.ts) 与 [README](../../../../README.md) 保留该约定。 |

## 验证边界与后续归属

- `1c53764` 的提交说明记载干净副本构建、类型检查、配置 lint 通过；`244ddd0` 的后续提交说明记载当时的 lint/build/type-check 与 95 项测试通过。未取得对应完整原始日志；不作为本次运行结果或当前 CI 结论。
- 原计划要求的生产构建日志行为，本次只有源码 DEV 门控证据，没有重新检查生产产物或浏览器运行。
- [local-quality-system](../../../active/1.3.0/release.md#local-quality-system) 承接类型声明生成、type-check 与 build 解耦及当前完整本地门禁验证；其收尾需补充生产产物日志检查，当前保持待验证。
- [错误契约债](../../../active/tech-debt-tracker.md#api-contract-r) 承接 R 信封、分页和错误消费验证；不能因旧 ApiError 已存在而关闭。
