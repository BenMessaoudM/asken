import { Fragment } from 'react'
import { Listbox } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'sv', label: 'Svenska' },
  { code: 'en', label: 'English' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <Listbox value={i18n.language} onChange={(lang) => i18n.changeLanguage(lang)}>
      <Listbox.Label className="sr-only">Language</Listbox.Label>
      <div className="relative">
        <Listbox.Button className="border rounded px-2 py-1" aria-label="Select language">
          {languages.find(l => l.code === i18n.language)?.label}
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg focus:outline-none">
          {languages.map(lang => (
            <Listbox.Option key={lang.code} value={lang.code} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={`cursor-pointer select-none p-2 ${active ? 'bg-blue-100' : ''} ${selected ? 'font-bold' : ''}`}
                >
                  {lang.label}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
