import { useEffect, useState } from 'react'
import { get } from '../lib/api'

type State<T> = { data: T | null; error: Error | null; loading: boolean }

export function useGet<T>(path: string) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    get<T>(path, controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setState({ data: null, error, loading: false })
      })

    return () => controller.abort()
  }, [path])

  return state
}