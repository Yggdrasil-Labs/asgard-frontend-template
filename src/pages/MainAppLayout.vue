<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QiankunContainer from '@/components/QiankunContainer.vue'
import apps from '@/config/apps'

/**
 * 主应用布局组件
 *
 * 提供主应用的统一布局,包括:
 * - 顶部导航栏
 * - 侧边栏菜单
 * - 子应用容器区域
 */

const router = useRouter()
const route = useRoute()

/**
 * 子应用菜单列表
 */
const microApps = computed(() => {
  return apps.map(app => ({
    name: app.name,
    title: app.name,
    path: app.activeRule,
  }))
})

/**
 * 当前激活的子应用
 */
const activeApp = computed(() => {
  return microApps.value.find(app => route.path.startsWith(app.path))
})

/**
 * 导航到子应用
 */
function navigateToApp(path) {
  router.push(path)
}

/**
 * 返回主应用首页
 */
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="main-app-layout">
    <!-- 顶部导航栏 -->
    <header class="main-header">
      <div class="header-left">
        <h1 class="app-title" @click="goHome">
          Asgard Frontend (主应用)
        </h1>
      </div>
      <nav class="header-nav">
        <a
          v-for="app in microApps"
          :key="app.name"
          class="nav-item" :class="[{ active: activeApp?.name === app.name }]"
          @click="navigateToApp(app.path)"
        >
          {{ app.title }}
        </a>
      </nav>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 子应用容器 -->
      <QiankunContainer id="subapp-viewport" />

      <!-- 主应用首页 (无子应用激活时显示) -->
      <div v-if="!activeApp" class="home-page">
        <h2>欢迎使用 Asgard Frontend 主应用</h2>
        <p>请从顶部导航栏选择一个子应用</p>
        <div class="app-list">
          <div
            v-for="app in microApps"
            :key="app.name"
            class="app-card"
            @click="navigateToApp(app.path)"
          >
            <h3>{{ app.title }}</h3>
            <p>点击访问</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.main-app-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

/* 顶部导航栏 */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;
}

.app-title:hover {
  color: #42b983;
}

.header-nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: #42b983;
  font-weight: 600;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  overflow: auto;
  background-color: #f5f5f5;
}

/* 主应用首页 */
.home-page {
  padding: 48px;
  text-align: center;
}

.home-page h2 {
  margin: 0 0 16px;
  font-size: 32px;
  color: #2c3e50;
}

.home-page > p {
  margin: 0 0 48px;
  color: #666;
  font-size: 16px;
}

.app-list {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.app-card {
  padding: 32px;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.app-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #2c3e50;
}

.app-card p {
  margin: 0;
  color: #999;
  font-size: 14px;
}
</style>
