<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'
import type { ProFormContext } from '@/types/pro-form'
import type {
  SearchBarEmits,
  SearchBarExpose,
  SearchBarProps,
  SearchBarSearchPayload,
  SearchRouteQuery,
} from '@/types/search-bar'
import { ElButton, ElCol, ElForm, ElRow } from 'element-plus'
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'
import { useAppBreakpoint } from '@/composables'
import {
  collectSearchRouteQueryKeys,
  deserializeSearchValues,
  mergeSearchDefaults,
  resolveVisibleFields,
  routeQueryContainsAnyKey,
  serializeSearchValues,
  splitSchemaGroups,
} from './search-bar.utils'
import SearchBarField from './SearchBarField.vue'

defineOptions({ name: 'SearchBar' })

const props = withDefaults(defineProps<SearchBarProps>(), {
  context: () => ({}),
  loading: false,
  defaultCollapsed: true,
  defaultVisibleCount: 3,
  syncRoute: false,
  routeKey: '',
  autoSearchOnInit: false,
  labelWidth: '88px',
})

const emit = defineEmits<SearchBarEmits>()
const slots = useSlots()
const route = useRoute()
const router = useRouter()
const { isMobile } = useAppBreakpoint()

const expanded = ref(!props.defaultCollapsed)
const initialized = ref(false)
const syncingRoute = ref(false)
const lastRouteKeys = ref<string[]>([])

const searchContext = computed<ProFormContext>(() => props.context ?? {})
const currentValues = computed(() => mergeSearchDefaults(props.schema, props.modelValue))
const groupedFields = computed(() => splitSchemaGroups(props.schema))
const visibleFields = computed(() =>
  resolveVisibleFields(props.schema, expanded.value, props.defaultVisibleCount),
)

const hasAdvancedFields = computed(() => groupedFields.value.advanced.length > 0)
const canToggleExpand = computed(() =>
  hasAdvancedFields.value || groupedFields.value.basic.length > props.defaultVisibleCount,
)
const effectiveLabelPosition = computed(() => isMobile.value ? 'top' : 'right')

function buildDefaultValues() {
  return mergeSearchDefaults(props.schema, {})
}

function changedValues(prev: Record<string, unknown>, nextValue: Record<string, unknown>) {
  const changed: Record<string, unknown> = {}
  const keys = new Set([...Object.keys(prev), ...Object.keys(nextValue)])
  for (const key of keys) {
    if (prev[key] !== nextValue[key])
      changed[key] = nextValue[key]
  }
  return changed
}

function setFieldsValue(values: Record<string, unknown>) {
  const nextValue = {
    ...currentValues.value,
    ...values,
  }
  emit('update:modelValue', nextValue)
  const changed = changedValues(currentValues.value, nextValue)
  if (Object.keys(changed).length > 0)
    emit('valuesChange', changed, nextValue)
}

function getFieldsValue(): Record<string, unknown> {
  return { ...currentValues.value }
}

function serialize(values = getFieldsValue()) {
  return serializeSearchValues(props.schema, values, searchContext.value)
}

function deserialize(query: SearchRouteQuery) {
  return deserializeSearchValues(props.schema, query, searchContext.value, props.routeKey || undefined)
}

async function syncRouteQuery(serializedValues: Record<string, unknown>) {
  if (!props.syncRoute)
    return

  // 路由同步只保留当前 SearchBar 负责的 query 键，避免误删页面上其他筛选器或分页参数。
  const nextSerialized = serializeSearchValues(
    props.schema,
    serializedValues,
    searchContext.value,
    props.routeKey || undefined,
  )

  const nextQuery: Record<string, unknown> = { ...route.query }
  for (const key of lastRouteKeys.value)
    delete nextQuery[key]
  for (const [key, value] of Object.entries(nextSerialized))
    nextQuery[key] = value

  syncingRoute.value = true
  await router.replace({ query: nextQuery as LocationQueryRaw })
  lastRouteKeys.value = Object.keys(nextSerialized)
  await nextTick()
  syncingRoute.value = false
}

async function buildPayload(values = getFieldsValue()): Promise<SearchBarSearchPayload> {
  const payload = {
    rawValues: values,
    // rawValues 保留组件内部值；serializedValues 对齐接口/路由约定后的值。
    serializedValues: serialize(values),
  }
  await syncRouteQuery(values)
  return payload
}

async function search(nextValues = getFieldsValue()) {
  const payload = await buildPayload(nextValues)
  emit('search', payload)
  return payload
}

function buildResetValues(): Record<string, unknown> {
  const nextValue: Record<string, unknown> = {}

  for (const field of props.schema) {
    const key = field.meta.field
    // 某些字段是页面级上下文，例如租户或固定筛选，不应被“重置”按钮清空。
    if (field.runtime?.preserveOnReset && key in currentValues.value) {
      nextValue[key] = currentValues.value[key]
      continue
    }
    if (field.meta.defaultValue !== undefined)
      nextValue[key] = field.meta.defaultValue
  }

  return nextValue
}

async function reset() {
  const nextValue = buildResetValues()
  emit('update:modelValue', nextValue)
  emit('valuesChange', changedValues(currentValues.value, nextValue), nextValue)
  await syncRouteQuery(nextValue)
  const payload = {
    rawValues: nextValue,
    serializedValues: serialize(nextValue),
  }
  emit('reset', payload)
  return payload
}

function toggleExpand(force?: boolean) {
  expanded.value = typeof force === 'boolean' ? force : !expanded.value
  emit('toggleExpand', expanded.value)
}

