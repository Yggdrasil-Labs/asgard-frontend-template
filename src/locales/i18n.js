import { createI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage'
import { updateLanguageAttribute } from '@/utils/initApp'
import { DEFAULT_LOCALE, LANGUAGE_CONFIGS, SUPPORTED_LOCALES } from './config'

export { DEFAULT_LOCALE, SUPPORTED_LOCALES }

const messageCache = new Map()

async function loadLocaleMessages(locale) {
  if (messageCache.has(locale)) {
    return messageCache.get(locale)
  }
  try {
    const messages = await import(`./${locale}/common.json`)
    const messageData = messages.default
    messageCache.set(locale, messageData)
    return messageData
  }
  catch (error) {
    console.error(`Failed to load locale messages for ${locale}:`, error)
    if (locale !== DEFAULT_LOCALE) {
      return loadLocaleMessages(DEFAULT_LOCALE)
    }
    return {}
  }
}

function getBrowserLocale() {
  const browserLocale = navigator.language || navigator.languages?.[0]
  if (!browserLocale)
    return DEFAULT_LOCALE
  for (const config of LANGUAGE_CONFIGS) {
    const [langCode] = config.code.split('-')
    if (langCode && browserLocale.startsWith(langCode)) {
      return config.code
    }
  }
  return DEFAULT_LOCALE
}

function getStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE)
    return stored && SUPPORTED_LOCALES.includes(stored) ? stored : null
  }
  catch {
    return null
  }
}

function getInitialLocale() {
  return getStoredLocale() || getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  messages: {},
  globalInjection: true,
  warnHtmlMessage: import.meta.env.DEV,
})

export async function setLocale(locale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    try {
      const messages = await loadLocaleMessages(locale)
      i18n.global.setLocaleMessage(locale, messages)
      i18n.global.locale.value = locale
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
      updateLanguageAttribute(locale)
    }
    catch (error) {
      console.error('Failed to load locale messages:', error)
    }
  }
}

export function getCurrentLocale() {
  return i18n.global.locale.value
}

async function preloadLocales() {
  const otherLocales = SUPPORTED_LOCALES.filter(locale => locale !== getInitialLocale())
  Promise.all(otherLocales.map(locale => loadLocaleMessages(locale))).catch((err) => {
    console.warn('Failed to preload some locales:', err)
  })
}

async function initializeLocale() {
  const initialLocale = getInitialLocale()
  await setLocale(initialLocale)
  preloadLocales()
}

initializeLocale()

export default i18n
