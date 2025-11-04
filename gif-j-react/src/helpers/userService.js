import { LocalStorage } from "./storage";
import { userKey } from "../static/storageKeys";
import { TokenService } from "./tokenService";

export const userService = {
  getUser: () => {
    const user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    return user?.user;
  },

  getUserId: () => {
    const user = TokenService.getRemember()
      ? JSON.parse(LocalStorage.get(userKey))
      : JSON.parse(sessionStorage.getItem(userKey));
    return user?.user.id;
  },

  setUser: (user) => {
    user.remember
      ? LocalStorage.set(userKey, JSON.stringify(user))
      : sessionStorage.setItem(userKey, JSON.stringify(user));
  },

  removeUser: () => {
    LocalStorage.remove(userKey);
    sessionStorage.removeItem(userKey);
  },
};
