import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";

// Screen
import Home from "./views/Home";
import Listing from "./views/Listing";
import NotFound from "./views/NotFound";
import Trips from "./views/Trips";
import Favorites from "./views/Favorites";
import Properties from "./views/Properties";
import Reservations from "./views/Reservations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/listings/:listingId",
        element: <Listing />,
      },
      {
        path: "/trips",
        element: <Trips />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "/reservations",
        element: <Reservations />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
