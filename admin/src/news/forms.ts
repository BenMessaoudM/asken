import { NewsTranslation } from './types'

export function createEmptyTranslations(): { en: NewsTranslation; sv: NewsTranslation } {
  const empty = (): NewsTranslation => ({ title: '', summary: '', body: '', imageUrl: '', imageAlt: '' })
  return { en: empty(), sv: empty() }
}

export function toDatetimeLocal(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
