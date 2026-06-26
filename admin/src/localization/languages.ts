export const publicLanguages = ['sv', 'en'] as const;
export const contractLanguages = ['sv', 'en', 'fi'] as const;
export const defaultLanguage = 'sv';

export type PublicLanguage = typeof publicLanguages[number];
export type ContractLanguageCode = typeof contractLanguages[number];
export type TranslationStatus = 'missing' | 'draft' | 'needs_review' | 'reviewed' | 'published' | 'stale';

export const languageLabels: Record<ContractLanguageCode, string> = {
  sv: 'Svenska',
  en: 'English',
  fi: 'Suomi',
};

export const translationStatusLabels: Record<TranslationStatus, string> = {
  missing: 'Missing',
  draft: 'Draft',
  needs_review: 'Needs Review',
  reviewed: 'Reviewed',
  published: 'Published',
  stale: 'Stale',
};

export function translationCompleteness(values: object): TranslationStatus {
  const entries = Object.values(values).map((value) => typeof value === 'string' ? value.trim() : '');
  if (entries.every((value) => !value)) return 'missing';
  if (entries.some((value) => !value)) return 'draft';
  return 'reviewed';
}
