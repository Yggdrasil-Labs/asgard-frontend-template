<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { ref } from 'vue'
import {
  ProForm,
  registerDefaultFieldComponents,
} from '@/components/pro-form'
import { showSuccess } from '@/utils/message'

// 在首屏渲染前注册默认字段组件，否则 ProFormField 会提示「未找到字段组件」
registerDefaultFieldComponents()

definePage({
  name: 'ProFormDemo',
  meta: { title: 'ProForm 示例' },
})

const formRef = ref<InstanceType<typeof ProForm> | null>(null)
const form = ref<Record<string, unknown>>({})
const lastSubmit = ref<Record<string, unknown> | null>(null)
const mode = ref<'edit' | 'readonly'>('edit')

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
      layout: { group: 'basic', span: 12 },
      tooltip: {
        content: '用于展示和检索的显示名称',
        placement: 'top',
      },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      required: true,
      defaultValue: 'draft',
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '请选择' },
      layout: { group: 'basic', span: 12 },
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
      ],
    },
    runtime: {
      validation: {
        rules: [
          {
            trigger: ['change', 'blur'],
            message: '请选择状态',
            validator: (v: unknown) => v != null && v !== '',
          },
        ],
      },
    },
  },
  {
    meta: {
      field: 'remark',
      label: '备注',
      valueType: 'string',
      required: false,
    },
    ui: {
      component: 'Input',
      props: { type: 'textarea', rows: 3, placeholder: '选填' },
      layout: { group: 'basic', span: 24 },
    },
  },
  {
    meta: {
      field: 'enabled',
      label: '启用',
      valueType: 'boolean',
      required: false,
      defaultValue: true,
    },
    ui: {
      component: 'Switch',
      layout: { group: 'advanced', span: 12 },
    },
  },
]

function handleSubmit(values: Record<string, unknown>) {
  lastSubmit.value = { ...values }
  showSuccess('提交成功')
}

function handleReset(values: Record<string, unknown>) {
  lastSubmit.value = null
  form.value = { ...values }
}
</script>

<template>
  <div class="pro-form-demo-page">
    <h1 class="page-title">
      ProForm 示例
    </h1>
    <p class="page-desc">
      Schema 驱动表单：分组、栅格、校验、只读切换。
    </p>

    <div class="demo-toolbar">
      <el-button
        :type="mode === 'edit' ? 'primary' : undefined"
        @click="mode = 'edit'"
      >
        编辑
      </el-button>
      <el-button
        :type="mode === 'readonly' ? 'primary' : undefined"
        @click="mode = 'readonly'"
      >
        只读
      </el-button>
    </div>

    <ProForm
      ref="formRef"
      v-model="form"
      :schema="schema"
      :mode="mode"
      @submit="handleSubmit"
      @reset="handleReset"
    >
      <template #form-header>
        <p class="form-header-tip">
          填写下方表单后点击「提交」会先校验，通过后触发 submit 事件。
        </p>
      </template>
      <template #form-footer="{ submit, reset }">
        <el-button
          v-if="mode === 'edit'"
          type="primary"
          @click="submit()"
        >
          提交
        </el-button>
        <el-button @click="reset()">
          重置
        </el-button>
      </template>
    </ProForm>

    <section v-if="lastSubmit" class="submit-result">
      <h3>最近一次提交结果</h3>
      <pre>{{ JSON.stringify(lastSubmit, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.pro-form-demo-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 20px;
}

.page-desc {
  margin: 0 0 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.demo-toolbar {
  margin-bottom: 16px;
}

.demo-toolbar .el-button + .el-button {
  margin-left: 8px;
}

.form-header-tip {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.submit-result {
  margin-top: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.submit-result h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.submit-result pre {
  margin: 0;
  font-size: 12px;
  overflow: auto;
}
</style>
