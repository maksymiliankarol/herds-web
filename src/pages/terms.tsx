import { Link } from "react-router";

const articles = [
  {
    title: "Terms of Service",
    url: "https://metalogrom.com/software/herds/terms",
  },
  {
    title: "Privacy Policy",
    url: "https://metalogrom.com/software/herds/privacy", 
  },
];

export default function Terms() {
  return (
    <section className="page width-sm column">
      <Link to="/">Back</Link>
      <p>Terms and policies</p>
      <ul>
        {articles.map((article) => (
          <li key={article.title}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}