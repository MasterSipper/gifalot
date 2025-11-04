import { createHashRouter } from "react-router-dom";

import {
  DashboardPage,
  ErrorPage,
  LoginPage,
  Registration,
  ResetPage,
  Favorite,
  MostFavorite,
  PublicCarousel,
} from "../pages";
import { routes } from "../static/routes";
import { Layout } from "../components";
import { PrivateRoute } from "./privateRoute";
import { RememberMe } from "./RememberMe";
import { Catalog } from "../pages/dashboard/catalog";
import { InnerCarouser } from "../pages/dashboard/carousel/innerCarouser";

export const router = createHashRouter([
  {
    path: routes.login,
    element: (
      <RememberMe>
        <LoginPage />
      </RememberMe>
    ),
  },
  {
    path: routes.reg,
    element: <Registration />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: routes.dashboard,
        element: <DashboardPage />,
        children: [
          {
            path: routes.gifs,
            element: <Catalog />,
            children: [
              {
                path: routes.carousel,
                element: <InnerCarouser />,
              },
            ],
          },
        ],
      },
      {
        path: routes.favorite,
        element: <Favorite />,
      },
      {
        path: routes.mostFav,
        element: <MostFavorite />,
      },
    ],
  },
  {
    path: routes.publicCarousel,
    element: <PublicCarousel />,
  },
  {
    path: routes.reset,
    element: <ResetPage />,
  },
  {
    path: routes.error,
    element: <ErrorPage />,
  },
]);
