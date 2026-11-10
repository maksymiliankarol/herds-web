import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router";
import { getErrorKind, getRooms, type ErrorKind, type Room } from "../lib/api";
import { roomName } from "../lib/room-name";
import { getUsername } from "../lib/username";
import RoomList from "../components/room-list";
import Chat from "../components/chat";
import News from "../components/news";
import { useLocale } from "../locales";

type View = "chat" | "rooms" | "news";

export default function City() {
  const { t } = useLocale();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { pathname, search } = useLocation();
  const roomId = params.get("room");
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<ErrorKind | null>(null);
  const [view, setView] = useState<View>(roomId ? "chat" : "rooms");

  useEffect(() => {
    let ignore = false;
    setRooms(null);
    setError(null);
    getRooms(Number(id))
      .then((result) => {
        if (!ignore) setRooms(result);
      })
      .catch((e) => {
        if (!ignore) setError(getErrorKind(e));
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const username = getUsername();
  if (roomId && !username) {
    return <Navigate to="/my-profile" state={{ from: pathname + search, reason: "required" }} replace />;
  }

  const room = rooms?.find((r) => String(r.id) === roomId);

  return (
    <div className={`grid-three xl view-${view}`}>
      <div className="mobile-bar">
        <button onClick={() => setView(view === "rooms" && room ? "chat" : "rooms")}>
          {room ? roomName(room.title) : t.city.rooms}
        </button>
        <button className="success" onClick={() => setView(view === "news" ? "chat" : "news")}>
          {view === "news" ? t.city.chat : t.city.news}
        </button>
      </div>
      <RoomList rooms={rooms} error={error} onSelect={() => setView("chat")} />
      {room && username ? (
        <>
          <Chat key={room.id} room={room} username={username} active={view === "chat"} />
          <News roomId={room.id} />
        </>
      ) : (
        <p className="select-room">{t.city.selectRoom}</p>
      )}
    </div>
  );
}