export type Inline =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: Inline[] }
  | { type: 'italic'; children: Inline[] }
  | { type: 'link'; label: string; href: string }
  | { type: 'button'; label: string; href: string }
  | { type: 'br' }

// A paragraph is a list of inline pieces
export type Paragraph = Inline[]

// One regex, three alternatives, tried left to right at each position:
//   **bold**  |  *italic*  |  [label](url)
// Italic must not start or end with a space, so "2 * 3 * 4" stays as written.
// Alternatives, tried left to right at each position:
//   [[button]](url)  |  **bold**  |  *italic*  |  [label](url)
const INLINE =
  /\[\[([^\]]+)\]\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*([^\s*](?:[^*]*[^\s*])?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

// Only http(s) links are allowed: no javascript:, data:, etc.
function isSafeUrl(href: string) {
  try {
    const { protocol } = new URL(href)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let last = 0

  for (const m of text.matchAll(INLINE)) {
    const [whole, buttonLabel, buttonHref, bold, italic, label, href] = m
    const start = m.index ?? 0

    if (start > last) out.push({ type: 'text', text: text.slice(last, start) })

    if (buttonLabel !== undefined) {
      if (isSafeUrl(buttonHref)) out.push({ type: 'button', label: buttonLabel, href: buttonHref })
      else out.push({ type: 'text', text: whole })
    } else if (bold !== undefined) {
      out.push({ type: 'bold', children: parseInline(bold) })
    } else if (italic !== undefined) {
      out.push({ type: 'italic', children: parseInline(italic) })
    } else if (isSafeUrl(href)) {
      out.push({ type: 'link', label, href })
    } else {
      out.push({ type: 'text', text: whole })
    }

    last = start + whole.length
  }

  if (last < text.length) out.push({ type: 'text', text: text.slice(last) })
  return out
}

export function parseMarkdown(source: string): Paragraph[] {
  return source
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/) // blank line = new paragraph
    .filter(Boolean)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .flatMap((line, i) =>
          i === 0 ? parseInline(line) : [{ type: 'br' } as const, ...parseInline(line)],
        ),
    )
}