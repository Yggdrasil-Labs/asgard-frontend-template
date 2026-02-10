<script setup>
/**
 * FormDialog - 弹窗 + ProForm，与 ProForm 同套配置（items / model），无额外转换
 */
import ProForm from './ProForm.vue'

const props = defineProps({
  /** 表单项配置，与 ProForm items 一致 */
  items: { type: Array, required: true },
  title: { type: String, default: '表单' },
  width: { type: String, default: '560px' },
  submitLoading: { type: Boolean, default: false },
  /** 透传 ProForm */
  labelWidth: { type: String, default: '100px' },
  defaultSpan: { type: Number, default: 24 },
})

const emit = defineEmits(['submit', 'cancel'])

const model = defineModel({ type: Object, required: true })
const visible = defineModel('visible', { type: Boolean, default: false })

const formRef = ref(null)

function onCancel() {
  visible.value = false
  emit('cancel')
}

function onSubmit(values) {
  emit('submit', values)
}

function onSaveClick() {
  formRef.value?.submit()
}
</script>

<template>
  <el-dialog v-model="visible" :title="props.title" :width="props.width">
    <ProForm
      ref="formRef"
      v-model="model"
      :items="props.items"
      mode="edit"
      :label-width="props.labelWidth"
      :default-span="props.defaultSpan"
      @submit="onSubmit"
    />
    <slot />
    <template #footer>
      <slot name="footer">
        <el-button @click="onCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="props.submitLoading" @click="onSaveClick">
          保存
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>
