<script setup>
definePage({
  meta: {
    title: '公共组件演示',
  },
})

// 搜索栏
const searchModel = ref({
  keyword: '',
  status: '',
  type: '',
  creator: '',
  dateRange: null,
})
const searchLoading = ref(false)
/** 表格查询条件，点击「查询」时同步 searchModel，ProTable 据此重新请求 */
const tableParams = ref({})
const searchItems = [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '请输入关键词',
    componentProps: { clearable: true },
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择',
    componentProps: { clearable: true, style: 'width: 120px' },
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' },
    ],
  },
  {
    prop: 'type',
    label: '类型',
    type: 'select',
    placeholder: '请选择',
    componentProps: { clearable: true, style: 'width: 120px' },
    options: [
      { label: '全部', value: '' },
      { label: '类型A', value: 'A' },
      { label: '类型B', value: 'B' },
      { label: '类型C', value: 'C' },
    ],
  },
  {
    prop: 'creator',
    label: '创建人',
    type: 'input',
    placeholder: '请输入创建人',
    componentProps: { clearable: true },
  },
  {
    prop: 'dateRange',
    label: '创建日期',
    type: 'daterange',
    componentProps: { style: 'width: 240px' },
  },
]

function onSearch() {
  searchLoading.value = true
  tableParams.value = { ...searchModel.value }
  setTimeout(() => {
    searchLoading.value = false
  }, 300)
}

function onReset() {
  // SearchBar 内部已清空 model，此处可做重置后的副作用（如重新请求）
  console.log('已重置', searchModel.value)
}

// 表格（ProTable：request 驱动，params 为查询条件）
const tableColumns = [
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'date', label: '日期', width: 120, sortable: true },
]
const mockList = [
  { id: 1, name: '示例项目 A', status: '启用', date: '2025-02-01' },
  { id: 2, name: '示例项目 B', status: '禁用', date: '2025-02-02' },
  { id: 3, name: '示例项目 C', status: '启用', date: '2025-02-03' },
  { id: 4, name: '示例项目 D', status: '启用', date: '2025-02-04' },
  { id: 5, name: '示例项目 E', status: '禁用', date: '2025-02-05' },
]
async function tableRequest({ page, pageSize, sortField, sortOrder, keyword, status }) {
  await new Promise(r => setTimeout(r, 300))
  let list = [...mockList]
  if (keyword)
    list = list.filter(item => item.name.includes(keyword))
  if (status)
    list = list.filter(item => (status === '1' ? item.status === '启用' : item.status === '禁用'))
  if (sortField === 'date' && sortOrder) {
    list.sort((a, b) => {
      const d = sortOrder === 'asc' ? 1 : -1
      return a.date > b.date ? d : -d
    })
  }
  const start = (page - 1) * pageSize
  const total = list.length
  const pageList = pageSize > 0 ? list.slice(start, start + pageSize) : list
  return { list: pageList, total }
}

// 表单弹窗
const dialogVisible = ref(false)
const formSubmitLoading = ref(false)
const formModel = ref({ name: '', status: '', remark: '' })
const formItems = [
  { prop: 'name', label: '名称', type: 'input', placeholder: '请输入名称', rules: [{ required: true, message: '请输入名称' }], span: 24 },
  { prop: 'status', label: '状态', type: 'select', placeholder: '请选择', options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }], span: 24 },
  { prop: 'remark', label: '备注', type: 'textarea', placeholder: '请输入备注', componentProps: { rows: 3 }, span: 24 },
]

function handleEdit(row) {
  formModel.value = { ...row }
  dialogVisible.value = true
}

function handleDelete(row) {
  console.log('删除', row)
}

function onFormSubmit(values) {
  formSubmitLoading.value = true
  setTimeout(() => {
    formSubmitLoading.value = false
    dialogVisible.value = false
    console.log('提交', values)
  }, 800)
}

function onFormCancel() {
  dialogVisible.value = false
}

function openAddDialog() {
  formModel.value = { name: '', status: '', remark: '' }
  dialogVisible.value = true
}

