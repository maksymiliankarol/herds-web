import { createBrowserRouter } from "react-router";
import Layout from "./layouts/layout";
import Home from "./pages/home";
import Cities from "./pages/cities";
import City from "./pages/city";
import MyProfile from "./pages/my-profile";
import Settings from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "cities", Component: Cities },
      { path: "city/:id", Component: City },
      { path: "my-profile", Component: MyProfile },
      { path: "settings", Component: Settings }
    ]
  }
])