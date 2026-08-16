---
updated: 2026-08-16
---

# 计划：修复 main 分支 CI 依赖审计失败

## 背景

CI 的 `build-and-test` job 中 `pnpm audit --audit-level=high` 自 2026-07-07 起持续失败（当前 HEAD 提交 #124：19 high / 5 moderate）。
本机 registry 为 npmmirror 镜像（无 audit 端点），本地无法复现，已通过官方 registry 实时审计确认与 CI 一致。

## 目标

- `pnpm audit` 对官方 registry 扫描结果为 0 漏洞
- CI `Security audit` 步骤恢复绿色

## 方案

通过 `pnpm.overrides` 将存在已知修复版本的传递依赖锁定到已修复版本（精确版本，避免跨主版本替换破坏 API）。

`image-size`（无修复版）经重新解析锁文件后自然消除：它是 vite 可选 peer `less@4.4.2` 的传递依赖，
而 pnpm 10 全新解析不会自动安装可选 peer，less 整体退出依赖树（项目 0 个 .less 文件，无影响）。
实验验证：不添加 less override 时全新解析同样无 less/image-size，因此无需为 less 添加 override。

## 版本选择依据

以官方 registry 实时审计（audit-asgard-live.json）中 advisory 的 `patched_versions` 为准，
并逐一验证目标版本在 registry 上真实存在。

| 模块 | 当前版本 | 选定修复版本 | 备注 |
|------|----------|--------------|------|
| brace-expansion@^1 | 1.1.14 | 1.1.18 | 分主版本精确锁定，避免跨主版本替换破坏 API |
| brace-expansion@^5 | 5.0.5 | 5.0.9 | 同上 |
| fast-uri | 3.1.3 | 3.1.5 | 覆盖两个 high advisory |
| immutable | 5.1.5 | 5.1.8 | sass 传递依赖 |
| js-yaml | 4.1.0 / 4.3.0 | 4.3.1 | eslint 工具链 |
| nanoid | 3.3.15 / 3.3.16 | 3.3.18 | postcss 传递依赖 |
| postcss | 8.5.16 / 8.5.20 | 8.5.23 | 覆盖 high + moderate |

## 风险与假设

- 假设：精确版本锁定不会与依赖方的 semver 约束冲突（各选定版本均满足上游要求的主版本范围）
- 假设：less 退出依赖树不影响构建（项目未使用 .less 文件）
- 风险：版本被锁死后 dependabot 不会自动升级这些传递依赖，需定期复核（已记入技术债跟踪）

## 验证

1. `pnpm audit --registry=https://registry.npmjs.org` 结果 0 漏洞
2. `pnpm lint` / `pnpm type-check` / `pnpm test` / `pnpm build` 全部通过
3. lockfile 与 package.json 同步（CI 的 `--frozen-lockfile` 不报错）
