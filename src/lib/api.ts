const API_URL: string = import.meta.env.VITE_API_URL

// Codes the server sends that this client has text for. Keep in sync with
// herds-api (src/lib/error-codes.ts). The server sends more (internal, not_found,
// invalid_input, admin codes): those have no text on purpose, so each screen
// shows its own fallback wording for them.
export type ServerErrorCode = 'rate_limited' | 'city_not_found' | 'room_not_found'

// Raised here, never sent by the server
export type ClientErrorCode = 'network'

export type ErrorCode = ServerErrorCode | ClientErrorCode

export class ApiError extends Error {
  status: number
  // As sent by the server: can be a code this client doesn't know, or null
  // (no body, or a proxy or error page in the way).
  code: string | null

  constructor(status: number, code: string | null = null) {
    // for the console only: users get text from describeError
    super(code ?? `Request failed: ${status}`)
    this.status = status
    this.code = code
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
    throw new ApiError(0, 'network') // status 0: no response at all
  }

  if (!res.ok) {
    // the API answers failures with { "code": "..." }
    const data = (await res.json().catch(() => null)) as { code?: unknown } | null
    throw new ApiError(res.status, typeof data?.code === 'string' ? data.code : null)
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