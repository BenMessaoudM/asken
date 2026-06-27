import { describe, expect, it } from 'vitest'
import { CampaignStatus, CampaignType, EldersCouncil, PersonType } from './types'

describe('organization admin types', () => {
  it('covers public organization management option values', () => {
    const personType: PersonType = 'board'
    const campaignType: CampaignType = 'student_council'
    const status: CampaignStatus = 'open'
    const elders: EldersCouncil = { title: { sv: 'Äldres Råd', en: 'Elders’ Council' }, description: { sv: '', en: '' }, contactEmail: 'aldresrad@asken.fi', members: [], visible: true }
    expect([personType, campaignType, status, elders.title.sv]).toEqual(['board', 'student_council', 'open', 'Äldres Råd'])
  })
})
