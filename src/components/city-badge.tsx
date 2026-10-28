import type { ReactNode } from 'react'
import { badgeFor, type Shape } from '../lib/city-badge'

// Record<Shape, ...> makes TypeScript fail the build if a shape is added
// to SHAPES without a drawing here.
const SHAPE_ELEMENTS: Record<Shape, ReactNode> = {
  square: <rect x="1" y="1" width="22" height="22" />,
  circle: <circle cx="12" cy="12" r="11" />,
  triangle: <polygon points="12,2 22.5,22 1.5,22" />,
}

interface CityBadgeProps {
  slug: string
  className?: string
}

export function CityBadge({ slug, className = '' }: CityBadgeProps) {
  const { color, shape } = badgeFor(slug)

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      strokeLinejoin="round"
      className={`size-6 shrink-0 stroke-black stroke-2 ${color} ${className}`}
    >
      {SHAPE_ELEMENTS[shape]}
    </svg>
  )
}