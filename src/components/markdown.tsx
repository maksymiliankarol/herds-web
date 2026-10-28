import type { ReactNode } from 'react'
import { parseMarkdown, type Inline } from '../lib/markdown'

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return node.text
      case 'br':
        return <br key={i} />
      case 'bold':
        return <strong key={i} className="font-bold">{renderInline(node.children)}</strong>
      case 'italic':
        return <em key={i} className="italic">{renderInline(node.children)}</em>
      case 'link':
        return (
          <a
            key={i}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:decoration-2"
          >
            {node.label}
          </a>
        )
      case 'button':
        return (
          <a
            key={i}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue text-white border-2 border-black px-4 py-2 no-underline hover:brightness-75"
          >
            {node.label}
          </a>
        )
    }
  })
}

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  const paragraphs = parseMarkdown(children)

  return (
    <div className={`flex flex-col gap-2 wrap-break-word ${className}`}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{renderInline(paragraph)}</p>
      ))}
    </div>
  )
}