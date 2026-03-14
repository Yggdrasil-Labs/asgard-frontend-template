import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/pages/index.vue'),
          meta: { title: '首页' },
        },
        {
          path: 'pro-form-demo',
          name: 'ProFormDemo',
          component: () => import('@/pages/pro-form-demo.vue'),
          meta: { title: 'ProForm 示例' },
        },
      ],
    },
  ],
})

// 路由守卫（模板默认不做业务鉴权）
router.beforeEach((to, from) => {
  console.log('Router navigate:', {
    to: to.path,
    from: from.path,
    meta: to.meta,
  })
})

// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Asgard Frontend`
  }
})

export default router
