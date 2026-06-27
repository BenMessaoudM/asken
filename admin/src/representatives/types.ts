export interface LocalizedText { sv: string; en: string }
export type RepresentativeBodyCategory = 'statutory_arcada_body' | 'arcada_body' | 'external_body' | 'other'
export type AppointingBody = 'fullmaktige' | 'board' | 'other'
export type RepresentativeRole = 'representative' | 'deputy'
export type RepresentativeStatus = 'active' | 'ended' | 'resigned' | 'dismissed'
export type RepresentativeCallStatus = 'coming_soon' | 'open' | 'closed'

export interface RepresentativeBody {
  id: string
  name: LocalizedText
  slug: string
  description: LocalizedText
  category: RepresentativeBodyCategory
  appointingBody: AppointingBody
  defaultTermLengthMonths: number
  defaultSeatCount?: number
  defaultDeputySeatCount?: number
  eligibilityDescription: LocalizedText
  applicationInstructions: LocalizedText
  active: boolean
  visible: boolean
  displayOrder: number
}

export interface StudentRepresentative {
  id: string
  bodyId: string
  fullName: string
  email?: string
  contactPublic: boolean
  studyProgramme?: string
  role: RepresentativeRole
  termStart: string
  termEnd: string
  status: RepresentativeStatus
  appointedBy: AppointingBody
  appointmentDate?: string
  publicProfile: boolean
  photoUrl?: string
  description: LocalizedText
  displayOrder: number
}

export interface RepresentativeCall {
  id: string
  title: LocalizedText
  bodyId?: string
  description: LocalizedText
  openingDate: string
  closingDate: string
  numberOfSeats: number
  eligibility: LocalizedText
  applicationInstructions: LocalizedText
  ctaLabel: LocalizedText
  ctaUrl?: string
  contactEmail?: string
  status: RepresentativeCallStatus
  published: boolean
  featured: boolean
  displayOrder: number
}
