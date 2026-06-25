import { PublicCmsSection } from '../cms/types'
import Icon from './Icon'
import SmartLink from './SmartLink'

function text(value: unknown) { return typeof value === 'string' ? value : '' }
function paragraphs(value: unknown) { return text(value).split(/\n{2,}/).filter(Boolean) }

export default function CmsSections({ sections, labelledBy }: { sections: PublicCmsSection[]; labelledBy?: string }) {
  if (sections.length === 0) return null

  return <div className="space-y-8" aria-labelledby={labelledBy}>{sections.map((section) => {
    if (section.type === 'hero') return null
    if (section.type === 'text') return <section key={section.id} className="ask-card p-6 sm:p-9">
      {text(section.data.heading) && <h2 className="text-2xl font-black sm:text-3xl">{text(section.data.heading)}</h2>}
      <div className="mt-4 max-w-4xl space-y-4 text-base leading-8 text-black/65 dark:text-white/65">{paragraphs(section.data.body).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </section>
    if (section.type === 'image') return <figure key={section.id} className="overflow-hidden rounded-[2rem] bg-white shadow-soft dark:bg-white/5">
      <img src={text(section.data.url)} alt={text(section.data.alt)} className="max-h-[42rem] w-full object-cover" />
      {text(section.data.caption) && <figcaption className="px-6 py-4 text-sm text-black/60 dark:text-white/60">{text(section.data.caption)}</figcaption>}
    </figure>
    if (section.type === 'cta') return <section key={section.id} className="relative overflow-hidden rounded-[2rem] bg-ask-600 p-7 text-white shadow-glow sm:p-10">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-ask-gold/20 blur-2xl" />
      <div className="relative max-w-3xl"><h2 className="text-3xl font-black">{text(section.data.heading)}</h2>{text(section.data.text) && <p className="mt-4 text-lg leading-8 text-white/75">{text(section.data.text)}</p>}<SmartLink href={text(section.data.url)} className="ask-button-secondary mt-6 bg-white text-ask-ink">{text(section.data.label)}<Icon name="arrow" /></SmartLink></div>
    </section>
    if (section.type === 'faq') {
      const items = Array.isArray(section.data.items) ? section.data.items as Array<{ question?: unknown; answer?: unknown }> : []
      return <section key={section.id} className="ask-card p-6 sm:p-9"><h2 className="text-2xl font-black sm:text-3xl">{text(section.data.heading)}</h2><div className="mt-6 divide-y divide-black/10 dark:divide-white/10">{items.map((item, index) => <details key={index} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold"><span>{text(item.question)}</span><span className="text-ask-600 transition group-open:rotate-45 dark:text-ask-400" aria-hidden="true">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-black/65 dark:text-white/65">{text(item.answer)}</p></details>)}</div></section>
    }
    return null
  })}</div>
}
