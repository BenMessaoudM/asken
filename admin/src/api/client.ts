const browserApiBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:3000/api/v1'
  : `${window.location.protocol}//${window.location.hostname}:3000/api/v1`

export const apiBaseUrl = import.meta.env.VITE_API_URL || browserApiBaseUrl

interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: unknown }
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message)
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T
  const body = await response.json() as ApiErrorBody & T
  if (!response.ok) {
    throw new ApiError(response.status, body.error?.code || 'REQUEST_FAILED', body.error?.message || 'Request failed', body.error?.details)
  }
  return body as T
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init.headers }
  })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    const refreshed = await fetch(`${apiBaseUrl}/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (refreshed.ok) return apiRequest<T>(path, init, false)
  }
  return parseResponse<T>(response)
}

export async function apiDownload(path:string,body:unknown,retry=true):Promise<{blob:Blob;filename:string}>{
  const response=await fetch(`${apiBaseUrl}${path}`,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  if(response.status===401&&retry){const refreshed=await fetch(`${apiBaseUrl}/auth/refresh`,{method:'POST',credentials:'include'});if(refreshed.ok)return apiDownload(path,body,false)}
  if(!response.ok)return parseResponse<never>(response);
  const disposition=response.headers.get('content-disposition')||'';
  return{blob:await response.blob(),filename:disposition.match(/filename="?([^";]+)"?/)?.[1]||'contract.pdf'};
}