function handleFieldUpdate(nextValue: Record<string, unknown>) {
  emit('update:modelValue', nextValue)
  const changed = changedValues(currentValues.value, nextValue)
  if (Object.keys(changed).length > 0)
    emit('valuesChange', changed, nextValue)
}

async function initializeValues() {
  const defaultsMerged = mergeSearchDefaults(props.schema, props.modelValue)
  const routeValues = props.syncRoute
    ? deserialize(route.query as SearchRouteQuery)
    : {}
  // 初始化顺序为：schema 默认值 -> 外部 v-model -> 路由 query。
  // 这样既保留父组件传入值，也允许分享链接覆盖默认筛选。
  const nextValue = {
    ...defaultsMerged,
    ...routeValues,
  }

  if (props.syncRoute) {
    lastRouteKeys.value = collectSearchRouteQueryKeys(
      props.schema,
      routeValues,
      searchContext.value,
      props.routeKey || undefined,
    )
  }

  emit('update:modelValue', nextValue)
  initialized.value = true

  if (props.autoSearchOnInit)
    await search(nextValue)
}

watch(
  () => props.schema,
  () => {
    if (!initialized.value)
      return
    const nextValue = mergeSearchDefaults(props.schema, props.modelValue)
    emit('update:modelValue', nextValue)
  },
  { deep: true },
)

watch(
  () => route.query,
  (query) => {
    if (!props.syncRoute || syncingRoute.value || !initialized.value)
      return
    const routeValues = deserialize(query as SearchRouteQuery)
    const hasTrackedRouteKeys = lastRouteKeys.value.length > 0
    const stillContainsTrackedKeys = routeQueryContainsAnyKey(
      query as SearchRouteQuery,
      lastRouteKeys.value,
    )

    if (Object.keys(routeValues).length === 0 && !hasTrackedRouteKeys)
      return

    // 当追踪过的 query 被外部导航清空时，需要回退到默认值，而不是保留旧筛选结果。
    const nextValue = Object.keys(routeValues).length > 0 || stillContainsTrackedKeys
      ? { ...buildDefaultValues(), ...routeValues }
      : buildDefaultValues()

    lastRouteKeys.value = collectSearchRouteQueryKeys(
      props.schema,
      routeValues,
      searchContext.value,
      props.routeKey || undefined,
    )

    handleFieldUpdate(nextValue)
  },
)

onMounted(() => {
  void initializeValues()
})

defineExpose<SearchBarExpose>({
  setFieldsValue,
  getFieldsValue,
  search,
  reset,
  toggleExpand,
  serialize,
  deserialize,
})
</script>

<template>
  <div class="search-bar" data-testid="search-bar">
    <slot name="searchbar-prefix" />

    <ElForm
      :model="currentValues"
      :label-width="labelWidth"
      :label-position="effectiveLabelPosition"
      class="search-bar__form"
      data-testid="search-bar-form"
    >
      <div class="search-bar__body">
        <div class="search-bar__fields">
          <ElRow :gutter="16">
            <ElCol
              v-for="field in visibleFields"
              :key="field.meta.field"
              class="search-bar__field-col"
              :span="isMobile ? 24 : (field.ui.layout?.span ?? 8)"
              v-bind="isMobile ? {} : (field.ui.layout?.breakpoints ?? {})"
            >
              <SearchBarField
                :schema="field"
                :model-value="currentValues"
                :context="searchContext"
                :disabled="loading"
                @update:model-value="handleFieldUpdate"
                @enter="search"
              >
                <template v-if="slots['custom-render']" #custom-render="slotProps">
                  <slot name="custom-render" v-bind="slotProps" />
                </template>
                <template v-if="slots['field-suffix']" #field-suffix="slotProps">
                  <slot name="field-suffix" v-bind="slotProps" />
                </template>
              </SearchBarField>
            </ElCol>
          </ElRow>
        </div>

        <div class="search-bar__actions" data-testid="search-bar-actions">
          <ElButton type="primary" :loading="loading" data-testid="search-bar-submit" @click="() => search()">
            查询
          </ElButton>
          <ElButton :disabled="loading" data-testid="search-bar-reset" @click="() => reset()">
            重置
          </ElButton>
          <ElButton
            v-if="canToggleExpand"
            link
            type="primary"
            :disabled="loading"
            data-testid="search-bar-toggle"
            @click="() => toggleExpand()"
          >
            {{ expanded ? '收起' : '展开' }}
          </ElButton>
          <slot name="searchbar-actions-extra" />
        </div>
      </div>
    </ElForm>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  background: var(--shell-surface-strong, #ffffff);
  border: 1px solid var(--shell-border, #e8eaed);
  border-radius: var(--shell-radius-sm);
  padding: var(--shell-space-4) var(--shell-space-4) var(--shell-space-1);
}

.search-bar__form {
  width: 100%;
}

.search-bar__body {
  display: flex;
  align-items: flex-start;
  gap: var(--shell-space-4);
}

.search-bar__fields {
  flex: 1;
  min-width: 0;
}

.search-bar__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--shell-space-2);
  flex-wrap: wrap;
  min-width: 200px;
  padding-top: 2px;
}

@media (max-width: 960px) {
  .search-bar__body {
    flex-direction: column;
  }

  .search-bar__actions {
    width: 100%;
    justify-content: flex-start;
    padding: 0 0 var(--shell-space-3);
  }
}

@media (max-width: 768px) {
  .search-bar {
    padding: var(--shell-space-3) var(--shell-space-3) var(--shell-space-1);
  }

  .search-bar__fields :deep(.el-row) {
    --el-row-gutter: 0 !important;
  }

  .search-bar__actions {
    gap: var(--shell-space-2);
  }

  .search-bar__actions :deep(.el-button) {
    min-height: 40px;
  }
}
</style>
