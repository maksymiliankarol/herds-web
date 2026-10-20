import { useEffect, useState } from 'react'
import { get } from '../lib/api'
import type { City } from '../types'

export function useCities(query: string) {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    // debounce typing; the initial list and a cleared search load immediately
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await get<City[]>(
          `/cities?q=${encodeURIComponent(query.trim())}`,
          controller.signal,
        )
        setCities(data)
        setError(null)
      } catch (e) {
        if (controller.signal.aborted) return // superseded by a newer request
        setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, query ? 250 : 0)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { cities, loading, error }
}