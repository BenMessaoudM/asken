import { useTranslation } from 'react-i18next'
import { SiteLocale, siteContent } from '../content/siteContent'
import { resolvePublicLanguage } from '../localization/languages'

export function useSiteLocale() {
  const { i18n } = useTranslation()
  const locale: SiteLocale = resolvePublicLanguage(i18n.resolvedLanguage)
  return { locale, content: siteContent[locale] }
}
