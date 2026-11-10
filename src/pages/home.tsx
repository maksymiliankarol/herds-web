import { useLocale } from "../locales";

const SITE = "https://metalogrom.com";

export default function Home() {
  const { t, lang } = useLocale();

  const sitePath = (path: string) =>
    `${SITE}${lang === "en" ? "" : `/${lang}`}${path}`;

  return (
    <div className="scroll">
      <div className="page md">
        <section className="heading">
          <h1>{t.home.welcome}</h1>
          <p>
            {t.home.intro}{" "}
            <a href="/my-profile">{t.home.profileLink}</a>{" "}
            {t.home.introPartTwo}{" "}
            <a href="/cities">{t.home.citiesLink}</a>
            {t.home.introPartThree}
          </p>
          <ul>
            <li>
              <a
                href={sitePath("/software/herds/terms")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.home.terms}
              </a>
            </li>
            <li>
              <a
                href={sitePath("/software/herds/privacy")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.home.privacy}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}