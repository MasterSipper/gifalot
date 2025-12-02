import { LocalStorage } from "./storage";
import { userKey } from "../static/storageKeys";

export const TokenService = {
  getRefreshToken: () => {
    try {
      const remember = TokenService.getRemember();
      if (remember) {
        const userStr = LocalStorage.get(userKey);
        if (userStr) {
          const user = JSON.parse(userStr);
          return user?.refreshToken;
        }
      } else {
        const userStr = sessionStorage.getItem(userKey);
        if (userStr) {
          const user = JSON.parse(userStr);
          return user?.refreshToken;
        }
      }
      // Fallback: try both if remember check failed
      try {
        const localUser = LocalStorage.get(userKey);
        if (localUser) {
          const user = JSON.parse(localUser);
          if (user?.refreshToken) return user.refreshToken;
        }
      } catch (e) {}
      try {
        const sessionUser = sessionStorage.getItem(userKey);
        if (sessionUser) {
          const user = JSON.parse(sessionUser);
          if (user?.refreshToken) return user.refreshToken;
        }
      } catch (e) {}
    } catch (error) {
      console.error("Error getting refresh token:", error);
    }
    return null;
  },

  getAccessToken: () => {
    try {
      const remember = TokenService.getRemember();
      if (remember) {
        const userStr = LocalStorage.get(userKey);
        if (userStr) {
          const user = JSON.parse(userStr);
          return user?.accessToken;
        }
      } else {
        const userStr = sessionStorage.getItem(userKey);
        if (userStr) {
          const user = JSON.parse(userStr);
          return user?.accessToken;
        }
      }
      // Fallback: try both if remember check failed
      try {
        const localUser = LocalStorage.get(userKey);
        if (localUser) {
          const user = JSON.parse(localUser);
          if (user?.accessToken) return user.accessToken;
        }
      } catch (e) {}
      try {
        const sessionUser = sessionStorage.getItem(userKey);
        if (sessionUser) {
          const user = JSON.parse(sessionUser);
          if (user?.accessToken) return user.accessToken;
        }
      } catch (e) {}
    } catch (error) {
      console.error("Error getting access token:", error);
    }
    return null;
  },

  getRemember: () => {
    try {
      const localUser = LocalStorage.get(userKey);
      if (localUser) {
        const user = JSON.parse(localUser);
        return user?.remember;
      }
    } catch (e) {
      // LocalStorage might be empty
    }
    // If not in localStorage, check sessionStorage
    try {
      const sessionUser = sessionStorage.getItem(userKey);
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        return user?.remember || false;
      }
    } catch (e) {
      // sessionStorage might be empty
    }
    return false;
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
