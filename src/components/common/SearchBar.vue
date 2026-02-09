<script setup>
import { useElementSize } from '@vueuse/core'

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
  /** 各断点下首行展示的字段数量 [窄, 中, 宽]，根据容器宽度自动选取 */
  visibleCounts: {
    type: Array,
    default: () => [1, 2, 3, 4],
  },
})

const emit = defineEmits(['search', 'reset'])

const model = defineModel({
  type: Object,
  default: () => ({}),
})

const containerRef = ref(null)
const { width: containerWidth } = useElementSize(containerRef)

const expanded = ref(false)

const visibleCount = computed(() => {
  const w = containerWidth.value || 9999
  const counts = props.visibleCounts
  if (w < 480)
    return counts[0] ?? 1
  if (w < 640)
    return counts[1] ?? 2
  if (w < 880)
    return counts[2] ?? 3
  if (w < 1100)
    return counts[3] ?? 4
  return Math.max(counts[4] ?? 4, props.fields.length)
})

const primaryFields = computed(() =>
  props.fields.slice(0, visibleCount.value),
)
const moreFields = computed(() =>
  props.fields.slice(visibleCount.value),
)
const hasMore = computed(() => moreFields.value.length > 0)

function onSearch() {
  emit('search', model.value)
}

function onReset() {
  emit('reset')
}

function toggleMore() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div ref="containerRef" class="search-bar">
    <el-form class="search-bar__form" :model="model" :label-width="props.labelWidth" inline>
      <div class="search-bar__row">
        <template v-for="field in primaryFields" :key="field.prop">
          <el-form-item :label="field.label">
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
            <el-date-picker
              v-else-if="field.component === 'el-date-picker'"
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
        </template>
        <el-form-item v-if="hasMore">
          <el-button type="primary" link class="search-bar__more-btn" @click="toggleMore">
            {{ expanded ? '收起' : '更多' }}
            <el-icon class="search-bar__more-icon">
              <component :is="expanded ? 'i-ep-arrow-up' : 'i-ep-arrow-down'" />
            </el-icon>
          </el-button>
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
      </div>
      <div v-show="expanded && hasMore" class="search-bar__more">
        <template v-for="field in moreFields" :key="field.prop">
          <el-form-item :label="field.label">
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
            <el-date-picker
              v-else-if="field.component === 'el-date-picker'"
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
        </template>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
}

.search-bar__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-bar__row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.search-bar__row :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
  flex-shrink: 0;
}

.search-bar__more-btn {
  padding-left: 0;
  padding-right: 0;
}

.search-bar__more-icon {
  margin-left: 2px;
  vertical-align: middle;
}

.search-bar__more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.search-bar__more :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}
</style>
