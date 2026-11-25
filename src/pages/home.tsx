import { Link } from "react-router";

const links = [
  { to: "/cities", label: "Cities" },
  { to: "/profile", label: "Profile" },
  { to: "https://herds-ads.metalogrom.com", label: "Ads", external: true },
  { to: "/contact", label: "Contact" },
  { to: "/terms", label: "Terms" },
];

export default function Home() {
  return (
    <section className="page width-sm column">
      <h1>M - Herds</h1>
      <p>Find your city. Join the room. Talk to locals, live.</p>
      <div>
        {links.map(({ to, label, external }) => (
          <p key={to}>
            {external ? (
              <a href={to} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </p>
        ))}
      </div>
    </section>
  );
}