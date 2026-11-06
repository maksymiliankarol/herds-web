import type { ReactNode } from "react";
import { parse, type MdNode } from "../lib/markdown";

function render(nodes: MdNode[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return n.text;
      case "bold":
        return <strong key={i}>{render(n.children)}</strong>;
      case "italic":
        return <em key={i}>{render(n.children)}</em>;
      case "link":
        return (
          <a key={i} href={n.href} target="_blank" rel="noopener noreferrer">
            {render(n.children)}
          </a>
        );
      case "button":
        return (
          <a key={i} className="button" href={n.href} target="_blank" rel="noopener noreferrer">
            {render(n.children)}
          </a>
        );
    }
  });
}

export default function Markdown({ text }: { text: string }) {
  return <>{render(parse(text))}</>;
}