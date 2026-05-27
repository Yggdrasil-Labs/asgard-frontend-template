<script setup lang="ts">
import type { AppRouteRecord } from '@/router/types'
import type { MenuNode } from '@/stores/menu'
import { useWindowSize } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageRenderer from '@/app/shell/AppPageRenderer.vue'
import { buildTabCacheKey } from '@/app/shell/route-cache'
import { normalizedAppRouteSchema } from '@/router/app-route-tree'
import { useAppShellStore, useKeepAliveStore, useMenuStore, useTabsStore } from '@/stores'
import AppHeader from './components/AppHeader.vue'
import AppSider from './components/AppSider.vue'
import AppTabs from './components/AppTabs.vue'

const route = useRoute()
const router = useRouter()
const { width } = useWindowSize()

const appShellStore = useAppShellStore()
const keepAliveStore = useKeepAliveStore()
const menuStore = useMenuStore()
const tabsStore = useTabsStore()

const currentPageTitle = computed(() => {
  return String(route.meta.title ?? 'Asgard Frontend Template')
})

const menuTree = computed<MenuNode[]>(() => {
  return normalizedAppRouteSchema
    .map(routeItem => toMenuNode(routeItem))
    .filter((item): item is MenuNode => Boolean(item))
})

const isMobile = computed(() => appShellStore.device === 'mobile')
const isDrawerVisible = computed(() => appShellStore.drawerVisible)
const isCollapsed = computed(() => appShellStore.siderCollapsed)

onMounted(() => {
  menuStore.setTree(menuTree.value)
})

watch(width, (nextWidth) => {
  appShellStore.setViewportWidth(nextWidth)
}, { immediate: true })

function handleMenuSelect(key: string) {
  const target = findRouteByKey(normalizedAppRouteSchema, key)
  if (!target)
    return

  router.push(target.path)
  if (isMobile.value)
    appShellStore.closeDrawer()
}

function handleTabSelect(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    router.push(target.path)
}

function handleTabClose(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  const wasActive = tabsStore.activeKey === key

  tabsStore.close(key)
  if (target)
    keepAliveStore.invalidate(getTabCacheKey(target.routeName, target.fullPath))

  if (wasActive) {
    const fallback = tabsStore.items.find(item => item.key !== key) ?? null
    if (fallback)
      router.push(fallback.path)
  }

  if (!tabsStore.items.length && target)
    router.push(target.path)
}

function handleTabCloseOthers(key: string) {
  const remainingCacheKeys = tabsStore.items
    .filter(item => item.pinned || item.key === key)
    .map(item => getTabCacheKey(item.routeName, item.fullPath))

  tabsStore.closeOthers(key)
  keepAliveStore.retain(remainingCacheKeys)

  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    router.push(target.path)
}

function handleTabRefresh(key: string) {
  const target = tabsStore.items.find(item => item.key === key)
  if (target)
    keepAliveStore.invalidate(getTabCacheKey(target.routeName, target.fullPath))
  tabsStore.refresh(key)
}

function handleSiderToggle() {
  if (isMobile.value) {
    appShellStore.toggleDrawer()
    return
  }

  appShellStore.toggleSiderCollapsed()
}

function handleHeaderToggle() {
  handleSiderToggle()
}

function toMenuNode(routeItem: AppRouteRecord): MenuNode | null {
  if (routeItem.meta.menu?.visible === false)
    return null

  return {
    key: routeItem.name,
    path: routeItem.path,
    title: routeItem.meta.title,
    icon: routeItem.meta.icon,
    order: routeItem.meta.menu?.order,
    hidden: false,
    children: routeItem.children?.map(child => toMenuNode(child)).filter((item): item is MenuNode => Boolean(item)),
  }
}

function findRouteByKey(routes: AppRouteRecord[], key: string): AppRouteRecord | null {
  for (const routeItem of routes) {
    if (routeItem.name === key)
      return routeItem

    if (routeItem.children) {
      const nested = findRouteByKey(routeItem.children, key)
      if (nested)
        return nested
    }
  }

  return null
}

function getTabCacheKey(routeName: string, fullPath: string) {
  const routeItem = findRouteByKey(normalizedAppRouteSchema, routeName)
  const strategy = routeItem?.meta.keepAlive?.strategy ?? 'routeName'

  return buildTabCacheKey({ routeName, fullPath }, strategy)
}
</script>

<template>
  <div class="default-layout" data-scroll-boundary="viewport" data-density="compact">
    <div class="default-layout__shell" data-scroll-boundary="viewport" data-density="compact">
      <AppHeader
        :title="currentPageTitle"
        :device="appShellStore.device"
        :collapsed="isCollapsed"
        :drawer-visible="isDrawerVisible"
        @toggle-nav="handleHeaderToggle"
      />

      <div class="default-layout__body" data-scroll-boundary="viewport" data-density="compact">
        <AppSider
          :tree="menuStore.tree"
          :active-key="menuStore.activeKey"
          :open-keys="menuStore.openKeys"
          :collapsed="isCollapsed"
          :mobile="isMobile"
          :drawer-visible="isDrawerVisible"
          @select="handleMenuSelect"
          @toggle-collapse="handleSiderToggle"
          @close-drawer="appShellStore.closeDrawer()"
        />

        <Transition name="fade">
          <div
            v-if="isMobile && isDrawerVisible"
            class="default-layout__backdrop"
            @click="appShellStore.closeDrawer()"
          />
        </Transition>

        <div class="default-layout__content" data-scroll-boundary="viewport" data-density="compact">
          <AppTabs
            v-if="!isMobile"
            :items="tabsStore.items"
            :active-key="tabsStore.activeKey"
            @select="handleTabSelect"
            @close="handleTabClose"
            @close-others="handleTabCloseOthers"
            @refresh="handleTabRefresh"
          />

          <main class="default-layout__main" data-scroll-boundary="main" data-density="compact">
            <div class="default-layout__main-surface" data-density="compact">
              <div class="default-layout__page-container" data-layout="page">
                <AppPageRenderer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  display: flex;
  height: 100dvh;
  overflow: hidden;
  padding: var(--shell-frame-padding);
  background: var(--shell-bg);
  color: var(--shell-text);
}

.default-layout__shell {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  flex-direction: column;
  gap: var(--shell-panel-gap);
}

.default-layout__body {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  gap: var(--shell-panel-gap);
}

.default-layout__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--shell-border);
  border-radius: var(--shell-radius-sm);
  background: var(--shell-surface-strong);
}

.default-layout__main {
  flex: 1;
  min-height: 0;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
}

.default-layout__main::-webkit-scrollbar {
  width: 6px;
}

.default-layout__main::-webkit-scrollbar-track {
  background: transparent;
}

.default-layout__main::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 3px;
}

.default-layout__main::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}

.default-layout__main-surface {
  min-height: 100%;
}

.default-layout__page-container {
  min-height: 100%;
  width: 100%;
  max-width: var(--shell-page-max-width);
  margin: 0 auto;
  padding: 20px 24px;
}

@media (max-width: 768px) {
  .default-layout__body {
    flex-direction: column;
  }

  .default-layout__content {
    border-radius: var(--shell-radius-sm);
  }

  .default-layout__page-container {
    padding: 16px;
  }
}

.default-layout__backdrop {
  position: fixed;
  inset: 0;
  z-index: 15;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
