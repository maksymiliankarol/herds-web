import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, NavLink, useOutletContext, useParams } from 'react-router'
import ArrowBack from '../assets/arrow-back.svg?react'
import Close from '../assets/close.svg?react'
import { useGet } from '../hooks/use-get'
import type { CityRooms, RoomSummary } from '../types'
import type { ProfileContext } from './require-profile'
import { Chat } from '../components/chat'
import { News } from '../components/news'
import { describeError } from '../lib/errors'

export function City() {
  const { name } = useOutletContext<ProfileContext>()
  const { city = '', room: roomSlug } = useParams()
  const { data, error } = useGet<CityRooms>(`/cities/${encodeURIComponent(city)}/rooms`)
  const [view, setView] = useState<'chat' | 'news'>('chat')
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDialogElement>(null)

  // ignore data that belongs to a previously visited city
  const rooms = data?.city.slug === city ? data.rooms : null
  const cityName = data?.city.slug === city ? data.city.name : undefined

  // open/close the native dialog to match state; Escape is handled natively (see onClose)
  useEffect(() => {
    const dialog = pickerRef.current
    if (!dialog) return
    if (pickerOpen && !dialog.open) dialog.showModal()
    if (!pickerOpen && dialog.open) dialog.close()
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
      <Notice error>
        {describeError(error, 'Could not load rooms', { 404: 'City not found' })}
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
        <dialog
          ref={pickerRef}
          aria-label="Rooms"
          onClose={() => setPickerOpen(false)}
          className="m-0 size-full max-h-none max-w-none flex-col gap-4 bg-offwhite p-4 text-foreground open:flex md:hidden"
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
        </dialog>

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

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <p className={`col-span-2 ${error ? 'text-error' : 'opacity-60'}`}>{children}</p>
}