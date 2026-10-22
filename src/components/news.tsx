import { useGet } from '../hooks/use-get'
import { describeError } from '../lib/errors'
import type { NewsItem } from '../types'

interface NewsProps {
  city: string
  room: string
  className?: string
}

export function News({ city, room, className = '' }: NewsProps) {
  const { data, error, loading } = useGet<NewsItem[]>(
    `/cities/${encodeURIComponent(city)}/rooms/${encodeURIComponent(room)}/news`,
  )

  return (
    <section className={`min-h-0 ${className}`}>
      <div className="bg-white w-full h-full overflow-y-auto border-2 p-3 flex flex-col gap-4">
        {loading && <p className="opacity-60">Loading...</p>}
        {error && <p className="text-error">{describeError(error, 'Could not load news')}</p>}
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