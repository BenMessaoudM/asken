import { describe, expect, it } from 'vitest'
import { contentTypeLabels, contentTypes } from './types'

describe('CMS content types', () => {
  it('supports every Epic 4 content type', () => {
    expect(contentTypes).toEqual([
      'page',
      'news',
      'event',
      'cor_activity',
      'governance_document',
      'collaboration'
    ])
    expect(contentTypes.map((type) => contentTypeLabels[type])).toEqual([
      'Page',
      'News',
      'Event',
      'Cor Activity',
      'Governance Document',
      'Collaboration'
    ])
  })
})
