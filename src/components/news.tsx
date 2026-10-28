import { useGet } from '../hooks/use-get'
import { describeError } from '../lib/errors'
import { formatNewsDate } from '../lib/format'
import type { NewsItem } from '../types'
import { Markdown } from './markdown'

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
      <div className="w-full h-full overflow-y-auto  flex flex-col gap-4">
        {loading && <p className="opacity-60">Loading...</p>}
        {error && <p className="text-error">{describeError(error, 'Could not load news')}</p>}
        {data?.length === 0 && <p className="opacity-60">No news yet</p>}
        {data?.map((item) => (
          <article key={item.id} className='p-4 bg-white border-2'>
            <header className='flex items-center gap-4 justify-between pb-4'>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <time className="text-sm opacity-60">
                {formatNewsDate(item.created_at)}
              </time>
            </header>
            <Markdown>{item.body}</Markdown>
          </article>
        ))}
      </div>
    </section>
  )
}