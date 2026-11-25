import { useState } from "react"
import { Link } from "react-router";
import { getTheme, setTheme } from "../lib/theme"

export default function Settings() {
  const [theme, setCurrentTheme] = useState(getTheme);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setCurrentTheme(next);
  }

  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      <h1>Settings</h1>
      <div className="column gap-sm">
        <label>Theme</label>
        <button className="secondary" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </section>
  )
}