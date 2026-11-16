import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="page width-sm column">
      <p>404 - No such page!</p>
      <Link to="/">Back</Link>
    </section>
  )
}