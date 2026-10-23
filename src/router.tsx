import { createBrowserRouter } from "react-router";
import { ErrorPage } from "./routes/error-page";
import { RootLayout } from "./layouts/root-layout";
import { Home } from "./routes/home";
import { NotFound } from "./routes/not-found";
import { Cities } from "./routes/cities";
import { MyProfile } from "./routes/my-profile";
import { City } from "./routes/city";
import { RequireProfile } from "./routes/require-profile";
import { Contact } from "./routes/contact";
import { HowItWorks } from "./routes/how-it-works";
import { TermsOfService } from "./routes/terms-of-service";
import { PrivacyPolicy } from "./routes/privacy-policy";

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
          { path: "contact", element: <Contact /> },
          { path: "how-it-works", element: <HowItWorks /> },
          { path: "terms-of-service", element: <TermsOfService /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "*", element: <NotFound /> },
        ]
      }
    ]
  }
])