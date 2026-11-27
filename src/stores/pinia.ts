/**
 * Pinia 配置和初始化
 * 创建和配置 Pinia 实例
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
export function createAppPinia() {
  const pinia = createPinia()

  // 注册官方持久化插件
  pinia.use(piniaPluginPersistedstate)

  return pinia
}
