import i18n from '@locales/i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createAppPinia } from '@/stores/pinia'
import { initAppSettings } from '@/utils/initApp'
import { isMainApp, isMicroApp } from '@/utils/qiankun'
import '@scss/main.scss'

/**
 * 导出子应用生命周期钩子 (vite-plugin-qiankun-x 要求)
 *
 * 插件会自动处理这些导出:
 * - 开发模式: 转换为 qiankun 可加载的格式
 * - 构建模式: 保留 ESM 导出
 */
export { bootstrap, mount, unmount, update } from '@/qiankun/micro'

// 初始化应用设置
initAppSettings()

// 模式 1: 主应用模式
if (isMainApp()) {
  const app = createApp(App)
  const pinia = createAppPinia()

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.mount('#app')

  // 动态导入 qiankun 主应用逻辑
  import('./qiankun/main').then(({ startMainApp }) => {
    startMainApp()
  })
}
// 模式 2: 子应用模式
// VITE_APP_MODE 为非 main/standalone 的值均视为子应用模式
else if (isMicroApp()) {
  // 独立运行时自动挂载 (非 qiankun 环境,如直接访问子应用开发服务器)
  if (!window.__POWERED_BY_QIANKUN__) {
    import('./qiankun/micro').then(lifecycle => lifecycle.mount({}))
  }
  // 在 qiankun 环境中,生命周期钩子由上方的 export 提供,qiankun 自动调用
}
// 模式 3: 独立应用模式 (默认)
else {
  const app = createApp(App)
  const pinia = createAppPinia()

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.mount('#app')
}
