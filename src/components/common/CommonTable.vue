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
  const active = normalizedColumns.value.find(column => column.sortOrder)
  if (!active || !active.prop || !active.sortOrder) {
    return props.data
  }
  const direction = active.sortOrder === 'ascending' ? 1 : -1
  return [...props.data].sort((left, right) => {
    const leftValue = left?.[active.prop]
    const rightValue = right?.[active.prop]
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
    <div v-if="props.showColumnSetting" class="common-table__toolbar">
      <el-dropdown trigger="click">
        <el-button text>
          列设置
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="common-table__dropdown">
            <el-dropdown-item v-for="column in normalizedColumns" :key="column.key">
              <el-checkbox v-model="visibleMap[column.key]">
                {{ column.label }}
              </el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
      <el-table-column v-if="props.showIndex" type="index" width="56" label="#" fixed="left" />
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
      >
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

.common-table__dropdown {
  padding: 4px 8px;
}

.common-table__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
