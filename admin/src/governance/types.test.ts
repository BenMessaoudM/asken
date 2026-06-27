import { describe, expect, it } from 'vitest'
import { GovernanceDocument, GovernanceSettings } from './types'
describe('governance admin types', () => {
  it('covers public document metadata and settings', () => {
    const document: GovernanceDocument = { id: '1', title: { sv: 'Protokoll', en: 'Minutes' }, slug: 'protokoll', description: { sv: '', en: '' }, documentType: 'minutes', governanceBody: 'fullmaktige', year: 2026, language: 'sv', fileUrl: 'https://example.com/file.pdf', isPublic: true, isPublished: true, displayOrder: 1, tags: { sv: '', en: '' } }
    const settings: GovernanceSettings = { id: 'settings', intro: { sv: 'Intro', en: 'Intro' }, documentPolicyText: { sv: 'Policy', en: 'Policy' }, visible: true }
    expect([document.documentType, document.governanceBody, settings.visible]).toEqual(['minutes', 'fullmaktige', true])
  })
})
