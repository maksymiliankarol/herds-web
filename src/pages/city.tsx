import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { get } from "../api";
import { capitalize } from "../lib/format";

type CityInfo = { id: number; title: string };
type Room = { id: number; title: string };
type Node = { label: string; id?: number; children: Node[] };
type CityData = { city: CityInfo; tree: Node[] };

const CACHE_MS = 5 * 60_000; // how long a city's rooms are considered fresh

// Lives outside the component so it survives going to a room and back.
// Holds one city only, so opening another city replaces it.
let cached: { id: string; data: CityData; at: number } | null = null;

const cachedData = (id: string) =>
  cached?.id === id && Date.now() - cached.at < CACHE_MS ? cached.data : null;

// Always listed first, in this order
const PINNED = ["general", "ogólne"];

const rank = (label: string) => {
  const i = PINNED.indexOf(label.toLowerCase());
  return i === -1 ? PINNED.length : i;
};

// Pinned first, then alphabetical, at every level
function sortNodes(nodes: Node[]) {
  nodes.sort((a, b) => rank(a.label) - rank(b.label) || a.label.localeCompare(b.label));
  nodes.forEach((n) => sortNodes(n.children));
}

// "Center_Praga_Cafe" becomes Center > Praga > Cafe. Only the last node gets the room id.
function buildTree(rooms: Room[]): Node[] {
  const root: Node = { label: "", children: [] };

  for (const room of rooms) {
    let node = root;
    for (const label of room.title.split("_")) {
      let child = node.children.find((c) => c.label.toLowerCase() === label.toLowerCase());
      if (!child) {
        child = { label, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.id = room.id;
  }

  sortNodes(root.children);
  return root.children;
}

function RoomTree({ nodes }: { nodes: Node[] }) {
  return (
    <ul>
      {nodes.map((n) => (
        <li key={n.label.toLowerCase()}>
          {n.id ? <Link to={`/room/${n.id}`}>{capitalize(n.label)}</Link> : capitalize(n.label)}
          {n.children.length > 0 && <RoomTree nodes={n.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function City() {
  const { id = "" } = useParams();
  const [data, setData] = useState(() => cachedData(id));
  const [error, setError] = useState("");

  useEffect(() => {
    const hit = cachedData(id);
    setData(hit);
    setError("");
    if (hit) return;

    const ctrl = new AbortController();

    Promise.all([
      get<CityInfo>(`/cities/${id}`, ctrl.signal),
      get<Room[]>(`/rooms?city_id=${id}`, ctrl.signal),
    ])
      .then(([city, rooms]) => {
        const fresh = { city, tree: buildTree(rooms) };
        cached = { id, data: fresh, at: Date.now() };
        setData(fresh);
      })
      .catch((e) => {
        if (!ctrl.signal.aborted) setError(e.message);
      });

    return () => ctrl.abort();
  }, [id]);

  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      {error && <p className="error">{error}</p>}
      {!data && !error && <p>Loading...</p>}
      {data && (
        <>
          <p>
            <strong>{data.city.title}</strong> has rooms. Join one.
          </p>
          {data.tree.length === 0 ? <p>No rooms yet</p> : <RoomTree nodes={data.tree} />}
        </>
      )}
    </section>
  );
}