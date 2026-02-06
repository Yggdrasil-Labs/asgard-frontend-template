# qiankun 最佳实践

本文档总结基于本模板使用 qiankun 时的推荐做法与常见陷阱。

## 子应用拆分原则

- **按业务域拆分**：子应用边界尽量与业务域一致，避免一个子应用过大或职责混杂。
- **独立可运行**：每个子应用应能单独 `pnpm dev:micro` 运行与调试，不依赖主应用才能开发。
- **统一技术栈**：主应用与子应用均使用 Vue 3 + Vite 时，版本与构建配置尽量对齐，减少沙箱与路由兼容问题。

## 通信机制

- **推荐**：主应用通过 `props.eventBus` 下发事件总线，子应用在 `mount(props)` 中订阅/发布；需要共享状态时由主应用维护并经由 `props.globalState` 下发。
- **避免**：子应用直接读写 `window` 上主应用内部变量，或依赖未在 props 中声明的全局对象，以免耦合与升级困难。

## 性能优化

- **子应用体积**：控制子应用构建产物大小，避免过大的 UMD 包；可配合 Vite 代码分割（注意子应用当前为单 UMD，依赖会打在一起）。
- **预加载**：主应用在 `src/config/qiankun.js` 中配置 `prefetch: true` 或 `'all'`，按需预加载子应用资源，平衡首屏与切换速度。
- **缓存**：子应用静态资源使用稳定文件名与长期缓存（如 nginx 对 `/static/` 设置 1 年），主应用 entry 指向带版本或 hash 的入口以控制更新。

## 安全与部署

- **环境变量**：敏感信息不要放在 `VITE_*` 中，生产配置通过构建环境或后端下发。
- **HTTPS**：生产环境主应用与子应用均使用 HTTPS，避免混合内容与安全策略问题。
- **CORS**：子应用若与主应用不同域，子应用域名必须正确返回 CORS 头（如使用 `nginx.micro.conf`），且不要过度放宽为 `*`（可按主应用域名白名单）。

## 版本与灰度

- **主应用与子应用版本**：主应用升级时需兼容当前已注册子应用的 entry 与 props 契约；子应用升级时尽量保持生命周期与 props 用法兼容。
- **灰度发布**：可先灰度子应用（如通过 entry 指向灰度地址），再全量；主应用可配合路由或配置做子应用入口的灰度切换。

## 常见陷阱与避免

| 不要 | 建议 |
|------|------|
| 子应用与主应用共用一个 Pinia 或 Router 实例 | 子应用使用独立实例，并在 unmount 时清理 |
| 子应用路由 base 与主应用 activeRule 不一致 | 主应用 `props.basename` 与 `activeRule` 保持一致，子应用用 `createAppRouter(basename)` |
| 生产环境子应用 entry 仍用 localhost | 构建/部署时确保 entry 为线上可访问 URL，且与 `VITE_APP_PUBLIC_PATH` 对应 |
| 子应用未配置 CORS 导致主应用加载失败 | 子应用部署使用带 CORS 头的 nginx 配置（如 `nginx.micro.conf`） |
| 在子应用内使用绝对路径跳转主应用路由 | 使用主应用下发的 basename 或 eventBus 通知主应用跳转，避免硬编码主应用域名 |
| 忽略 qiankun 错误 | 主应用已集成错误 overlay，开发时可开启 `VITE_QIANKUN_DEBUG=true` 查看生命周期与异常 |

## 参考

- [qiankun 官方文档](https://qiankun.umijs.org/)
- 本模板 [配置说明](./configuration.md)、[开发指南](./development.md)、[部署指南](./deployment.md)
