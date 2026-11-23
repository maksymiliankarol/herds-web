import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { get } from "../api";
import { capitalize } from "../lib/format";

type CityInfo = { id: number; title: string };
type Room = { id: number; title: string };
type Node = { label: string; id?: number; children: Node[] };

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
  const { id } = useParams();
  const [data, setData] = useState<{ city: CityInfo; tree: Node[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setError("");

    Promise.all([
      get<CityInfo>(`/cities/${id}`, ctrl.signal),
      get<Room[]>(`/rooms?city_id=${id}`, ctrl.signal),
    ])
      .then(([city, rooms]) => setData({ city, tree: buildTree(rooms) }))
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
            Join to some <strong>{data.city.title}</strong> room!
          </p>
          {data.tree.length === 0 ? <p>No rooms yet</p> : <RoomTree nodes={data.tree} />}
        </>
      )}
    </section>
  );
}