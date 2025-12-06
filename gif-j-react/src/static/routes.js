export const routes = {
  login: "/",
  dashboard: "dashboard",
  favorite: "favorite",
  mostFav: "most-favorite",
  gifs: "/dashboard/:folder",
  player: "/player/:folder", // Private standalone player route
  publicPlayer: "/:userId/:folderId/carousel", // Public player route
  reg: "/registration",
  reset: "/reset",
  learnMore: "/learn-more",
  error: "*",
};
