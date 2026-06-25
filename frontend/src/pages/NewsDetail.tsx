import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import PublicLayout from '../components/PublicLayout'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { getNewsArticle } from '../news/api'
import { NewsLocale, PublicNewsArticle } from '../news/types'

export default function NewsDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'sv') as NewsLocale
  const [article, setArticle] = useState<PublicNewsArticle | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setArticle(null)
    setError('')
    void getNewsArticle(slug, locale).then((result) => setArticle(result.data.article)).catch(() => setError(t('news.not_found')))
  }, [slug, locale, t])
  usePageMetadata(article?.title || t('news.title'), article?.summary || t('news.intro'), `/news/${slug || ''}`)

  return (
    <PublicLayout>
      <article className="ask-container max-w-4xl py-12 sm:py-16">
        <Link to="/news" className="inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400"><Icon name="arrow" className="h-4 w-4 rotate-180" />{t('news.back')}</Link>
        {error && <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
        {!article && !error && <p className="mt-8" aria-live="polite">{t('news.loading')}</p>}
        {article && <div className="mt-10">
          <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-wider text-ask-600 dark:text-ask-400">{article.categories.map((item) => <span key={item.slug}>{item.label}</span>)}</div>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-8 text-black/60 dark:text-white/60">{article.summary}</p>
          <time className="mt-5 block text-sm font-semibold text-black/45 dark:text-white/45">{new Date(article.publishedAt).toLocaleDateString(locale)}</time>
          {article.imageUrl && <img src={article.imageUrl} alt={article.imageAlt || ''} className="mt-10 max-h-[36rem] w-full rounded-[2rem] object-cover shadow-soft" />}
          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8">{article.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          {article.tags.length > 0 && <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">{article.tags.map((tag) => <span key={tag.slug} className="rounded-full bg-ask-50 px-3 py-1.5 text-sm font-semibold text-ask-600 dark:bg-ask-600/15 dark:text-ask-400">#{tag.label}</span>)}</div>}
        </div>}
      </article>
    </PublicLayout>
  )
}
