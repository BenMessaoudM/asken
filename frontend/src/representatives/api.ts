import { getJson } from '../api/client'
import { CurrentRepresentativesGroup, PublicRepresentativeBody, PublicRepresentativeCall, PublicStudentRepresentative } from './types'

export const representativesApi = {
  bodies(locale: string) { return getJson<{ data: { bodies: PublicRepresentativeBody[] } }>(`/representatives/bodies?lang=${locale}`) },
  body(slug: string, locale: string) { return getJson<{ data: { body: PublicRepresentativeBody; representatives: PublicStudentRepresentative[]; calls: PublicRepresentativeCall[] } }>(`/representatives/bodies/${slug}?lang=${locale}`) },
  current(locale: string) { return getJson<{ data: { groups: CurrentRepresentativesGroup[] } }>(`/representatives/current?lang=${locale}`) },
  calls(locale: string) { return getJson<{ data: { calls: PublicRepresentativeCall[] } }>(`/representatives/calls?lang=${locale}`) }
}
