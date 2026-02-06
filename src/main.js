import i18n from '@locales/i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import { APP_MODE } from '@/constants/qiankun'
import router from '@/router'
import { createAppPinia } from '@/stores/pinia'
import { initAppSettings } from '@/utils/initApp'
import { getAppMode } from '@/utils/qiankun'
import '@scss/main.scss'

// 初始化应用设置
initAppSettings()

// 获取当前运行模式
const mode = getAppMode()

// 模式 1: 主应用模式
if (mode === APP_MODE.MAIN) {
  // 主应用初始化
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
else if (mode === APP_MODE.MICRO) {
  // 动态导入子应用生命周期逻辑
  import('./qiankun/micro').then((lifecycle) => {
    // 导出到全局,供 qiankun 调用
    window.microAppBootstrap = lifecycle.bootstrap
    window.microAppMount = lifecycle.mount
    window.microAppUnmount = lifecycle.unmount
    window.microAppUpdate = lifecycle.update

    // 独立运行时自动挂载
    if (!window.__POWERED_BY_QIANKUN__) {
      lifecycle.mount({})
    }
  })
}
// 模式 3: 独立应用模式 (默认)
else {
  // 标准 SPA 启动流程
  const app = createApp(App)
  const pinia = createAppPinia()

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.mount('#app')
}
