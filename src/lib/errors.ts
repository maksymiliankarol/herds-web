import { ApiError, type ErrorCode } from './api'
import type { Messages } from '../locales/en'

// fallback is the screen's own wording ("Could not load news"). It is used for
// anything without text of its own: internal errors, unknown codes, other statuses.
export function describeError(t: Messages, error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback

  // Fails the build if a code in ErrorCode has no text in en.ts
  const messages: Record<ErrorCode, string> = t.errors

  if (error.code && Object.hasOwn(messages, error.code)) {
    return messages[error.code as ErrorCode]
  }
  // no usable code: a proxy in the way, or an older API
  if (error.status === 429) return messages.rate_limited
  if (error.status === 0) return messages.network
  return fallback
}