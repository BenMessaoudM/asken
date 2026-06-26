export const supportedLanguages = ['sv', 'en', 'fi'] as const;
export const publicLanguages = ['sv', 'en'] as const;
export const bookingLanguages = ['sv', 'en', 'fi'] as const;
export const contractLanguages = ['sv', 'en', 'fi'] as const;
export const defaultLanguage = 'sv';
export const fallbackLanguage = 'sv';

export type SupportedLanguage = typeof supportedLanguages[number];
export type PublicLanguage = typeof publicLanguages[number];
export type BookingLanguageCode = typeof bookingLanguages[number];
export type ContractLanguageCode = typeof contractLanguages[number];

export const translationStatuses = ['missing', 'draft', 'needs_review', 'reviewed', 'published', 'stale'] as const;
export type TranslationStatus = typeof translationStatuses[number];

export interface TranslationMetadata {
  status: TranslationStatus;
  sourceLanguage: SupportedLanguage;
  lastTranslatedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  staleSourceVersion?: number;
}

export const languageLabels: Record<SupportedLanguage, string> = { sv: 'Svenska', en: 'English', fi: 'Suomi' };
export const translationStatusLabels: Record<TranslationStatus, string> = { missing: 'Missing', draft: 'Draft', needs_review: 'Needs Review', reviewed: 'Reviewed', published: 'Published', stale: 'Stale' };

export function getDefaultLanguage(): typeof defaultLanguage { return defaultLanguage; }
export function getSupportedLanguages(): readonly SupportedLanguage[] { return supportedLanguages; }
export function getPublicLanguages(): readonly PublicLanguage[] { return publicLanguages; }
export function getBookingLanguages(): readonly BookingLanguageCode[] { return bookingLanguages; }
export function getContractLanguages(): readonly ContractLanguageCode[] { return contractLanguages; }
export function getLanguageLabel(language: SupportedLanguage): string { return languageLabels[language]; }
export function resolvePublicLanguage(language?: string | null): PublicLanguage { return language?.startsWith('en') ? 'en' : defaultLanguage; }
export function resolveBookingLanguage(language?: string | null): BookingLanguageCode { if (language === 'en' || language === 'fi') return language; return defaultLanguage; }
export function resolveContractLanguage(language?: string | null): ContractLanguageCode { return resolveBookingLanguage(language); }

export function resolveLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage | PublicLanguage = defaultLanguage): string {
  const selected = values[selectedLanguage];
  if (selected && selected.trim()) return selected;
  const swedish = values.sv;
  if (swedish && swedish.trim()) return swedish;
  const english = values.en;
  if (english && english.trim()) return english;
  const finnish = values.fi;
  if (finnish && finnish.trim()) return finnish;
  return '';
}
export function fallbackLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage | PublicLanguage = defaultLanguage): string { return resolveLocalizedValue(values, selectedLanguage); }
export const localizedValue = resolveLocalizedValue;
export function localizedObject<T extends object>(translations: Partial<Record<PublicLanguage, T>>, selectedLanguage: PublicLanguage = defaultLanguage): T | undefined { return translations[selectedLanguage] || translations.sv || translations.en; }
export function createTranslationMetadata(status: TranslationStatus = 'draft', sourceLanguage: SupportedLanguage = defaultLanguage): TranslationMetadata { return { status, sourceLanguage }; }
