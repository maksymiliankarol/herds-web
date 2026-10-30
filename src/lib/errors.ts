import { ApiError } from './api'
import type { Messages } from '../locales/en'

type Overrides = Record<number, string>

// Turns whatever a request threw into text for the user, so every screen reads the same.
// fallback is the screen's own wording; overrides map specific statuses to their own text
// ({ 404: t.city.cityNotFound }) and win over the shared messages.
export function describeError(
  t: Messages,
  error: unknown,
  fallback: string,
  overrides: Overrides = {},
): string {
  if (error instanceof ApiError) {
    const own = overrides[error.status]
    if (own) return own
    if (error.status === 429) return t.errors.tooManyRequests
    if (error.status === 0) return t.errors.cannotReach
  }
  return fallback
}