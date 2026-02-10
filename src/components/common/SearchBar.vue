<script setup>
const props = defineProps({
  /** 搜索项配置列表 */
  items: { type: Array, required: true },
  /** 首行展示的搜索项数量，多余的折叠到「更多」；展开时在第二行展示，按钮始终在第一行 */
  visibleCount: { type: Number, default: 2 },
  /** 表单项标签宽度 */
  labelWidth: { type: String, default: 'auto' },
  /** 查询按钮 loading 状态 */
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'reset', 'change'])

const model = defineModel({
  type: Object,
  required: true,
})

const expanded = ref(false)

/** 仅显示 visible !== false 的项 */
const visibleItems = computed(() =>
  props.items.filter(item => item.visible !== false),
)

const count = computed(() => Math.max(0, Number(props.visibleCount) || 2))

const primaryItems = computed(() =>
  visibleItems.value.slice(0, count.value),
)
const moreItems = computed(() =>
  visibleItems.value.slice(count.value),
)
const hasMore = computed(() => moreItems.value.length > 0)

function onSearch() {
  emit('search', { ...model.value })
}

function onReset() {
  visibleItems.value.forEach((item) => {
    model.value[item.prop] = undefined
  })
  emit('reset')
}

function onItemChange(prop, value) {
  emit('change', { prop, value })
}

function toggleMore() {
  expanded.value = !expanded.value
}

/** 合并 placeholder 与 componentProps，供控件使用 */
function getControlProps(item) {
  const base = item.placeholder != null
    ? { placeholder: item.placeholder, ...item.componentProps }
    : { ...item.componentProps }
  return base
}
</script>

<template>
  <div class="search-bar">
    <el-form class="search-bar__form" :model="model" :label-width="props.labelWidth" inline>
      <div class="search-bar__row">
        <template v-for="item in primaryItems" :key="item.prop">
          <el-form-item v-if="item.visible !== false" :label="item.label">
            <!-- custom：使用插槽，插槽名为 prop -->
            <slot
              v-if="item.type === 'custom'"
              :name="item.prop"
              :item="item"
              :model="model"
            />
            <!-- input -->
            <el-input
              v-else-if="item.type === 'input'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <!-- select -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            >
              <el-option
                v-for="opt in (item.options ?? [])"
                :key="String(opt.value)"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <!-- date -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="model[item.prop]"
              type="date"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <!-- daterange -->
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="model[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <!-- number -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <!-- 未指定 type 时回退为 input -->
            <el-input
              v-else
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
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
        <template v-for="item in moreItems" :key="item.prop">
          <el-form-item v-if="item.visible !== false" :label="item.label">
            <slot
              v-if="item.type === 'custom'"
              :name="item.prop"
              :item="item"
              :model="model"
            />
            <el-input
              v-else-if="item.type === 'input'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            >
              <el-option
                v-for="opt in (item.options ?? [])"
                :key="String(opt.value)"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="model[item.prop]"
              type="date"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="model[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
            />
            <el-input
              v-else
              v-model="model[item.prop]"
              v-bind="getControlProps(item)"
              @change="val => onItemChange(item.prop, val)"
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

/* 第一行：搜索项 + 更多 + 按钮组，撑满一行；放不下时多余项在「更多」中 */
.search-bar__row {
  display: flex;
  flex-wrap: wrap;
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

/* 展开时第二行仅展示多余搜索项，按钮仍在第一行 */
.search-bar__more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.search-bar__more :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}
</style>
