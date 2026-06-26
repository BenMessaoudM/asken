import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import sv from './locales/sv/translation.json'
import en from './locales/en/translation.json'
import { defaultLanguage, fallbackLanguage, resolvePublicLanguage } from './localization/languages'

i18n.use(initReactI18next).init({
  resources: {
    sv: { translation: sv },
    en: { translation: en }
  },
  lng: typeof window !== 'undefined' ? resolvePublicLanguage(localStorage.getItem('ask-public-language') || navigator.language) : defaultLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false
  }
})

export default i18n
