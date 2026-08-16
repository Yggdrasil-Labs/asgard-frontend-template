import { describe, expect, it } from 'vitest'
import { getKeepAliveIncludeName } from '@/app/shell/route-cache'
import { createRouteRecords } from '@/router/app-routes'

describe('createRouteRecords', () => {
  it('creates child routes under shell entry', () => {
    const routes = createRouteRecords()
    const home = routes.find(route => route.path === '/')
    expect(home).toBeTruthy()
  })

  it('uses lazy route loaders instead of defineAsyncComponent wrappers', () => {
    const routes = createRouteRecords()
    const proDialog = routes.find(route => route.path === '/pro-dialog-demo')

    expect(typeof proDialog?.component).toBe('function')
  })

  it('keepAlive include 名映射为页面文件名（与组件 __name 一致，HMR 免疫）', () => {
    expect(getKeepAliveIncludeName('Home')).toBe('index')
    expect(getKeepAliveIncludeName('ProFormDemo')).toBe('pro-form-demo')
    expect(getKeepAliveIncludeName('Customer')).toBe('customer')

    // fullPath 策略键只取路由名段再做映射
    expect(getKeepAliveIncludeName('Home:/detail?id=1')).toBe('index')

    // 未知路由名原样回退，不吞键
    expect(getKeepAliveIncludeName('UnknownRoute')).toBe('UnknownRoute')
  })

  it('preserves nested child routes from the schema', () => {
    const routes = createRouteRecords([
      {
        name: 'Workspace',
        path: '/workspace',
        component: 'index',
        meta: { title: 'Workspace' },
        children: [
          {
            name: 'WorkspaceDetail',
            path: '/workspace/detail',
            component: 'pro-detail-demo',
            meta: { title: 'Workspace Detail' },
          },
        ],
      },
    ])

    expect(routes[0]?.children).toHaveLength(1)
    expect(routes[0]?.children?.[0]?.path).toBe('/workspace/detail')
    expect(routes[0]?.children?.[0]?.name).toBe('WorkspaceDetail')
  })
})
