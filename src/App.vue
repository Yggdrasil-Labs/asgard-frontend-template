<script setup>
import AppNavbar from '@components/AppNavbar.vue'
import { useElementPlusLocale } from '@/composables/useElementPlusLocale'

const { elementLocale } = useElementPlusLocale()
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <div class="app">
      <AppNavbar />
      <main class="app__main">
        <RouterView />
      </main>
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  max-width: 100vw;
  margin: 0 auto;
}

.app__main {
  min-height: calc(100vh - 56px);
}
</style>
