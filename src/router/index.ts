import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫（模板默认不做业务鉴权）
router.beforeEach((to, from, next) => {
  console.log('Router navigate:', {
    to: to.path,
    from: from.path,
    meta: to.meta,
  })
  next()
})

// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Asgard Frontend`
  }
})

export default router
