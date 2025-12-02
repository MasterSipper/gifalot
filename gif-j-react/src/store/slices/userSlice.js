import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginRoute, logOutRoute, regRoute } from "../../static/api";
import { notification } from "antd";
import axiosInstance from "../../helpers/axiosConfig";
import { TokenService } from "../../helpers/tokenService";
import { userService } from "../../helpers/userService";

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  const { remember, email, password, token } = data;

  try {
    const res = await axiosInstance.post(
      `${loginRoute}`,
      {
        email,
        password,
      },
      {
        headers: {
          recaptcha: `${token}`,
        },
      }
    );

    return await { ...res.data, remember };
  } catch (error) {
    // Extract only serializable error data
    const errorData = {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
      request: error.request ? {
        // Only include serializable request data if needed
      } : null,
    };
    return thunkAPI.rejectWithValue({ error: errorData });
  }
});

export const register = createAsyncThunk(
  "auth/registration",
  async (data, thunkAPI) => {
    const { email, password, token } = data;
    try {
      const res = await axiosInstance.post(
        `${regRoute}`,
        {
          email,
          password,
        },
        {
          headers: {
            recaptcha: `${token}`,
          },
        }
      );

      return await res.data;
    } catch (error) {
      // Extract only serializable error data
      const errorData = {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        } : null,
      };
      return thunkAPI.rejectWithValue({ error: errorData });
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const token = TokenService.getAccessToken();

  try {
    const res = await axiosInstance.post(
      `${logOutRoute}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return await res.data;
  } catch (error) {
    // Extract only serializable error data
    const errorData = {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
    };
    return thunkAPI.rejectWithValue({ error: errorData });
  }
});

// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable authentication
const DISABLE_AUTH = true;

const auth = DISABLE_AUTH ? true : Boolean(userService.getUser());
const remember = DISABLE_AUTH ? false : TokenService.getRemember();
const user = DISABLE_AUTH 
  ? { id: 1, email: "dev@example.com" } // Mock user for development
  : userService.getUser();

const initialState = {
  isAuth: DISABLE_AUTH ? true : Boolean(auth),
  rememberMe: remember,
  userInfo: DISABLE_AUTH ? { id: 1, email: "dev@example.com" } : (user === null ? "" : user),
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetAuth: (_, action) => {
      _.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loading = false;
      userService.setUser(payload);
      state.isAuth = Boolean(payload.accessToken);
      state.userInfo = payload.user;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false;
      const error = payload?.error;
      
      if (error?.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || error.message;
        
        if (status === 400 || status === 401) {
          notification.error({
            message: message || "Wrong email or password",
            description: "Please check your credentials and try again",
          });
        } else if (status === 403) {
          notification.error({
            message: "reCAPTCHA verification failed",
            description: "Please try again",
          });
        } else {
          notification.error({
            message: "Login failed",
            description: message || "An error occurred. Please try again.",
          });
        }
      } else {
        notification.error({
          message: "Login failed",
          description: error?.message || "Unable to connect to server. Please check your connection.",
        });
      }
      
      console.error("Login error:", error);
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuth = false;
      notification.open({
        message: `User was created`,
      });
    });
    builder.addCase(register.rejected, (state, { payload }) => {
      state.loading = false;
      notification.open({
        message: payload?.error.message,
      });
    });
    builder.addCase(logOut.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logOut.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuth = false;
      state.rememberMe = false;
      state.userInfo = null;
      userService.removeUser();
    });
    builder.addCase(logOut.rejected, (state, { payload }) => {
      state.loading = false;
      notification.open({
        message: payload?.error.message,
      });
    });
  },
});

export const { SetAuth } = userSlice.actions;

export default userSlice.reducer;
