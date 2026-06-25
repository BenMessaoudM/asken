const browserApiBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:3000/api/v1'
  : `${window.location.protocol}//${window.location.hostname}:3000/api/v1`

export const publicApiBaseUrl = import.meta.env.VITE_API_URL || browserApiBaseUrl

export class PublicApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${publicApiBaseUrl}${path}`)
  const body = await response.json() as { error?: { message?: string } } & T
  if (!response.ok) throw new PublicApiError(response.status, body.error?.message || 'Request failed')
  return body as T
}
