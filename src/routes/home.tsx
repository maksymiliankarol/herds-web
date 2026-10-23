import { Link } from "react-router";

const tile =
  "flex items-center justify-center text-center p-2 border-2 border-black " +
  "hover:brightness-75";

export function Home() {
  return (
    <div className="max-w-3xl flex flex-col gap-8 md:py-16 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-32 gap-4">
        <Link to="/cities" className={`${tile} col-span-2 row-span-2 text-4xl md:text-5xl bg-red text-white`}>
          Cities
        </Link>
        <Link to="/profile" className={`${tile} col-span-2 text-2xl md:text-3xl bg-blue text-white`}>
          My Profile
        </Link>
        <Link to="/how-it-works" className={`${tile} text-xl bg-sage text-white`}>
          How It Works
        </Link>
        <Link to="/contact" className={`${tile} text-xl bg-white text-black`}>
          Contact
        </Link>
        <Link to="/terms-of-service" className={`${tile} text-xl bg-white text-black`}>
          Terms
        </Link>
        <Link to="/privacy-policy" className={`${tile} text-xl bg-white text-black`}>
          Privacy
        </Link>
        <a
          href="https://metalogrom.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${tile} col-span-2 text-2xl md:text-3xl bg-offblack text-white`}
        >
          Metalogrom
        </a>
      </div>
    </div>
  )
}