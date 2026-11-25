import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getUsername, setUsername } from "../lib/username";

type State = { message?: string; from?: string } | null;

export default function Profile() {
  const { message, from } = (useLocation().state as State) ?? {};
  const navigate = useNavigate();
  const [name, setName] = useState(getUsername() ?? "");

  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      <h1>Profile</h1>
      {message && <p>{message}</p>}
      <form
        className="column"
        onSubmit={(e) => {
          e.preventDefault();
          setUsername(name);
          navigate(from ?? "/", { replace: true });
        }}
      >
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