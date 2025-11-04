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
    return thunkAPI.rejectWithValue({ error: error });
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
      return thunkAPI.rejectWithValue({ error: error });
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
    return thunkAPI.rejectWithValue({ error: error });
  }
});

const auth = userService.getUser();
const remember = TokenService.getRemember();
const user = userService.getUser();

const initialState = {
  isAuth: Boolean(auth),
  rememberMe: remember,
  userInfo: user === null ? "" : user,
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
      if (payload?.error.response.status === 400) {
        notification.warning({
          message: `wrong email or password`,
        });
      }
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
