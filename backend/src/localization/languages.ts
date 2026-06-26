export const publicLanguages = ['sv', 'en'] as const;
export const contractLanguages = ['sv', 'en', 'fi'] as const;
export const defaultLanguage = 'sv';
export const fallbackLanguage = 'sv';

export type PublicLanguage = typeof publicLanguages[number];
export type ContractLanguageCode = typeof contractLanguages[number];

export const translationStatuses = ['missing', 'draft', 'needs_review', 'reviewed', 'published', 'stale'] as const;
export type TranslationStatus = typeof translationStatuses[number];

export interface TranslationMetadata {
  status: TranslationStatus;
  sourceLanguage: ContractLanguageCode;
  lastTranslatedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  staleSourceVersion?: number;
}

export const languageLabels: Record<ContractLanguageCode, string> = {
  sv: 'Svenska',
  en: 'English',
  fi: 'Suomi',
};

export function resolvePublicLanguage(language?: string): PublicLanguage {
  return language === 'en' ? 'en' : defaultLanguage;
}

export function resolveContractLanguage(language?: string): ContractLanguageCode {
  if (language === 'en' || language === 'fi') return language;
  return defaultLanguage;
}

export function localizedValue<T extends string | undefined>(
  values: Partial<Record<ContractLanguageCode, T>>,
  selectedLanguage: ContractLanguageCode | PublicLanguage = defaultLanguage,
): string {
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

export function localizedObject<T extends object>(
  translations: Partial<Record<PublicLanguage, T>>,
  selectedLanguage: PublicLanguage = defaultLanguage,
): T | undefined {
  return translations[selectedLanguage] || translations.sv || translations.en;
}
