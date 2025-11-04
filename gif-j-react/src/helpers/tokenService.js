import { LocalStorage } from "./storage";
import { userKey } from "../static/storageKeys";

export const TokenService = {
  getRefreshToken: () => {
    const user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    return user?.refreshToken;
  },

  getAccessToken: () => {
    const user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    return user?.accessToken;
  },

  getRemember: () => {
    const user = JSON.parse(LocalStorage.get(userKey));
    return user?.remember;
  },

  updateAccessToken: (token) => {
    let user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    user.accessToken = token;
    TokenService.getRemember()
      ? LocalStorage.set(userKey, JSON.stringify(user))
      : sessionStorage.setItem(userKey, JSON.stringify(user));
  },

  updateRefreshToken: (token) => {
    let user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    user.refreshToken = token;
    TokenService.getRemember()
      ? LocalStorage.set(userKey, JSON.stringify(user))
      : sessionStorage.setItem(userKey, JSON.stringify(user));
  },
};
