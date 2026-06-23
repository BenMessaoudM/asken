import { CmsSection } from '../cms/types'
import { sectionLabels } from '../cms/sections'

interface Props {
  section: CmsSection
  index: number
  total: number
  onChange: (section: CmsSection) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  readOnly?: boolean
}

export default function PageSectionEditor({ section, index, total, onChange, onMove, onRemove, readOnly = false }: Props) {
  const set = (key: string, value: unknown) => onChange({ ...section, data: { ...section.data, [key]: value } })
  const field = (label: string, key: string, type = 'text') => <label className="block text-sm font-medium">{label}<input disabled={readOnly} type={type} value={String(section.data[key] || '')} onChange={(event) => set(key, event.target.value)} className="mt-1 w-full rounded-xl border p-2.5" /></label>
  const textarea = (label: string, key: string) => <label className="block text-sm font-medium">{label}<textarea disabled={readOnly} value={String(section.data[key] || '')} onChange={(event) => set(key, event.target.value)} rows={5} className="mt-1 w-full rounded-xl border p-2.5" /></label>
  const faqItems = Array.isArray(section.data.items) ? section.data.items as Array<{ question: string; answer: string }> : []

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-ask-600 dark:text-ask-400">Section {index + 1}</p><h3 className="text-lg font-bold">{sectionLabels[section.type]}</h3></div>{!readOnly && <div className="flex gap-2"><button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-30" aria-label="Move section up">↑</button><button type="button" disabled={index === total - 1} onClick={() => onMove(1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-30" aria-label="Move section down">↓</button><button type="button" onClick={onRemove} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700 dark:border-red-500/30 dark:text-red-300">Remove</button></div>}</div>
      <div className="grid gap-4 md:grid-cols-2">
        {section.type === 'hero' && <>{field('Heading', 'heading')}{field('Subheading', 'subheading')}{field('Image URL', 'imageUrl', 'url')}{field('CTA label', 'ctaLabel')}{field('CTA URL', 'ctaUrl', 'url')}</>}
        {section.type === 'text' && <>{field('Heading', 'heading')}<div className="md:col-span-2">{textarea('Body', 'body')}</div></>}
        {section.type === 'image' && <>{field('Image URL', 'url', 'url')}{field('Alternative text', 'alt')}<div className="md:col-span-2">{field('Caption', 'caption')}</div></>}
        {section.type === 'cta' && <>{field('Heading', 'heading')}{field('Button label', 'label')}<div className="md:col-span-2">{textarea('Text', 'text')}</div>{field('Destination URL', 'url', 'url')}</>}
        {section.type === 'faq' && <div className="space-y-4 md:col-span-2">{field('Section heading', 'heading')}{faqItems.map((item, itemIndex) => <div key={itemIndex} className="rounded-xl bg-ask-50/60 p-4 dark:bg-white/5"><div className="grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">Question<input disabled={readOnly} value={item.question} onChange={(event) => set('items', faqItems.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, question: event.target.value } : current))} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-sm font-medium">Answer<textarea disabled={readOnly} value={item.answer} onChange={(event) => set('items', faqItems.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, answer: event.target.value } : current))} className="mt-1 w-full rounded-lg border p-2" /></label></div><button disabled={readOnly} type="button" onClick={() => set('items', faqItems.filter((_, currentIndex) => currentIndex !== itemIndex))} className="mt-2 text-sm text-red-700 dark:text-red-300">Remove question</button></div>)}<button disabled={readOnly} type="button" onClick={() => set('items', [...faqItems, { question: '', answer: '' }])} className="rounded-lg bg-ask-50 px-3 py-2 text-sm font-semibold text-ask-600 dark:bg-ask-600/20 dark:text-ask-400">Add question</button></div>}
      </div>
    </article>
  )
}
