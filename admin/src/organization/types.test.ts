import { describe, expect, it } from 'vitest'
import { CampaignStatus, CampaignType, PersonType } from './types'

describe('organization admin types', () => {
  it('covers public organization management option values', () => {
    const personType: PersonType = 'board'
    const campaignType: CampaignType = 'student_council'
    const status: CampaignStatus = 'open'
    expect([personType, campaignType, status]).toEqual(['board', 'student_council', 'open'])
  })
})
