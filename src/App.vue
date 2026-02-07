<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import QiankunContainer from '@/components/QiankunContainer.vue'
import apps from '@/config/apps'
import { isMainApp, isQiankunEnv } from '@/utils/qiankun'

/**
 * 导航栏显示条件:
 * - 在 qiankun 环境中运行时不显示 (主应用已提供导航栏)
 * - 其他模式下始终显示
 */
const showNavbar = !isQiankunEnv()

/**
 * 是否为主应用模式
 */
const isMain = isMainApp()

// 如果环境变量是 main mode，强制设置为主应用
const forceMain = import.meta.env.MODE === 'main'
const shouldRenderContainer = isMain || forceMain

/**
 * 子应用激活路由前缀列表
 * 用于判断当前 URL 是否匹配某个子应用
 */
const subappPrefixes = shouldRenderContainer ? apps.map(app => app.activeRule) : []

/**
 * 当前是否处于子应用路由
 * 当 URL 匹配某个子应用的 activeRule 时,隐藏主应用自身页面,只展示子应用容器
 */
const route = useRoute()
const isSubappRoute = computed(() => {
  if (!shouldRenderContainer)
    return false
  return subappPrefixes.some(prefix => route.path.startsWith(prefix))
})
</script>

<template>
  <div class="app" :class="{ 'has-navbar': showNavbar, 'subapp-active': isSubappRoute }">
    <!-- 通用固定导航栏 -->
    <AppNavbar v-if="showNavbar" />

    <!-- 主应用自身页面 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 子应用挂载容器 (仅主应用模式,始终在 DOM 中) -->
    <QiankunContainer v-if="shouldRenderContainer" class="app-subapp" />
  </div>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  max-width: 100vw;
  margin: 0 auto;
  position: relative;
}

/* 有导航栏时为内容区域添加顶部间距 */
.app.has-navbar {
  padding-top: 56px;
}

.app-main {
  width: 100%;
  min-height: calc(100vh - 56px);
}

.app-subapp {
  /* 使用 fixed 定位，相对于视口 */
  position: fixed;
  top: 56px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  /* 默认隐藏子应用容器 */
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  /* 确保子应用在最上层 */
  z-index: 1;
  background: #fff;
}

/* 子应用激活时的样式 */
.app.subapp-active {
  .app-main {
    /* 隐藏主应用内容 */
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .app-subapp {
    /* 显示子应用容器 */
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
