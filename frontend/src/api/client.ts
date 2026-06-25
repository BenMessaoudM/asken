const browserApiBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:3000/api/v1'
  : `${window.location.protocol}//${window.location.hostname}:3000/api/v1`

export const publicApiBaseUrl = import.meta.env.VITE_API_URL || browserApiBaseUrl

export class PublicApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message) }
}

async function parse<T>(response: Response): Promise<T> {
  const body = await response.json() as { error?: { message?: string } } & T
  if (!response.ok) throw new PublicApiError(response.status, body.error?.message || 'Request failed')
  return body as T
}

export async function getJson<T>(path: string): Promise<T> {
  return parse<T>(await fetch(`${publicApiBaseUrl}${path}`))
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  return parse<T>(await fetch(`${publicApiBaseUrl}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }))
}
