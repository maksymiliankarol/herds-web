export const SHAPES = ['square', 'circle', 'triangle'] as const
export type Shape = (typeof SHAPES)[number]

// full class names, so Tailwind can see them
export const COLORS = ['fill-yellow', 'fill-blue', 'fill-green'] as const
export type Color = (typeof COLORS)[number]

// FNV-1a: a small, well-spread string hash
function hash(text: string): number {
  let h = 2166136261
  for (const ch of text) {
    h ^= ch.codePointAt(0)!
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Stable color and shape per city, derived from its slug.
// Color uses the hash directly, shape uses the part left over after dividing
// by the number of colors, so the two vary independently (9 combinations).
export function badgeFor(slug: string): { color: Color; shape: Shape } {
  const h = hash(slug)
  return {
    color: COLORS[h % COLORS.length],
    shape: SHAPES[Math.floor(h / COLORS.length) % SHAPES.length],
  }
}