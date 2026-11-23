import { useEffect, useState } from "react";
import { Link } from "react-router";
import { get } from "../api";

type City = { id: number; title: string; country_code: string };

export default function Cities() {
  const [q, setQ] = useState("");
  const [cities, setCities] = useState<City[] | null>(null); // null = nothing searched yet
  const [error, setError] = useState("");

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setCities(null);
      return;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      get<City[]>(`/cities?q=${encodeURIComponent(query)}`, ctrl.signal)
        .then((result) => {
          setCities(result);
          setError("");
        })
        .catch((e) => {
          if (!ctrl.signal.aborted) setError(e.message);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q]);

  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      <label>
        City
        <input
          placeholder="Warsaw..."
          maxLength={100}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      {cities?.length === 0 && <p>No cities found</p>}
      {cities && cities.length > 0 && (
        <ul>
          {cities.map((c) => (
            <li key={c.id}>
              <Link to={`/city/${c.id}`}>
                {c.title} ({c.country_code})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}