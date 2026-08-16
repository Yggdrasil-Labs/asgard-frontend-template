---
updated: 2026-08-16
---

# 计划：代码治理第一批（门禁重建与安全止血）

## 范围

基于 2026-08-16 代码走查报告的第一梯队：

- H1 类型检查门禁重建：`type-check` 指向 `tsconfig.app.json`，修 17 个真实类型错误
- H2 HTTP 契约真实化：返回类型如实反映 AxiosResponse，统一 ApiError，删除 `as any`
- H3 安全止血：生产日志 DEV 门控、生产配置 fail-closed、.env.example 清理
- H4 开箱可用：统一 API baseURL 的 /api 约定（消除 api/api 404）

## 原则

- 每个批次原子提交，逐项验证（lint / type-check / test / build）
- H2 选「类型如实化」方案（不改运行时返回形状），避免波及 204/blob 下载路径
- 不在本批触碰路由双源与 keep-alive（第二批）

## 验证标准

1. `pnpm type-check` 真实检查且 0 错误
2. `pnpm lint` / `pnpm test` / `pnpm build` 全绿
3. 生产构建下 request.ts 无 console 数据日志
