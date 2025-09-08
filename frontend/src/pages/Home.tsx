import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="p-4">
      <header className="flex justify-end">
        <LanguageSwitcher />
      </header>
      <h1 className="mt-4 text-2xl font-bold">{t('welcome')}</h1>
      <p className="mt-2">
        <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          {t('click_me')}
        </button>
      </p>
    </main>
  )
}
