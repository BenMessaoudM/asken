import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import NewsCard from '../components/NewsCard'
import { usePageMetadata } from '../hooks/usePageMetadata'
import PublicLayout from '../components/PublicLayout'
import { listNews, listNewsCategories } from '../news/api'
import { NewsCategory, NewsLocale, PublicNewsArticle } from '../news/types'

export default function NewsList() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'sv') as NewsLocale
  const [articles, setArticles] = useState<PublicNewsArticle[]>([])
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [category, setCategory] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    void Promise.all([listNews({ locale, search, category }), listNewsCategories()])
      .then(([newsResult, categoryResult]) => {
        setArticles(newsResult.data.articles)
        setCategories(categoryResult.data.categories)
      })
      .catch(() => setError(t('news.load_error')))
      .finally(() => setLoading(false))
  }, [locale, search, category, t])

  usePageMetadata(t('news.title'), t('news.intro'), '/news')
  const featured = useMemo(() => articles.find((article) => article.featured), [articles])
  const remaining = featured ? articles.filter((article) => article.id !== featured.id) : articles
  const submit = (event: FormEvent) => { event.preventDefault(); setSearch(searchInput.trim()) }

  return (
    <PublicLayout>
      <section className="ask-container py-12 sm:py-16">
        <p className="ask-eyebrow">{t('home.news.eyebrow')}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{t('news.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/60">{t('news.intro')}</p>
        <form onSubmit={submit} className="ask-card mt-8 grid gap-3 p-4 sm:grid-cols-[1fr_240px_auto]">
          <label className="sr-only" htmlFor="news-search">{t('news.search')}</label>
          <input id="news-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('news.search_placeholder')} className="min-h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/15" />
          <label className="sr-only" htmlFor="news-category">{t('news.all_categories')}</label>
          <select id="news-category" value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/15">
            <option value="">{t('news.all_categories')}</option>
            {categories.map((item) => <option key={item.id} value={item.slug}>{item.labels[locale]}</option>)}
          </select>
          <button className="ask-button-primary"><Icon name="news" className="h-4 w-4" />{t('news.search')}</button>
        </form>

        {loading && <p className="mt-10" aria-live="polite">{t('news.loading')}</p>}
        {error && <p role="alert" className="mt-10 rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
        {!loading && !error && <>
          {featured && <article className="mt-10 overflow-hidden rounded-[2rem] bg-ask-mesh text-white shadow-2xl lg:grid lg:grid-cols-2">
            {featured.imageUrl ? <img src={featured.imageUrl} alt={featured.imageAlt || ''} className="h-full min-h-72 w-full object-cover" /> : <div className="grid min-h-72 place-items-center bg-white/5"><Icon name="news" className="h-16 w-16 text-ask-400" /></div>}
            <div className="flex flex-col justify-center p-8 sm:p-10"><p className="font-bold text-ask-gold">{t('news.featured')}</p><h2 className="mt-3 text-3xl font-black sm:text-4xl"><Link to={`/news/${featured.slug}`}>{featured.title}</Link></h2><p className="mt-4 text-lg leading-8 text-white/70">{featured.summary}</p><Link to={`/news/${featured.slug}`} className="mt-7 inline-flex items-center gap-2 font-bold text-ask-gold">{t('news.read_more')}<Icon name="arrow" /></Link></div>
          </article>}
          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((article) => <NewsCard key={article.id} article={article} locale={locale} readMore={t('news.read_more')} />)}
          </section>
          {articles.length === 0 && <p className="ask-card mt-10 p-8 text-center text-black/55 dark:text-white/55">{t('news.empty')}</p>}
        </>}
      </section>
    </PublicLayout>
  )
}
