import { describe, expect, it } from 'vitest'
import { resolveInitialTheme } from './theme'

describe('dashboard theme', () => {
  it('uses a stored valid preference', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark')
    expect(resolveInitialTheme('light', true)).toBe('light')
  })

  it('falls back to the system preference', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
    expect(resolveInitialTheme('invalid', false)).toBe('light')
  })
})
