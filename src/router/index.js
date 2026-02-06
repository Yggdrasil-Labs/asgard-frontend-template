import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { isMainApp, isMicroApp } from '@/utils/qiankun'

/**
 * 创建路由实例
 *
 * @param {string} [base] - 路由 base 路径
 * @returns {import('vue-router').Router} 路由实例
 */
export function createAppRouter(base = '/') {
  const router = createRouter({
    history: createWebHistory(base),
    routes,
  })

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = `${to.meta.title} - Asgard Frontend`
    }
  })

  return router
}

// 创建默认路由实例(子应用模式为 null,由 qiankun 生命周期管理)
const defaultRouter = (() => {
  if (isMicroApp()) {
    return null
  }
  const router = createAppRouter()
  if (isMainApp()) {
    router.beforeEach((to, from, next) => next())
  }
  return router
})()

export default defaultRouter
