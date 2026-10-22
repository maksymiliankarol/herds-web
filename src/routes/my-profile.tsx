import { useState, type SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChildLayout } from '../layouts/child-layout'
import { getProfileName, isValidName, setProfileName } from '../lib/profile'

export function MyProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/cities'

  const [name, setName] = useState(() => getProfileName() ?? '')
  const [error, setError] = useState<string | null>(null)

const save = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = name.trim()
    if (!isValidName(value)) {
      setError('2-20 characters: letters, digits, _ or -')
      return
    }
    setProfileName(value)
    navigate(from, { replace: true }) // back to where the redirect came from
  }

  return (
    <ChildLayout size="xs">
      <form className="flex flex-col gap-4" onSubmit={save}>
        <div className='flex flex-col gap-2'>
          <label className='font-bold'>Your name</label>
          <input
            aria-label="Your name"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'name-error' : undefined}
            placeholder="Enter your name here..."
            className="w-full border-2 px-3 py-2 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
        </div>
        {error && (
          <p id="name-error" role="alert" className="text-error">
            {error}
          </p>
        )}
        <button className="bg-green text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50">
          Save
        </button>
      </form>
    </ChildLayout>
  )
}