import { describe, expect, it } from 'vitest'
import { RepresentativeBody, RepresentativeCall, StudentRepresentative } from './types'

describe('representatives admin types', () => {
  it('covers bodies, people and calls including privacy flags', () => {
    const body: RepresentativeBody = { id: 'body-1', name: { sv: 'Omprövningsnämnden', en: 'Board of Review' }, slug: 'omprovningsnamnden', description: { sv: '', en: '' }, category: 'statutory_arcada_body', appointingBody: 'fullmaktige', defaultTermLengthMonths: 24, defaultSeatCount: 1, defaultDeputySeatCount: 1, eligibilityDescription: { sv: '', en: '' }, applicationInstructions: { sv: '', en: '' }, active: true, visible: true, displayOrder: 10 }
    const person: StudentRepresentative = { id: 'rep-1', bodyId: body.id, fullName: 'Student', contactPublic: false, role: 'representative', termStart: '2026-01-01T00:00:00.000Z', termEnd: '2027-12-31T00:00:00.000Z', status: 'active', appointedBy: 'fullmaktige', publicProfile: true, description: { sv: '', en: '' }, displayOrder: 1 }
    const call: RepresentativeCall = { id: 'call-1', title: { sv: 'Ansök', en: 'Apply' }, bodyId: body.id, description: { sv: '', en: '' }, openingDate: '2026-08-01T00:00:00.000Z', closingDate: '2026-08-15T00:00:00.000Z', numberOfSeats: 1, eligibility: { sv: '', en: '' }, applicationInstructions: { sv: '', en: '' }, ctaLabel: { sv: 'Ansök', en: 'Apply' }, status: 'open', published: true, featured: false, displayOrder: 1 }
    expect([body.appointingBody, person.contactPublic, call.status]).toEqual(['fullmaktige', false, 'open'])
  })
})
