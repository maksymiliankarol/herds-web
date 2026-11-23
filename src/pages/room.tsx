import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { get } from "../api";
import { capitalize } from "../lib/format";
import { getUsername } from "../lib/username";
import Chat from "../components/chat";
import News from "../components/news";

type RoomInfo = { id: number; title: string; city_id: number; city_title: string };
type View = "chat" | "news";

export default function Room() {
  const { id } = useParams();
  const username = getUsername();

  if (!username) {
    return <Navigate to="/profile" replace state={{ message: "Please add your name first.", from: `/room/${id}` }} />;
  }
  return <RoomView key={id} id={id!} username={username} />;
}

function RoomView({ id, username }: { id: string; username: string }) {
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [error, setError] = useState("");
  const [online, setOnline] = useState<number | null>(null);
  const [view, setView] = useState<View>("chat");

  useEffect(() => {
    const ctrl = new AbortController();
    get<RoomInfo>(`/rooms/${id}`, ctrl.signal)
      .then(setRoom)
      .catch((e) => {
        if (!ctrl.signal.aborted) setError(e.message);
      });
    return () => ctrl.abort();
  }, [id]);

  if (error) {
    return (
      <section className="page width-sm column">
        <Link to="/">Back</Link>
        <p>{error}</p>
      </section>
    );
  }
  if (!room) {
    return (
      <section className="page width-sm column">
        <p>Loading...</p>
      </section>
    );
  }

  const name = room.title.split("_").map(capitalize).join(" / ");

  return (
    <section className="page width-xl column noscroll">
      <nav>
        <Link to={`/city/${room.city_id}`}>{room.city_title}</Link>
        {" / "}
        <p>
          {name}
          {online !== null && ` (${online} online)`}
        </p>
      </nav>

      <nav className="view-nav">
        {(["chat", "news"] as const).map((v) => (
          <button
            key={v}
            className={view === v ? "view-switch active" : "view-switch"}
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            {capitalize(v)}
          </button>
        ))}
      </nav>

      <div className="grid-two" data-view={view}>
        <Chat roomId={id} username={username} onOnline={setOnline} />
        <News roomId={id} />
      </div>
    </section>
  );
}