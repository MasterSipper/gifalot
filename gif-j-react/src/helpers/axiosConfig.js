import axios from "axios";
import { apiUrl, loginRoute, refreshRoute } from "../static/api";
import { TokenService } from "./tokenService";
import { notification } from "antd";
import { userService } from "./userService";

const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
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

    if (originalConfig.url !== `${loginRoute}` && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refresh = TokenService.getRefreshToken();

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

          return axiosInstance(originalConfig);
        } catch (_error) {
          notification.error({
            message: "Session terminated, need login again",
          });
          userService.removeUser();
          return (window.location.href = "/");
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
