<script setup>
definePage({
  meta: {
    title: '公共组件演示',
  },
})

// 搜索栏
const searchModel = ref({ keyword: '', status: '' })
const searchLoading = ref(false)
const searchFields = [
  {
    prop: 'keyword',
    label: '关键词',
    componentProps: { placeholder: '请输入关键词', clearable: true },
  },
  {
    prop: 'status',
    label: '状态',
    component: 'el-select',
    componentProps: { placeholder: '请选择', clearable: true, style: 'width: 120px' },
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' },
    ],
  },
]

function onSearch() {
  searchLoading.value = true
  setTimeout(() => {
    searchLoading.value = false
    console.log('搜索', searchModel.value)
  }, 500)
}

function onReset() {
  searchModel.value = { keyword: '', status: '' }
}

// 表格
const tableLoading = ref(false)
const tablePagination = ref({
  page: 1,
  pageSize: 10,
  total: 33,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 50],
})
const tableColumns = [
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'date', label: '日期', width: 120 },
]
const tableData = ref([
  { id: 1, name: '示例项目 A', status: '启用', date: '2025-02-01' },
  { id: 2, name: '示例项目 B', status: '禁用', date: '2025-02-02' },
  { id: 3, name: '示例项目 C', status: '启用', date: '2025-02-03' },
])

function onPaginationUpdate(val) {
  tablePagination.value = val
}

// 表单弹窗
const dialogVisible = ref(false)
const formSubmitLoading = ref(false)
const formModel = ref({ name: '', status: '', remark: '' })
const formFields = [
  {
    prop: 'name',
    label: '名称',
    componentProps: { placeholder: '请输入名称' },
  },
  {
    prop: 'status',
    label: '状态',
    component: 'el-select',
    componentProps: { placeholder: '请选择', style: 'width: 100%' },
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' },
    ],
  },
  {
    prop: 'remark',
    label: '备注',
    component: 'el-input',
    componentProps: { type: 'textarea', rows: 3, placeholder: '请输入备注' },
  },
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
</script>

<template>
  <div class="components-demo">
    <div class="demo-header">
      <h1>公共组件演示</h1>
      <p class="demo-desc">
        本页展示 CommonTable、SearchBar、FormDialog、HelloWorld、LanguageSwitcher 等公共组件的用法与效果。
      </p>
      <div class="demo-header-actions">
        <LanguageSwitcher />
      </div>
    </div>

    <div class="demo-section">
      <h2>1. HelloWorld</h2>
      <HelloWorld msg="公共组件演示页" />
    </div>

    <div class="demo-section">
      <h2>2. SearchBar 搜索栏</h2>
      <SearchBar
        v-model="searchModel"
        :fields="searchFields"
        :loading="searchLoading"
        @search="onSearch"
        @reset="onReset"
      />
    </div>

    <div class="demo-section">
      <h2>3. CommonTable 表格</h2>
      <div class="table-actions">
        <el-button type="primary" @click="openAddDialog">
          新增
        </el-button>
      </div>
      <CommonTable
        :columns="tableColumns"
        :data="tableData"
        :loading="tableLoading"
        :pagination="tablePagination"
        @update:pagination="onPaginationUpdate"
      >
        <template #action="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </div>

    <div class="demo-section">
      <h2>4. FormDialog 表单弹窗</h2>
      <el-button type="primary" @click="openAddDialog">
        打开表单弹窗
      </el-button>
      <FormDialog
        v-model="formModel"
        v-model:visible="dialogVisible"
        title="编辑示例"
        :fields="formFields"
        :submit-loading="formSubmitLoading"
        @submit="onFormSubmit"
        @cancel="onFormCancel"
      />
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

  .demo-header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
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
</style>
