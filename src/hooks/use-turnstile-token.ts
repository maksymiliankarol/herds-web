import { useCallback, useEffect, useRef } from 'react'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

const TOKEN_TIMEOUT_MS = 20_000

type Pending = { resolve: (token: string) => void; reject: (error: Error) => void }

// Defined once, so the widget always receives the same options object
const OPTIONS = {
  theme: 'light',
  refreshExpired: 'manual',
  appearance: 'interaction-only',
} as const

// Turns the Turnstile widget into a promise: getToken() resolves with a fresh, single-use token.
// Spread widgetProps onto <Turnstile />. getToken is stable, so it's safe in effect dependencies.
export function useTurnstileToken() {
  const widget = useRef<TurnstileInstance>(null)
  const pending = useRef<Pending | null>(null)

  // reset() makes the widget produce a fresh token; if the widget isn't ready yet,
  // its first token resolves the request instead. Rejects if the widget never answers
  // (script blocked, unsupported browser...).
  const getToken = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        const entry: Pending = {
          resolve: (token) => {
            clearTimeout(timer)
            resolve(token)
          },
          reject: (error) => {
            clearTimeout(timer)
            reject(error)
          },
        }

        const timer = window.setTimeout(() => {
          if (pending.current === entry) pending.current = null
          reject(new Error('turnstile timeout'))
        }, TOKEN_TIMEOUT_MS)

        pending.current = entry
        widget.current?.reset()
      }),
    [],
  )

  const onSuccess = useCallback((token: string) => {
    pending.current?.resolve(token)
    pending.current = null
  }, [])

  const onError = useCallback(() => {
    pending.current?.reject(new Error('turnstile error'))
    pending.current = null
  }, [])

  // don't leave a pending request (and its timer) behind when the component goes away
  useEffect(
    () => () => {
      pending.current?.reject(new Error('turnstile unmounted'))
      pending.current = null
    },
    [],
  )

  const widgetProps = {
    ref: widget,
    siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    options: OPTIONS,
    onSuccess,
    onError,
  }

  return { getToken, widgetProps }
}