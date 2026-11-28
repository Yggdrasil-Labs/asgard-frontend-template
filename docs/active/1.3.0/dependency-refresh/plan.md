# 依赖分批升级计划

## 范围与约束

按用户确认的“分批、本地升级、验证”执行。候选来自 2026-11-28 的 npm 元数据、官方变更说明与本项目兼容性检查；每批保留原有版本范围写法并更新锁文件，不执行提交或推送。

TypeScript 保持 6.0.3：7.0 的程序化 API、dependency-cruiser 及当前类型工具链尚不兼容。`@types/node` 保持 26.6.6；不扩展到后端、Bifrost 或环境工具升级。保留现有两个安全 override，除非有独立移除证据。

## 批次

| 批次 | 目标版本 | 验证重点 |
|------|----------|----------|
| 1：补丁 | Vue/compiler-sfc/shared 3.5.46；Element Plus 2.14.9；Axios 1.21.1；plugin-vue 6.0.11；lint-staged 17.6.3；PostCSS 8.5.34 | Vue 配套一致、请求与表单回归、声明漂移 |
| 2：运行时小版本 | VueUse 15.1.0；vue-i18n 11.4.24；vue-router 5.5.3 | 路由、壳层与响应式回归 |
| 3：构建与测试 | Vite 8.4.0；Vitest/coverage-v8 5.1.2；Sass 1.108.2 | 测试与覆盖率插件同版、生产构建与声明 |
| 4：检查器小版本 | ESLint 10.16.0；Knip 6.49.0 | 当前规则与公开入口不变 |
| 5：样式检查器大版本 | Stylelint 18.1.0；stylelint-config-standard-scss 18.0.0 | 配套 peer、SCSS/Vue 解析与新增规则 |
| 6：ESLint 预设大版本 | antfu 10.0.0 | 新规则及插件升级；只做必要格式适配，不弱化门禁 |
| 7：DOM 测试环境大版本 | jsdom 31.0.1 | 真实 Element Plus 校验、弹窗、焦点与样式兼容性 |

## 执行与验收

每批先备份 manifest、锁文件与受控声明，定点升级后检查实际安装版本和 peer 警告，运行 `pnpm check:full`、`pnpm build` 与 `pnpm audit --registry=https://registry.npmjs.org --json`。覆盖率阈值保持 31/28/24；安全要求无 high/critical，既有 moderate 单独记录，不能写作零漏洞。

失败先定位：只刷新真实发生漂移的生成声明；新增检查规则只做有依据的适配。无法在本批范围内解决时恢复该批并保留前批结果，不带失败进入下一批。

最终检查锁文件冻结安装、工作区差异及版本范围；使用现有 Chromium 与 Playwright 做本地浏览器冒烟，覆盖首页、表单、Customer 表格/编辑保存和移动端菜单。浏览器使用 mock R 响应，不声明真实后端、数据库、Bifrost E2E 或远端 CI 验收通过。实际结果统一记录于同版本 release.md。
