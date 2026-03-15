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
const labelPosition = ref<'right' | 'top'>('right')
const loading = ref(false)
const lastChangedFields = ref<string[]>([])

const schema: FormFieldSchema[] = [
  // ---------- 基本信息（分组 + 栅格 12+12、24 + tooltip）----------
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
      layout: { group: '基本信息', span: 12 },
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
      layout: { group: '基本信息', span: 12 },
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
      props: { type: 'textarea', rows: 2, placeholder: '选填；状态为已发布时必填；最多 500 字' },
      layout: { group: '基本信息', span: 24 },
    },
    runtime: {
      validation: {
        rules: [
          {
            trigger: ['blur', 'change'],
            message: '已发布时请填写备注',
            when: (formValues: Record<string, unknown>) => formValues.status === 'published',
            validator: (v: unknown) => (v != null && String(v).trim() !== '') as boolean,
          },
          {
            trigger: 'blur',
            message: '备注最多 500 字',
            validator: (v: unknown) => (v == null || String(v).length <= 500) as boolean,
          },
        ],
      },
    },
  },
  // ---------- 扩展信息（InputNumber、DatePicker、多列 8+8+8 + 条件必填）----------
  {
    meta: {
      field: 'quantity',
      label: '数量',
      valueType: 'number',
      required: false,
      defaultValue: 0,
    },
    ui: {
      component: 'InputNumber',
      props: { min: 0, max: 9999, step: 1, placeholder: '数量' },
      layout: { group: '扩展信息', span: 8 },
    },
    runtime: {
      validation: {
        rules: [
          {
            trigger: 'blur',
            message: '数量不能为负数',
            validator: (v: unknown) => typeof v === 'number' && v >= 0,
          },
        ],
      },
    },
  },
  {
    meta: {
      field: 'publishDate',
      label: '发布日期',
      valueType: 'date',
      required: false,
    },
    ui: {
      component: 'DatePicker',
      props: {
        type: 'date',
        placeholder: '选择日期',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: '扩展信息', span: 8 },
    },
  },
  {
    meta: {
      field: 'amount',
      label: '金额',
      valueType: 'number',
      required: false,
    },
    ui: {
      component: 'InputNumber',
      props: {
        min: 0,
        precision: 2,
        placeholder: '0.00',
      },
      layout: {
        group: '扩展信息',
        span: 8,
        breakpoints: { xs: 24, sm: 12, md: 8 },
      },
      tooltip: { content: '保留两位小数；小屏占满宽', placement: 'top' },
    },
  },
  {
    meta: {
      field: 'expiryDate',
      label: '有效期至',
      valueType: 'date',
      required: false,
    },
    ui: {
      component: 'DatePicker',
      props: {
        type: 'date',
        placeholder: '已发布时必填',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: '扩展信息', span: 24 },
    },
    runtime: {
      validation: {
        rules: [
          {
            trigger: ['blur', 'change'],
            message: '已发布时请选择有效期',
            when: (formValues: Record<string, unknown>) => formValues.status === 'published',
            validator: (v: unknown) => v != null && v !== '',
          },
        ],
      },
    },
  },
  // ---------- 高级选项（Switch + 动态 options 依赖 status）----------
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
      layout: { group: '高级选项', span: 12 },
    },
  },
  {
    meta: {
      field: 'subStatus',
      label: '子状态',
      valueType: 'string',
      required: false,
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '依赖主状态' },
      layout: { group: '高级选项', span: 12, labelWidth: '120px' },
    },
    runtime: {
      dependencies: ['status'],
      options: (formValues: Record<string, unknown>) => {
        const status = formValues.status as string | undefined
        if (status === 'draft')
          return [{ label: '待提交', value: 'pending' }, { label: '已归档', value: 'archived' }]
        if (status === 'published')
          return [{ label: '正常', value: 'normal' }, { label: '已下架', value: 'offline' }]
        return []
      },
    },
  },
  // ---------- 其他（栅格 16+8、字段只读、Tooltip 多位置）----------
  {
    meta: {
      field: 'code',
      label: '编码',
      valueType: 'string',
      required: false,
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '选填，占 16 列' },
      layout: { group: '其他', span: 16 },
      tooltip: { content: '左侧标签悬停可看说明', placement: 'left' },
    },
  },
  {
    meta: {
      field: 'readonlyDemo',
      label: '只读示例',
      valueType: 'string',
      required: false,
      defaultValue: '编辑模式下此处也仅读',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '' },
      layout: { group: '其他', span: 8 },
      readonly: true,
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

function handleValuesChange(changed: Record<string, unknown>) {
  lastChangedFields.value = Object.keys(changed)
}

function triggerLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSuccess('加载完成')
  }, 2000)
}
</script>

<template>
  <div class="pro-form-demo-page">
    <h1 class="page-title">
      ProForm 示例
    </h1>
    <p class="page-desc">
      分组折叠、栅格（12+12、24、8+8+8、16+8）、响应式 breakpoints、多种控件、Tooltip（top/left）、
      字段级 labelWidth、ui.readonly、必填与多规则校验、条件校验（when）、动态选项（dependencies）、
      valuesChange、labelPosition、loading、编辑/只读切换。
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
      <el-button
        :type="labelPosition === 'right' ? 'primary' : undefined"
        @click="labelPosition = 'right'"
      >
        标签右
      </el-button>
      <el-button
        :type="labelPosition === 'top' ? 'primary' : undefined"
        @click="labelPosition = 'top'"
      >
        标签上
      </el-button>
      <el-button :loading="loading" @click="triggerLoading">
        模拟加载 2s
      </el-button>
    </div>

    <p v-if="lastChangedFields.length" class="changed-tip">
      最近变更字段：<code>{{ lastChangedFields.join(', ') }}</code>
    </p>

    <ProForm
      ref="formRef"
      v-model="form"
      :schema="schema"
      :mode="mode"
      :layout="{ labelPosition }"
      :loading="loading"
      @submit="handleSubmit"
      @reset="handleReset"
      @values-change="handleValuesChange"
    >
      <template #form-header>
        <p class="form-header-tip">
          填写下方表单后点击「提交」会先校验，通过后触发 submit 事件。可切换「编辑/只读」、修改「状态」观察「子状态」选项变化、状态为「已发布」时「备注」必填。
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
  max-width: 960px;
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
  flex-wrap: wrap;
  gap: 8px;
}

.demo-toolbar .el-button + .el-button {
  margin-left: 0;
}

.changed-tip {
  margin: -8px 0 16px;
  font-size: 12px;
  color: var(--el-color-primary);
}

.changed-tip code {
  padding: 2px 6px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
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
