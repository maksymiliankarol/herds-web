import { useState } from 'react'
import { Link } from 'react-router'
import { ChildLayout } from '../layouts/child-layout'
import { useCities } from '../hooks/use-cities'
import { CityBadge } from '../components/city-badge'
import { useI18n } from '../lib/i18n-context'


export function Cities() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const { cities, loading, error } = useCities(query)

  return (
    <ChildLayout>
      <div className="flex flex-col gap-4">
        <input
          type="search"
          aria-label={t.cities.searchLabel}
          placeholder={t.cities.searchPlaceholder}
          className="w-full border-2 p-3 bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {error && <p className="text-error">{error}</p>}

        <section className="flex flex-col gap-4 w-full">
          {cities.map((city) => (
            <Link
              key={city.slug}
              to={`/city/${city.slug}`}
              className="flex items-center gap-4 w-full bg-offwhite hover:brightness-75"
            >
              <CityBadge slug={city.slug} />
              <p className="text-lg">{city.name}</p>
              <p className="opacity-60">{city.country_name}</p>
            </Link>
          ))}

          {!loading && !error && cities.length === 0 && (
            <p className="opacity-60">{t.cities.noCities}</p>
          )}
        </section>
      </div>
    </ChildLayout>
  )
}