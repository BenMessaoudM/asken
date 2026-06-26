import { fallbackLocalizedValue, getBookingLanguages, getContractLanguages, getDefaultLanguage, getLanguageLabel, getPublicLanguages, getSupportedLanguages, resolveLocalizedValue, translationStatuses } from './languages';

describe('language policy', () => {
  it('uses Swedish-first language order', () => {
    expect(getDefaultLanguage()).toBe('sv');
    expect(getSupportedLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getPublicLanguages()).toEqual(['sv', 'en']);
    expect(getBookingLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getContractLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getLanguageLabel('sv')).toBe('Svenska');
    expect(getLanguageLabel('en')).toBe('English');
    expect(getLanguageLabel('fi')).toBe('Suomi');
  });

  it('falls back to Swedish before English', () => {
    expect(resolveLocalizedValue({ en: 'English', sv: 'Svenska' }, 'fi')).toBe('Svenska');
    expect(fallbackLocalizedValue({ en: 'English' }, 'fi')).toBe('English');
    expect(resolveLocalizedValue({ fi: 'Suomi' }, 'sv')).toBe('Suomi');
  });

  it('defines the shared translation status model', () => {
    expect(translationStatuses).toEqual(['missing', 'draft', 'needs_review', 'reviewed', 'published', 'stale']);
  });
});
