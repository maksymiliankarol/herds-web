const timeOnly = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
const dateAndTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

// today: just the time; anything older: date and time
export function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp)
  const isToday = date.toDateString() === new Date().toDateString()
  return (isToday ? timeOnly : dateAndTime).format(date)
}