import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ApiError, apiRequest } from '../api/client'
import { createEmptyTranslations, toDatetimeLocal } from '../news/forms'
import { languageLabels, publicLanguages, translationCompleteness, translationStatusLabels } from '../localization/languages'
import { NewsArticle, NewsLocale, NewsTaxonomyItem, NewsTranslation } from '../news/types'

export default function NewsEditor() {
  const { articleId } = useParams()
  const isNew = !articleId
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('news.write')
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [translations, setTranslations] = useState(createEmptyTranslations)
  const [slug, setSlug] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [tagIds, setTagIds] = useState<string[]>([])
  const [featured, setFeatured] = useState(false)
  const [schedule, setSchedule] = useState('')
  const [categories, setCategories] = useState<NewsTaxonomyItem[]>([])
  const [tags, setTags] = useState<NewsTaxonomyItem[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const requests: Promise<unknown>[] = [
      apiRequest<{ data: { categories: NewsTaxonomyItem[] } }>('/admin/news/categories'),
      apiRequest<{ data: { tags: NewsTaxonomyItem[] } }>('/admin/news/tags')
    ]
    if (articleId) requests.push(apiRequest<{ data: { article: NewsArticle } }>(`/admin/news/${articleId}`))
    void Promise.all(requests).then((results) => {
      setCategories((results[0] as { data: { categories: NewsTaxonomyItem[] } }).data.categories)
      setTags((results[1] as { data: { tags: NewsTaxonomyItem[] } }).data.tags)
      if (articleId) {
        const loaded = (results[2] as { data: { article: NewsArticle } }).data.article
        setArticle(loaded); setTranslations(loaded.translations); setSlug(loaded.slug)
        setCategoryIds(loaded.categories.map((item) => item.id)); setTagIds(loaded.tags.map((item) => item.id))
        setFeatured(loaded.featured); setSchedule(toDatetimeLocal(loaded.scheduledAt))
      }
    }).catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to load article'))
  }, [articleId])

  const updateTranslation = (locale: NewsLocale, key: keyof NewsTranslation, value: string) => setTranslations((current) => ({
    ...current, [locale]: { ...current[locale], [key]: value }
  }))
  const payload = () => ({ slug: slug || undefined, translations, categoryIds, tagIds, featured })
  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!isNew && !article) return
    setError(''); setSaving(true)
    try {
      if (isNew) {
        const result = await apiRequest<{ data: { article: NewsArticle } }>('/admin/news', { method: 'POST', body: JSON.stringify(payload()) })
        navigate(`/news/${result.data.article.id}`, { replace: true })
      } else {
        const result = await apiRequest<{ data: { article: NewsArticle } }>(`/admin/news/${articleId}`, { method: 'PUT', body: JSON.stringify({ ...payload(), expectedVersion: article!.version }) })
        setArticle(result.data.article); setSlug(result.data.article.slug)
      }
    } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to save article') }
    finally { setSaving(false) }
  }
  const publish = async () => {
    if (!article) return
    setError(''); setSaving(true)
    try {
      const result = await apiRequest<{ data: { article: NewsArticle } }>(`/admin/news/${article.id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ expectedVersion: article.version, ...(schedule ? { publishAt: new Date(schedule).toISOString() } : {}) })
      })
      setArticle(result.data.article)
    } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to publish article') }
    finally { setSaving(false) }
  }
  const remove = async () => {
    if (!article || !window.confirm(`Delete “${article.translations.en.title}”?`)) return
    try { await apiRequest(`/admin/news/${article.id}`, { method: 'DELETE' }); navigate('/news') }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to delete article') }
  }
  const toggleSelection = (id: string, selected: string[], setSelected: (ids: string[]) => void) => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id])

  if (!isNew && !article && !error) return <main className="p-6">Loading article…</main>

  const localePanel = (locale: NewsLocale, label: string) => {
    const status = translationCompleteness(translations[locale])
    return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">{label}</h2><span className="rounded-full bg-ask-50 px-2 py-1 text-xs font-semibold text-ask-700">{translationStatusLabels[status]}</span></div>
      <div className="mt-4 space-y-4"><label className="block text-sm font-semibold">Title<input required disabled={!canWrite} value={translations[locale].title} onChange={(event) => updateTranslation(locale, 'title', event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><label className="block text-sm font-semibold">Summary<textarea required disabled={!canWrite} rows={3} value={translations[locale].summary} onChange={(event) => updateTranslation(locale, 'summary', event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><label className="block text-sm font-semibold">Body<textarea required disabled={!canWrite} rows={12} value={translations[locale].body} onChange={(event) => updateTranslation(locale, 'body', event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Image URL<input disabled={!canWrite} type="url" value={translations[locale].imageUrl || ''} onChange={(event) => updateTranslation(locale, 'imageUrl', event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><label className="text-sm font-semibold">Image alt text<input disabled={!canWrite} value={translations[locale].imageAlt || ''} onChange={(event) => updateTranslation(locale, 'imageAlt', event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label></div></div>
    </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><Link to="/news" className="text-sm font-semibold text-ask-600 dark:text-ask-400">← News dashboard</Link><h1 className="mt-2 text-3xl font-bold">{isNew ? 'Create article' : translations.sv.title || translations.en.title || 'Edit article'}</h1>{article && <p className="mt-1 text-sm text-gray-500">{article.status} · Version {article.version}</p>}</div>{canWrite && !isNew && <div className="flex gap-2"><button disabled={saving} onClick={() => void publish()} className="rounded-xl bg-ask-600 px-4 py-2.5 font-semibold text-white">{schedule ? 'Schedule' : 'Publish'}</button><button onClick={() => void remove()} className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700">Delete</button></div>}</div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      <form onSubmit={(event) => void save(event)} className="space-y-6">
        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 md:grid-cols-3"><label className="text-sm font-semibold">Slug <span className="font-normal text-gray-400">(generated from Swedish title)</span><input disabled={!canWrite} value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><label className="text-sm font-semibold">Publish date and time<input disabled={!canWrite} type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal" /></label><label className="flex items-center gap-3 self-end rounded-xl bg-ask-50 p-3 font-semibold text-ask-ink"><input disabled={!canWrite} type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Featured article</label></section>
        <div className="grid gap-6 xl:grid-cols-2">{publicLanguages.map((locale) => localePanel(locale, languageLabels[locale]))}</div>
        <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"><h2 className="font-bold">Categories</h2><div className="mt-3 flex flex-wrap gap-2">{categories.map((item) => <label key={item.id} className="rounded-full border px-3 py-2 text-sm"><input disabled={!canWrite} type="checkbox" checked={categoryIds.includes(item.id)} onChange={() => toggleSelection(item.id, categoryIds, setCategoryIds)} className="mr-2" />{item.labels.sv} / {item.labels.en}</label>)}</div></section><section className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"><h2 className="font-bold">Tags</h2><div className="mt-3 flex flex-wrap gap-2">{tags.map((item) => <label key={item.id} className="rounded-full border px-3 py-2 text-sm"><input disabled={!canWrite} type="checkbox" checked={tagIds.includes(item.id)} onChange={() => toggleSelection(item.id, tagIds, setTagIds)} className="mr-2" />{item.labels.sv} / {item.labels.en}</label>)}</div></section></div>
        {canWrite && <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="rounded-xl bg-ask-600 px-6 py-3 font-semibold text-white shadow-xl shadow-ask-600/25">{saving ? 'Saving…' : isNew ? 'Create draft' : 'Save draft'}</button></div>}
      </form>
    </section>
  )
}
