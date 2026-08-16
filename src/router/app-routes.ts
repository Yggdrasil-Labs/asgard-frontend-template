import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { AppRouteRecord } from './types'
import { markRaw } from 'vue'
import { appRouteSchema } from './app-route-schema'
import { getNormalizedAppRoutes } from './app-route-tree'

const views = import.meta.glob<{ default: Component }>('/src/pages/*.vue')

export function resolvePageComponent(component: string) {
  const key = `/src/pages/${component}.vue`
  const loader = views[key]
  if (!loader)
    throw new Error(`View not found: ${component}`)

  return loader
}

async function resolveRouteComponent(route: AppRouteRecord): Promise<Component> {
  const loader = resolvePageComponent(route.component)
  const { default: page } = await loader()
  // KeepAlive 的 include 按组件 name 匹配；页面组件的 __name 是文件名（如 index），
  // 与路由名（如 Home）不一致会导致缓存永不命中，这里把组件名显式对齐到路由名。
  return markRaw(Object.assign({}, page, { name: route.name }))
}

function toRouteRecord(route: AppRouteRecord): RouteRecordRaw {
  return {
    path: route.path,
    name: route.name,
    component: () => resolveRouteComponent(route),
    meta: route.meta,
    children: route.children?.map(toRouteRecord),
  }
}

export function createRouteRecords(routes: AppRouteRecord[] = appRouteSchema): RouteRecordRaw[] {
  return getNormalizedAppRoutes(routes).map(toRouteRecord)
}
