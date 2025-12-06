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
      // Check both storages directly (avoid circular dependency with getRemember)
      let userStr = sessionStorage.getItem(userKey) || LocalStorage.get(userKey);
      
      if (!userStr) {
        if (process.env.NODE_ENV === 'development') {
          console.log("getAccessToken - No data found in storage");
        }
        return null;
      }
      
      const user = JSON.parse(userStr);
      const token = user?.accessToken || null;
      
      if (process.env.NODE_ENV === 'development') {
        console.log("getAccessToken - Found token:", {
          hasToken: !!token,
          storage: sessionStorage.getItem(userKey) ? 'sessionStorage' : 'localStorage'
        });
      }
      
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  getRemember: () => {
    try {
      // Check both storages directly
      const localUser = LocalStorage.get(userKey);
      const sessionUser = sessionStorage.getItem(userKey);
      
      // Prefer localStorage if it exists (remember=true uses localStorage)
      if (localUser) {
        const user = JSON.parse(localUser);
        return user?.remember || false;
      }
      
      // Otherwise check sessionStorage
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        return user?.remember || false;
      }
    } catch (e) {
      // Storage might be empty or corrupted
      if (process.env.NODE_ENV === 'development') {
        console.error("Error getting remember flag:", e);
      }
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
