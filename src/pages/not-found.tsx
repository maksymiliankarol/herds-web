import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="page width-sm column">
      <Link to="/">Back</Link>
      <h1>404</h1>
      <p>No such page!</p>
    </section>
  )
}