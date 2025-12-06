import axios from "axios";
import { apiUrl, loginRoute, refreshRoute, regRoute } from "../static/api";
import { TokenService } from "./tokenService";
import { notification } from "antd";
import { userService } from "./userService";

const axiosInstance = axios.create({
  baseURL: apiUrl || undefined, // Use undefined if empty string to prevent invalid URLs
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Routes that don't require authentication
    const publicRoutes = [loginRoute, regRoute, refreshRoute];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    } else if (!isPublicRoute) {
      // Log missing token for debugging (always log in production too for now)
      const errorInfo = {
        url: config.url,
        method: config.method,
        timestamp: new Date().toISOString(),
        message: "No access token found for request"
      };
      console.warn("[AXIOS] No access token:", errorInfo);
      
      // Store in sessionStorage for debugging
      try {
        const errors = JSON.parse(sessionStorage.getItem('axios_missing_token') || '[]');
        errors.push(errorInfo);
        sessionStorage.setItem('axios_missing_token', JSON.stringify(errors.slice(-10)));
      } catch (e) {
        console.error('Failed to store missing token error:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    // Log all 401 errors for debugging
    if (err.response?.status === 401) {
      const errorInfo = {
        url: originalConfig?.url,
        method: originalConfig?.method,
        hasToken: !!TokenService.getAccessToken(),
        hasRefreshToken: !!TokenService.getRefreshToken(),
        timestamp: new Date().toISOString()
      };
      
      // Store error in sessionStorage so it persists
      try {
        const errors = JSON.parse(sessionStorage.getItem('axios_401_errors') || '[]');
        errors.push(errorInfo);
        sessionStorage.setItem('axios_401_errors', JSON.stringify(errors.slice(-10))); // Keep last 10
      } catch (e) {
        console.error('Failed to store 401 error:', e);
      }
      
      console.error("[AXIOS] 401 Unauthorized:", errorInfo);
    }

    if (originalConfig.url !== `${loginRoute}` && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refresh = TokenService.getRefreshToken();
          
          if (!refresh) {
            console.error("[AXIOS] No refresh token available, cannot refresh");
            console.error("[AXIOS] This might be a timing issue - token may not be stored yet");
            // Don't clear user immediately - this might be a race condition
            // Let the component handle it, or retry after a short delay
            return Promise.reject(err);
          }

          console.log("[AXIOS] Attempting token refresh...");
          const rs = await axios.post(
            `${apiUrl}${refreshRoute}`,
            {},
            {
              headers: {
                authorization: `Bearer ${refresh}`,
              },
            }
          );

          const { accessToken } = rs.data;
          TokenService.updateAccessToken(accessToken);
          console.log("[AXIOS] Token refreshed successfully");

          return axiosInstance(originalConfig);
        } catch (refreshError) {
          console.error("[AXIOS] Token refresh failed:", {
            message: refreshError.message,
            response: refreshError.response?.status,
            data: refreshError.response?.data
          });
          
          // Only clear user and redirect if we're not on the login page
          // and this isn't a login/register request
          const isAuthRoute = originalConfig.url?.includes(loginRoute) || 
                             originalConfig.url?.includes(regRoute);
          
          if (!isAuthRoute) {
            notification.error({
              message: "Session expired",
              description: "Please log in again",
            });
            userService.removeUser();
            // Use a small delay to allow error to be logged
            setTimeout(() => {
              window.location.href = "/";
            }, 100);
          }
          
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
