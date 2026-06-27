export type RepresentativeCallStatus = 'coming_soon' | 'open' | 'closed'
export type AppointingBody = 'fullmaktige' | 'board' | 'other'
export type RepresentativeRole = 'representative' | 'deputy'

export interface PublicRepresentativeBody {
  id: string
  name: string
  slug: string
  description: string
  category: 'statutory_arcada_body' | 'arcada_body' | 'external_body' | 'other'
  appointingBody: AppointingBody
  defaultTermLengthMonths: number
  defaultSeatCount?: number
  defaultDeputySeatCount?: number
  eligibilityDescription: string
  applicationInstructions: string
}

export interface PublicStudentRepresentative {
  id: string
  bodyId: string
  fullName: string
  email?: string
  studyProgramme?: string
  role: RepresentativeRole
  termStart: string
  termEnd: string
  status: 'active' | 'ended' | 'resigned' | 'dismissed'
  appointedBy: AppointingBody
  appointmentDate?: string
  photoUrl?: string
  description: string
  displayOrder: number
}

export interface PublicRepresentativeCall {
  id: string
  title: string
  bodyId?: string
  body?: PublicRepresentativeBody
  description: string
  openingDate: string
  closingDate: string
  numberOfSeats: number
  eligibility: string
  applicationInstructions: string
  ctaLabel: string
  ctaUrl?: string
  contactEmail?: string
  status: RepresentativeCallStatus
  featured: boolean
  displayOrder: number
}

export interface CurrentRepresentativesGroup {
  body: PublicRepresentativeBody
  representatives: PublicStudentRepresentative[]
}
