export type Theme = 'light' | 'dark'

export function resolveInitialTheme(storedTheme: string | null, prefersDark: boolean): Theme {
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return prefersDark ? 'dark' : 'light'
}
