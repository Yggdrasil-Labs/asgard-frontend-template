<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import type { TableColumnSchema } from '@/types/pro-table'
import type { SearchFieldSchema } from '@/types/search-bar'
import { ElButton } from 'element-plus'
import { deleteCustomer } from '@/api/modules/customer'
import { ProDialog } from '@/components/pro-dialog'
import { ProForm, registerDefaultFieldComponents } from '@/components/pro-form'
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'
import { registerDefaultSearchFieldComponents, SearchBar } from '@/components/search-bar'
import { confirm, showSuccess } from '@/utils/message'

import { useCustomerEditor } from './customer/useCustomerEditor'
import { reportCustomerError, useCustomerList } from './customer/useCustomerList'

registerDefaultColumnComponents()
registerDefaultFieldComponents()
registerDefaultSearchFieldComponents()

definePage({
  name: 'Customer',
  meta: { title: '客户管理' },
})

const { loading, tableData, pagination, searchValues, fetchData, fetchFromFirstPage } = useCustomerList()
const { dialogVisible, dialogTitle, formRef, formValues, formKey, busy, conflict, deleted, notice, saveDisabled, openCreate, openEdit, handleFormConfirm, handleFormSubmit, refreshConflict } = useCustomerEditor(fetchData)

const formSchema: FormFieldSchema[] = [
  {
    meta: {
      field: 'name',
      label: '姓名',
      valueType: 'string',
      required: true,
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入姓名', clearable: true, maxlength: 50 },
      layout: { span: 24 },
    },
    runtime: {
      validation: {
        rules: [
          {
            validator: (value: unknown) => typeof value === 'string' && value.trim().length >= 2 && value.length <= 50,
            message: '姓名长度为2至50个字符',
          },
        ],
      },
    },
  },
  {
    meta: {
      field: 'email',
      label: '邮箱',
      valueType: 'string',
      required: true,
      defaultValue: '',
    },
    runtime: {
      validation: {
        rules: [
          {
            validator: (value: unknown) => typeof value === 'string' && value.length <= 100 && /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value),
            message: '请输入100个字符以内的合法邮箱',
          },
        ],
      },
    },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入邮箱', clearable: true, maxlength: 100 },
      layout: { span: 24 },
    },
  },
  {
    meta: {
      field: 'phone',
      label: '电话',
      valueType: 'string',
      required: false,
      defaultValue: '',
    },
    runtime: {
      validation: {
        rules: [
          {
            validator: (value: unknown) => value == null || String(value).length <= 20,
            message: '电话不能超过20个字符',
          },
        ],
      },
    },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入电话', clearable: true, maxlength: 20 },
      layout: { span: 24 },
    },
  },
]

const searchSchema: SearchFieldSchema[] = [
  {
    meta: {
      field: 'keyword',
      label: '关键词',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '按姓名或邮箱搜索', clearable: true },
      layout: { group: 'basic', span: 12 },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      defaultValue: '',
    },
    ui: {
      component: 'Select',
      props: { clearable: true, placeholder: '请选择状态' },
      layout: { group: 'basic', span: 12 },
      options: [
        { label: '活跃', value: 'ACTIVE' },
        { label: '停用', value: 'INACTIVE' },
      ],
    },
  },
]

const columns: TableColumnSchema[] = [
  {
    meta: { field: 'id', label: 'ID', valueType: 'string' },
    ui: { component: 'Text', width: 80 },
  },
  {
    meta: { field: 'name', label: '姓名', valueType: 'string' },
    ui: { component: 'Text', minWidth: 120 },
  },
  {
    meta: { field: 'email', label: '邮箱', valueType: 'string' },
    ui: { component: 'Text', minWidth: 160 },
  },
  {
    meta: { field: 'phone', label: '电话', valueType: 'string' },
    ui: { component: 'Text', width: 140 },
  },
  {
    meta: { field: 'status', label: '状态', valueType: 'enum' },
    ui: { component: 'Tag', width: 100, align: 'center' },
    runtime: {
      tagType: (v) => {
        if (String(v) === 'ACTIVE')
          return 'success'
        return 'info'
      },
    },
  },
  {
    meta: { field: '_actions', label: '操作', valueType: 'actions' },
    ui: { component: 'Actions', width: 160, fixed: 'right' },
    runtime: {
      actions: [
        {
          label: '编辑',
          onClick: row => openEdit(row),
        },
        {
          label: '删除',
          danger: true,
          onClick: row => handleDelete(row),
        },
      ],
    },
  },
]

async function handleDelete(row: Record<string, unknown>) {
  try {
    await confirm({ message: '确认删除该客户？', title: '提示' })
  }
  catch {
    return
  }

  try {
    await deleteCustomer(row.id as number)
  }
  catch (error) {
    reportCustomerError(error, '删除失败，请稍后重试')
    return
  }

  showSuccess('删除成功')
  void fetchData()
}
</script>

<template>
  <div class="customer-page">
    <SearchBar
      v-model="searchValues"
      :schema="searchSchema"
      :loading="loading"
      :default-visible-count="2"
      @search="fetchFromFirstPage"
      @reset="fetchFromFirstPage"
    />

    <ProTable
      v-model:pagination="pagination"
      :columns="columns"
      :data="tableData"
      row-key="id"
      :loading="loading"
    >
      <template #toolbar-prefix>
        <ElButton type="primary" @click="openCreate">
          新建客户
        </ElButton>
      </template>
    </ProTable>

    <ProDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="520"
      confirm-text="保存"
      :close-on-confirm="false"
      :confirm-loading="busy"
      :confirm-disabled="saveDisabled"
      @confirm="handleFormConfirm"
    >
      <p v-if="notice" role="alert">
        {{ notice }}
      </p>
      <ElButton v-if="conflict && !deleted" :disabled="busy" @click="refreshConflict">
        刷新并重新编辑
      </ElButton>
      <ProForm
        :key="formKey"
        ref="formRef"
        v-model="formValues"
        :schema="formSchema"
        :loading="busy"
        mode="edit"
        :layout="{ labelWidth: '80px' }"
        @submit="handleFormSubmit"
      />
    </ProDialog>
  </div>
</template>

<style scoped lang="scss">
.customer-page {
  width: 100%;
}
</style>
