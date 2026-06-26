import { Fragment } from 'react'
import { Listbox } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { languageLabels, publicLanguages, resolvePublicLanguage } from '../localization/languages'

const languages = publicLanguages.map((code) => ({ code, label: languageLabels[code] }))

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = resolvePublicLanguage(i18n.resolvedLanguage)
  const changeLanguage = (language: string) => { localStorage.setItem('ask-public-language', language); void i18n.changeLanguage(language) }
  return <Listbox value={current} onChange={changeLanguage}><Listbox.Label className="sr-only">{t('accessibility.language')}</Listbox.Label><div className="relative"><Listbox.Button className="flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-ask-ink shadow-sm transition hover:border-ask-400 dark:border-white/15 dark:bg-white/5 dark:text-white" aria-label={t('accessibility.language')}>{languages.find((language) => language.code === current)?.label}</Listbox.Button><Listbox.Options className="absolute right-0 z-50 mt-2 min-w-32 overflow-auto rounded-2xl border border-black/10 bg-white p-1 shadow-xl focus:outline-none dark:border-white/10 dark:bg-ask-ink">{languages.map((language) => <Listbox.Option key={language.code} value={language.code} as={Fragment}>{({ active, selected }) => <li lang={language.code} className={`cursor-pointer select-none rounded-xl px-3 py-2 text-sm ${active ? 'bg-ask-50 text-ask-600 dark:bg-white/10 dark:text-ask-400' : ''} ${selected ? 'font-bold' : ''}`}>{language.label}</li>}</Listbox.Option>)}</Listbox.Options></div></Listbox>
}
