// Development: use localhost, Production: use production URL
export const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000/gif-j/";
export const regRoute = "auth/register";
export const loginRoute = "auth/login";
export const logOutRoute = "auth/logout";
export const refreshRoute = "auth/refresh";
export const collections = "collection";
export const file = "file";
export const reset = "auth/reset-password";
export const confirmReset = "auth/reset-password-confirm";
export const checkLinks = "file/links/check";
export const fav = "favorite/file";
export const mostFav = "favorite/file/most-favorited";
