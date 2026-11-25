import { Link } from "react-router";

export default function Contact() {
  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      <h1>Contact</h1>
      <p>Write us: 
      {" "}
      <a href="mailto:herds@metalogrom.com">herds@metalogrom.com</a>
      </p>
    </section>
  )
}