import { Link, Route, Routes } from "react-router";
import logo from "./assets/logo.svg";
import Home from "./pages/home";
import Cities from "./pages/cities";
import City from "./pages/city";
import Room from "./pages/room";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Contact from "./pages/contact";
import Legal from "./pages/legal";
import NotFound from "./pages/not-found";

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
          <Route path="/settings" element={<Settings />}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}