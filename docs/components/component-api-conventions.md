# 组件 API 约定

## 目标

这份文档用于统一当前公共组件的 API 风格，减少跨组件切换时的心智成本。它不定义业务功能，只约定组件层的表达方式。

---

## 状态与事件

### 受控状态

公共组件优先采用受控状态：

- `modelValue`
- `update:modelValue`
- `v-model:*`

规则：

- `update:*` 只负责状态同步
- 不把业务含义塞进 `update:*`
- 如果组件有多个独立状态，优先使用多个受控绑定而不是隐式内部托管

示例：

- `update:modelValue`
- `update:pagination`
- `update:sort`
- `update:selection`

### 语义事件

业务语义通过独立事件表达，而不是复用状态同步事件。

例如：

- `confirm`
- `cancel`
- `search`
- `reset`
- `toggleExpand`

这样 `update:*` 和业务意图不会混在一起。

---

## Slot 命名

插槽命名优先使用“结构位置 + 语义”的组合形式。

推荐模式：

- `header-extra`
- `footer-extra`
- `body-prefix`
- `body-suffix`
- `field-suffix`
- `field-help`
- `group-extra`

不推荐：

- 含糊不清的 `extra`
- 与组件内部实现强绑定的临时命名

---

## 作用域对象

所有作用域插槽都应尽量提供稳定、可预测的作用域对象。

推荐优先字段：

- `schema`
- `value`
- `context`
- `field`
- `data`
- `close`
- `confirm`
- `loading`

要求：

- 作用域对象字段名尽量复用，不要同义多名
- 同一语义在不同组件里尽量保持同名
- 文档里必须明确“作用域对象”包含哪些字段

---

## 插槽覆盖规则

组件文档必须明确说明插槽属于哪一种模式：

1. 追加内容  
   例如 `header-extra`、`footer-extra`

2. 局部覆盖  
   例如只覆盖单个字段渲染

3. 完全接管  
   例如 `footer`、全局 `custom-render`

如果声明插槽后会替换默认内容，必须在文档里明确写出，避免用户误以为是追加。

---

## Expose 约定

`expose` 只暴露高频、稳定、跨页面通用的方法。

推荐：

- `open`
- `close`
- `toggle`
- `search`
- `reset`
- `serialize`
- `deserialize`

不推荐暴露：

- 过多临时业务方法
- 与页面流程强绑定的方法

---

## 当前适用组件

这份约定当前适用于：

- [ProForm](./pro-form.md)
- [ProDetail](./pro-detail.md)
- [ProTable](./pro-table.md)
- [SearchBar](./search-bar.md)
- [ProDialog](./pro-dialog.md)

---

## data-testid 命名规范

公共组件必须在关键交互节点添加 `data-testid`，为 E2E 测试（bifrost-e2e）提供稳定定位锚点。

### 命名规则

```
{组件语义前缀}-{区域/元素}
```

- 前缀使用**组件语义名**（去掉 `Pro` 前缀），如 `dialog`、`detail`、`search-bar`、`form`、`table`
- 区域/元素使用英文短横线连接

### 已有约定

| 组件 | 前缀 | 示例 |
|------|------|------|
| ProDialog | `dialog-` | `dialog-title`, `dialog-close`, `dialog-body`, `dialog-footer`, `dialog-cancel`, `dialog-confirm` |
| ProDetail | `detail-` | `detail-root`, `detail-header`, `detail-collapse`, `detail-empty` |
| SearchBar | `search-bar-` | `search-bar`, `search-bar-form`, `search-bar-actions`, `search-bar-submit`, `search-bar-reset`, `search-bar-toggle` |

### 放置原则

1. 根容器（用于整体可见性断言）
2. 主要结构区域（header、body、footer）
3. 所有用户交互按钮
4. 状态切换节点（空状态、loading 等）

不需要为纯装饰元素添加 testid。
