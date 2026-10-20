import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useOutletContext,
  useParams,
} from 'react-router'
import ArrowBack from '../assets/arrow-back.svg?react'
import Close from '../assets/close.svg?react'
import { useGet } from '../hooks/use-get'
import { useRoom } from '../hooks/use-room'
import { ApiError } from '../lib/api'
import type { CityRooms, NewsItem, RoomSummary } from '../types'
import type { ProfileContext } from './require-profile'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export function City() {
  const { name } = useOutletContext<ProfileContext>()
  const { city = '', room: roomSlug } = useParams()
  const { data, error } = useGet<CityRooms>(`/cities/${encodeURIComponent(city)}/rooms`)
  const [view, setView] = useState<'chat' | 'news'>('chat')
  const [pickerOpen, setPickerOpen] = useState(false)

  // ignore data that belongs to a previously visited city
  const rooms = data?.city.slug === city ? data.rooms : null
  const cityName = data?.city.slug === city ? data.city.name : undefined

  useEffect(() => {
    if (!pickerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pickerOpen])

  if (rooms && !roomSlug && rooms.length > 0) {
    return <Navigate to={`/city/${city}/${rooms[0].slug}`} replace />
  }

  const room = rooms?.find((r) => r.slug === roomSlug)

  const onRoomSelected = () => {
    setPickerOpen(false)
    setView('chat')
  }

  let main: ReactNode
  if (error) {
    main = (
      <Notice>
        {error instanceof ApiError && error.status === 404
          ? 'City not found'
          : 'Could not load rooms'}
      </Notice>
    )
  } else if (!rooms) {
    main = <Notice>Loading...</Notice>
  } else if (rooms.length === 0) {
    main = <Notice>No rooms yet</Notice>
  } else if (!room) {
    main = <Notice>Room not found</Notice>
  } else {
    // key = remount per room: fresh socket, fresh message list.
    // Both stay mounted on mobile, so the socket stays alive while you read news.
    main = (
      <>
        <Chat
          key={`chat:${city}/${room.slug}`}
          className={view === 'news' ? 'max-md:hidden' : ''}
          city={city}
          room={room.slug}
          name={name}
        />
        <News
          key={`news:${city}/${room.slug}`}
          className={view === 'chat' ? 'max-md:hidden' : ''}
          city={city}
          room={room.slug}
        />
      </>
    )
  }

  return (
    <div className="h-full w-full flex gap-4">
      {/* desktop sidebar */}
      <aside className="hidden md:flex h-full w-60 flex-col">
        <BackLink className="pb-4" />
        {cityName && <h1 className="pb-2 text-xl">{cityName}</h1>}
        <RoomList city={city} rooms={rooms ?? []} />
      </aside>

      <div className="flex flex-1 min-w-0 min-h-0 flex-col gap-4">
        {/* mobile bar */}
        <div className="flex flex-col gap-4 md:hidden">
          <BackLink />
          <nav className="grid grid-cols-2 gap-4">
            <button
              type="button"
              aria-haspopup="dialog"
              className="bg-green text-white border-2 border-black px-4 py-2 truncate"
              onClick={() => setPickerOpen(true)}
            >
              {room?.title ?? 'Rooms'}
            </button>
            <button
              type="button"
              className="bg-yellow border-2 border-black px-4 py-2"
              onClick={() => setView((v) => (v === 'chat' ? 'news' : 'chat'))}
            >
              {view === 'chat' ? 'News' : 'Chat'}
            </button>
          </nav>
        </div>

        {/* mobile room picker: full screen, scrolls on its own */}
        {pickerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Rooms"
            className="fixed inset-0 z-50 flex flex-col gap-4 bg-offwhite p-4 md:hidden"
          >
            <header className="flex items-center justify-between">
              <h2 className="text-xl">{cityName ?? 'Rooms'}</h2>
              <button
                type="button"
                aria-label="Close rooms"
                className="border-2 border-black bg-white p-2"
                onClick={() => setPickerOpen(false)}
              >
                <Close />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <RoomList
                city={city}
                rooms={rooms ?? []}
                onNavigate={onRoomSelected}
                itemClassName="py-3 text-lg"
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[minmax(0,1fr)] gap-4">
          {main}
        </div>
      </div>
    </div>
  )
}

// Back link, city name and room list: shared by the desktop sidebar and the mobile dropdown
function BackLink({ className = '' }: { className?: string }) {
  return (
    <nav className={className}>
      <Link to="/cities" className="flex items-center gap-2 hover:underline">
        <ArrowBack />
        <span>Back</span>
      </Link>
    </nav>
  )
}

function RoomList({
  city,
  rooms,
  onNavigate,
  itemClassName = '',
}: {
  city: string
  rooms: RoomSummary[]
  onNavigate?: () => void
  itemClassName?: string
}) {
  return (
    <nav className="flex flex-col gap-2">
      {rooms.map((r) => (
        <NavLink
          key={r.slug}
          to={`/city/${city}/${r.slug}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 bg-offwhite hover:brightness-75 ${itemClassName} ${isActive ? 'font-bold' : ''}`
          }
        >
          <span className="h-3 w-3 shrink-0 border-2 border-black bg-yellow" />
          <span>{r.title}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function Notice({ children }: { children: ReactNode }) {
  return <p className="col-span-2 opacity-60">{children}</p>
}

function Chat({ city, room, name, className = '' }: { city: string; room: string; name: string, className?: string }) {
  const location = useLocation()
  const widget = useRef<TurnstileInstance>(null)
  const pending = useRef<{ resolve: (token: string) => void; reject: (e: Error) => void } | null>(null)

  // The hook calls this before each connect. reset() makes the widget produce a fresh
  // token; if the widget isn't ready yet, its first token resolves the request instead.
  const getToken = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        pending.current = { resolve, reject }
        widget.current?.reset()
      }),
    [],
  )

  const { messages, status, error, send } = useRoom(city, room, name, getToken)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <section className={`flex flex-col gap-4 min-h-0 ${className}`}>      
      {status === 'rejected' ? (
        <p className="text-error">
          {error}.{' '}
          <Link to="/profile" state={{ from: location.pathname }} className="underline">
            Change name
          </Link>
        </p>
      ) : (
        status !== 'open' && (
          <p className="opacity-60">
            {status === 'connecting' ? 'Connecting...' : 'Reconnecting...'}
          </p>
        )
      )}

      <ul
        ref={listRef}
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
                className={`border-2 border-black px-3 py-2 whitespace-pre-wrap wrap-break-words ${
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

      <form
        className="flex gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          const body = draft.trim()
          if (body && send(body)) setDraft('')
        }}
      >
        <input
          className="w-full border-2 bg-white px-3 py-2"
          placeholder="Write message here..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          disabled={status !== 'open'}
        />
        <button
          className="bg-blue text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
          disabled={status !== 'open'}
        >
          Send
        </button>
      </form>

      <Turnstile
        ref={widget}
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
        options={{ theme: 'light', refreshExpired: 'manual', appearance: 'interaction-only' }}
        onSuccess={(token) => {
          pending.current?.resolve(token)
          pending.current = null
        }}
        onError={() => {
          pending.current?.reject(new Error('turnstile error'))
          pending.current = null
        }}
      />
    </section>
  )
}

function News({ city, room, className = '' }: { city: string; room: string, className?: string }) {
  const { data, error, loading } = useGet<NewsItem[]>(`/cities/${city}/rooms/${room}/news`)

  return (
    <section className={`min-h-0 ${className}`}>
      <div className="bg-white w-full h-full overflow-y-auto border-2 p-3 flex flex-col gap-4">
        {loading && <p className="opacity-60">Loading...</p>}
        {error && <p className="text-error">Could not load news</p>}
        {data?.length === 0 && <p className="opacity-60">No news yet</p>}
        {data?.map((item) => (
          <article key={item.id}>
            <h2 className="text-lg font-bold">{item.title}</h2>
            <time className="text-sm opacity-60">
              {new Date(item.created_at).toLocaleDateString()}
            </time>
            <p className="whitespace-pre-line wrap-break-word">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}