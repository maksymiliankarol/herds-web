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
import { buildRoomTree, flattenRooms, parentOf, type RoomNode } from '../lib/room-tree'
import { useI18n } from '../lib/i18n-context'

export function City() {
  const { t } = useI18n()
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

  const tree = rooms ? buildRoomTree(rooms) : []

  if (rooms && !roomSlug && rooms.length > 0) {
    return <Navigate to={`/city/${city}/${flattenRooms(tree)[0].slug}`} replace />
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
        {describeError(t, error, t.city.couldNotLoadRooms, { 404: t.city.cityNotFound })}
      </Notice>
    )
  } else if (!rooms) {
    main = <Notice>{t.common.loading}</Notice>
  } else if (rooms.length === 0) {
    main = <Notice>{t.city.noRooms}</Notice>
  } else if (!room) {
    main = <Notice>{t.city.roomNotFound}</Notice>
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
        {cityName && <h1 className="pb-4 text-xl">{cityName}</h1>}
        <RoomList city={city} tree={tree} />
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
              {room?.title ?? t.city.rooms}
            </button>
            <button
              type="button"
              className="bg-yellow border-2 border-black px-4 py-2"
              onClick={() => setView((v) => (v === 'chat' ? 'news' : 'chat'))}
            >
              {view === 'chat' ? t.city.news : t.city.chat}
            </button>
          </nav>
        </div>

        {/* mobile room picker: full screen, scrolls on its own */}
        <dialog
          ref={pickerRef}
          aria-label={t.city.rooms}
          onClose={() => setPickerOpen(false)}
          className="m-0 size-full max-h-none max-w-none flex-col gap-4 bg-offwhite p-4 text-foreground open:flex md:hidden"
        >
          <header className="flex items-center justify-between">
            <h2 className="text-xl">{cityName ?? t.city.rooms}</h2>
            <button
              type="button"
              aria-label={t.city.closeRooms}
              className="border-2 border-black bg-white p-2"
              onClick={() => setPickerOpen(false)}
            >
              <Close />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <RoomList
              city={city}
              tree={tree}
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
  const { t } = useI18n()
  return (
    <nav className={className}>
      <Link to="/cities" className="flex items-center gap-2 hover:underline">
        <ArrowBack />
        <span>{t.common.back}</span>
      </Link>
    </nav>
  )
}

function Marker({ shape }: { shape: 'square' | 'right' | 'down' }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      strokeLinejoin="round"
      className="size-3 shrink-0 fill-yellow stroke-black stroke-2"
    >
      {shape === 'square' && <rect x="1" y="1" width="8" height="8" />}
      {shape === 'right' && <polygon points="1,1 11,6 1,11" />}
      {shape === 'down' && <polygon points="1,1 11,1 6,11" />}
    </svg>
  )
}

function RoomList({
  city,
  tree,
  onNavigate,
  itemClassName = '',
}: {
  city: string
  tree: RoomNode[]
  onNavigate?: () => void
  itemClassName?: string
}) {
  const { t } = useI18n()
  const { room: activeSlug } = useParams()
  const activeParent = activeSlug ? parentOf(activeSlug) : null

  // slugs of expanded parents; the parent of the active room starts open
  const [open, setOpen] = useState<Set<string>>(() => new Set(activeParent ? [activeParent] : []))

  // navigating into a sub-room (link, redirect, back button) opens its parent,
  // but never closes anything, so a manual collapse isn't undone
  useEffect(() => {
    if (!activeParent) return
    setOpen((prev) => (prev.has(activeParent) ? prev : new Set(prev).add(activeParent)))
  }, [activeParent])

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (!next.delete(slug)) next.add(slug)
      return next
    })

  const row = (r: RoomSummary, opts: { child?: boolean; children?: RoomSummary[] } = {}) => {
    const hasChildren = !!opts.children?.length
    const expanded = open.has(r.slug)

    return (
      <div key={r.slug} className={`flex items-center gap-2 ${opts.child ? 'pl-5' : ''}`}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggle(r.slug)}
            aria-expanded={expanded}
            aria-controls={`subrooms-${r.slug}`}
            aria-label={expanded ? t.city.collapseRoom(r.title) : t.city.expandRoom(r.title)}
            className="flex items-center self-stretch px-1 cursor-pointer hover:brightness-75"
          >
            <Marker shape={expanded ? 'down' : 'right'} />
          </button>
        ) : (
          <span className="flex items-center self-stretch px-1">
            <Marker shape="square" />
          </span>
        )}
        <NavLink
          to={`/city/${city}/${r.slug}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex-1 min-w-0 bg-offwhite hover:brightness-75 ${itemClassName} ${isActive ? 'font-bold' : ''}`
          }
        >
          {r.title}
        </NavLink>
      </div>
    )
  }

  return (
    <nav className="flex flex-col gap-2">
      {tree.map((room) => (
        <div key={room.slug} className="flex flex-col gap-2">
          {row(room, { children: room.children })}
          {room.children.length > 0 && open.has(room.slug) && (
            <div id={`subrooms-${room.slug}`} className="flex flex-col gap-2">
              {room.children.map((child) => row(child, { child: true }))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <p className={`col-span-2 ${error ? 'text-error' : 'opacity-60'}`}>{children}</p>
}