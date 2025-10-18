<script setup lang="ts">
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">
      count is {{ count }}
    </button>
    <p>
      {{ $t('button.edit') }}
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>
