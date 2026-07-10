<script setup lang="ts">
import type { ProDetailContext } from './types'
import type { FormFieldSchema } from '@/types/pro-form'
import { ElCollapse, ElCollapseItem, ElDescriptions, ElDescriptionsItem, ElTooltip } from 'element-plus'
import { computed, ref, useSlots, watch } from 'vue'
import { useAppBreakpoint } from '@/composables'
import ProDetailField from './ProDetailField.vue'

defineOptions({ name: 'ProDetail' })

const props = defineProps<{
  schema: FormFieldSchema[]
  data: Record<string, unknown>
  context?: ProDetailContext
  layout?: ProDetailLayout
}>()

interface ProDetailLayout {
  column?: number
  size?: 'large' | 'default' | 'small'
  border?: boolean
  labelWidth?: string | number
}

const slots = useSlots()
const { isMobile } = useAppBreakpoint()

interface DetailGroup {
  key: string
  label?: string
  fields: FormFieldSchema[]
}

const DEFAULT_GROUP_KEY = '__default__'

function isFieldVisible(field: FormFieldSchema): boolean {
  return field.runtime?.visible !== false
}

function getDescSpan(field: FormFieldSchema, col: number): number {
  const span = field.ui.layout?.span ?? 24
  if (span >= 24)
    return col
  if (span >= 12)
    return Math.min(2, col)
  return 1
}

const groupedSchema = computed<DetailGroup[]>(() => {
  const order: string[] = []
  const map = new Map<string, FormFieldSchema[]>()

  for (const field of props.schema) {
    const groupKey = field.ui.layout?.group ?? DEFAULT_GROUP_KEY
    if (!map.has(groupKey)) {
      map.set(groupKey, [])
      order.push(groupKey)
    }
    map.get(groupKey)!.push(field)
  }

  return order
    .map(groupKey => ({
      key: groupKey,
      label: groupKey === DEFAULT_GROUP_KEY ? undefined : groupKey,
      fields: (map.get(groupKey) ?? []).filter(isFieldVisible),
    }))
    .filter(group => group.fields.length > 0)
})

const expandedGroupKeys = ref<string[]>([])

watch(
  groupedSchema,
  (groups) => {
    const keys = groups.map(g => g.key)
    expandedGroupKeys.value = [...new Set([...expandedGroupKeys.value, ...keys])]
  },
  { immediate: true },
)

const column = computed(() => isMobile.value ? 1 : (props.layout?.column ?? 3))
const size = computed(() => props.layout?.size ?? 'default')
const border = computed(() => props.layout?.border ?? true)
const labelWidth = computed(() => props.layout?.labelWidth ?? 120)
</script>

<template>
  <section class="pro-detail" data-testid="detail-root">
    <header
      v-if="slots['detail-header'] || slots['detail-header-extra']"
      class="pro-detail__header"
      data-testid="detail-header"
    >
      <div class="pro-detail__header-main">
        <slot name="detail-header" />
      </div>
      <div class="pro-detail__header-extra">
        <slot name="detail-header-extra" />
      </div>
    </header>

    <ElCollapse
      v-if="groupedSchema.length > 0"
      v-model="expandedGroupKeys"
      class="pro-detail__collapse"
      expand-icon-position="left"
      data-testid="detail-collapse"
    >
      <ElCollapseItem
        v-for="group in groupedSchema"
        :key="group.key"
        :name="group.key"
      >
        <template #title>
          <header class="pro-detail__group-header">
            <span class="pro-detail__group-title">
              {{ group.label ?? '基本信息' }}
            </span>
            <div
              v-if="slots['group-extra']"
              class="pro-detail__group-extra"
              @click.stop
            >
              <slot
                name="group-extra"
                :group="group.key === DEFAULT_GROUP_KEY ? undefined : group.key"
              />
            </div>
          </header>
        </template>

        <ElDescriptions
          :column="column"
          :border="border"
          :size="size"
          :label-width="labelWidth"
          class="pro-detail__descriptions"
        >
          <ElDescriptionsItem
            v-for="field in group.fields"
            :key="field.meta.field"
            :span="getDescSpan(field, column)"
          >
            <template #label>
              <span>
                {{ field.meta.label }}
                <ElTooltip
                  v-if="field.ui.tooltip"
                  :content="field.ui.tooltip.content"
                  :placement="field.ui.tooltip.placement ?? 'top'"
                >
                  <span class="pro-detail__label-tooltip">?</span>
                </ElTooltip>
              </span>
            </template>

            <ProDetailField
              :schema="field"
              :data="data"
              :context="context"
            >
              <template
                v-if="slots['field-suffix']"
                #field-suffix="slotProps"
              >
                <slot
                  name="field-suffix"
                  v-bind="slotProps"
                />
              </template>
              <template
                v-if="slots['field-help']"
                #field-help="slotProps"
              >
                <slot
                  name="field-help"
                  v-bind="slotProps"
                />
              </template>
              <template
                v-if="slots['custom-render']"
                #custom-render="slotProps"
              >
                <slot
                  name="custom-render"
                  v-bind="slotProps"
                />
              </template>
            </ProDetailField>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCollapseItem>
    </ElCollapse>

    <div
      v-else
      class="pro-detail__empty"
      data-testid="detail-empty"
    >
      暂无可展示字段
    </div>
  </section>
</template>

<style scoped>
.pro-detail {
  padding: var(--shell-space-5);
}

.pro-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--shell-space-4);
}

.pro-detail__header-main {
  flex: 1;
  min-width: 0;
}

.pro-detail__header-extra {
  margin-left: var(--shell-space-4);
}

.pro-detail__collapse {
  margin-bottom: 0;
}

.pro-detail__collapse :deep(.el-collapse-item__header) {
  border-radius: 6px;
  transition: background-color 150ms ease;
}

.pro-detail__collapse :deep(.el-collapse-item__header:hover) {
  background-color: var(--el-fill-color-light, #f8f9fa);
}

.pro-detail__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px 0 0;
}

.pro-detail__group-title {
  font-size: var(--shell-text-sm);
  font-weight: 600;
}

.pro-detail__group-extra {
  margin-left: var(--shell-space-4);
}

.pro-detail__descriptions {
  margin-top: var(--shell-space-2);
}

.pro-detail__label-tooltip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  border-radius: 50%;
  font-size: var(--shell-text-xs);
  border: 1px solid var(--el-border-color, #e8eaed);
  color: var(--el-text-color-secondary, #5e6578);
  cursor: help;
  transition:
    color 150ms ease,
    border-color 150ms ease;
}

.pro-detail__label-tooltip:hover {
  color: var(--el-color-primary, #4f6ef7);
  border-color: var(--el-color-primary, #4f6ef7);
}

.pro-detail__empty {
  padding: var(--shell-space-6) var(--shell-space-4);
  color: var(--el-text-color-secondary, #5e6578);
  text-align: center;
  font-size: var(--shell-text-sm);
}

@media (max-width: 768px) {
  .pro-detail {
    padding: var(--shell-space-4);
  }

  .pro-detail__header,
  .pro-detail__group-header {
    flex-wrap: wrap;
    gap: var(--shell-space-2);
  }

  .pro-detail__header-extra,
  .pro-detail__group-extra {
    margin-left: 0;
  }
}
</style>
