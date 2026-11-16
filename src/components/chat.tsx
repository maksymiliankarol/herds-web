import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { WS_URL } from "../api";

// Must match the "Username taken" close code in the API's chat-room.ts
const USERNAME_TAKEN = 4009;
const PING_MS = 25_000; // the server drops sockets that stay silent for ~60s
const MAX_MESSAGES = 200;

type Message = { id: number; name: string; text: string };
type ServerEvent =
  | { type: "online"; count: number }
  | { type: "message"; username: string; text: string }
  | { type: "error"; error: string };

type Props = { roomId: string; username: string; onOnline: (count: number) => void };

export default function Chat({ roomId, username, onOnline }: Props) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [closed, setClosed] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/chat/${roomId}?username=${encodeURIComponent(username)}`);
    socket.current = ws;
    let opened = false;

    ws.onopen = () => {
      opened = true;
    };

    ws.onmessage = (e) => {
      if (e.data === "__pong__") return;
      const event: ServerEvent = JSON.parse(e.data);

      if (event.type === "online") {
        onOnline(event.count);
      } else if (event.type === "error") {
        setNotice(event.error);
      } else {
        const message = { id: nextId.current++, name: event.username, text: event.text };
        setMessages((prev) => [...prev, message].slice(-MAX_MESSAGES));
      }
    };

    ws.onclose = (e) => {
      if (e.code === USERNAME_TAKEN) {
        navigate("/profile", {
          replace: true,
          state: { message: "Someone in this room already uses that name. Please pick another.", from: `/room/${roomId}` },
        });
      } else {
        setClosed(e.reason || (opened ? "Connection lost" : "Could not connect to the room"));
      }
    };

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("__ping__");
    }, PING_MS);

    return () => {
      clearInterval(ping);
      ws.onclose = null; // leaving on purpose is not an error
      ws.close();
    };
  }, [roomId, username, navigate, onOnline]);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || socket.current?.readyState !== WebSocket.OPEN) return;
    socket.current.send(text);
    setDraft("");
    setNotice("");
  }

  return (
    <div className="chat column">
      <div className="scroll column" ref={list}>
        {messages.map((m) => {
          const own = m.name === username;
          return (
            <div key={m.id} className={own ? "message own" : "message"}>
              {!own && <small>{m.name}</small>}
              <p>{m.text}</p>
            </div>
          );
        })}
      </div>
      {(closed || notice) && <small>{closed || notice}</small>}
      <form className="chat-input" onSubmit={send}>
        <input
          placeholder="Enter message here..."
          maxLength={500}
          value={draft}
          disabled={!!closed}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button disabled={!!closed}>Send</button>
      </form>
    </div>
  );
}