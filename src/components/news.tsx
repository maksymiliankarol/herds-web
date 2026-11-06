import { useEffect, useState } from "react";
import { getErrorKind, getNews, type ErrorKind, type NewsItem } from "../lib/api";
import { formatDate } from "../lib/date";
import { useLocale } from "../locales";
import Markdown from "./markdown";

export default function News({ roomId }: { roomId: number }) {
  const { t, lang } = useLocale();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<ErrorKind | null>(null);

  useEffect(() => {
    let ignore = false;
    setItems(null);
    setError(null);
    getNews(roomId)
      .then((result) => {
        if (!ignore) setItems(result);
      })
      .catch((e) => {
        if (!ignore) setError(getErrorKind(e));
      });

    return () => {
      ignore = true;
    };
  }, [roomId]);

  return (
    <section className="scroll news">
      {error && <p>{t.errors[error]}</p>}
      {items?.length === 0 && <p>{t.city.noNews}</p>}
      <div className="column">
        {items?.map((n) => (
          <article key={n.id} className="news-item column">
            <h2 className="news-title">{n.title}</h2>
            <p className="news-content"><Markdown text={n.content} /></p>
            <small className="news-date">{formatDate(n.created_at, lang)}</small>
          </article>
        ))}
      </div>
    </section>
  );
}