import Tile from "../components/tile";

export function Home() {
  return (
    <div className="max-w-3xl flex flex-col gap-8 py-4 md:py-16 mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Tile to="/cities" title="Cities" className="bg-red text-white" />
        <Tile to="/profile" title="My Profile" className="bg-blue text-white" />
        <Tile to="/how-it-works" title="How It Works" className="bg-sage text-white"/>
        <Tile to="/contact" title="Contact" className="bg-white text-black"/>
        <Tile to="/how-it-works" title="Terms" className="bg-white text-black"/>
        <Tile to="https://metalogrom.com" title="Metalogrom" className="bg-offblack text-white"/>
      </div>
    </div>
  )
}