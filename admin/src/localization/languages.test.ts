import { describe, expect, it } from 'vitest';
import { fallbackLocalizedValue, getBookingLanguages, getContractLanguages, getDefaultLanguage, getLanguageLabel, getPublicLanguages, getSupportedLanguages } from './languages';

describe('admin language policy', () => {
  it('uses Swedish-first language order', () => {
    expect(getDefaultLanguage()).toBe('sv');
    expect(getSupportedLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getPublicLanguages()).toEqual(['sv', 'en']);
    expect(getBookingLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getContractLanguages()).toEqual(['sv', 'en', 'fi']);
    expect(getLanguageLabel('sv')).toBe('Svenska');
  });

  it('falls back to Swedish, then English', () => {
    expect(fallbackLocalizedValue({ sv: 'Svenska', en: 'English' }, 'fi')).toBe('Svenska');
    expect(fallbackLocalizedValue({ en: 'English' }, 'fi')).toBe('English');
  });
});
