<script setup>
/**
 * ProTable - 列表页核心组件
 * 通过 request 方法拉取数据，支持分页、排序、多选、列可见、插槽列与操作列
 */

const props = defineProps({
  /** 列配置（必填） */
  columns: { type: Array, required: true },
  /** 数据请求方法，参数 { page, pageSize, sortField, sortOrder, ...params }，返回 { list, total } */
  request: { type: Function, required: true },
  /** 查询条件，通常来自 SearchBar，变化时自动重新请求 */
  params: { type: Object, default: () => ({}) },
  /** 是否启用分页。true 使用默认配置，false 不展示分页，Object 为自定义配置 */
  pagination: { type: [Boolean, Object], default: true },
  /** 行唯一标识字段 */
  rowKey: { type: [String, Function], default: 'id' },
  /** 是否显示多选列 */
  showSelection: { type: Boolean, default: false },
  /** 是否显示序号列 */
  showIndex: { type: Boolean, default: false },
  /** 是否显示操作列（固定右侧，插槽 action） */
  showAction: { type: Boolean, default: true },
  /** 操作列标题 */
  actionLabel: { type: String, default: '操作' },
  /** 操作列宽度 */
  actionWidth: { type: [String, Number], default: 180 },
  /** 是否显示列设置（显示/隐藏列） */
  showColumnSetting: { type: Boolean, default: true },
  stripe: { type: Boolean, default: true },
  border: { type: Boolean, default: true },
})

const emit = defineEmits(['selectionChange', 'sortChange', 'pageChange', 'rowClick', 'requestError'])

const tableData = ref([])
const totalCount = ref(0)
const loading = ref(false)

const visibleMap = ref({})
const sortState = ref({ prop: null, order: null })
const currentPage = ref(1)
const currentPageSize = ref(10)

const paginationConfig = computed(() => {
  const raw = props.pagination
  const defaults = {
    page: 1,
    pageSize: 10,
    total: 0,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
  }
  if (raw === false)
    return null
  if (raw === true)
    return { ...defaults }
  return { ...defaults, ...raw }
})

const hasPagination = computed(() => paginationConfig.value != null)

watch(
  () => props.pagination,
  (p) => {
    if (p && typeof p === 'object') {
      if (p.page != null)
        currentPage.value = p.page
      if (p.pageSize != null)
        currentPageSize.value = p.pageSize
    }
  },
  { immediate: true },
)

const normalizedColumns = computed(() =>
  props.columns.map(col => ({
    ...col,
    type: col.type || 'normal',
    key: col.prop || col.label,
  })),
)

watch(
  () => props.columns,
  (columns) => {
    const next = {}
    columns.forEach((col) => {
      const key = col.prop || col.label
      next[key] = col.visible !== false
    })
    visibleMap.value = next
  },
  { immediate: true },
)

const displayedColumns = computed(() =>
  normalizedColumns.value.filter(col => visibleMap.value[col.key]),
)

async function fetchData() {
  if (!props.request)
    return
  loading.value = true
  const page = hasPagination.value ? currentPage.value : 1
  const pageSize = hasPagination.value ? currentPageSize.value : 0
  const sortField = sortState.value.prop || undefined
  const sortOrder = sortState.value.order === 'ascending' ? 'asc' : sortState.value.order === 'descending' ? 'desc' : undefined
  const requestParams = {
    page,
    pageSize,
    sortField,
    sortOrder,
    ...props.params,
  }
  try {
    const res = await props.request(requestParams)
    tableData.value = res?.list ?? []
    totalCount.value = res?.total ?? 0
  }
  catch (err) {
    tableData.value = []
    emit('requestError', err)
  }
  finally {
    loading.value = false
  }
}

watch(
  () => props.params,
  () => {
    if (hasPagination.value)
      currentPage.value = 1
    fetchData()
  },
  { deep: true },
)

onMounted(() => {
  if (paginationConfig.value) {
    currentPage.value = paginationConfig.value.page ?? 1
    currentPageSize.value = paginationConfig.value.pageSize ?? 10
  }
  fetchData()
})

function handleSortChange({ prop, order }) {
  sortState.value = { prop: prop || null, order: order || null }
  if (hasPagination.value)
    currentPage.value = 1
  emit('sortChange', { prop, order })
  fetchData()
}

function handlePageChange(page) {
  currentPage.value = page
  emit('pageChange', { page, pageSize: currentPageSize.value })
  fetchData()
}

function handleSizeChange(pageSize) {
  currentPageSize.value = pageSize
  currentPage.value = 1
  emit('pageChange', { page: 1, pageSize })
  fetchData()
}

function handleSelectionChange(selection) {
  emit('selectionChange', selection)
}

function handleRowClick(row, column, event) {
  emit('rowClick', row, column, event)
}

/** 序号列：分页连续编号 (page-1)*pageSize + index + 1；Element Plus 传入的为行索引（数字） */
function indexMethod(rowIndex) {
  if (!hasPagination.value)
    return rowIndex + 1
  return (currentPage.value - 1) * currentPageSize.value + rowIndex + 1
}
</script>

<template>
  <div class="pro-table">
    <div v-if="$slots.toolbar" class="pro-table__toolbar">
      <slot name="toolbar" />
    </div>
    <el-table
      :data="tableData"
      :row-key="props.rowKey"
      :stripe="props.stripe"
      :border="props.border"
      :loading="loading"
      v-bind="$attrs"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="props.showSelection"
        type="selection"
        width="48"
        fixed="left"
      />
      <el-table-column
        v-if="props.showIndex"
        type="index"
        width="56"
        label="#"
        fixed="left"
        align="center"
        :index="indexMethod"
      />
      <el-table-column
        v-for="column in displayedColumns"
        :key="column.key"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align"
        :fixed="column.fixed"
        :sortable="column.sortable"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="column.slot" v-bind="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.showAction"
        fixed="right"
        :label="props.actionLabel"
        :width="props.actionWidth"
        align="center"
      >
        <template v-if="props.showColumnSetting" #header>
          <div class="pro-table__action-header">
            <span>{{ props.actionLabel }}</span>
            <el-popover
              trigger="click"
              placement="bottom-end"
              :width="180"
              popper-class="pro-table__column-popover"
            >
              <template #reference>
                <el-icon class="pro-table__setting-icon" title="列设置">
                  <i-ep-setting />
                </el-icon>
              </template>
              <div class="pro-table__column-list">
                <el-checkbox
                  v-for="column in normalizedColumns"
                  :key="column.key"
                  v-model="visibleMap[column.key]"
                  class="pro-table__column-item"
                >
                  {{ column.label }}
                </el-checkbox>
              </div>
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <slot name="action" v-bind="scope" />
        </template>
      </el-table-column>
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </el-table>
    <div v-if="hasPagination" class="pro-table__pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="currentPageSize"
        :total="totalCount"
        :layout="paginationConfig.layout"
        :page-sizes="paginationConfig.pageSizes"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.pro-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pro-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pro-table__action-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pro-table__setting-icon {
  cursor: pointer;
  font-size: 15px;
  color: var(--el-text-color-secondary);
  transition: color 0.2s;
}

.pro-table__setting-icon:hover {
  color: var(--el-color-primary);
}

.pro-table__column-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pro-table__column-item {
  margin-right: 0;
}

.pro-table__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
