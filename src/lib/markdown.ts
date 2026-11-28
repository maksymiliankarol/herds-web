// Supported: paragraphs, "- " / "* " bullets, **bold**, *italic*, [text](https://link)
export type Inline =
  | { type: "text"; text: string }
  | { type: "bold" | "italic"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "p"; children: Inline[] }
  | { type: "ul"; items: Inline[][] };

// link | bold | italic (the opening * must be followed by a non-space)
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(\S(?:.*?\S)?)\*\*|\*(\S(?:.*?\S)?)\*/g;

// Only absolute http(s) links. This rejects javascript:, data:, relative URLs, etc.
function safeUrl(href: string): string | null {
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function parseInline(text: string): Inline[] {
  const nodes: Inline[] = [];
  let last = 0;

  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) nodes.push({ type: "text", text: text.slice(last, m.index) });

    const href = m[1] ? safeUrl(m[2]) : null;
    if (m[1] && href) nodes.push({ type: "link", href, children: parseInline(m[1]) });
    else if (m[3]) nodes.push({ type: "bold", children: parseInline(m[3]) });
    else if (m[4]) nodes.push({ type: "italic", children: parseInline(m[4]) });
    else nodes.push({ type: "text", text: m[0] }); // link with an unsafe URL stays plain text

    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push({ type: "text", text: text.slice(last) });
  return nodes;
}

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", children: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };

  for (const raw of source.split("\n")) {
    const line = raw.trim();
    const bullet = /^[-*] +(.+)$/.exec(line);

    if (bullet) {
      flush();
      const last = blocks.at(-1);
      const item = parseInline(bullet[1]);
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    } else if (line === "") {
      flush();
    } else {
      paragraph.push(line);
    }
  }

  flush();
  return blocks;
}