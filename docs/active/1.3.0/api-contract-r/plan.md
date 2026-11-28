# 客户响应契约对接实施计划

**归属版本**：1.3.0

## 目标与依据

依照[需求](spec.md)、[设计](design.md)将五个Customer接口接入后端R、分页、校验与版本控制。后端公共线契约为唯一来源，前端文档只规定消费行为；API URL与HTTP业务错误200约定不重新选型。

基准前端a97eed3；后端error-contract-r已提交56a8716，data-consistency已提交7ec180b，契约文档提交5246d96；完整应用、V2真实迁移和数据库并发证据仍另计。ProForm目前没有服务端字段错误API，需要小范围扩展并同步公共契约文档。

## T1：信封、错误类型与fixture依据

- Modify：`src/types/api/response.ts`、`src/types/api/index.ts`、`src/utils/api/error.ts`，定义设计中的R/PageResult/ValidationErrorData/ApiError，不保留COLA信封自动兼容；status只读alias可留以减小非必要破坏。
- Create：`tests/fixtures/api-contract-r/` JSON及同目录 `README.md`，记录样例来源类型、后端提交、生成命令/对应测试与场景；可在`tests/unit/api/`增加测试辅助。
- 样例从现有后端CustomerHttpContractTest/CustomerResponseSerializationTest的受管序列化/standalone输出采集；无已导出JSON时实施前在临时普通后端副本复用现有隔离测试采集，不修改原后端测试或新增上下文/DB集成测试。规范化timestamp/traceId仅记录规则，不能手写JSON后声称后端生成。没有可复现输出时标为契约手工夹具并明确不满足后端来源验证，阻止最终“消费者契约验证完成”声明。

验收：类型完整，样例来源可追溯，覆盖成功、删除null、分页、20001/21001/21002映射、400字段/对象错误、404和500；样例不含真实个人数据。版本冲突fixture是映射证据，非真实并发证明。

## T2：HTTP归一化与Customer API

依赖T1，共享类型/API串行修改。

- Modify：`src/utils/api/request.ts`、`http.ts`、`utils.ts`、`src/api/modules/customer.ts`；可Create同HTTP模块私有归一化辅助，不能在UI组件反向调用API。
- Create：`tests/unit/api/request.spec.ts`、`customer.spec.ts`及必要辅助测试，先证明旧success判定/二层分页/version缺失会失败，再实施。
- 常规JSON保持AxiosResponse<R<T>>，HTTP与code联合判定；取消→超时→response→网络顺序、raw HEAD/OPTIONS/下载边界、错误安全回退和trace/details规则遵守设计。

验收：真实Axios adapter穿过拦截器，逐项覆盖设计测试表；所有公开Http方法、提取工具和并发辅助的签名与返回一致，不通过类型断言掩盖旧分页形状。list使用pageIndex/pageSize，update必填version，delete为R<null>。

## T3：ProForm通用服务端错误入口

依赖T1的消息约定；与T2可分离实现，但共享集成时串行验证。

- Modify：`src/types/pro-form.ts`、`src/components/pro-form/ProForm.vue`、`ProFormField.vue`；扩展setFieldErrors/clearFieldErrors，组件不依赖ApiError、Customer模块或业务码。
- Modify：`docs/components/pro-form.md`，记录新API、替换/清理/隐藏字段语义；`src/components/pro-form/index.ts`按需要导出相关类型。
- Create：`tests/unit/pro-form/server-errors.spec.ts`，组件测试验证展示、错误组展开、未改值blur或依赖校验后错误仍可见、相同消息重复注入、逐字段清理、提交与reset/clearValidate边界，既有本地校验不退化。

验收：准确定位可见schema字段；未知key不会形成路径写入；同字段消息按顺序合并；清理行为与设计完全一致。

## T4：Customer页面状态与业务交互

依赖T2/T3。

- Modify：`src/pages/customer.vue`，分页/类型同步、保存与刷新busy、编辑version/会话隔离、错误提示及冲突刷新。
- Create（按职责拆分）：`src/pages/customer/validation.ts` 等页面私有映射/状态辅助；不把业务码交给共享组件。
- Create：`tests/unit/customer/customer.spec.ts`及`validation.spec.ts`；既测映射，也挂载页面验证提交和恢复，不仅断言内部变量。
- 字段规则同步name2–50/email100/phone20，电话null不改与空串清空；20001区分HTTP200/404，21001定位email，00004映射字段/汇总，21002保留输入并显式刷新。

验收：覆盖Spec全部行为，包括保存重复点击、读取详情失败/删除、取消刷新、旧异步结果隔离、版本耗尽、服务端纠正分页与删除末页单次退页。所有异步事件错误均被消费，取消无失败toast。

## T5：全量收尾与真实链路边界

依赖T1–T4。

- Modify：`README.md` API消费说明、`docs/active/tech-debt-tracker.md`与本版本`release.md`；必要时刷新`src/types/components.d.ts`、`auto-imports.d.ts`（用types:generate，不手改）。当前方案不更改后端债务清单，TD-009跨项目关闭另核验。
- 执行定向回归、pnpm check:full、pnpm build、types:check，覆盖率不低于31/28/24，新规则违规修复或精确说明合理例外。
- 真实HTTP使用明确已运行且完成V2迁移的后端环境，至少核对列表、带version更新、校验与错误消费；条件不具备时保留“本地实现完成/真实链路待验收”，错误契约债保持开放。不擅自部署或迁移数据库。

验收：新旧消费入口不混用COLA/R，fixture与实际后端来源边界清楚；前端单元通过不能替代自动装配、MySQL并发、浏览器或远端CI。Bifrost保持本版本排除范围。

## 决策边界

本轮只产出方案，不修改业务源码、安装依赖或提交。实施获准后可决定私有辅助拆分及测试组织；公共ProForm错误API、冲突刷新语义、线契约/写入重试/范围扩大须重新对齐。不为按计划实施推导Git提交、推送、发布或实际数据库迁移授权。
