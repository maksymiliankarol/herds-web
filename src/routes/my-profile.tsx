import { useState, type SubmitEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ChildLayout } from '../layouts/child-layout'
import { getProfileName, isReservedName, isValidName, setProfileName } from '../lib/profile'
import { useI18n } from '../lib/i18n-context'

export function MyProfile() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/cities'

  const [name, setName] = useState(() => getProfileName() ?? '')
  const [error, setError] = useState<'nameReserved' | 'nameInvalid' | null>(null)

  const save = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = name.trim()
    if (!isValidName(value)) {
      setError(isReservedName(value) ? 'nameReserved' : 'nameInvalid')
      return
    }
    setProfileName(value)
    navigate(from, { replace: true }) // back to where the redirect came from
  }

  return (
    <ChildLayout size="xs">
      <form className="flex flex-col gap-4" onSubmit={save}>
        <div className='flex flex-col gap-2'>
          <label className='font-bold'>{t.myProfile.nameLabel}</label>
          <input
            aria-label={t.myProfile.nameLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'name-error' : undefined}
            placeholder={t.myProfile.namePlaceholder}
            className="w-full border-2 px-3 py-2 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
        </div>
        <p className="opacity-60">
          {t.myProfile.publicNotice}{" "}
          {t.myProfile.acceptBefore}
          <Link to="/terms-of-service" className="underline">
            {t.myProfile.terms}
          </Link>
          {t.myProfile.acceptMiddle}
          <Link to="/privacy-policy" className="underline">
            {t.myProfile.privacy}
          </Link>
          {t.myProfile.acceptAfter}
        </p>
        {error && (
          <p id="name-error" role="alert" className="text-error">
            {t.myProfile[error]}
          </p>
        )}
        <button className="bg-green text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50">
          {t.myProfile.save}
        </button>
      </form>
    </ChildLayout>
  )
}