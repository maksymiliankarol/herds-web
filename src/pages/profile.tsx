import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getUsername, setUsername } from "../lib/username";

type State = { message?: string; from?: string } | null;

export default function Profile() {
  const { message, from } = (useLocation().state as State) ?? {};
  const navigate = useNavigate();
  const [name, setName] = useState(getUsername() ?? "");

  function save(e: FormEvent) {
    e.preventDefault();
    setUsername(name);
    navigate(from ?? "/", { replace: true });
  }

  return (
    <section className="page sm column">
      <Link to="/">Back</Link>
      {message && <p>{message}</p>}
      <form className="column" onSubmit={save}>
        <label>
          Your name
          <input
            placeholder="Alice"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={20}
            pattern="[A-Za-z0-9_]{3,20}"
            title="3-20 letters, numbers or _"
          />
        </label>
        <button>Save</button>
      </form>
    </section>
  );
}