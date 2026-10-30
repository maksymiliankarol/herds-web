import type { Lang } from './locale'

const STYLES = {
  time: { timeStyle: 'short' },
  date: { dateStyle: 'medium' },
  dateTime: { dateStyle: 'medium', timeStyle: 'short' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

// one formatter per language and style, created on first use
const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(lang: Lang, style: keyof typeof STYLES) {
  const key = `${lang}:${style}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(lang, STYLES[style])
    cache.set(key, f)
  }
  return f
}

// today: just the time; anything older: date and time
export function formatMessageTime(timestamp: number, lang: Lang) {
  const date = new Date(timestamp)
  const isToday = date.toDateString() === new Date().toDateString()
  return formatter(lang, isToday ? 'time' : 'dateTime').format(date)
}

// news cards: date only ("Oct 17, 2026" / "17 paź 2026")
export function formatNewsDate(timestamp: number, lang: Lang) {
  return formatter(lang, 'date').format(new Date(timestamp))
}