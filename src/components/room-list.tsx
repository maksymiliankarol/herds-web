import { Link } from "react-router";
import type { ErrorKind, Room } from "../lib/api";
import { useLocale } from "../locales";

type Props = { rooms: Room[] | null; error: ErrorKind | null; onSelect: () => void };

// "food_chinese" sorts right after "food", so a sorted flat list already reads as a tree
const byTitle = (a: Room, b: Room) => a.title.localeCompare(b.title);

export default function RoomList({ rooms, error, onSelect }: Props) {
  const { t } = useLocale();

  return (
    <section className="scroll rooms">
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