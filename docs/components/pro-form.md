# ProForm 组件说明

基于 Schema 驱动的企业级表单组件，内置分组、栅格布局、校验与只读模式，与 Element Plus Form 体系兼容。

---

## 概述

- **位置**：`src/components/pro-form`
- **依赖**：Vue 3 Composition API、Element Plus 2.x、项目内类型 `@/types/pro-form`
- **能力**：通过 `schema` 描述字段（meta + ui + runtime），自动渲染表单项、生成校验规则、支持分组折叠与响应式栅格

---

## 基本用法

### 1. 注册字段组件（按需）

使用 **Schema 里 `ui.component` 指定组件名** 的字段时，需要先注册组件映射（如 `Input` → `ElInput`），否则会提示「未找到字段组件」。  
若字段使用 **`ui.slot: 'custom-render'`** 并通过插槽渲染，则不依赖注册表，非公共/未注册组件用 `custom-render` 即可，效果一致。

```ts
import { ProForm, registerDefaultFieldComponents } from '@/components/pro-form'

// 在首屏渲染前调用，通常放在页面或根组件的 setup 中
registerDefaultFieldComponents()
```

`registerDefaultFieldComponents()` 会注册：Input、Select、DatePicker、InputNumber、Switch、Checkbox、CheckboxGroup 等与 Element Plus 的对应关系。若需自定义组件名，可使用 `registerFieldComponent(name, component)`。

### 2. 绑定数据与 Schema

```vue
<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { ref } from 'vue'
import { ProForm, registerDefaultFieldComponents } from '@/components/pro-form'

registerDefaultFieldComponents()

const form = ref<Record<string, unknown>>({})
const schema: FormFieldSchema[] = [
  {
    meta: {
      field: 'name',
      label: '名称',
      valueType: 'string',
      required: true,
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入名称' },
      layout: { span: 12 },
    },
  },
]
</script>

<template>
  <ProForm
    v-model="form"
    :schema="schema"
    mode="edit"
  />
</template>
```

