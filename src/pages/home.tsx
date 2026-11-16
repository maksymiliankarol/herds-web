import { Link } from "react-router";

const links = [
  { to: "/cities", label: "Cities" },
  { to: "/profile", label: "Profile" },
  { to: "/contact", label: "Contact" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
];

export default function Home() {
  return (
    <section className="page width-sm column">
      <p>Welcome to <strong>M - Herds.</strong> Find your city and chat live with its residents!</p>
      <div className="column gap-sm">
        {links.map(({ to, label }) => (
          <p key={to}>
            <Link to={to}>{label}</Link>
          </p>
        ))}
      </div>
    </section>
  );
}