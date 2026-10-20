import { createBrowserRouter } from "react-router";
import { ErrorPage } from "./routes/error-page";
import { RootLayout } from "./layouts/root-layout";
import { Home } from "./routes/home";
import { NotFound } from "./routes/not-found";
import { Cities } from "./routes/cities";
import { MyProfile } from "./routes/my-profile";
import { City } from "./routes/city";
import { RequireProfile } from "./routes/require-profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "/cities", element: <Cities /> },
          { path: "/profile", element: <MyProfile /> },
          {
            element: <RequireProfile />,
            children: [{ path: "/city/:city/:room?", element: <City /> }],
          },
          { path: "*", element: <NotFound /> },
        ]
      }
    ]
  }
])