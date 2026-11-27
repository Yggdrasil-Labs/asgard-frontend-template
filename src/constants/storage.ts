/**
 * 本地存储键名常量
 * 统一管理应用中使用的 localStorage/sessionStorage 键名
 */

export const STORAGE_KEYS = {
  /** 应用语言设置 */
  LOCALE: 'locale',
  /** 应用偏好设置 */
  APP_PREFERENCES: 'app-preferences',
  /** 主题设置 */
  THEME: 'theme',
} as const
