<script setup>
const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: String,
    default: 'auto',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'reset'])

const model = defineModel({
  type: Object,
  default: () => ({}),
})

function onSearch() {
  emit('search', model.value)
}

function onReset() {
  emit('reset')
}
</script>

<template>
  <el-form class="search-bar" :model="model" :label-width="props.labelWidth" inline>
    <el-form-item
      v-for="field in props.fields"
      :key="field.prop"
      :label="field.label"
    >
      <el-select
        v-if="field.options || field.component === 'el-select'"
        v-model="model[field.prop]"
        v-bind="field.componentProps"
      >
        <el-option
          v-for="option in (field.options || [])"
          :key="String(option.value)"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-input
        v-else-if="!field.component || field.component === 'el-input'"
        v-model="model[field.prop]"
        v-bind="field.componentProps"
      />
      <component
        :is="field.component"
        v-else
        v-model="model[field.prop]"
        v-bind="field.componentProps"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="props.loading" @click="onSearch">
        查询
      </el-button>
      <el-button @click="onReset">
        重置
      </el-button>
      <slot name="actions" />
    </el-form-item>
  </el-form>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.search-bar :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}
</style>
