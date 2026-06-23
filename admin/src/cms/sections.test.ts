import { describe, expect, it } from 'vitest'
import { createSection, normalizeSections } from './sections'

it('creates defaults for every CMS section type', () => {
  expect(createSection('hero', 0).data).toHaveProperty('heading')
  expect(createSection('text', 0).data).toHaveProperty('body')
  expect(createSection('image', 0).data).toHaveProperty('alt')
  expect(createSection('cta', 0).data).toHaveProperty('label')
  expect(createSection('faq', 0).data).toHaveProperty('items')
})

it('normalizes section positions after reordering', () => {
  expect(normalizeSections([createSection('text', 8), createSection('hero', 3)]).map((section) => section.position)).toEqual([0, 1])
})
