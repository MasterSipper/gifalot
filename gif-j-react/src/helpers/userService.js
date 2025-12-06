import { LocalStorage } from "./storage";
import { userKey } from "../static/storageKeys";
import { TokenService } from "./tokenService";

export const userService = {
  getUser: () => {
    try {
      // Check both storages directly (don't rely on getRemember which creates circular dependency)
      let userStr = sessionStorage.getItem(userKey) || LocalStorage.get(userKey);
      
      if (!userStr) {
        if (process.env.NODE_ENV === 'development') {
          console.log("getUser - No data found in storage");
        }
        return null;
      }
      
      const userData = JSON.parse(userStr);
      const user = userData?.user || null;
      
      if (process.env.NODE_ENV === 'development') {
        console.log("getUser - Found user:", {
          hasUser: !!user,
          storage: sessionStorage.getItem(userKey) ? 'sessionStorage' : 'localStorage',
          userData: userData
        });
      }
      
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  getUserId: () => {
    try {
      const remember = TokenService.getRemember();
      let userStr = null;
      
      if (remember) {
        userStr = LocalStorage.get(userKey);
      } else {
        userStr = sessionStorage.getItem(userKey);
      }
      
      if (!userStr) {
        // Try fallback - check both storages
        userStr = LocalStorage.get(userKey) || sessionStorage.getItem(userKey);
      }
      
      if (!userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      return user?.user?.id || null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  },

  setUser: (user) => {
    console.log("setUser called with:", user);
    try {
      if (!user) {
        console.error("setUser: user is null/undefined");
        return;
      }
      
      const userStr = JSON.stringify(user);
      console.log("setUser: Stringified user:", userStr);
      
      if (user.remember) {
        console.log("setUser: Storing in localStorage");
        LocalStorage.set(userKey, userStr);
        // Also clear sessionStorage to avoid conflicts
        sessionStorage.removeItem(userKey);
        console.log("setUser: localStorage set, sessionStorage cleared");
      } else {
        console.log("setUser: Storing in sessionStorage");
        sessionStorage.setItem(userKey, userStr);
        // Also clear localStorage to avoid conflicts
        LocalStorage.remove(userKey);
        console.log("setUser: sessionStorage set, localStorage cleared");
      }
      
      // Verify immediately
      const verifySession = sessionStorage.getItem(userKey);
      const verifyLocal = LocalStorage.get(userKey);
      console.log("setUser: Verification:", {
        sessionStorage: verifySession ? 'has data' : 'empty',
        localStorage: verifyLocal ? 'has data' : 'empty',
        remember: user.remember,
        hasAccessToken: !!user.accessToken,
        hasUser: !!user.user
      });
    } catch (error) {
      console.error("Error setting user:", error);
      console.error("Error details:", {
        user: user,
        errorMessage: error.message,
        errorStack: error.stack
      });
    }
  },

  removeUser: () => {
    LocalStorage.remove(userKey);
    sessionStorage.removeItem(userKey);
  },
};
