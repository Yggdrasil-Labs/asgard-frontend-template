import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import apps from '@/config/apps'
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

  // 如果是主应用模式，为子应用路由准备配置
  let routesWithSubapps = [...routes]
  if (isMainApp()) {
    // 为每个子应用的 activeRule 添加 catch-all 路由
    // 这样 Vue Router 不会在导航到子应用路径时报警告
    // 实际渲染由 qiankun 在 QiankunContainer 中处理
    const subappRoutes = apps.map(app => ({
      path: `${app.activeRule}/:pathMatch(.*)*`,
      name: `subapp-${app.name}`,
      component: { render: () => null },
      meta: { isSubApp: true, appName: app.name },
    }))
    routesWithSubapps = [...routes, ...subappRoutes]
  }

  const router = createRouter({
    history: createWebHistory('/'),
    routes: routesWithSubapps,
  })

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = `${to.meta.title} - Asgard Frontend`
    }
  })

  return router
})()

export default defaultRouter
