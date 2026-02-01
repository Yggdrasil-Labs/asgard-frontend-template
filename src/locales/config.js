/**
 * 支持的语言配置
 */
export const LANGUAGE_CONFIGS = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
]

export const SUPPORTED_LOCALES = LANGUAGE_CONFIGS.map(config => config.code)
export const DEFAULT_LOCALE = 'zh-CN'

const LANGUAGE_DISPLAY_NAMES = LANGUAGE_CONFIGS.reduce((acc, config) => {
  acc[config.code] = config.nativeName
  return acc
}, {})

const LANGUAGE_NAMES = LANGUAGE_CONFIGS.reduce((acc, config) => {
  acc[config.code] = config.name
  return acc
}, {})

export function getLanguageConfig(locale) {
  return LANGUAGE_CONFIGS.find(config => config.code === locale)
}

export function getLanguageDisplayName(locale) {
  return LANGUAGE_DISPLAY_NAMES[locale] || locale
}

export function getLanguageName(locale) {
  return LANGUAGE_NAMES[locale] || locale
}
