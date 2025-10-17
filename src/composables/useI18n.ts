import type { Locale } from '@locales/types'
import { getLanguageDisplayName } from '@locales/config'
import { getCurrentLocale, setLocale, SUPPORTED_LOCALES } from '@locales/i18n'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { updatePageTitle } from '@/utils/initApp'

/**
 * i18n 组合函数
 * 提供便捷的国际化功能
 */
export function useI18nHelper() {
  const { t, locale } = useI18n()

  // 当前语言
  const currentLocale = computed(() => getCurrentLocale())

  // 语言检测
  const isChinese = computed(() => currentLocale.value === 'zh-CN')
  const isEnglish = computed(() => currentLocale.value === 'en-US')

  // 切换语言
  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  // 切换中英文
  const toggleLanguage = () => {
    const newLocale = isChinese.value ? 'en-US' : 'zh-CN'
    switchLocale(newLocale)
  }

  // 循环切换语言
  const cycleLanguage = () => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(currentLocale.value)
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
    const nextLocale = SUPPORTED_LOCALES[nextIndex]
    if (nextLocale) {
      switchLocale(nextLocale)
    }
  }

  // 便捷的翻译函数
  const translate = (key: string, params?: Record<string, unknown>) => {
    return t(key, params || {})
  }

  // 获取语言显示名称（使用统一配置）
  const getLocaleDisplayName = (locale: Locale) => {
    return getLanguageDisplayName(locale)
  }

  // 更新页面标题
  const setPageTitle = (title?: string) => {
    updatePageTitle(title)
  }

  return {
    // 基础功能
    t: translate,
    locale,
    currentLocale,

    // 语言检测
    isChinese,
    isEnglish,

    // 语言切换
    switchLocale,
    toggleLanguage,
    cycleLanguage,

    // 工具函数
    getLocaleDisplayName,
    setPageTitle,

    // 常量
    supportedLocales: SUPPORTED_LOCALES,
  }
}