// ProForm 弹窗示例（三种模式：新增 / 编辑 / 查看）
const proFormDialogVisible = ref(false)
const proFormRef = ref(null)
const proFormModel = ref({ name: '', status: '1', remark: '' })
const proFormMode = ref('edit')
const proFormItems = [
  { prop: 'name', label: '名称', type: 'input', placeholder: '请输入名称', rules: [{ required: true, message: '请输入名称' }], span: 12 },
  { prop: 'status', label: '状态', type: 'select', placeholder: '请选择', options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }], span: 12 },
  { prop: 'remark', label: '备注', type: 'textarea', placeholder: '请输入备注', span: 24 },
]
const proFormDialogTitle = computed(() => {
  const t = { create: '新增', edit: '编辑', view: '查看' }
  return t[proFormMode.value] || '表单'
})
function openProFormDialog(mode) {
  proFormMode.value = mode
  if (mode === 'create') {
    proFormModel.value = { name: '', status: '1', remark: '' }
  }
  else {
    proFormModel.value = { name: '示例数据', status: '1', remark: '这是一条示例记录' }
  }
  proFormDialogVisible.value = true
}
function onProFormSubmit(values) {
  console.log('ProForm 提交', values)
  proFormDialogVisible.value = false
}
function onProFormReset() {
  console.log('ProForm 重置')
}
function closeProFormDialog() {
  proFormDialogVisible.value = false
}
function proFormSubmitClick() {
  proFormRef.value?.submit()
}
function proFormResetClick() {
  proFormRef.value?.reset()
}
</script>

<template>
  <div class="components-demo">
    <div class="demo-header">
      <h1>公共组件演示</h1>
      <p class="demo-desc">
        本页展示 ProTable、SearchBar、FormDialog、ProForm、LanguageSwitcher 等公共组件的用法与效果。
      </p>
    </div>

    <div class="demo-section">
      <h2>1. SearchBar 搜索栏</h2>
      <SearchBar
        v-model="searchModel"
        :items="searchItems"
        :loading="searchLoading"
        @search="onSearch"
        @reset="onReset"
      />
    </div>

    <div class="demo-section">
      <h2>2. ProTable 表格</h2>
      <div class="table-actions">
        <el-button type="primary" @click="openAddDialog">
          新增
        </el-button>
      </div>
      <ProTable
        :columns="tableColumns"
        :request="tableRequest"
        :params="tableParams"
        :pagination="{ pageSizes: [10, 20, 50] }"
        show-selection
        show-index
      >
        <template #toolbar>
          <span class="pro-table-toolbar-tip">工具栏插槽示例</span>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </ProTable>
    </div>

    <div class="demo-section">
      <h2>3. FormDialog 表单弹窗</h2>
      <el-button type="primary" @click="openAddDialog">
        打开表单弹窗
      </el-button>
      <FormDialog
        v-model="formModel"
        v-model:visible="dialogVisible"
        title="编辑示例"
        :items="formItems"
        :submit-loading="formSubmitLoading"
        @submit="onFormSubmit"
        @cancel="onFormCancel"
      />
    </div>

    <div class="demo-section">
      <h2>4. ProForm 表单（弹窗三种模式）</h2>
      <div class="demo-section-toolbar">
        <el-button @click="openProFormDialog('create')">
          新增
        </el-button>
        <el-button type="primary" @click="openProFormDialog('edit')">
          编辑
        </el-button>
        <el-button @click="openProFormDialog('view')">
          查看
        </el-button>
      </div>
      <el-dialog
        v-model="proFormDialogVisible"
        :title="proFormDialogTitle"
        width="560px"
        destroy-on-close
      >
        <ProForm
          ref="proFormRef"
          v-model="proFormModel"
          :items="proFormItems"
          :mode="proFormMode"
          label-width="100px"
          @submit="onProFormSubmit"
          @reset="onProFormReset"
        />
        <template #footer>
          <el-button @click="closeProFormDialog">
            取消
          </el-button>
          <template v-if="proFormMode !== 'view'">
            <el-button @click="proFormResetClick">
              重置
            </el-button>
            <el-button type="primary" @click="proFormSubmitClick">
              提交
            </el-button>
          </template>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.components-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: left;
}

.demo-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
  }

  .demo-desc {
    margin: 0 0 1rem;
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.5;
  }
}

.demo-section-toolbar {
  margin-bottom: 1rem;
}

.demo-section {
  margin-bottom: 2.5rem;

  h2 {
    margin: 0 0 1rem;
    font-size: 1.15rem;
    font-weight: 600;
    color: #334155;
  }
}

.table-actions {
  margin-bottom: 0.75rem;
}

.pro-table-toolbar-tip {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
