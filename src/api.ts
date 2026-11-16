const API_URL = import.meta.env.VITE_API_URL ?? "https://herds-api.metalogrom.com";

export const WS_URL = API_URL.replace(/^http/, "ws");

export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(API_URL + path, { signal });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? res.statusText);
  return res.json();
}