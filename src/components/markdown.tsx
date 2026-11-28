import { parseMarkdown, type Inline } from "../lib/markdown";

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case "text":
            return n.text;
          case "bold":
            return <strong key={i}><Inlines nodes={n.children} /></strong>;
          case "italic":
            return <em key={i}><Inlines nodes={n.children} /></em>;
          case "link":
            return (
              <a key={i} href={n.href} target="_blank" rel="noopener noreferrer nofollow ugc">
                <Inlines nodes={n.children} />
              </a>
            );
        }
      })}
    </>
  );
}

export default function Markdown({ text }: { text: string }) {
  return (
    <>
      {parseMarkdown(text).map((b, i) =>
        b.type === "p" ? (
          <p key={i}><Inlines nodes={b.children} /></p>
        ) : (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}><Inlines nodes={item} /></li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}