import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useI18n } from 'vue-i18n'

/**
 * Element Plus 国际化 locale 映射
 *
 * 将项目 vue-i18n 的 locale code 映射为 Element Plus 对应的 locale 对象。
 * 新增语言时，只需在此处补充映射即可。
 */
const EP_LOCALE_MAP = {
  'zh-CN': zhCn,
  'en-US': en,
}

export function useElementPlusLocale() {
  const { locale } = useI18n()

  const elementLocale = computed(() => {
    return EP_LOCALE_MAP[locale.value] || zhCn
  })

  return { elementLocale }
}
