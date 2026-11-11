import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router";
import { getCity, getErrorKind, getRooms, type City as CityData, type ErrorKind, type Room } from "../lib/api";
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
  const [city, setCity] = useState<CityData | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<ErrorKind | null>(null);
  const [view, setView] = useState<View>(roomId ? "chat" : "rooms");

  useEffect(() => {
    let ignore = false;
    setCity(null);
    setRooms(null);
    setError(null);
    Promise.all([getCity(Number(id)), getRooms(Number(id))])
      .then(([c, r]) => {
        if (ignore) return;
        setCity(c);
        setRooms(r);
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
          {t.city.rooms}
        </button>
        <button className="success" onClick={() => setView(view === "news" ? "chat" : "news")}>
          {view === "news" ? t.city.chat : t.city.news}
        </button>
      </div>
      <RoomList 
        city={city}
        rooms={rooms} 
        error={error} 
        onSelect={() => setView("chat")} 
      />
      {city && room && username ? (
        <>
          <Chat 
            city={city.title}
            key={room.id} 
            room={room} 
            username={username} 
            active={view === "chat"} 
          />
          <News roomId={room.id} />
        </>
      ) : (
        <p className="select-room">{t.city.selectRoom}</p>
      )}
    </div>
  );
}