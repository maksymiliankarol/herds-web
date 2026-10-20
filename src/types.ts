export type Room = { name: string; title: string; created_at: number }

export type Message = { id: number; author: string; body: string; created_at: number }

export type ServerEvent =
  | { type: 'history'; messages: Message[] }
  | { type: 'message'; message: Message }
  | { type: 'error'; error: string }
  | { type: 'rejected'; code: number; error: string }

export type City = { slug: string; name: string; country_code: string; country_name: string }

export type RoomSummary = { slug: string; title: string }

export type CityRooms = { city: Pick<City, 'slug' | 'name'>; rooms: RoomSummary[] }

export type NewsItem = { id: number; title: string; body: string; created_at: number }