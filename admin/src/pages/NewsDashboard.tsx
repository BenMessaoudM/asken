import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ApiError, apiRequest } from '../api/client'
import { useAdminLocale } from '../localization/AdminLocaleContext'
import { NewsArticle, NewsTaxonomyItem } from '../news/types'
import { formatDateTime } from '../utils/dateTime'

export default function NewsDashboard() {
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('news.write')
  const { language, t } = useAdminLocale()
  const label = (item: NewsTaxonomyItem) => item.labels[language] || item.labels.sv || item.labels.en
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<NewsTaxonomyItem[]>([])
  const [tags, setTags] = useState<NewsTaxonomyItem[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [categoryLabels, setCategoryLabels] = useState({ en: '', sv: '' })
  const [tagLabels, setTagLabels] = useState({ en: '', sv: '' })

  const load = async () => {
    const [articleResult, categoryResult, tagResult] = await Promise.all([
      apiRequest<{ data: { articles: NewsArticle[] } }>('/admin/news'),
      apiRequest<{ data: { categories: NewsTaxonomyItem[] } }>('/admin/news/categories'),
      apiRequest<{ data: { tags: NewsTaxonomyItem[] } }>('/admin/news/tags')
    ])
    setArticles(articleResult.data.articles)
    setCategories(categoryResult.data.categories)
    setTags(tagResult.data.tags)
  }
  useEffect(() => { void load().catch(handleError) }, [])
  const handleError = (requestError: unknown) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to complete the request')
  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return articles
    return articles.filter((article) => [article.translations.en.title, article.translations.sv.title, article.slug].some((value) => value.toLowerCase().includes(query)))
  }, [articles, search])

  const removeArticle = async (article: NewsArticle) => {
    if (!window.confirm(`Delete “${article.translations.en.title}”?`)) return
    try { await apiRequest(`/admin/news/${article.id}`, { method: 'DELETE' }); await load() } catch (requestError) { handleError(requestError) }
  }
  const publish = async (article: NewsArticle) => {
    try { await apiRequest(`/admin/news/${article.id}/publish`, { method: 'POST', body: JSON.stringify({ expectedVersion: article.version }) }); await load() } catch (requestError) { handleError(requestError) }
  }
  const toggleFeatured = async (article: NewsArticle) => {
    try { await apiRequest(`/admin/news/${article.id}/featured`, { method: 'PATCH', body: JSON.stringify({ featured: !article.featured }) }); await load() } catch (requestError) { handleError(requestError) }
  }
  const createTaxonomy = async (event: FormEvent, kind: 'categories' | 'tags') => {
    event.preventDefault()
    const labels = kind === 'categories' ? categoryLabels : tagLabels
    try {
      await apiRequest(`/admin/news/${kind}`, { method: 'POST', body: JSON.stringify({ labels }) })
      kind === 'categories' ? setCategoryLabels({ en: '', sv: '' }) : setTagLabels({ en: '', sv: '' })
      await load()
    } catch (requestError) { handleError(requestError) }
  }
  const editTaxonomy = async (kind: 'categories' | 'tags', item: NewsTaxonomyItem) => {
    const sv = window.prompt(t.contentFields.svLabel, item.labels.sv)
    if (sv === null) return
    const en = window.prompt(t.contentFields.enLabel, item.labels.en)
    if (en === null) return
    try { await apiRequest(`/admin/news/${kind}/${item.id}`, { method: 'PUT', body: JSON.stringify({ slug: item.slug, labels: { en, sv } }) }); await load() } catch (requestError) { handleError(requestError) }
  }
  const removeTaxonomy = async (kind: 'categories' | 'tags', item: NewsTaxonomyItem) => {
    if (!window.confirm(`Delete “${item.labels.en}”?`)) return
    try { await apiRequest(`/admin/news/${kind}/${item.id}`, { method: 'DELETE' }); await load() } catch (requestError) { handleError(requestError) }
  }

  const taxonomyPanel = (title: string, kind: 'categories' | 'tags', items: NewsTaxonomyItem[], labels: { en: string; sv: string }, setLabels: (labels: { en: string; sv: string }) => void) => (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-lg font-bold">{title}</h2>
      {canWrite && <form onSubmit={(event) => void createTaxonomy(event, kind)} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input required value={labels.sv} onChange={(event) => setLabels({ ...labels, sv: event.target.value })} placeholder={t.contentFields.svLabel} className="rounded-xl border p-2.5" /><input required value={labels.en} onChange={(event) => setLabels({ ...labels, en: event.target.value })} placeholder={t.contentFields.enLabel} className="rounded-xl border p-2.5" /><button className="rounded-xl bg-ask-ink px-4 py-2 font-semibold text-white dark:bg-ask-600">{t.common.create}</button></form>}
      <ul className="mt-4 divide-y divide-black/5 dark:divide-white/10">{items.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{label(item)}</p><p className="text-xs text-gray-500">{item.slug}</p></div>{canWrite && <div className="flex gap-3"><button onClick={() => void editTaxonomy(kind, item)} className="text-sm font-semibold text-ask-600 dark:text-ask-400">{t.common.edit}</button><button onClick={() => void removeTaxonomy(kind, item)} className="text-sm text-red-700 dark:text-red-300">{t.common.delete}</button></div>}</li>)}</ul>
    </section>
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-ask-600 dark:text-ask-400">News & Blog</p><h1 className="mt-1 text-3xl font-bold">News dashboard</h1><p className="mt-2 text-gray-500 dark:text-white/50">Create bilingual articles, schedule publishing, and manage discovery metadata.</p></div>{canWrite && <Link to="/news/new" className="rounded-xl bg-ask-600 px-4 py-2.5 font-semibold text-white">Create article</Link>}</div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles" className="w-full max-w-md rounded-xl border p-3" />
      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"><table className="min-w-full"><thead><tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500 dark:border-white/10"><th className="p-4">Article</th><th className="p-4">Status</th><th className="p-4">Taxonomy</th><th className="p-4">Featured</th><th className="p-4">Actions</th></tr></thead><tbody>{visibleArticles.map((article) => <tr key={article.id} className="border-b last:border-0 dark:border-white/10"><td className="p-4"><p className="font-semibold">{article.translations[language].title || article.translations.sv.title || article.translations.en.title}</p><p className="text-sm text-gray-500">/{article.slug} · v{article.version}</p></td><td className="p-4"><span className="rounded-full bg-ask-50 px-2.5 py-1 text-xs font-bold text-ask-600 dark:bg-ask-600/20 dark:text-ask-400">{article.status}</span>{article.scheduledAt && <p className="mt-1 text-xs">{formatDateTime(article.scheduledAt)}</p>}</td><td className="p-4 text-sm">{article.categories.map(label).join(', ') || '—'}<p className="text-xs text-gray-500">{article.tags.map((item) => `#${label(item)}`).join(' ')}</p></td><td className="p-4"><button disabled={!canWrite} onClick={() => void toggleFeatured(article)} className={`rounded-full px-3 py-1 text-xs font-bold ${article.featured ? 'bg-ask-gold/25 text-ask-ink' : 'bg-gray-100 text-gray-500'}`}>{article.featured ? (language === 'sv' ? 'Utvald' : 'Featured') : 'Standard'}</button></td><td className="p-4"><div className="flex flex-wrap gap-2"><Link to={`/news/${article.id}`} className="rounded-lg border px-3 py-1.5 text-sm">{canWrite ? t.common.edit : t.common.open}</Link>{canWrite && article.status === 'draft' && <button onClick={() => void publish(article)} className="rounded-lg bg-ask-600 px-3 py-1.5 text-sm text-white">{t.common.publish}</button>}{canWrite && <button onClick={() => void removeArticle(article)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700">{t.common.delete}</button>}</div></td></tr>)}</tbody></table>{visibleArticles.length === 0 && <p className="p-8 text-center text-gray-500">{t.common.noResults}</p>}</div>
      <div className="grid gap-6 xl:grid-cols-2">{taxonomyPanel(language === 'sv' ? 'Kategorier' : 'Categories', 'categories', categories, categoryLabels, setCategoryLabels)}{taxonomyPanel(language === 'sv' ? 'Taggar' : 'Tags', 'tags', tags, tagLabels, setTagLabels)}</div>
    </section>
  )
}
