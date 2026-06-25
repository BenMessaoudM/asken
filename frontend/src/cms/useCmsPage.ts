import { useQuery } from '@tanstack/react-query'
import { PublicApiError } from '../api/client'
import { SiteLocale } from '../content/siteContent'
import { getPublishedPage } from './api'

export function useCmsPage(pageKey: string, locale: SiteLocale) {
  const query = useQuery({
    queryKey: ['cms-page', pageKey, locale],
    queryFn: () => getPublishedPage(`${pageKey}-${locale}`),
    retry: (count, error) => !(error instanceof PublicApiError && error.status === 404) && count < 1,
    staleTime: 60_000,
  })

  return {
    page: query.data?.data.page || null,
    isLoading: query.isLoading,
    error: query.error instanceof PublicApiError && query.error.status === 404 ? null : query.error,
  }
}
