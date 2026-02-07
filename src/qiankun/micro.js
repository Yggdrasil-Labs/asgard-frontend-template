/**
 * qiankun 子应用生命周期逻辑
 *
 * 本文件实现子应用的 qiankun 生命周期钩子
 */

import i18n from '@locales/i18n'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from '@/App.vue'
import { createAppPinia } from '@/stores/pinia'
import { getAppName, getPublicPath } from '@/utils/qiankun'

// 子应用实例引用
let vueApp = null
let router = null
let pinia = null

/**
 * 子应用初始化钩子
 * 仅在子应用第一次加载时调用一次
 *
 * @returns {Promise<void>}
 */
export async function bootstrap() {
  // 子应用首次加载时调用一次
}

/**
 * 子应用挂载钩子
 * 每次子应用激活时调用
 *
 * @param {object} props - 主应用传递的数据
 * @param {string} props.basename - 子应用路由前缀
 * @param {object} [props.globalState] - 全局状态
 * @param {object} [props.eventBus] - 事件总线
 * @param {HTMLElement} [props.container] - 挂载容器
 * @returns {Promise<void>}
 */
export async function mount(props = {}) {
  const appName = getAppName() || 'micro-app'

  // 防止重复挂载: 如果已有 Vue 实例,先卸载再重新挂载
  if (vueApp) {
    await unmount()
  }

  try {
    // 1. 配置路由 base
    const basename = props.basename || getPublicPath() || '/'
    router = createRouter({
      history: createWebHistory(basename),
      routes,
    })

    // 2. 创建 Pinia 实例
    pinia = createAppPinia()

    // 3. 创建 Vue 应用实例
    vueApp = createApp(App)
    vueApp.use(pinia)
    vueApp.use(router)
    vueApp.use(i18n)

    // 4. 将主应用传递的数据挂载到全局
    if (props.globalState) {
      vueApp.provide('globalState', props.globalState)
    }
    if (props.eventBus) {
      vueApp.provide('eventBus', props.eventBus)
    }

    // 5. 挂载到 DOM
    const container = props.container?.querySelector('#app') || '#app'
    vueApp.mount(container)
  }
  catch (error) {
    console.error(`[qiankun-micro] ${appName} mount failed:`, error)
    throw error
  }
}

/**
 * 子应用卸载钩子
 * 每次子应用失活时调用
 *
 * @returns {Promise<void>}
 */
export async function unmount() {
  const appName = getAppName() || 'micro-app'

  try {
    // 1. 卸载 Vue 应用实例
    if (vueApp) {
      vueApp.unmount()
      vueApp = null
    }

    // 2. 清理 Router
    if (router) {
      router = null
    }

    // 3. 清理 Pinia store
    if (pinia) {
      // 清理所有 store 的状态
      pinia._s.forEach((store) => {
        store.$dispose?.()
      })
      pinia = null
    }
  }
  catch (error) {
    console.error(`[qiankun-micro] ${appName} unmount failed:`, error)
    throw error
  }
}

/**
 * 子应用更新钩子 (可选)
 * props 变化时调用
 *
 * @param {object} props - 更新后的 props
 * @returns {Promise<void>}
 */
export async function update(props) {
  // 可以在这里处理 props 变化
  // 例如: 更新主题、更新全局状态等
  void props
}
