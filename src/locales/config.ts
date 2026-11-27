// 统一的语言配置
export interface LanguageConfig {
  code: string // 语言代码，如 'zh-CN'
  name: string // 英文名称，如 'Chinese (Simplified)'
  nativeName: string // 本地名称，如 '简体中文'
  flag?: string // 可选：国旗 emoji，如 '🇨🇳'
}

// 支持的语言配置
export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
]

// 从配置生成类型
export type Locale = typeof LANGUAGE_CONFIGS[number]['code']

// 从配置生成支持的语言列表
export const SUPPORTED_LOCALES: Locale[] = LANGUAGE_CONFIGS.map(config => config.code)

// 默认语言
export const DEFAULT_LOCALE: Locale = 'zh-CN'

// 语言显示名称映射
const LANGUAGE_DISPLAY_NAMES: Record<Locale, string> = LANGUAGE_CONFIGS.reduce(
  (acc, config) => {
    acc[config.code as Locale] = config.nativeName
    return acc
  },
  {} as Record<Locale, string>,
)

// 获取语言显示名称
export function getLanguageDisplayName(locale: Locale): string {
  return LANGUAGE_DISPLAY_NAMES[locale] || locale
}
