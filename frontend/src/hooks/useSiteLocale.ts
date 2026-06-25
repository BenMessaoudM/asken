import { useTranslation } from 'react-i18next'
import { SiteLocale, siteContent } from '../content/siteContent'

export function useSiteLocale() {
  const { i18n } = useTranslation()
  const locale: SiteLocale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'sv'
  return { locale, content: siteContent[locale] }
}
