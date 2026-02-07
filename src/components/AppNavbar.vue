<script setup>
/**
 * 通用导航栏组件
 *
 * 主应用和子应用共用的固定顶部导航栏
 * 提供应用切换下拉菜单,支持在主、子应用之间切换
 *
 * 显示逻辑:
 * - 主应用模式: 显示完整导航栏,下拉菜单通过 Vue Router 导航
 * - 独立应用模式: 显示导航栏,下拉菜单通过 URL 跳转
 * - 子应用嵌入 qiankun: 不显示 (由主应用提供导航栏)
 */

import { onClickOutside } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import apps from '@/config/apps'
import { isMainApp } from '@/utils/qiankun'

const router = useRouter()
const route = useRoute()

/** 下拉菜单开关状态 */
const dropdownOpen = ref(false)

/** 下拉菜单 DOM 引用 */
const switcherRef = ref(null)

/**
 * 当前路径（以浏览器 URL 为准，子应用挂载后主应用 route 可能不同步）
 */
const pathname = ref(typeof window !== 'undefined' ? window.location.pathname : route.fullPath)

function syncPathname() {
  if (typeof window === 'undefined')
    return
  const current = window.location.pathname
  if (current !== pathname.value)
    pathname.value = current
}

// 主应用路由变化时同步
watch(() => route.fullPath, (fullPath) => {
  pathname.value = fullPath
}, { immediate: true })

// 浏览器前进/后退、子应用内部跳转后同步真实 URL
let pathnameTimer = null
onMounted(() => {
  window.addEventListener('popstate', syncPathname)
  pathnameTimer = setInterval(syncPathname, 400)
})
onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPathname)
  if (pathnameTimer)
    clearInterval(pathnameTimer)
})

// 点击外部自动关闭下拉菜单
onClickOutside(switcherRef, () => {
  dropdownOpen.value = false
})

/**
 * 子应用列表 (从 apps.js 配置读取)
 */
const appList = computed(() => {
  return apps.map(app => ({
    name: app.name,
    title: app.title || app.name,
    path: app.activeRule,
  }))
})

/**
 * 当前激活的子应用（按浏览器实际 pathname 匹配）
 */
const activeApp = computed(() => {
  const path = pathname.value
  return appList.value.find(app => path === app.path || path.startsWith(`${app.path}/`))
})

/**
 * 是否在主页 (无子应用激活)
 */
const isHome = computed(() => !activeApp.value)

/**
 * 当前应用的显示名称
 */
const currentLabel = computed(() => activeApp.value?.title || '主应用首页')

/**
 * 导航到指定路径
 * @param {string} path - 目标路径
 */
function navigateTo(path) {
  dropdownOpen.value = false
  if (isMainApp()) {
    router.push(path)
  }
  else {
    window.location.href = path
  }
}

/**
 * 切换下拉菜单显示状态
 */
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
</script>

<template>
  <nav class="app-navbar">
    <div class="navbar-inner">
      <!-- 左侧: 品牌标识 -->
      <div class="navbar-brand" @click="navigateTo('/')">
        <span class="brand-text">Asgard Frontend</span>
      </div>

      <!-- 中间: 应用切换下拉菜单 -->
      <div ref="switcherRef" class="app-switcher">
        <button class="switcher-btn" @click="toggleDropdown">
          <span class="switcher-dot" :class="{ active: !isHome }" />
          <span class="switcher-label">{{ currentLabel }}</span>
          <svg
            class="switcher-arrow"
            :class="{ open: dropdownOpen }"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="dropdown-panel">
            <div class="dropdown-header">
              切换应用
            </div>

            <!-- 主应用首页 -->
            <a
              class="dropdown-item"
              :class="{ active: isHome }"
              @click="navigateTo('/')"
            >
              <span class="item-dot" />
              <span class="item-name">主应用首页</span>
              <svg
                v-if="isHome"
                class="item-check"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8L6.5 11.5L13 4.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>

            <!-- 子应用列表 -->
            <template v-if="appList.length">
              <div class="dropdown-divider" />
              <a
                v-for="app in appList"
                :key="app.name"
                class="dropdown-item"
                :class="{ active: activeApp?.name === app.name }"
                @click="navigateTo(app.path)"
              >
                <span class="item-dot" />
                <span class="item-name">{{ app.title }}</span>
                <svg
                  v-if="activeApp?.name === app.name"
                  class="item-check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8L6.5 11.5L13 4.5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </template>
          </div>
        </Transition>
      </div>

      <!-- 右侧: 操作区 -->
      <div class="navbar-actions">
        <LanguageSwitcher />
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ========== 导航栏容器 ========== */
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 56px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.navbar-inner {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ========== 品牌标识 ========== */
.navbar-brand {
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s;
}

.navbar-brand:hover .brand-text {
  opacity: 0.75;
}

/* ========== 应用切换器 ========== */
.app-switcher {
  position: relative;
}

.switcher-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.4;
}

.switcher-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.switcher-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.switcher-dot.active {
  background: #667eea;
}

.switcher-arrow {
  transition: transform 0.2s ease;
  color: #9ca3af;
  flex-shrink: 0;
}

.switcher-arrow.open {
  transform: rotate(180deg);
}

/* ========== 下拉面板 ========== */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 240px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 6px;
  z-index: 100;
}

.dropdown-header {
  padding: 8px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 8px;
}

/* ========== 下拉菜单项 ========== */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  user-select: none;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
}

.dropdown-item.active .item-dot {
  background: rgba(255, 255, 255, 0.7);
}

.item-name {
  flex: 1;
}

.item-check {
  flex-shrink: 0;
  opacity: 0.9;
}

/* ========== 下拉动画 ========== */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ========== 右侧操作区 ========== */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .navbar-inner {
    padding: 0 16px;
  }

  .brand-text {
    font-size: 16px;
  }

  .switcher-label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
