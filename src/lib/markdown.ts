export type MdNode =
  | { type: "text"; text: string }
  | { type: "bold" | "italic"; children: MdNode[] }
  | { type: "link" | "button"; href: string; children: MdNode[] };

// [[button]](url) | [link](url) | **bold** | *italic*, matched left to right
const INLINE =
  /\[\[(?<btn>[^\]]+)\]\]\((?<btnUrl>[^)\s]+)\)|\[(?<link>[^\]]+)\]\((?<linkUrl>[^)\s]+)\)|\*\*(?<bold>.+?)\*\*|\*(?<italic>.+?)\*/g;

// Only absolute http(s) links; anything else (javascript:, data:, relative) is not linked
function safeUrl(url: string) {
  try {
    const { protocol, href } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? href : null;
  } catch {
    return null;
  }
}

function linkNodes(type: "link" | "button", label: string, url: string): MdNode[] {
  const children = parse(label);
  const href = safeUrl(url);
  return href ? [{ type, href, children }] : children;
}

export function parse(text: string): MdNode[] {
  const nodes: MdNode[] = [];
  let last = 0;

  for (const m of text.matchAll(INLINE)) {
    const { btn, btnUrl, link, linkUrl, bold, italic } = m.groups!;
    if (m.index > last) nodes.push({ type: "text", text: text.slice(last, m.index) });

    if (btn !== undefined) nodes.push(...linkNodes("button", btn, btnUrl));
    else if (link !== undefined) nodes.push(...linkNodes("link", link, linkUrl));
    else if (bold !== undefined) nodes.push({ type: "bold", children: parse(bold) });
    else nodes.push({ type: "italic", children: parse(italic) });

    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push({ type: "text", text: text.slice(last) });
  return nodes;
}