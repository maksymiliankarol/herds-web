import { Link } from "react-router";
import { useI18n } from "../lib/i18n-context";
import type { Messages } from "../locales/en";

const tile =
  "flex items-center justify-center text-center p-2 border-2 border-black " +
  "hover:brightness-75 focus-visible:brightness-75 focus-visible:outline-4 " +
  "focus-visible:outline-offset-2 focus-visible:outline-black";

type Tile = {
  label: keyof Messages["home"]; // a key into t.home, checked by TypeScript
  to: string;
  className: string;
  external?: boolean;
};

const tiles: Tile[] = [
  { label: "cities", to: "/cities", className: "col-span-2 row-span-2 text-4xl md:text-5xl bg-red text-white" },
  { label: "profile", to: "/profile", className: "col-span-2 text-2xl md:text-3xl bg-blue text-white" },
  { label: "settings", to: "/settings", className: "text-xl bg-blue text-white" },
  { label: "howItWorks", to: "/how-it-works", className: "text-xl bg-sage text-white" },
  { label: "contact", to: "/contact", className: "text-xl bg-white text-black" },
  { label: "policies", to: "/policies", className: "text-xl bg-white text-black" },
  { label: "metalogrom", to: "https://metalogrom.com", className: "col-span-2 text-2xl md:text-3xl bg-offblack text-white", external: true },
];

export function Home() {
  const { t } = useI18n()

  return (
    <div className="max-w-3xl flex flex-col gap-8 md:py-16 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-32 gap-4">
        {tiles.map(({ label, to, className, external }) =>
          external ? (
            <a
              key={to}
              href={to}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tile} ${className}`}
            >
              {t.home[label]}
              <span className="sr-only"> {t.common.opensInNewTab}</span>
            </a>
          ) : (
            <Link key={to} to={to} className={`${tile} ${className}`}>
              {t.home[label]}
            </Link>
          )
        )}
      </div>
    </div>
  );
}