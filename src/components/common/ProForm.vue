<script setup>
/**
 * ProForm - 后台新增/编辑/查看场景的表单组件
 * 配置驱动、支持校验、create/edit/view 模式，不直接调接口
 */

const props = defineProps({
  /** 表单数据模型（必填） */
  model: { type: Object, required: true },
  /** 表单项配置列表（必填） */
  items: { type: Array, required: true },
  /** 表单模式：create 可编辑空表单 / edit 可编辑回显 / view 只读 */
  mode: { type: String, default: 'edit' },
  /** 标签宽度 */
  labelWidth: { type: String, default: '100px' },
  /** 栅格默认占位（每项 span），默认 24 即一行一个 */
  defaultSpan: { type: Number, default: 24 },
})

const emit = defineEmits(['submit', 'reset', 'change'])

const model = defineModel({ type: Object, required: true })

const formRef = ref(null)

const isView = computed(() => props.mode === 'view')

const visibleItems = computed(() =>
  props.items.filter(item => item.visible !== false),
)

/** 表单项是否禁用：view 模式或 item.disabled */
function isItemDisabled(item) {
  return isView.value || item.disabled === true
}

/** 合并 placeholder 与 componentProps */
function getControlProps(item) {
  const base = item.placeholder != null
    ? { placeholder: item.placeholder, ...item.componentProps }
    : { ...item.componentProps }
  return base
}

function onSubmit() {
  formRef.value?.validate((valid) => {
    if (valid)
      emit('submit', { ...model.value })
  })
}

function onReset() {
  formRef.value?.resetFields()
  emit('reset')
}

defineExpose({ submit: onSubmit, reset: onReset })

function onItemChange(prop, value) {
  emit('change', { prop, value })
}
</script>

<template>
  <div class="pro-form">
    <el-form
      ref="formRef"
      :model="model"
      :label-width="props.labelWidth"
      v-bind="$attrs"
    >
      <el-row :gutter="16">
        <template v-for="item in visibleItems" :key="item.prop">
          <el-col :span="item.span ?? props.defaultSpan">
            <el-form-item
              :label="item.label"
              :prop="item.prop"
              :rules="item.rules"
            >
              <!-- custom -->
              <slot
                v-if="item.slot || item.type === 'custom'"
                :name="item.prop"
                :item="item"
                :model="model"
              />
              <!-- input -->
              <el-input
                v-else-if="item.type === 'input'"
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              />
              <!-- textarea -->
              <el-input
                v-else-if="item.type === 'textarea'"
                v-model="model[item.prop]"
                type="textarea"
                :disabled="isItemDisabled(item)"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              />
              <!-- select -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
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
              <!-- radio -->
              <el-radio-group
                v-else-if="item.type === 'radio'"
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              >
                <el-radio
                  v-for="opt in (item.options ?? [])"
                  :key="String(opt.value)"
                  :label="opt.value"
                >
                  {{ opt.label }}
                </el-radio>
              </el-radio-group>
              <!-- checkbox -->
              <el-checkbox-group
                v-else-if="item.type === 'checkbox'"
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              >
                <el-checkbox
                  v-for="opt in (item.options ?? [])"
                  :key="String(opt.value)"
                  :label="opt.value"
                >
                  {{ opt.label }}
                </el-checkbox>
              </el-checkbox-group>
              <!-- date -->
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="model[item.prop]"
                type="date"
                :disabled="isItemDisabled(item)"
                style="width: 100%"
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
                :disabled="isItemDisabled(item)"
                style="width: 100%"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              />
              <!-- number -->
              <el-input-number
                v-else-if="item.type === 'number'"
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
                style="width: 100%"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              />
              <!-- 默认 input -->
              <el-input
                v-else
                v-model="model[item.prop]"
                :disabled="isItemDisabled(item)"
                v-bind="getControlProps(item)"
                @change="val => onItemChange(item.prop, val)"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <slot />
      <div v-if="$slots.actions" class="pro-form__actions">
        <slot name="actions" />
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.pro-form__actions {
  margin-top: 16px;
}
</style>
