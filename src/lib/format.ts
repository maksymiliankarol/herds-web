const timeOnly = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const dateAndTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

// today: just the time; anything older: date and time
export function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp)
  const isToday = date.toDateString() === new Date().toDateString()
  return (isToday ? timeOnly : dateAndTime).format(date)
}

// news cards: date only, same style as the chat ("Oct 17, 2026")
export function formatNewsDate(timestamp: number) {
  return dateOnly.format(new Date(timestamp))
}