import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
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

  it('页面组件 name 与路由名一致（KeepAlive include 可命中）', async () => {
    const routes = createRouteRecords()
    const home = routes.find(route => route.name === 'Home')

    expect(home).toBeTruthy()
    expect(typeof home?.component).toBe('function')

    const resolved = await (home!.component as () => Promise<Component>)()
    expect((resolved as { name?: string }).name).toBe('Home')

    const customer = routes.find(route => route.name === 'Customer')
    expect(customer).toBeTruthy()
    const resolvedCustomer = await (customer!.component as () => Promise<Component>)()
    expect((resolvedCustomer as { name?: string }).name).toBe('Customer')
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
