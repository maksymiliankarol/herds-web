import { Link } from "react-router";
import type { City, ErrorKind, Room } from "../lib/api";
import { useLocale } from "../locales";

type Props = { 
  city: City | null;
  rooms: Room[] | null; 
  error: ErrorKind | null; 
  onSelect: () => void 
};

// Pinned first, in every language we serve. "food_chinese" sorts right after "food", so a sorted flat list already reads as a tree
const GENERAL = new Set(["general", "ogólne"]);
const isGeneral = (r: Room) => GENERAL.has(r.title.toLowerCase());
const byTitle = (a: Room, b: Room) =>
  Number(isGeneral(b)) - Number(isGeneral(a)) || a.title.localeCompare(b.title);

export default function RoomList({ city, rooms, error, onSelect }: Props) {
  const { t } = useLocale();

  return (
    <section className="scroll rooms">
      {city && <strong>{city.title}</strong>}
      {error && <p>{t.errors[error]}</p>}
      {rooms?.length === 0 && <p>{t.city.noRooms}</p>}
      <ul>
        {rooms?.toSorted(byTitle).map((r) => {
          const parts = r.title.split("_");
          return (
            <li key={r.id} style={{ marginLeft: `${parts.length - 1}rem` }}>
              <Link to={`?room=${r.id}`} onClick={onSelect}>{parts.at(-1)}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}