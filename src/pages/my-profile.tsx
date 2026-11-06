import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUsername, saveUsername } from "../lib/username";
import { useLocale } from "../locales";

// Set by the pages that send the user here, so we can send them back afterwards
type State = { from: string; reason: "required" | "taken" } | null;

export default function MyProfile() {
  const { t } = useLocale();
  const state = useLocation().state as State;
  const navigate = useNavigate();
  const [name, setName] = useState(getUsername() ?? "");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    saveUsername(name.trim());
    if (state) navigate(state.from, { replace: true });
    else setSaved(true);
  }

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{t.profile.title}</h1>
          <p>{t.profile.intro}</p>
        </section>
        {state && <p>{t.profile[state.reason]}</p>}
        <form className="column xs" onSubmit={handleSubmit}>
          <label>
            {t.profile.name}
            <input
              placeholder={t.profile.namePlaceholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              pattern="\s*[A-Za-z0-9_]{3,20}\s*"
              title={t.profile.rules}
              required
            />
          </label>
          <button>{t.profile.save}</button>
          {saved && <p>{t.profile.saved}</p>}
        </form>
      </div>
    </div>
  );
}