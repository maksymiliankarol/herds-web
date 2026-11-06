import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErrorKind, searchCities, type City, type ErrorKind } from "../lib/api";
import { useLocale } from "../locales";

export default function Cities() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[] | null>(null);
  const [error, setError] = useState<ErrorKind | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setCities(null);
      setError(null);
      return;
    }

    let ignore = false;
    const timer = setTimeout(() => {
      searchCities(q)
        .then((result) => {
          if (ignore) return;
          setCities(result);
          setError(null);
        })
        .catch((e) => {
          if (!ignore) setError(getErrorKind(e));
        });
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{t.cities.title}</h1>
          <p>{t.cities.intro}</p>
        </section>
        <section className="column">
          <input
            placeholder={t.cities.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {error && <p>{t.errors[error]}</p>}
          {cities?.length === 0 && <p>{t.cities.noResults}</p>}
          <ul>
            {cities?.map((c) => (
              <li key={c.id}>
                <Link to={`/city/${c.id}`}>{c.city_label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}