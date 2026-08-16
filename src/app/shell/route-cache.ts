import { appRouteSchema } from '@/router/app-route-schema'

export type KeepAliveStrategy = 'routeName' | 'fullPath'

// 路由名 → 页面组件文件名。
// KeepAlive 的 include 按组件 name/__name 匹配，而页面组件编译产物的 __name
// 是文件名（如 index），与路由名（如 Home）不同源。这里把 include 名映射为
// 文件名，保证缓存命中；__name 恒存在于编译产物，HMR 也不会改变它。
// 约定：页面组件请勿用 defineOptions 自定义 name，否则会改变匹配名。
const routeComponentNameMap = new Map(
  appRouteSchema.map(route => [route.name, route.component]),
)

interface CacheRouteLike {
  name?: string | symbol | null
  path: string
  fullPath: string
  meta: {
    keepAlive?: {
      strategy?: KeepAliveStrategy
    }
  }
}

interface CacheTabLike {
  routeName: string
  fullPath: string
}

export function buildRouteCacheKey(route: CacheRouteLike) {
  const routeName = String(route.name ?? route.path)
  const strategy = route.meta.keepAlive?.strategy ?? 'routeName'

  return buildCacheKey({
    routeName,
    fullPath: route.fullPath,
    strategy,
  })
}

export function buildTabCacheKey(tab: CacheTabLike, strategy: KeepAliveStrategy = 'routeName') {
  return buildCacheKey({
    routeName: tab.routeName,
    fullPath: tab.fullPath,
    strategy,
  })
}

export function getKeepAliveIncludeName(cacheKey: string) {
  const routeName = cacheKey.split(':', 1)[0] ?? cacheKey
  return routeComponentNameMap.get(routeName) ?? routeName
}

function buildCacheKey(input: { routeName: string, fullPath: string, strategy: KeepAliveStrategy }) {
  if (input.strategy === 'fullPath')
    return `${input.routeName}:${input.fullPath}`

  return input.routeName
}
