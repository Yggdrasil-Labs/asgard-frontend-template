<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="blank-layout">
    <main class="blank-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.blank-layout {
  min-height: 100dvh;
  background: #ffffff;
}

.blank-layout__main {
  min-height: 100dvh;
}
</style>
