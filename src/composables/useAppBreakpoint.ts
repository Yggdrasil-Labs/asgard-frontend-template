import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

export const APP_MOBILE_BREAKPOINT = 768
export const APP_TABLET_BREAKPOINT = 1200

export type DeviceFormFactor = 'mobile' | 'tablet' | 'desktop'

/**
 * 宽度 → 设备形态。
 * 口径统一：<=768 移动端、<1200 平板、其余桌面，与 5 处 CSS 媒体查询
 * （max-width: 768px）以及 useAppBreakpoint 的 isMobile 判定保持一致。
 */
export function getDeviceForWidth(width: number): DeviceFormFactor {
  if (width <= APP_MOBILE_BREAKPOINT)
    return 'mobile'
  if (width < APP_TABLET_BREAKPOINT)
    return 'tablet'
  return 'desktop'
}

export function useAppBreakpoint() {
  const { width } = useWindowSize()

  const isMobile = computed(() => width.value <= APP_MOBILE_BREAKPOINT)

  return {
    width,
    isMobile,
  }
}
