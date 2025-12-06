import { createHashRouter } from "react-router-dom";

import {
  DashboardPage,
  ErrorPage,
  LoginPage,
  Registration,
  ResetPage,
  Favorite,
  MostFavorite,
} from "../pages";
import { routes } from "../static/routes";
import { Layout } from "../components";
import { PrivateRoute } from "./privateRoute";
import { RememberMe } from "./RememberMe";
import { Catalog } from "../pages/dashboard/catalog";
import { Player } from "../pages/player";
import { LearnMore } from "../pages/learnMore";

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
    path: routes.publicPlayer,
    element: <Player />,
  },
  {
    path: routes.player,
    element: (
      <PrivateRoute>
        <Player />
      </PrivateRoute>
    ),
  },
  {
    path: routes.learnMore,
    element: <LearnMore />,
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
