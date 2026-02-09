<script setup>
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      pageSizes: [10, 20, 50, 100],
    }),
  },
  showSelection: {
    type: Boolean,
    default: true,
  },
  showIndex: {
    type: Boolean,
    default: true,
  },
  showColumnSetting: {
    type: Boolean,
    default: true,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  actionLabel: {
    type: String,
    default: '操作',
  },
  actionWidth: {
    type: [String, Number],
    default: 180,
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  stripe: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  sortMode: {
    type: String,
    default: 'backend',
  },
})

const emit = defineEmits(['update:pagination', 'sortChange'])

const visibleMap = ref({})
const sortState = ref({ prop: null, order: null })
const normalizedColumns = computed(() => props.columns.map(column => ({
  ...column,
  key: column.prop || column.label,
})))

watch(
  () => props.columns,
  (columns) => {
    const nextVisible = {}
    columns.forEach((column) => {
      const key = column.prop || column.label
      nextVisible[key] = column.hidden !== true
    })
    visibleMap.value = nextVisible
  },
  { immediate: true },
)

const displayedColumns = computed(() => normalizedColumns.value.filter(column => visibleMap.value[column.key]))

const sortedData = computed(() => {
  if (props.sortMode !== 'frontend') {
    return props.data
  }
  const { prop, order } = sortState.value
  if (!prop || !order) {
    return props.data
  }
  const direction = order === 'ascending' ? 1 : -1
  return [...props.data].sort((left, right) => {
    const leftValue = left?.[prop]
    const rightValue = right?.[prop]
    if (leftValue === rightValue) {
      return 0
    }
    return leftValue > rightValue ? direction : -direction
  })
})

const tableData = computed(() => {
  if (props.sortMode === 'frontend') {
    return sortedData.value
  }
  return props.data
})

function handleSortChange(payload) {
  if (props.sortMode === 'frontend' && payload) {
    sortState.value = { prop: payload.prop, order: payload.order || null }
  }
  emit('sortChange', payload)
}

function handlePageChange(page) {
  emit('update:pagination', { ...props.pagination, page })
}

function handleSizeChange(pageSize) {
  emit('update:pagination', { ...props.pagination, page: 1, pageSize })
}
</script>

<template>
  <div class="common-table">
    <div v-if="$slots.toolbar" class="common-table__toolbar">
      <slot name="toolbar" />
    </div>
    <el-table
      :data="tableData"
      :row-key="props.rowKey"
      :stripe="props.stripe"
      :border="props.border"
      :loading="props.loading"
      v-bind="$attrs"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="props.showSelection" type="selection" width="48" fixed="left" />
      <el-table-column v-if="props.showIndex" type="index" width="56" label="#" fixed="left" align="center" />
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
          <div class="common-table__action-header">
            <span>{{ props.actionLabel }}</span>
            <el-popover
              trigger="click"
              placement="bottom-end"
              :width="180"
              popper-class="common-table__column-popover"
            >
              <template #reference>
                <el-icon class="common-table__setting-icon" title="列设置">
                  <i-ep-setting />
                </el-icon>
              </template>
              <div class="common-table__column-list">
                <el-checkbox
                  v-for="column in normalizedColumns"
                  :key="column.key"
                  v-model="visibleMap[column.key]"
                  class="common-table__column-item"
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
    <div class="common-table__pagination">
      <el-pagination
        :current-page="props.pagination.page"
        :page-size="props.pagination.pageSize"
        :total="props.pagination.total"
        :layout="props.pagination.layout"
        :page-sizes="props.pagination.pageSizes"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.common-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.common-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.common-table__action-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.common-table__setting-icon {
  cursor: pointer;
  font-size: 15px;
  color: var(--el-text-color-secondary);
  transition: color 0.2s;
}

.common-table__setting-icon:hover {
  color: var(--el-color-primary);
}

.common-table__column-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.common-table__column-item {
  margin-right: 0;
}

.common-table__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
