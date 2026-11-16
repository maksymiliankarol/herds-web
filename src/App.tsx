import { Link, Route, Routes } from "react-router";
import Home from "./pages/home";
import City from "./pages/city";
import Room from "./pages/room";
import NotFound from "./pages/not-found";
import Cities from "./pages/cities";
import Profile from "./pages/profile";
import Contact from "./pages/contact";
import Hexagon from "./components/hexagon";

export default function App() {
  return (
    <>
      <header>
        <nav>
          <Hexagon size={24} />
          {"/"}
          <Link to="/">M - Herds</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/city/:id" element={<City />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}