<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import type { ProTablePaginationState, TableColumnSchema } from '@/types/pro-table'
import type { CustomerCO, CreateCustomerRequest, UpdateCustomerRequest } from '@/api/modules/customer'
import { ref } from 'vue'
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'
import { ProDialog } from '@/components/pro-dialog'
import { ProForm, registerDefaultFieldComponents } from '@/components/pro-form'
import { showSuccess } from '@/utils/message'
import { createCustomer, deleteCustomer, listCustomers, updateCustomer } from '@/api/modules/customer'

registerDefaultColumnComponents()
registerDefaultFieldComponents()

definePage({
  name: 'Customer',
  meta: { title: '客户管理' },
})

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const pagination = ref<ProTablePaginationState>({ page: 1, pageSize: 10, total: 0 })

const dialogVisible = ref(false)
const dialogTitle = ref('新建客户')
const editingId = ref<number | null>(null)
const formRef = ref<InstanceType<typeof ProForm> | null>(null)
const formValues = ref<Record<string, unknown>>({})

const formSchema: FormFieldSchema[] = [
  {
    meta: { field: 'name', label: '姓名', valueType: 'string', required: true, defaultValue: '' },
    ui: { component: 'Input', props: { placeholder: '请输入姓名', clearable: true }, layout: { span: 24 } },
  },
  {
    meta: { field: 'email', label: '邮箱', valueType: 'string', required: true, defaultValue: '' },
    ui: { component: 'Input', props: { placeholder: '请输入邮箱', clearable: true }, layout: { span: 24 } },
  },
  {
    meta: { field: 'phone', label: '电话', valueType: 'string', required: false, defaultValue: '' },
    ui: { component: 'Input', props: { placeholder: '请输入电话', clearable: true }, layout: { span: 24 } },
  },
]

const columns: TableColumnSchema[] = [
  { meta: { field: 'id', label: 'ID', valueType: 'string' }, ui: { component: 'Text', width: 80 } },
  { meta: { field: 'name', label: '姓名', valueType: 'string' }, ui: { component: 'Text', minWidth: 120 } },
  { meta: { field: 'email', label: '邮箱', valueType: 'string' }, ui: { component: 'Text', minWidth: 160 } },
  { meta: { field: 'phone', label: '电话', valueType: 'string' }, ui: { component: 'Text', width: 140 } },
  {
    meta: { field: 'status', label: '状态', valueType: 'enum' },
    ui: { component: 'Tag', width: 100, align: 'center' },
    runtime: {
      tagType: (v) => {
        if (String(v) === 'ACTIVE') return 'success'
        return 'info'
      },
    },
  },
  {
    meta: { field: '_actions', label: '操作', valueType: 'actions' },
    ui: { component: 'Actions', width: 160, fixed: 'right' },
    runtime: {
      actions: [
        { label: '编辑', onClick: row => openEdit(row) },
        { label: '删除', danger: true, onClick: row => handleDelete(row) },
      ],
    },
  },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await listCustomers({ page: pagination.value.page, size: pagination.value.pageSize })
    const data = res.data as any
    tableData.value = data.content ?? data.records ?? (Array.isArray(data) ? data : [])
    pagination.value.total = data.totalElements ?? data.total ?? tableData.value.length
  }
  finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  dialogTitle.value = '新建客户'
  formValues.value = {}
  dialogVisible.value = true
}

function openEdit(row: Record<string, unknown>) {
  editingId.value = row.id as number
  dialogTitle.value = '编辑客户'
  formValues.value = { name: row.name, email: row.email, phone: row.phone }
  dialogVisible.value = true
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await ElMessageBox.confirm('确认删除该客户？', '提示', { type: 'warning' })
    await deleteCustomer(row.id as number)
    showSuccess('删除成功')
    fetchData()
  }
  catch { /* cancelled */ }
}

function handleFormConfirm() {
  formRef.value?.submit()
}

async function handleFormSubmit(values: Record<string, unknown>) {
  if (editingId.value) {
    await updateCustomer(editingId.value, values as UpdateCustomerRequest)
    showSuccess('更新成功')
  }
  else {
    await createCustomer(values as CreateCustomerRequest)
    showSuccess('创建成功')
  }
  dialogVisible.value = false
  fetchData()
}

fetchData()

watch(
  () => pagination.value.page,
  () => fetchData(),
)
</script>

<template>
  <div class="customer-page">
    <ProTable
      v-model:pagination="pagination"
      :columns="columns"
      :data="tableData"
      row-key="id"
      :loading="loading"
    >
      <template #toolbar-prefix>
        <el-button type="primary" @click="openCreate">
          新建客户
        </el-button>
      </template>
    </ProTable>

    <ProDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="520"
      confirm-text="保存"
      :close-on-confirm="false"
      @confirm="handleFormConfirm"
    >
      <ProForm
        ref="formRef"
        v-model="formValues"
        :schema="formSchema"
        :mode="editingId ? 'edit' : 'create'"
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
