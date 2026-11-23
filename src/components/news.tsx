import { useEffect, useState } from "react";
import { get } from "../api";

type Item = { id: number; content: string; created_at: string };

export default function News({ roomId }: { roomId: string }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    get<Item[]>(`/news?room_id=${roomId}`, ctrl.signal)
      .then(setItems)
      .catch((e) => {
        if (!ctrl.signal.aborted) setError(e.message);
      });
    return () => ctrl.abort();
  }, [roomId]);

  return (
    <div className="news scroll column">
      {error && <p>{error}</p>}
      {!items && !error && <p>Loading...</p>}
      {items?.length === 0 && <p>No news yet</p>}
      {items?.map((n) => (
        <article key={n.id} className="news-item column">
          <p>{n.content}</p>
          {/* SQLite timestamps are UTC without a zone marker */}
          <small>{new Date(n.created_at.replace(" ", "T") + "Z").toLocaleDateString()}</small>
        </article>
      ))}
    </div>
  );
}