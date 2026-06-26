export const supportedLanguages = ['sv', 'en', 'fi'] as const;
export const publicLanguages = ['sv', 'en'] as const;
export const bookingLanguages = ['sv', 'en', 'fi'] as const;
export const contractLanguages = ['sv', 'en', 'fi'] as const;
export const defaultLanguage = 'sv';

export type SupportedLanguage = typeof supportedLanguages[number];
export type PublicLanguage = typeof publicLanguages[number];
export type BookingLanguageCode = typeof bookingLanguages[number];
export type ContractLanguageCode = typeof contractLanguages[number];
export type TranslationStatus = 'missing' | 'draft' | 'needs_review' | 'reviewed' | 'published' | 'stale';

export interface TranslationMetadata { status: TranslationStatus; sourceLanguage: SupportedLanguage; lastTranslatedAt?: string; reviewedBy?: string; reviewedAt?: string; staleSourceVersion?: number; }
export const languageLabels: Record<SupportedLanguage, string> = { sv: 'Svenska', en: 'English', fi: 'Suomi' };
export const translationStatusLabels: Record<TranslationStatus, string> = { missing: 'Missing', draft: 'Draft', needs_review: 'Needs Review', reviewed: 'Reviewed', published: 'Published', stale: 'Stale' };
export function getDefaultLanguage(): typeof defaultLanguage { return defaultLanguage; }
export function getSupportedLanguages(): readonly SupportedLanguage[] { return supportedLanguages; }
export function getPublicLanguages(): readonly PublicLanguage[] { return publicLanguages; }
export function getBookingLanguages(): readonly BookingLanguageCode[] { return bookingLanguages; }
export function getContractLanguages(): readonly ContractLanguageCode[] { return contractLanguages; }
export function getLanguageLabel(language: SupportedLanguage): string { return languageLabels[language]; }
export function resolveLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage = defaultLanguage): string { const selected = values[selectedLanguage]; if (selected && selected.trim()) return selected; if (values.sv && values.sv.trim()) return values.sv; if (values.en && values.en.trim()) return values.en; if (values.fi && values.fi.trim()) return values.fi; return ''; }
export function fallbackLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage = defaultLanguage): string { return resolveLocalizedValue(values, selectedLanguage); }
export function translationCompleteness(values: object): TranslationStatus { const entries = Object.values(values).map((value) => typeof value === 'string' ? value.trim() : ''); if (entries.every((value) => !value)) return 'missing'; if (entries.some((value) => !value)) return 'draft'; return 'reviewed'; }
