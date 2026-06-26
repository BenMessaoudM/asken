export const publicLanguages = ['sv', 'en'] as const;
export const defaultLanguage = 'sv';
export const fallbackLanguage = 'sv';

export type PublicLanguage = typeof publicLanguages[number];

export const languageLabels: Record<PublicLanguage, string> = {
  sv: 'Svenska',
  en: 'English',
};

export function resolvePublicLanguage(language?: string | null): PublicLanguage {
  return language?.startsWith('en') ? 'en' : defaultLanguage;
}
