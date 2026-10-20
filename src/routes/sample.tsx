import { useEffect, useRef, useState } from 'react'
import { useRoom } from '../hooks/use-room'

const CITY = 'warsaw'
const SLUG = 'general'
const NAME_KEY = 'herds:name'

export function Sample() {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')

  if (!name) {
    return (
      <NameForm
        onSubmit={(n) => {
          localStorage.setItem(NAME_KEY, n)
          setName(n)
        }}
      />
    )
  }

  return (
    <Chat
      name={name}
      onChangeName={() => {
        localStorage.removeItem(NAME_KEY)
        setName('')
      }}
    />
  )
}

function NameForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <form
      className="mx-auto flex max-w-sm flex-col gap-2 p-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value.trim())
      }}
    >
      <label htmlFor="name">Pick a name</label>
      <input
        id="name"
        className="border p-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minLength={2}
        maxLength={20}
        required
        autoFocus
      />
      <button className="border p-2">Join</button>
    </form>
  )
}

function Chat({ name, onChangeName }: { name: string; onChangeName: () => void }) {
  const { messages, status, error, send } = useRoom(CITY, SLUG, name)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col gap-2 p-4">
      <header className="flex items-center justify-between">
        <span>
          {CITY}/{SLUG} · {name} · {status}
        </span>
        <button className="underline" onClick={onChangeName}>
          change name
        </button>
      </header>

      {error && <p className="text-error">{error}</p>}

      <ul className="flex-1 overflow-y-auto border p-2">
        {messages.map((m) => (
          <li key={m.id}>
            <b>{m.author}</b>{' '}
            <small>{new Date(m.created_at).toLocaleTimeString()}</small>
            <div>{m.body}</div>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.trim() && send(draft.trim())) setDraft('')
        }}
      >
        <input
          className="flex-1 border p-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={status !== 'open'}
          maxLength={2000}
        />
        <button className="border p-2" disabled={status !== 'open'}>
          Send
        </button>
      </form>
    </div>
  )
}