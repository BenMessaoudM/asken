import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ApiError, apiRequest } from '../api/client'
import { NewsArticle, NewsTaxonomyItem } from '../news/types'

export default function NewsDashboard() {
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('news.write')
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
    const en = window.prompt('English label', item.labels.en)
    if (en === null) return
    const sv = window.prompt('Swedish label', item.labels.sv)
    if (sv === null) return
    try { await apiRequest(`/admin/news/${kind}/${item.id}`, { method: 'PUT', body: JSON.stringify({ slug: item.slug, labels: { en, sv } }) }); await load() } catch (requestError) { handleError(requestError) }
  }
  const removeTaxonomy = async (kind: 'categories' | 'tags', item: NewsTaxonomyItem) => {
    if (!window.confirm(`Delete “${item.labels.en}”?`)) return
    try { await apiRequest(`/admin/news/${kind}/${item.id}`, { method: 'DELETE' }); await load() } catch (requestError) { handleError(requestError) }
  }

  const taxonomyPanel = (title: string, kind: 'categories' | 'tags', items: NewsTaxonomyItem[], labels: { en: string; sv: string }, setLabels: (labels: { en: string; sv: string }) => void) => (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-lg font-bold">{title}</h2>
      {canWrite && <form onSubmit={(event) => void createTaxonomy(event, kind)} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input required value={labels.en} onChange={(event) => setLabels({ ...labels, en: event.target.value })} placeholder="English label" className="rounded-xl border p-2.5" /><input required value={labels.sv} onChange={(event) => setLabels({ ...labels, sv: event.target.value })} placeholder="Swedish label" className="rounded-xl border p-2.5" /><button className="rounded-xl bg-ask-ink px-4 py-2 font-semibold text-white dark:bg-ask-600">Add</button></form>}
      <ul className="mt-4 divide-y divide-black/5 dark:divide-white/10">{items.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.labels.en} / {item.labels.sv}</p><p className="text-xs text-gray-500">{item.slug}</p></div>{canWrite && <div className="flex gap-3"><button onClick={() => void editTaxonomy(kind, item)} className="text-sm font-semibold text-ask-600 dark:text-ask-400">Edit</button><button onClick={() => void removeTaxonomy(kind, item)} className="text-sm text-red-700 dark:text-red-300">Delete</button></div>}</li>)}</ul>
    </section>
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-ask-600 dark:text-ask-400">News & Blog</p><h1 className="mt-1 text-3xl font-bold">News dashboard</h1><p className="mt-2 text-gray-500 dark:text-white/50">Create bilingual articles, schedule publishing, and manage discovery metadata.</p></div>{canWrite && <Link to="/news/new" className="rounded-xl bg-ask-600 px-4 py-2.5 font-semibold text-white">Create article</Link>}</div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles" className="w-full max-w-md rounded-xl border p-3" />
      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"><table className="min-w-full"><thead><tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500 dark:border-white/10"><th className="p-4">Article</th><th className="p-4">Status</th><th className="p-4">Taxonomy</th><th className="p-4">Featured</th><th className="p-4">Actions</th></tr></thead><tbody>{visibleArticles.map((article) => <tr key={article.id} className="border-b last:border-0 dark:border-white/10"><td className="p-4"><p className="font-semibold">{article.translations.en.title}</p><p className="text-sm text-gray-500">{article.translations.sv.title} · /{article.slug} · v{article.version}</p></td><td className="p-4"><span className="rounded-full bg-ask-50 px-2.5 py-1 text-xs font-bold text-ask-600 dark:bg-ask-600/20 dark:text-ask-400">{article.status}</span>{article.scheduledAt && <p className="mt-1 text-xs">{new Date(article.scheduledAt).toLocaleString()}</p>}</td><td className="p-4 text-sm">{article.categories.map((item) => item.labels.en).join(', ') || '—'}<p className="text-xs text-gray-500">{article.tags.map((item) => `#${item.labels.en}`).join(' ')}</p></td><td className="p-4"><button disabled={!canWrite} onClick={() => void toggleFeatured(article)} className={`rounded-full px-3 py-1 text-xs font-bold ${article.featured ? 'bg-ask-gold/25 text-ask-ink' : 'bg-gray-100 text-gray-500'}`}>{article.featured ? 'Featured' : 'Standard'}</button></td><td className="p-4"><div className="flex flex-wrap gap-2"><Link to={`/news/${article.id}`} className="rounded-lg border px-3 py-1.5 text-sm">{canWrite ? 'Edit' : 'View'}</Link>{canWrite && article.status === 'draft' && <button onClick={() => void publish(article)} className="rounded-lg bg-ask-600 px-3 py-1.5 text-sm text-white">Publish</button>}{canWrite && <button onClick={() => void removeArticle(article)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700">Delete</button>}</div></td></tr>)}</tbody></table>{visibleArticles.length === 0 && <p className="p-8 text-center text-gray-500">No articles found.</p>}</div>
      <div className="grid gap-6 xl:grid-cols-2">{taxonomyPanel('Categories', 'categories', categories, categoryLabels, setCategoryLabels)}{taxonomyPanel('Tags', 'tags', tags, tagLabels, setTagLabels)}</div>
    </section>
  )
}
