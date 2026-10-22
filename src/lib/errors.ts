import { ApiError } from './api'

type Overrides = Record<number, string>

// Turns whatever a request threw into text for the user, so every screen reads the same.
// fallback is the screen's own wording ("Could not load rooms"); overrides map specific
// statuses to their own text ({ 404: 'City not found' }) and win over the shared messages.
export function describeError(error: unknown, fallback: string, overrides: Overrides = {}): string {
  if (error instanceof ApiError) {
    const own = overrides[error.status]
    if (own) return own
    if (error.status === 429) return 'Too many requests, try again in a minute'
    if (error.status === 0) return 'Cannot reach the server, check your connection'
  }
  return fallback
}