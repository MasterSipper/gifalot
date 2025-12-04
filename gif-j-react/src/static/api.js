// Development: use localhost, Production: use production URL
// If REACT_APP_API_URL is not set in production, use empty string to prevent localhost calls
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // In production build, if env var is not set, return empty (calls will fail but won't hit localhost)
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // Development default
  return "http://localhost:3001/gif-j/";
};

export const apiUrl = getApiUrl();
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
