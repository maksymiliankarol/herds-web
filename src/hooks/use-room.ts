import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message, ServerEvent } from '../types'
import { wsUrl } from '../lib/api'
import {
  CLOSE_INVALID_NAME,
  CLOSE_NAME_TAKEN,
  CLOSE_VERIFICATION_FAILED,
  describeRejection,
  type Rejection,
} from '../lib/rejections'

export type Status = 'connecting' | 'open' | 'closed' | 'rejected'

const MAX_MESSAGES = 100 // must match KEEP_MESSAGES / listMessages on the server
const NOTICE_MS = 4000
const BACKOFF_BASE_MS = 1000
const BACKOFF_MAX_MS = 15_000

// Exponential backoff with jitter: wait somewhere between half and all of the current step,
// so clients that lost the server together don't all come back together.
const retryDelay = (attempt: number) => {
  const step = Math.min(BACKOFF_BASE_MS * 2 ** attempt, BACKOFF_MAX_MS)
  return step / 2 + Math.random() * (step / 2)
}

// getToken must be stable (wrap it in useCallback): it returns a fresh Turnstile token
export function useRoom(
  city: string,
  slug: string,
  name: string,
  getToken: () => Promise<string>,
) {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('connecting')
  // error: a connection problem, shown until the next successful connect
  const [error, setError] = useState<string | null>(null)
  // rejection: why a first connection was refused for good (the user retries by hand)
  const [rejection, setRejection] = useState<Rejection | null>(null)
  // notice: a transient chat error ("slow down"), cleared after a few seconds
  const [notice, setNotice] = useState<{ text: string } | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  // The object is new on every event, so a repeated message restarts the timer
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS)
    return () => clearTimeout(timer)
  }, [notice])

  // retryKey is only here to restart the connection from scratch (see retry below)
  useEffect(() => {
    let ws: WebSocket | undefined
    let start: number
    let retryTimer: number
    let ping: number
    let attempt = 0
    let stopped = false
    let established = false // the server accepted us and sent the history
    let rejected = false

    const scheduleRetry = () => {
      setStatus('closed')
      retryTimer = window.setTimeout(connect, retryDelay(attempt++))
    }

    const connect = async () => {
      setStatus('connecting')

      // a token is single-use, so every connect needs a fresh one
      let token: string
      try {
        token = await getToken()
      } catch {
        if (stopped) return
        setError(describeRejection(CLOSE_VERIFICATION_FAILED).message)
        scheduleRetry()
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
        let event: ServerEvent
        try {
          event = JSON.parse(e.data) as ServerEvent
        } catch {
          return // ignore a malformed frame instead of throwing inside the handler
        }

        if (event.type === 'history') {
          // the first real event: only now are we truly connected
          attempt = 0
          established = true
          setMessages(event.messages)
          setStatus('open')
          setError(null)
          setNotice(null)
        } else if (event.type === 'message') {
          setMessages((prev) => [...prev, event.message].slice(-MAX_MESSAGES))
        } else if (event.type === 'rejected') {
          const info = describeRejection(event.code, event.error)
          setError(info.message)
          // A refused first connection won't succeed on its own, except a failed
          // verification: the next attempt brings a fresh token.
          if (
            event.code === CLOSE_INVALID_NAME ||
            (event.code !== CLOSE_VERIFICATION_FAILED && !established)
          ) {
            rejected = true
            setRejection(info)
            setStatus('rejected')
          }
        } else {
          setNotice({ text: event.error })
        }
      }

      socket.onclose = (e) => {
        clearInterval(ping)
        if (stopped || rejected) return

        // fallback in case the "rejected" event was missed
        if (e.code === CLOSE_INVALID_NAME || (e.code === CLOSE_NAME_TAKEN && !established)) {
          const info = describeRejection(e.code, e.reason)
          rejected = true
          setRejection(info)
          setStatus('rejected')
          setError(info.message)
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
      clearTimeout(retryTimer)
      clearInterval(ping)
      ws?.close()
    }
  }, [city, slug, name, getToken, retryKey])

  // Manual "Try again" after a rejection: reconnect from scratch
  const retry = useCallback(() => {
    setRejection(null)
    setError(null)
    setStatus('connecting')
    setRetryKey((k) => k + 1)
  }, [])

  const send = useCallback((body: string) => {
    const ws = wsRef.current
    if (ws?.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify({ body }))
    return true
  }, [])

  return { messages, status, error, notice: notice?.text ?? null, rejection, retry, send }
}