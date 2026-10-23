import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

let scriptPromise: Promise<void> | null = null

function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null // allow a retry on the next mount
      reject(new Error("Could not load Turnstile"))
    }
    document.head.append(script)
  })
  return scriptPromise
}

interface TurnstileProps {
  onToken: (token: string) => void
  onError: () => void
  // Bump to request a fresh token. A token can only be used once.
  resetKey?: number
}

const Turnstile = ({ onToken, onError, resetKey = 0 }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onTokenRef.current = onToken
    onErrorRef.current = onError
  })

  useEffect(() => {
    let cancelled = false

    loadScript()
      .then(() => {
        const container = containerRef.current
        if (cancelled || !container || !window.turnstile) return

        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: SITE_KEY,
          theme: "light",
          appearance: "interaction-only",
          "refresh-expired": "manual", // a new token is only requested via resetKey
          callback: (token: string) => onTokenRef.current(token),
          "error-callback": () => onErrorRef.current()
        })
      })
      .catch(() => onErrorRef.current())

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = null
    }
  }, [])

  useEffect(() => {
    if (resetKey === 0 || !widgetIdRef.current) return
    window.turnstile?.reset(widgetIdRef.current)
  }, [resetKey])

  return <div ref={containerRef} />
}

export default Turnstile