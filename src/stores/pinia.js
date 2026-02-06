import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { getAppName, isMicroApp } from '@/utils/qiankun'

/**
 * 创建 Pinia 实例
 *
 * 子应用模式下,会为持久化存储添加命名空间前缀,避免与主应用冲突
 *
 * @returns {import('pinia').Pinia}
 */
export function createAppPinia() {
  const pinia = createPinia()

  // 配置持久化插件
  if (isMicroApp()) {
    // 子应用模式: 添加命名空间前缀
    const appName = getAppName() || 'micro-app'
    pinia.use(piniaPluginPersistedstate)

    // 为所有 store 添加命名空间前缀
    pinia.use(({ store }) => {
      if (store.$id) {
        const originalId = store.$id
        store.$id = `${appName}:${originalId}`
      }
    })
  }
  else {
    // 主应用和独立应用模式: 标准配置
    pinia.use(piniaPluginPersistedstate)
  }

  return pinia
}

export default createAppPinia