- `v-model`（即 `modelValue`）为表单值对象，键为 `meta.field`。
- `schema` 为字段配置数组，见下方 [Schema 结构](#schema-结构)。

---

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `FormFieldSchema[]` | 必填 | 字段 Schema 数组 |
| `modelValue` | `Record<string, unknown>` | 必填 | 表单值（v-model） |
| `mode` | `'edit' \| 'readonly'` | `'edit'` | 编辑 / 只读模式 |
| `context` | `ProFormContext` | `{}` | 透传上下文，供 when/options/transform 使用 |
| `layout` | `ProFormLayout` | — | 表单级布局：`labelWidth`、`labelPosition` |
| `loading` | `boolean` | `false` | 加载态（为 true 时表单项 disabled） |

---

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `value: Record<string, unknown>` | 表单值变化时触发 |
| `submit` | `values: Record<string, unknown>` | 调用 `submit()` 且校验通过后触发 |
| `reset` | `values: Record<string, unknown>` | 调用 `resetFields()` 后触发 |
| `valuesChange` | `changedValues`, `allValues` | 任意字段值变化时，传出变更键值对与当前全量值 |

---

## 插槽

| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| `form-header` | — | 表单顶部区域 |
| `form-footer` | `{ submit, reset, validate }` | 表单底部，常用于提交/重置按钮 |
| `group-extra` | `{ group?: string }` | 分组标题右侧扩展内容 |
| `field-prefix` | 字段 slot 上下文 | 表单项前缀 |
| `field-suffix` | 字段 slot 上下文 | 表单项后缀 |
| `field-help` | 字段 slot 上下文 | 表单项帮助文案 |
| `custom-render` | 字段 slot 上下文 | 自定义字段渲染（当 schema 中 `ui.slot === 'custom-render'` 时使用）；**非公共或未注册组件用此插槽即可，无需注册** |

---

## 暴露方法（ref）

通过 `ref` 调用以下方法：

| 方法 | 说明 |
|------|------|
| `setFieldsValue(values)` | 批量设置字段值，与当前 model 合并 |
| `getFieldsValue()` | 获取当前表单值副本 |
| `resetFields()` | 恢复为初始值（首次合并 schema 默认值时的快照）并清空校验、触发 `reset` 事件 |
| `validate()` | 执行全表校验，通过返回 `true`，失败返回 `false` 并滚动到首个错误 |
| `validateField(field?)` | 校验指定字段（不传则校验全部） |
| `clearValidate(field?)` | 清除校验结果 |
| `submit()` | 先 `validate()`，通过后 `emit('submit', getFieldsValue())` |

---

## Schema 结构

每个字段对应一个 `FormFieldSchema`：

```ts
interface FormFieldSchema {
  meta: FormFieldMeta   // 标识、展示、值类型、必填、默认值
  ui: FormFieldUi       // 组件、props、布局、tooltip、options、只读、插槽
  runtime?: FormFieldRuntime  // 可见性、禁用、依赖、动态 options、转换、校验
}
```

### meta（FormFieldMeta）

| 属性 | 类型 | 说明 |
|------|------|------|
| `field` | `string` | 字段唯一键，对应 model 的 key |
| `label` | `string` | 表单项标签 |
| `valueType` | `FormFieldValueType` | 值类型：如 `'string'`、`'number'`、`'boolean'`、`'date'`、`'dateRange'`、`'array'` 等 |
| `defaultValue` | `unknown` | 默认值，在首次合并时会填充到 model |
| `required` | `boolean` | 是否必填（标签红星与校验可结合使用） |

### ui（FormFieldUi）

| 属性 | 类型 | 说明 |
|------|------|------|
| `component` | `string` | 组件注册名，如 `'Input'`、`'Select'`、`'DatePicker'` |
| `props` | `Record<string, unknown>` | 透传给该控件的 props |
| `layout` | `FormFieldLayout` | 见下方 [布局](#布局) |
| `tooltip` | `FormFieldTooltip` | 标签旁提示：`content`、`placement?` |
| `options` | `FormFieldOption[]` | 静态选项（Select/Radio/Checkbox 等） |
| `readonly` | `boolean` | 字段级只读 |
| `slot` | `string` | 使用的插槽名；设为 `'custom-render'` 时由插槽渲染，无需在注册表中注册组件 |

### runtime（FormFieldRuntime，可选）

| 属性 | 类型 | 说明 |
|------|------|------|
| `visible` | `boolean` | 为 `false` 时隐藏该字段 |
| `disabled` | `boolean` | 字段级禁用 |
| `readonly` | `boolean` | 字段级只读 |
| `dependencies` | `string[]` | 依赖的 field 列表，依赖变化时会重算 options、重校验 |
| `options` | `(formValues, context) => Option[] \| Promise<Option[]>` | 动态选项 |
| `transform` | `FormFieldTransform` | input / submit / display 值转换 |
| `validation` | `ValidationConfig` | 校验配置，见 [校验](#校验) |

---

## 布局

### 表单级（ProFormLayout）

- `labelWidth`：标签宽度，默认 `'120px'`
- `labelPosition`：`'left'` | `'right'` | `'top'`

### 字段级（FormFieldLayout）

- `group`：分组名，同组字段渲染在同一折叠面板内；不设或同名的在同一组
- `span`：栅格占位（24 栅格），默认 24（一整行）
- `align`：标签/内容对齐
- `labelWidth`：覆盖表单级标签宽度
- `breakpoints`：响应式 span（`xs`、`sm`、`md`、`lg`、`xl`）

多列示例：`span: 12` 表示半行，`span: 8` 表示 1/3 行；同行 span 之和不超过 24 会自动换行。

---

## 校验

字段校验通过 `runtime.validation` 配置，最终会转换为 Element Plus Form 的 rules。

### ValidationConfig

| 属性 | 类型 | 说明 |
|------|------|------|
| `rules` | `ValidationRule[]` | 规则列表 |
| `validateFirst` | `boolean` | 是否在第一条失败时停止 |
| `validateWhenHidden` | `boolean` | 隐藏时是否仍校验，默认 false |
| `revalidateOnDependencyChange` | `boolean` | 依赖字段变化时是否重新校验，默认 true |
| `debounce` | `number` | 防抖毫秒数 |

### ValidationRule

| 属性 | 类型 | 说明 |
|------|------|------|
| `trigger` | `'change' \| 'blur' \| 'submit'` 或数组 | 触发时机 |
| `when` | `boolean \| (formValues, context) => boolean` | 为 false 时该规则不生效 |
| `validator` | 见下 | 校验函数 |
| `message` | `string` | 失败时的错误文案 |

`validator` 支持：

- 同步/异步返回 `boolean` 或 `Promise<boolean>`
- Callback 风格：`(value, formValues, context, done) => void`，调用 `done(ok)` 表示结果

---

## 默认值与初始值

- 若 model 中缺少某字段且 schema 中该字段有 `meta.defaultValue`，ProForm 会在初始化时合并进 model 并触发一次 `update:modelValue`。
- `resetFields()` 会恢复到「首次合并默认值后的快照」状态，不会随后续对 `modelValue` 的修改而改变。

---

## 示例页面

完整示例（分组、栅格、条件必填、动态选项、只读模式、提交/重置）见：

- **页面**：`src/pages/pro-form-demo.vue`
- **路由**：根据 `src/router/index.ts` 配置访问对应路径（如 `/pro-form-demo`）

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/types/pro-form.ts` | 类型定义 |
| `src/components/pro-form/ProForm.vue` | 根组件 |
| `src/components/pro-form/ProFormField.vue` | 单字段渲染 |
| `src/components/pro-form/form-registry.ts` | 字段组件注册表 |
| `src/components/pro-form/validation/` | 校验规则适配（转 Element rules） |
