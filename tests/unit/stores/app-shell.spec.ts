import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppShellStore } from '@/stores/app-shell'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useAppShellStore', () => {
  it('has correct initial state', () => {
    const store = useAppShellStore()

    expect(store.device).toBe('desktop')
    expect(store.siderCollapsed).toBe(false)
    expect(store.drawerVisible).toBe(false)
  })

  it('setDevice sets the device type', () => {
    const store = useAppShellStore()

    store.setDevice('mobile')
    expect(store.device).toBe('mobile')

    store.setDevice('tablet')
    expect(store.device).toBe('tablet')

    store.setDevice('desktop')
    expect(store.device).toBe('desktop')
  })

  describe('setViewportWidth', () => {
    it('sets mobile state when width < 768', () => {
      const store = useAppShellStore()
      store.setSiderCollapsed(true)
      store.openDrawer()

      store.setViewportWidth(767)

      expect(store.device).toBe('mobile')
      expect(store.siderCollapsed).toBe(false)
      expect(store.drawerVisible).toBe(false)
    })

    it('sets tablet state when width is 768~1199', () => {
      const store = useAppShellStore()
      store.openDrawer()

      store.setViewportWidth(768)

      expect(store.device).toBe('tablet')
      expect(store.siderCollapsed).toBe(true)
      expect(store.drawerVisible).toBe(false)

      store.setViewportWidth(1199)

      expect(store.device).toBe('tablet')
      expect(store.siderCollapsed).toBe(true)
      expect(store.drawerVisible).toBe(false)
    })

    it('sets desktop state when width >= 1200', () => {
      const store = useAppShellStore()
      store.setSiderCollapsed(true)
      store.openDrawer()

      store.setViewportWidth(1200)

      expect(store.device).toBe('desktop')
      expect(store.siderCollapsed).toBe(false)
      expect(store.drawerVisible).toBe(false)
    })
  })

  it('setSiderCollapsed sets the value directly', () => {
    const store = useAppShellStore()

    store.setSiderCollapsed(true)
    expect(store.siderCollapsed).toBe(true)

    store.setSiderCollapsed(false)
    expect(store.siderCollapsed).toBe(false)
  })

  it('toggleSiderCollapsed flips the value', () => {
    const store = useAppShellStore()

    expect(store.siderCollapsed).toBe(false)
    store.toggleSiderCollapsed()
    expect(store.siderCollapsed).toBe(true)
    store.toggleSiderCollapsed()
    expect(store.siderCollapsed).toBe(false)
  })

  describe('drawer actions', () => {
    it('setDrawerVisible sets the value directly', () => {
      const store = useAppShellStore()

      store.setDrawerVisible(true)
      expect(store.drawerVisible).toBe(true)

      store.setDrawerVisible(false)
      expect(store.drawerVisible).toBe(false)
    })

    it('openDrawer sets drawerVisible to true', () => {
      const store = useAppShellStore()

      store.openDrawer()
      expect(store.drawerVisible).toBe(true)
    })

    it('closeDrawer sets drawerVisible to false', () => {
      const store = useAppShellStore()
      store.openDrawer()

      store.closeDrawer()
      expect(store.drawerVisible).toBe(false)
    })

    it('toggleDrawer flips the value', () => {
      const store = useAppShellStore()

      expect(store.drawerVisible).toBe(false)
      store.toggleDrawer()
      expect(store.drawerVisible).toBe(true)
      store.toggleDrawer()
      expect(store.drawerVisible).toBe(false)
    })
  })

  it('$reset restores initial state', () => {
    const store = useAppShellStore()

    store.setDevice('mobile')
    store.setSiderCollapsed(true)
    store.openDrawer()

    store.$reset()

    expect(store.device).toBe('desktop')
    expect(store.siderCollapsed).toBe(false)
    expect(store.drawerVisible).toBe(false)
  })
})
