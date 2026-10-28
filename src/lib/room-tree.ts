import type { RoomSummary } from '../types'

export type RoomNode = RoomSummary & { children: RoomSummary[] }

const PINNED = 'general' // always first

const byTitle = (a: RoomSummary, b: RoomSummary) => a.title.localeCompare(b.title)

export const parentOf = (slug: string) => (slug.includes('_') ? slug.split('_')[0] : null)

// Top-level rooms A-Z (general first), each with its sub-rooms A-Z.
// A sub-room whose parent doesn't exist is shown as a top-level room, so nothing disappears.
export function buildRoomTree(rooms: RoomSummary[]): RoomNode[] {
  const slugs = new Set(rooms.map((r) => r.slug))
  const childrenOf = new Map<string, RoomSummary[]>()
  const tops: RoomSummary[] = []

  for (const room of rooms) {
    const parent = parentOf(room.slug)
    if (parent && slugs.has(parent)) {
      childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), room])
    } else {
      tops.push(room)
    }
  }

  return tops
    .sort((a, b) =>
      a.slug === PINNED ? -1 : b.slug === PINNED ? 1 : byTitle(a, b),
    )
    .map((room) => ({
      ...room,
      children: (childrenOf.get(room.slug) ?? []).sort(byTitle),
    }))
}

// Display order as a flat list: used for "which room opens by default"
export const flattenRooms = (tree: RoomNode[]): RoomSummary[] =>
  tree.flatMap(({ children, ...room }) => [room, ...children])