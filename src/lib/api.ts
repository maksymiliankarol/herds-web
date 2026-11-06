import type { Messages } from "../locales/en";

const API_URL = import.meta.env.VITE_API_URL as string;

export type City = {
  id: number;
  city: string;
  city_label: string;
  country_code: string;
};

export type Room = {
  id: number;
  title: string;
  created_at: string;
};

export type NewsItem = {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export type ErrorKind = keyof Messages["errors"];

export type ChatEvent =
  | { type: "message"; username: string; text: string }
  | { type: "error"; error: string };

export type ServerEvent = ChatEvent | { type: "online"; count: number };

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`API error ${status}`);
    this.status = status;
  }
};

export function getErrorKind(err: unknown): ErrorKind {
  if (err instanceof ApiError) {
    if (err.status === 404) return "notFound";
    if (err.status === 400) return "badRequest";
    if (err.status === 429) return "tooManyRequests";
  }
  return "generic";
};

export async function searchCities(q: string): Promise<City[]> {
  const res = await fetch(`${API_URL}/cities?${new URLSearchParams({ q })}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
};

export async function getRooms(cityId: number): Promise<Room[]> {
  const res = await fetch(`${API_URL}/rooms?${new URLSearchParams({ city_id: String(cityId) })}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
};

export function chatUrl(roomId: number, username: string) {
  return `${API_URL.replace(/^http/, "ws")}/chat/${roomId}?${new URLSearchParams({ username })}`;
};

export async function getNews(roomId: number): Promise<NewsItem[]> {
  const res = await fetch(`${API_URL}/news?${new URLSearchParams({ room_id: String(roomId) })}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
};