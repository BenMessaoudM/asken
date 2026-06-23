import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { apiRequest, ApiError } from '../api/client'
import { createSection, normalizeSections, sectionLabels } from '../cms/sections'
import { CmsContent, CmsSection, ContentType, ContentVersion, SectionType, contentTypeLabels, contentTypes } from '../cms/types'
import PageSectionEditor from '../components/PageSectionEditor'

function cleanData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cleanData)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== '').map(([key, item]) => [key, cleanData(item)]))
  return value
}

export default function ContentEditor() {
  const { contentId } = useParams()
  const isNew = !contentId
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('content.write')
  const [content, setContent] = useState<CmsContent | null>(null)
  const [contentType, setContentType] = useState<ContentType>('page')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [sections, setSections] = useState<CmsSection[]>([])
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [newSectionType, setNewSectionType] = useState<SectionType>('text')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!contentId) return
    void Promise.all([
      apiRequest<{ data: { content: CmsContent } }>(`/admin/content/${contentId}`),
      apiRequest<{ data: { versions: ContentVersion[] } }>(`/admin/content/${contentId}/versions`)
    ]).then(([contentResult, versionResult]) => {
      const loaded = contentResult.data.content
      setContent(loaded)
      setContentType(loaded.contentType)
      setTitle(loaded.title)
      setSlug(loaded.slug)
      setSections(normalizeSections(loaded.sections))
      setVersions(versionResult.data.versions)
    }).catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to load content'))
  }, [contentId])

  const payload = () => ({
    contentType,
    title,
    ...(slug.trim() ? { slug: slug.trim() } : {}),
    sections: normalizeSections(sections).map(({ type, position, data }) => ({ type, position, data: cleanData(data) }))
  })
  const refreshVersions = async (id: string) => {
    const result = await apiRequest<{ data: { versions: ContentVersion[] } }>(`/admin/content/${id}/versions`)
    setVersions(result.data.versions)
  }
  const save = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!isNew && !content) return
    setError('')
    setSaving(true)
    try {
      if (isNew) {
        const result = await apiRequest<{ data: { content: CmsContent } }>('/admin/content', { method: 'POST', body: JSON.stringify(payload()) })
        navigate(`/content/${result.data.content.id}`, { replace: true })
      } else {
        const result = await apiRequest<{ data: { content: CmsContent } }>(`/admin/content/${contentId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...payload(), expectedVersion: content!.version })
        })
        setContent(result.data.content)
        setContentType(result.data.content.contentType)
        setSlug(result.data.content.slug)
        setSections(normalizeSections(result.data.content.sections))
        await refreshVersions(contentId!)
      }
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to save content')
    } finally {
      setSaving(false)
    }
  }
  const publish = async () => {
    if (!content) return
    setError('')
    setSaving(true)
    try {
      const result = await apiRequest<{ data: { content: CmsContent } }>(`/admin/content/${content.id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ expectedVersion: content!.version })
      })
      setContent(result.data.content)
      await refreshVersions(content.id)
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to publish content')
    } finally {
      setSaving(false)
    }
  }
  const remove = async () => {
    if (!content || !window.confirm(`Delete “${content.title}”?`)) return
    try {
      await apiRequest(`/admin/content/${content.id}`, { method: 'DELETE' })
      navigate('/content')
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to delete content')
    }
  }
  const updateSection = (index: number, section: CmsSection) => setSections((current) => current.map((item, currentIndex) => currentIndex === index ? section : item))
  const moveSection = (index: number, direction: -1 | 1) => setSections((current) => {
    const target = index + direction
    if (target < 0 || target >= current.length) return current
    const next = [...current]
    ;[next[index], next[target]] = [next[target], next[index]]
    return normalizeSections(next)
  })

  if (!isNew && !content && !error) return <main className="p-6">Loading content…</main>

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/content" className="text-sm font-semibold text-ask-600 dark:text-ask-400">← Content</Link>
          <h1 className="mt-2 text-3xl font-bold">{isNew ? 'Create content' : title || 'Edit content'}</h1>
          {content && <p className="mt-1 text-sm text-gray-500 dark:text-white/45">{contentTypeLabels[content.contentType]} · Status: {content.status} · Version {content.version}{content.publishedAt ? ` · Published ${new Date(content.publishedAt).toLocaleString()}` : ''}</p>}
        </div>
        {canWrite && !isNew && <div className="flex gap-2">{content?.status === 'draft' && <button disabled={saving} onClick={() => void publish()} className="rounded-xl bg-ask-600 px-4 py-2.5 font-semibold text-white">Publish</button>}<button onClick={() => void remove()} className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700 dark:border-red-500/30 dark:text-red-300">Delete</button></div>}
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      {content?.status === 'published' && canWrite && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">Saving changes creates a new draft version. Publish again when the revision is ready.</p>}
      <form onSubmit={(event) => void save(event)} className="space-y-6">
        <div className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 md:grid-cols-3">
          <label className="text-sm font-semibold">Content type<select disabled={!canWrite} value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)} className="mt-2 w-full rounded-xl border p-3 font-normal dark:border-white/15 dark:bg-ask-ink">{contentTypes.map((type) => <option key={type} value={type}>{contentTypeLabels[type]}</option>)}</select></label>
          <label className="text-sm font-semibold">Title<input required disabled={!canWrite} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border p-3 font-normal dark:border-white/15 dark:bg-ask-ink" /></label>
          <label className="text-sm font-semibold">Slug <span className="font-normal text-gray-400">(generated if blank)</span><input disabled={!canWrite} value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="content-slug" className="mt-2 w-full rounded-xl border p-3 font-normal dark:border-white/15 dark:bg-ask-ink" /></label>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-bold">Content sections</h2><p className="text-sm text-gray-500 dark:text-white/45">Build reusable structured content blocks.</p></div>
            {canWrite && <div className="flex gap-2"><select value={newSectionType} onChange={(event) => setNewSectionType(event.target.value as SectionType)} className="rounded-xl border px-3 py-2 dark:border-white/15 dark:bg-ask-ink">{Object.entries(sectionLabels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}</select><button type="button" onClick={() => setSections((current) => [...current, createSection(newSectionType, current.length)])} className="rounded-xl bg-ask-ink px-4 py-2 font-semibold text-white dark:bg-ask-600">Add section</button></div>}
          </div>
          {sections.map((section, index) => <PageSectionEditor key={section.id || `${section.type}-${index}`} section={section} index={index} total={sections.length} onChange={(updated) => updateSection(index, updated)} onMove={(direction) => moveSection(index, direction)} onRemove={() => setSections((current) => normalizeSections(current.filter((_, currentIndex) => currentIndex !== index)))} readOnly={!canWrite} />)}
          {sections.length === 0 && <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-gray-500 dark:border-white/15 dark:text-white/40">No sections added.</div>}
        </div>
        {canWrite && <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="rounded-xl bg-ask-600 px-6 py-3 font-semibold text-white shadow-xl shadow-ask-600/25 disabled:opacity-50">{saving ? 'Saving…' : isNew ? 'Create draft' : 'Save draft'}</button></div>}
      </form>
      {!isNew && <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"><h2 className="font-bold">Version history</h2><ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">{versions.map((version) => <li key={version.id} className="flex items-center justify-between py-3 text-sm"><span>Version {version.version} · {version.status} · {contentTypeLabels[version.contentType]}</span><time className="text-gray-500 dark:text-white/40">{new Date(version.createdAt).toLocaleString()}</time></li>)}</ul></div>}
    </section>
  )
}
