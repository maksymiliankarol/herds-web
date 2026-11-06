import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { chatUrl, type ChatEvent, type Room, type ServerEvent } from "../lib/api";
import { roomName } from "../lib/room-name";
import { useLocale } from "../locales";

const MAX_EVENTS = 200;
const PING_MS = 25_000;
let nextId = 0;

type Entry = ChatEvent & { id: number };

type Props = { room: Room; username: string; active: boolean };

export default function Chat({ room, username, active }: Props) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [events, setEvents] = useState<Entry[]>([]);
  const [online, setOnline] = useState(0);
  const [disconnected, setDisconnected] = useState(false);
  const [text, setText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket(chatUrl(room.id, username));
    wsRef.current = ws;

    // Keeps the connection alive; the server closes connections that stop pinging
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("__ping__");
    }, PING_MS);

    ws.onmessage = (e) => {
      if (e.data === "__pong__") return;
      const event: ServerEvent = JSON.parse(e.data);
      if (event.type === "online") setOnline(event.count);
      else setEvents((prev) => [...prev, { ...event, id: nextId++ }].slice(-MAX_EVENTS));
    };

    ws.onclose = (e) => {
      if (e.code === 4009) {
        navigate("/my-profile", { state: { from: pathname + search, reason: "taken" }, replace: true });
      }
      else setDisconnected(true);
    };

    return () => {
      clearInterval(ping);
      ws.onmessage = null;
      ws.onclose = null;
      wsRef.current = null;
      ws.close(1000);
    };
  }, [room.id, username, navigate, pathname, search]);

  // Also on `active`: a hidden chat (mobile) can't scroll, so catch up when it is shown again
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [events, active]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = text.trim();
    const ws = wsRef.current;
    if (!message || ws?.readyState !== WebSocket.OPEN) return;

    ws.send(message);
    setText("");
  }

  return (
    <section className="chat column">
      <div className="chat-header">
        {roomName(room.title)}
        {online > 0 && ` · ${t.chat.online}: ${online}`}
      </div>
      {disconnected && <p>{t.chat.disconnected}</p>}
      <div className="scroll">
        {events.map((e) => {
          if (e.type === "error") {
            return <div key={e.id} className="chat-notice">{e.error}</div>;
          }
          const mine = e.username === username;
          return (
            <div key={e.id} className={`chat-row ${mine ? "my" : "other"}`}>
              {!mine && <small className="chat-author">{e.username}</small>}
              <div className={`chat-message ${mine ? "my" : "other"}`}>{e.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          disabled={disconnected}
        />
        <button disabled={disconnected}>Send</button>
      </form>
    </section>
  );
}