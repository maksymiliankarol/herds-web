import type { SVGProps } from "react";

const COLORS = [
  "#ff0000",
  "#ff00ff",
  "#0000ff",
  "#00ffff",
  "#00ff00",
  "#ffff00",
] as const;

type HexagonProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** Width/height of the SVG in px. */
  size?: number;
  /** Optional accessible label. Omit to mark the hexagon as decorative. */
  label?: string;
};

/**
 * Small regular hexagon (pointy-top) split into six triangles,
 * one for each color.
 */
export function Hexagon({ size = 32, label, ...props }: HexagonProps) {
  const cx = 50;
  const cy = 50;
  const r = 48;

  // Pointy-top hexagon: vertices at -90°, -30°, 30°, 90°, 150°, 210°.
  const vertices = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 90);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });

  return (
    <a href="https://metalogrom.com">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        {vertices.map(([x1, y1], i) => {
          const [x2, y2] = vertices[(i + 1) % 6];
          return (
            <polygon
              key={COLORS[i]}
              points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`}
              fill={COLORS[i]}
              // Thin same-color stroke hides anti-aliasing seams between wedges.
              stroke={COLORS[i]}
              strokeWidth={0.5}
            />
          );
        })}
      </svg>
    </a>
  );
}

export default Hexagon;