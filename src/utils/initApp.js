import env from '@/config/env'

export function initAppSettings() {
  useTitle(env.APP_NAME)
  const isDocumentLangSupported = useSupported(() => 'lang' in document.documentElement)
  if (isDocumentLangSupported.value) {
    document.documentElement.lang = 'zh-CN'
  }
}

export function updateLanguageAttribute(locale) {
  const isDocumentLangSupported = useSupported(() => 'lang' in document.documentElement)
  if (isDocumentLangSupported.value) {
    document.documentElement.lang = locale
  }
}

export function updatePageTitle(title) {
  const baseTitle = env.APP_NAME
  const documentTitle = useTitle()
  documentTitle.value = title ? `${title} - ${baseTitle}` : baseTitle
}
