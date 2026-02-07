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
})
</script>

<template>
  <el-table
    :data="props.data"
    :row-key="props.rowKey"
    :stripe="props.stripe"
    :border="props.border"
    :loading="props.loading"
    v-bind="$attrs"
  >
    <el-table-column
      v-for="column in props.columns"
      :key="column.prop || column.label"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :align="column.align"
      :fixed="column.fixed"
    >
      <template v-if="column.slot" #default="scope">
        <slot :name="column.slot" v-bind="scope" />
      </template>
    </el-table-column>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </el-table>
</template>
