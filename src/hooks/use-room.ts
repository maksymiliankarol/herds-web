import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message, ServerEvent } from '../types'
import { wsUrl } from '../lib/api'

export type Status = 'connecting' | 'open' | 'closed' | 'rejected'

// must match the codes on the server
const CLOSE_INVALID_NAME = 4400
const CLOSE_NAME_TAKEN = 4409
const CLOSE_VERIFICATION_FAILED = 4403

// getToken must be stable (wrap it in useCallback): it returns a fresh Turnstile token
export function useRoom(
  city: string,
  slug: string,
  name: string,
  getToken: () => Promise<string>,
) {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('connecting')
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let ws: WebSocket | undefined
    let start: number
    let retry: number
    let ping: number
    let attempt = 0
    let stopped = false
    let established = false // the server accepted us and sent the history
    let rejected = false

    const scheduleRetry = () => {
      setStatus('closed')
      retry = window.setTimeout(connect, Math.min(1000 * 2 ** attempt++, 15_000))
    }

    const connect = async () => {
      setStatus('connecting')

      // a token is single-use, so every connect needs a fresh one
      let token: string
      try {
        token = await getToken()
      } catch {
        if (!stopped) scheduleRetry()
        return
      }
      if (stopped) return

      const socket = new WebSocket(
        wsUrl(
          `/cities/${city}/rooms/${slug}/ws?name=${encodeURIComponent(name)}&token=${encodeURIComponent(token)}`,
        ),
      )
      ws = socket
      wsRef.current = socket

      socket.onopen = () => {
        // keepalive: answered by the server without waking the Durable Object
        ping = window.setInterval(() => socket.send('ping'), 30_000)
      }

      socket.onmessage = (e) => {
        if (e.data === 'pong') return
        const event = JSON.parse(e.data) as ServerEvent

        if (event.type === 'history') {
          // the first real event: only now are we truly connected
          attempt = 0
          established = true
          setMessages(event.messages)
          setStatus('open')
          setError(null)
        } else if (event.type === 'message') {
          setMessages((prev) => [...prev, event.message])
        } else if (event.type === 'rejected') {
          setError(event.error)
          // A refused first connection won't succeed on retry, except a failed
          // verification: the next attempt brings a fresh token.
          if (
            event.code === CLOSE_INVALID_NAME ||
            (event.code !== CLOSE_VERIFICATION_FAILED && !established)
          ) {
            rejected = true
            setStatus('rejected')
          }
        } else {
          setError(event.error)
        }
      }

      socket.onclose = (e) => {
        clearInterval(ping)
        if (stopped || rejected) return

        // fallback in case the "rejected" event was missed
        if (e.code === CLOSE_INVALID_NAME || (e.code === CLOSE_NAME_TAKEN && !established)) {
          rejected = true
          setStatus('rejected')
          setError(e.reason)
          return
        }

        scheduleRetry()
      }
    }

    // Deferred so StrictMode's throwaway first mount is cleaned up before anything starts
    start = window.setTimeout(connect, 0)

    return () => {
      stopped = true
      clearTimeout(start)
      clearTimeout(retry)
      clearInterval(ping)
      ws?.close()
    }
  }, [city, slug, name, getToken])

  const send = useCallback((body: string) => {
    const ws = wsRef.current
    if (ws?.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify({ body }))
    return true
  }, [])

  return { messages, status, error, send }
}