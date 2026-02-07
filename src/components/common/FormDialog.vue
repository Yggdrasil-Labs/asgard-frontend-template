<script setup>
const props = defineProps({
  rules: {
    type: Object,
    default: () => ({}),
  },
  fields: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '表单',
  },
  width: {
    type: String,
    default: '560px',
  },
  submitLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const model = defineModel({
  type: Object,
  default: () => ({}),
})

const visible = defineModel('visible', { type: Boolean, default: false })
function onCancel() {
  visible.value = false
  emit('cancel')
}

function onSubmit() {
  emit('submit', model.value)
}
</script>

<template>
  <el-dialog v-model="visible" :title="props.title" :width="props.width">
    <el-form :model="model" :rules="props.rules" label-width="100px">
      <el-form-item
        v-for="field in props.fields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <component
          :is="field.component || 'el-input'"
          v-model="model[field.prop]"
          v-bind="field.componentProps"
        >
          <template v-if="field.options" #default>
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </template>
        </component>
      </el-form-item>
      <slot />
    </el-form>
    <template #footer>
      <slot name="footer">
        <el-button @click="onCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="props.submitLoading" @click="onSubmit">
          保存
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>
