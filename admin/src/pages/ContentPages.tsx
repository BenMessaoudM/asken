import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { apiRequest, ApiError } from '../api/client'
import { ContentSummary, ContentType, contentTypeLabels, contentTypes } from '../cms/types'

type ContentFilter = ContentType | 'all'

export default function ContentPages() {
  const [contents, setContents] = useState<ContentSummary[]>([])
  const [filter, setFilter] = useState<ContentFilter>('all')
  const [error, setError] = useState('')
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('content.write')
  const load = async (contentFilter = filter) => {
    const query = contentFilter === 'all' ? '' : `?type=${encodeURIComponent(contentFilter)}`
    const result = await apiRequest<{ data: { contents: ContentSummary[] } }>(`/admin/content${query}`)
    setContents(result.data.contents.filter((content) => !['news', 'event'].includes(content.contentType)))
  }

  useEffect(() => {
    setError('')
    void load(filter).catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to load content'))
  }, [filter])

  const remove = async (content: ContentSummary) => {
    if (!window.confirm(`Delete “${content.title}”? This also removes its version history.`)) return
    try {
      await apiRequest(`/admin/content/${content.id}`, { method: 'DELETE' })
      await load()
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to delete content')
    }
  }
  const publish = async (content: ContentSummary) => {
    try {
      await apiRequest(`/admin/content/${content.id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ expectedVersion: content.version })
      })
      await load()
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to publish content')
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ask-600 dark:text-ask-400">CMS foundation</p>
          <h1 className="mt-1 text-3xl font-bold">Content</h1>
          <p className="mt-2 text-gray-500 dark:text-white/50">Manage structured drafts and published content across ASK modules.</p>
        </div>
        {canWrite && <Link to="/content/new" className="rounded-xl bg-ask-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-ask-600/20">Create content</Link>}
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="content-filter" className="text-sm font-semibold">Content type</label>
        <select id="content-filter" value={filter} onChange={(event) => setFilter(event.target.value as ContentFilter)} className="rounded-xl border px-3 py-2 dark:border-white/15 dark:bg-ask-ink">
          <option value="all">All types</option>
          {contentTypes.filter((type) => !['news', 'event'].includes(type)).map((type) => <option key={type} value={type}>{contentTypeLabels[type]}</option>)}
        </select>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full">
          <thead><tr className="border-b border-black/5 text-left text-xs uppercase tracking-wider text-gray-500 dark:border-white/10 dark:text-white/40"><th className="p-4">Content</th><th className="p-4">Type</th><th className="p-4">Status</th><th className="p-4">Version</th><th className="p-4">Sections</th><th className="p-4">Updated</th><th className="p-4">Actions</th></tr></thead>
          <tbody>{contents.map((content) => <tr key={content.id} className="border-b border-black/5 last:border-0 dark:border-white/10"><td className="p-4"><p className="font-semibold">{content.title}</p><p className="text-sm text-gray-500 dark:text-white/40">/{content.slug}</p></td><td className="p-4 text-sm font-medium">{contentTypeLabels[content.contentType]}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${content.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'}`}>{content.status}</span></td><td className="p-4">v{content.version}</td><td className="p-4">{content.sectionCount}</td><td className="p-4 text-sm">{new Date(content.updatedAt).toLocaleDateString()}</td><td className="p-4"><div className="flex flex-wrap gap-2"><Link to={`/content/${content.id}`} className="rounded-lg border px-3 py-1.5 text-sm">{canWrite ? 'Edit' : 'View'}</Link>{canWrite && content.status === 'draft' && <button onClick={() => void publish(content)} className="rounded-lg bg-ask-600 px-3 py-1.5 text-sm text-white">Publish</button>}{canWrite && <button onClick={() => void remove(content)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 dark:border-red-500/30 dark:text-red-300">Delete</button>}</div></td></tr>)}</tbody>
        </table>
        {contents.length === 0 && <div className="p-10 text-center text-gray-500 dark:text-white/45">No content matches this filter.</div>}
      </div>
    </section>
  )
}
