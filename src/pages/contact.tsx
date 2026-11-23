import { Link } from "react-router";

export default function Contact() {
  return (
    <section className="page width-sm column">
      <nav><Link to="/">Back</Link></nav>
      <p>Need help or have some nice ideas? Reach us: 
      {" "}
      <a href="mailto:herds@metalogrom.com">herds@metalogrom.com</a>
      </p>
    </section>
  )
}