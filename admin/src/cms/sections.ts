import { CmsSection, SectionType } from './types'

export const sectionLabels: Record<SectionType, string> = {
  hero: 'Hero', text: 'Text', image: 'Image', cta: 'Call to action', faq: 'FAQ'
}

export function createSection(type: SectionType, position: number): CmsSection {
  const defaults: Record<SectionType, Record<string, unknown>> = {
    hero: { heading: '', subheading: '', imageUrl: '', ctaLabel: '', ctaUrl: '' },
    text: { heading: '', body: '' },
    image: { url: '', alt: '', caption: '' },
    cta: { heading: '', text: '', label: '', url: '' },
    faq: { heading: '', items: [{ question: '', answer: '' }] }
  }
  return { type, position, data: defaults[type] }
}

export function normalizeSections(sections: CmsSection[]) {
  return sections.map((section, position) => ({ ...section, position }))
}
