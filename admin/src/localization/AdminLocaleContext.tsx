import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { AdminLanguage, AdminTranslations, adminTranslations } from './adminTranslations'

interface AdminLocaleContextValue {
  language: AdminLanguage
  setLanguage: (language: AdminLanguage) => void
  t: AdminTranslations
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)
const storageKey = 'ask-admin-language'

function resolveInitialLanguage(): AdminLanguage {
  if (typeof localStorage === 'undefined') return 'sv'
  return localStorage.getItem(storageKey) === 'en' ? 'en' : 'sv'
}

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AdminLanguage>(resolveInitialLanguage)
  useEffect(() => { localStorage.setItem(storageKey, language) }, [language])
  const value = useMemo(() => ({ language, setLanguage, t: adminTranslations[language] }), [language])
  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext)
  if (!context) throw new Error('useAdminLocale must be used within AdminLocaleProvider')
  return context
}
