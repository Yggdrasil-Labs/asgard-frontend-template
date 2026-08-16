import type { RouteRecordInfo } from 'vue-router'
import type { SemanticIconName } from '@/components/icon/icon.types'
import type { AppLayoutName } from '@/router/types'

declare module 'vue-router' {
  /**
   * 路由名类型映射：与 src/router/app-route-schema.ts 严格一致，是路由名的单一类型来源。
   * 此前由 vue-router/vite 文件式路由插件生成的 route-map.d.ts 提供（已移除），
   * 其把首页路由名推为 '/'，与运行时 schema 的 'Home' 背离。
   * schema 改名时此处类型会编译失败，请同步更新。
   */
  interface TypesConfig {
    RouteNamedMap: {
      Home: RouteRecordInfo<'Home', '/', Record<never, never>, Record<never, never>, never>
      ProDialogDemo: RouteRecordInfo<'ProDialogDemo', '/pro-dialog-demo', Record<never, never>, Record<never, never>, never>
      ProFormDemo: RouteRecordInfo<'ProFormDemo', '/pro-form-demo', Record<never, never>, Record<never, never>, never>
      ProDetailDemo: RouteRecordInfo<'ProDetailDemo', '/pro-detail-demo', Record<never, never>, Record<never, never>, never>
      ProTableDemo: RouteRecordInfo<'ProTableDemo', '/pro-table-demo', Record<never, never>, Record<never, never>, never>
      SearchBarDemo: RouteRecordInfo<'SearchBarDemo', '/search-bar-demo', Record<never, never>, Record<never, never>, never>
      Customer: RouteRecordInfo<'Customer', '/customer', Record<never, never>, Record<never, never>, never>
    }
  }

  interface RouteMeta {
    title?: string
    icon?: SemanticIconName
    layout?: AppLayoutName
    menu?: {
      visible?: boolean
      order?: number
      activeMenu?: string
    }
    tab?: {
      enabled?: boolean
      closable?: boolean
      pinned?: boolean
      singleton?: boolean
    }
    keepAlive?: {
      enabled?: boolean
      strategy?: 'routeName' | 'fullPath'
    }
  }
}
