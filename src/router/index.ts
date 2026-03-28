import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const MAIN_LAYOUT_ROUTE_NAME = 'MainLayout'

const PAGE_FILE_RE = /\/src\/pages\/([^/]+)\.vue$/
const PASCAL_SEG_RE = /(^\w)|-(\w)/g

function toRoutePathFromPageFile(file: string): string | undefined {
  // 约定：src/pages/index.vue -> '/'
  //      src/pages/foo-bar.vue -> '/foo-bar'
  // 只处理一级 pages，避免隐式嵌套路由引入歧义
  const match = file.match(PAGE_FILE_RE)
  if (!match)
    return undefined
  const name = match[1]
  if (name === 'index')
    return '/'
  return `/${name}`
}

function toRouteNameFromPath(path: string): string {
  if (path === '/')
    return 'Home'
  return path
    .slice(1)
    .split('/')
    .filter(Boolean)
    .map(seg => seg.replace(PASCAL_SEG_RE, (_, a, b) => (a ?? b).toUpperCase()))
    .join('')
}

function registerDynamicPageRoutes(router: ReturnType<typeof createRouter>) {
  const pages = import.meta.glob('/src/pages/*.vue')

  // 可选：为常用 demo 页提供默认标题（避免依赖宏/解析 definePage）
  const titleMap: Record<string, string> = {
    '/': '首页',
    '/pro-form-demo': 'ProForm 示例',
    '/pro-detail-demo': 'ProDetail 示例',
    '/pro-table-demo': 'ProTable 示例',
    '/search-bar-demo': 'SearchBar 示例',
  }

  for (const [file, loader] of Object.entries(pages)) {
    const path = toRoutePathFromPageFile(file)
    if (!path)
      continue

    const name = toRouteNameFromPath(path)

    // 跳过首页（由静态 children 承载），其他都动态注入到 MainLayout 下
    if (path === '/')
      continue

    // 子路由使用相对路径挂到 MainLayout，最终访问地址仍保持 '/foo' 形式。
    const record: RouteRecordRaw = {
      path: path.slice(1),
      name,
      component: loader,
      meta: { title: titleMap[path] ?? name },
    }

    router.addRoute(MAIN_LAYOUT_ROUTE_NAME, record)
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: MAIN_LAYOUT_ROUTE_NAME,
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/pages/index.vue'),
          meta: { title: '首页' },
        },
      ],
    },
  ],
})

registerDynamicPageRoutes(router)

// 路由守卫（模板默认不做业务鉴权）
// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Asgard Frontend`
  }
})

export default router
