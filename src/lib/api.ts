const API_URL: string = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number

  constructor(status: number, message?: string) {
    super(message ?? `Request failed: ${status}`)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch (e) {
    // an aborted request was superseded: let the caller see the abort and ignore it
    if (init.signal?.aborted) throw e
    throw new ApiError(0, 'Network error') // status 0: no response at all
  }
  
  if (!res.ok) {
    // the API answers failures with { "error": "..." }
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    throw new ApiError(res.status, data?.error)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const get = <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal })

export const post = <T>(path: string, data: unknown, token?: string) =>
  request<T>(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token,
  )

export const del = (path: string, token?: string) =>
  request<void>(path, { method: 'DELETE' }, token)

// http://host -> ws://host, https://host -> wss://host
export function wsUrl(path: string) {
  const url = new URL(path, API_URL)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return url.toString()
}