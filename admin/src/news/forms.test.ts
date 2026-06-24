import { describe, expect, it } from 'vitest'
import { createEmptyTranslations, toDatetimeLocal } from './forms'

describe('News form helpers', () => {
  it('creates independent English and Swedish article fields', () => {
    const translations = createEmptyTranslations()
    translations.en.title = 'English'
    expect(translations.sv.title).toBe('')
  })

  it('formats an ISO schedule for datetime-local controls', () => {
    expect(toDatetimeLocal('2030-01-01T10:00:00.000Z')).toMatch(/^2030-01-01T/)
  })
})
