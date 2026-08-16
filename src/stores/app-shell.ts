import type { DeviceFormFactor } from '@/composables/useAppBreakpoint'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getDeviceForWidth } from '@/composables/useAppBreakpoint'

export type AppDeviceType = DeviceFormFactor

export const useAppShellStore = defineStore('app-shell', () => {
  const device = shallowRef<AppDeviceType>('desktop')
  const siderCollapsed = shallowRef(false)
  const drawerVisible = shallowRef(false)

  function setViewportWidth(width: number) {
    const nextDevice = getDeviceForWidth(width)

    // 同带内 resize（如拖拽窗口）不触碰折叠/抽屉状态，避免抹掉用户手动操作
    if (nextDevice === device.value)
      return

    device.value = nextDevice
    // 跨断点时按形态重置：移动端抽屉导航、平板图标栏、桌面展开侧栏
    siderCollapsed.value = nextDevice === 'tablet'
    drawerVisible.value = false
  }

  function setSiderCollapsed(collapsed: boolean) {
    siderCollapsed.value = collapsed
  }

  function toggleSiderCollapsed() {
    siderCollapsed.value = !siderCollapsed.value
  }

  function setDrawerVisible(visible: boolean) {
    drawerVisible.value = visible
  }

  function openDrawer() {
    drawerVisible.value = true
  }

  function closeDrawer() {
    drawerVisible.value = false
  }

  function toggleDrawer() {
    drawerVisible.value = !drawerVisible.value
  }

  function $reset() {
    device.value = 'desktop'
    siderCollapsed.value = false
    drawerVisible.value = false
  }

  return {
    device,
    siderCollapsed,
    drawerVisible,
    setViewportWidth,
    setSiderCollapsed,
    toggleSiderCollapsed,
    setDrawerVisible,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    $reset,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppShellStore, import.meta.hot))
