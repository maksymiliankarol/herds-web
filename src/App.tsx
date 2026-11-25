import { Link, Route, Routes } from "react-router";
import Home from "./pages/home";
import City from "./pages/city";
import Room from "./pages/room";
import NotFound from "./pages/not-found";
import Cities from "./pages/cities";
import Profile from "./pages/profile";
import Contact from "./pages/contact";
import logo from "./assets/logo.svg";
import Legal from "./pages/legal";

export default function App() {
  return (
    <>
      <header>
        <nav>
          <a href="https://metalogrom.com" target="_blank" rel="noopener">
            <img src={logo} width="24" alt="Metalogrom" />
          </a>
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
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}