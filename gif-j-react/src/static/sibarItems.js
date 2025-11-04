import { routes } from "./routes";
import { HeartOutlined, HomeOutlined } from "@ant-design/icons";

export const sidebarItems = [
  {
    label: "Dashboard",
    key: routes.dashboard,
    icon: <HomeOutlined />,
  },
  {
    label: "Favorite",
    key: "",
    icon: <HeartOutlined />,
    children: [
      {
        label: " Your Favorites",
        key: routes.favorite,
      },
      {
        label: "Favorites",
        key: routes.mostFav,
      },
    ],
  },
];
