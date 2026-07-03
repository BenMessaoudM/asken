import { describe, expect, it } from 'vitest'
import { adminLanguages, adminTranslations } from './adminTranslations'

describe('admin translations', () => {
  it('supports the bilingual backoffice language switcher options', () => {
    expect(adminLanguages).toEqual(['sv', 'en'])
    expect(adminTranslations.sv.language.sv).toBe('Svenska')
    expect(adminTranslations.en.language.en).toBe('English')
  })

  it('translates requested module tabs', () => {
    expect(adminTranslations.sv.organization.tabs.people).toBe('Personer')
    expect(adminTranslations.en.organization.tabs.people).toBe('People')
    expect(adminTranslations.sv.booking.tabs.resources).toBe('Resurser')
    expect(adminTranslations.en.booking.tabs.resources).toBe('Resources')
    expect(adminTranslations.sv.governance.tabs.settings).toBe('Inställningar')
    expect(adminTranslations.en.governance.tabs.settings).toBe('Settings')
    expect(adminTranslations.sv.representatives.tabs.calls).toBe('Utlysningar')
    expect(adminTranslations.en.representatives.tabs.calls).toBe('Calls')
    expect(adminTranslations.sv.collaborations.tabs.collaborations).toBe('Samarbeten')
    expect(adminTranslations.en.collaborations.tabs.collaborations).toBe('Collaborations')
  })

  it('translates common actions and collaboration type labels', () => {
    expect(adminTranslations.sv.common.save).toBe('Spara')
    expect(adminTranslations.en.common.noResults).toBe('No results')
    expect(adminTranslations.sv.collaborations.types.arcada_association).toBe('Specialförening')
    expect(adminTranslations.en.collaborations.types.arcada_association).toBe('Arcada Association')
    expect(adminTranslations.sv.collaborations.officeAtCor).toBe('Kontor i Cor-huset')
    expect(adminTranslations.en.collaborations.officeAtCor).toBe('Office at Cor')
  })

  it('keeps content editing fields Swedish-first in both admin languages', () => {
    expect(adminTranslations.sv.contentFields.svLabel).toBe('svenska')
    expect(adminTranslations.sv.contentFields.enLabel).toBe('English')
    expect(adminTranslations.en.contentFields.svLabel).toBe('Swedish')
    expect(adminTranslations.en.contentFields.enLabel).toBe('English')
  })
})
