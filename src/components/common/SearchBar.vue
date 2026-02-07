<script setup>
const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: String,
    default: '88px',
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
  <el-form :model="model" :label-width="props.labelWidth" inline>
    <el-form-item
      v-for="field in props.fields"
      :key="field.prop"
      :label="field.label"
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
