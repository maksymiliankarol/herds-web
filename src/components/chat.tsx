import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Turnstile } from '@marsidev/react-turnstile'
import { useRoom } from '../hooks/use-room'
import { useStickToBottom } from '../hooks/use-stick-to-bottom'
import { useTurnstileToken } from '../hooks/use-turnstile-token'

const MAX_BODY = 2000 // must match the server (Room)

interface ChatProps {
  city: string
  room: string
  name: string
  className?: string
}

export function Chat({ city, room, name, className = '' }: ChatProps) {
  const location = useLocation()
  const { getToken, widgetProps } = useTurnstileToken()
  const { messages, status, error, notice, rejection, retry, send } = useRoom(
    city,
    room,
    name,
    getToken,
  )
  const { ref: listRef, onScroll, jumpToEnd } = useStickToBottom<HTMLUListElement>(messages)
  const [draft, setDraft] = useState('')
  
  // Don't read the whole history aloud on connect: announce only what arrives afterwards
  const [announce, setAnnounce] = useState(false)
  useEffect(() => {
    if (status !== 'open') {
      setAnnounce(false)
      return
    }
    const timer = window.setTimeout(() => setAnnounce(true), 500)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <section className={`flex flex-col gap-4 min-h-0 ${className}`}>
      {status === 'rejected' && rejection ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-error first-letter:uppercase">{rejection.message}</p>
          {rejection.actions.includes('retry') && (
            <button
              type="button"
              className="bg-yellow border-2 border-black px-3 py-1 cursor-pointer hover:brightness-75"
              onClick={retry}
            >
              Try again
            </button>
          )}
          {rejection.actions.includes('change-name') && (
            <Link to="/profile" state={{ from: location.pathname }} className="underline">
              Change name
            </Link>
          )}
        </div>
      ) : (
        status !== 'open' && (
          <>
            <p className="opacity-60">
              {status === 'connecting' ? 'Connecting...' : 'Reconnecting...'}
            </p>
            {error && <p className="text-error first-letter:uppercase">{error}</p>}
          </>
        )
      )}

      <ul
        ref={listRef}
        onScroll={onScroll}
        role="log"
        aria-label="Messages"
        aria-live={announce ? 'polite' : 'off'}
        className="bg-white w-full flex-1 min-h-0 overflow-y-auto border-2 p-3 flex flex-col gap-3"
      >
        {messages.map((m) => {
          const mine = m.author === name // later: m.author_key === myKey

          return (
            <li
              key={m.id}
              className={`flex flex-col max-w-2/3 ${mine ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {!mine && <b className="text-sm">{m.author}</b>}
              <div
                className={`border-2 border-black px-3 py-2 whitespace-pre-wrap wrap-break-word ${
                  mine ? 'bg-blue text-white' : 'bg-offwhite'
                }`}
              >
                {m.body}
              </div>
              <small className="opacity-60">{new Date(m.created_at).toLocaleTimeString()}</small>
            </li>
          )
        })}
      </ul>

      {notice && (
        <p role="alert" className="text-error first-letter:uppercase">
          {notice}
        </p>
      )}

      <form
        className="flex gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          const body = draft.trim()
          if (body && send(body)) {
            setDraft('')
            jumpToEnd() // your own message always scrolls into view
          }
        }}
      >
        <input
          className="w-full border-2 bg-white px-3 py-2"
          placeholder="Write message here..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_BODY}
          disabled={status !== 'open'}
        />
        <button
          className="bg-blue text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
          disabled={status !== 'open'}
        >
          Send
        </button>
      </form>

      <div className="fixed right-4 bottom-4 z-50">
        <Turnstile {...widgetProps} />
      </div>
    </section>
  )
}