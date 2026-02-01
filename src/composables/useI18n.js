import { getLanguageDisplayName } from '@locales/config'
import { getCurrentLocale, setLocale, SUPPORTED_LOCALES } from '@locales/i18n'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage'
import { updatePageTitle } from '@/utils/initApp'

export function useI18nHelper() {
  const { t, locale } = useI18n()
  const storedLocale = useLocalStorage(STORAGE_KEYS.LOCALE, getCurrentLocale())
  const currentLocale = ref(storedLocale.value || getCurrentLocale())
  syncRef(currentLocale, storedLocale)

  const isChinese = computed(() => currentLocale.value === 'zh-CN')
  const isEnglish = computed(() => currentLocale.value === 'en-US')

  const { next: nextLanguage } = useCycleList(SUPPORTED_LOCALES, {
    initialValue: currentLocale.value,
  })

  const switchLocale = (newLocale) => {
    setLocale(newLocale)
    currentLocale.value = newLocale
  }

  const toggleLanguage = () => {
    const newLocale = isChinese.value ? 'en-US' : 'zh-CN'
    switchLocale(newLocale)
  }

  const cycleLanguage = () => {
    const nextLocale = nextLanguage()
    switchLocale(nextLocale)
  }

  const translate = (key, params) => {
    return t(key, params || {})
  }

  const getLocaleDisplayName = (locale) => {
    return getLanguageDisplayName(locale)
  }

  const setPageTitle = (title) => {
    updatePageTitle(title)
  }

  return {
    t: translate,
    locale,
    currentLocale,
    isChinese,
    isEnglish,
    switchLocale,
    toggleLanguage,
    cycleLanguage,
    getLocaleDisplayName,
    setPageTitle,
    supportedLocales: SUPPORTED_LOCALES,
  }
}
