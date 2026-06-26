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
export const languageLabels: Record<SupportedLanguage, string> = { sv: 'Svenska', en: 'English', fi: 'Suomi' };
export function getDefaultLanguage(): typeof defaultLanguage { return defaultLanguage; }
export function getSupportedLanguages(): readonly SupportedLanguage[] { return supportedLanguages; }
export function getPublicLanguages(): readonly PublicLanguage[] { return publicLanguages; }
export function getBookingLanguages(): readonly BookingLanguageCode[] { return bookingLanguages; }
export function getContractLanguages(): readonly ContractLanguageCode[] { return contractLanguages; }
export function getLanguageLabel(language: SupportedLanguage): string { return languageLabels[language]; }
export function resolvePublicLanguage(language?: string | null): PublicLanguage { return language?.startsWith('en') ? 'en' : defaultLanguage; }
export function resolveBookingLanguage(language?: string | null): BookingLanguageCode { if (language === 'en' || language === 'fi') return language; return defaultLanguage; }
export function resolveLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage = defaultLanguage): string { const selected = values[selectedLanguage]; if (selected && selected.trim()) return selected; if (values.sv && values.sv.trim()) return values.sv; if (values.en && values.en.trim()) return values.en; if (values.fi && values.fi.trim()) return values.fi; return ''; }
export function fallbackLocalizedValue<T extends string | undefined>(values: Partial<Record<SupportedLanguage, T>>, selectedLanguage: SupportedLanguage = defaultLanguage): string { return resolveLocalizedValue(values, selectedLanguage); }
export function getSeoAlternates(path: string, origin: string) { const canonicalUrl = new URL(path, origin).toString(); return [...publicLanguages.map((language) => ({ hreflang: language, href: canonicalUrl })), { hreflang: 'x-default', href: canonicalUrl }]; }
