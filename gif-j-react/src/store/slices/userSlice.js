import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginRoute, logOutRoute, regRoute, apiUrl } from "../../static/api";
import { notification } from "antd";
import axiosInstance from "../../helpers/axiosConfig";
import { TokenService } from "../../helpers/tokenService";
import { userService } from "../../helpers/userService";
import { LocalStorage } from "../../helpers/storage";

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  const { remember, email, password, token } = data;

  try {
    // Log login attempt (apiUrl might be empty in production, that's ok)
    if (process.env.NODE_ENV === 'development') {
      console.log("[LOGIN] REQUEST:", { email, apiUrl, loginRoute: `${apiUrl}${loginRoute}` });
    }
    
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

    // Always log login response for debugging
    console.log("[LOGIN] RESPONSE:", {
      status: res.status,
      hasData: !!res.data,
      hasAccessToken: !!res.data?.accessToken,
      hasUser: !!res.data?.user,
      dataKeys: res.data ? Object.keys(res.data) : []
    });

    const result = { ...res.data, remember };
    console.log("[LOGIN] RESULT (with remember):", {
      hasAccessToken: !!result.accessToken,
      hasUser: !!result.user,
      remember: result.remember
    });
    
    return result;
  } catch (error) {
    console.error("[LOGIN] ERROR:", {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : null,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method
      } : null
    });
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

// Check if user is already authenticated (from previous session)
const user = userService.getUser();
const accessToken = TokenService.getAccessToken();
// User is authenticated if both user exists and access token exists
const auth = Boolean(user && accessToken);
const remember = TokenService.getRemember();

const initialState = {
  isAuth: auth,
  rememberMe: remember,
  userInfo: user === null ? "" : user,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetAuth: (state, action) => {
      state.isAuth = action.payload;
      // If setting auth to true, also ensure userInfo is set from storage
      if (action.payload) {
        const user = userService.getUser();
        const accessToken = TokenService.getAccessToken();
        if (user && accessToken) {
          state.userInfo = user;
        }
      }
    },
    RehydrateAuth: (state) => {
      // Rehydrate auth state from storage
      const user = userService.getUser();
      const accessToken = TokenService.getAccessToken();
      const remember = TokenService.getRemember();
      const isAuthenticated = Boolean(user && accessToken);
      
      state.isAuth = isAuthenticated;
      state.userInfo = user || "";
      state.rememberMe = remember || false;
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Rehydrated auth state:", { 
          isAuth: isAuthenticated, 
          hasUser: !!user,
          hasToken: !!accessToken,
          user: user,
          token: accessToken ? 'present' : 'missing'
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      try {
        console.log("=== LOGIN FULFILLED START ===", payload);
        state.loading = false;
        
        // Verify payload structure
        if (!payload || !payload.accessToken || !payload.user) {
          console.error("❌ Login payload is invalid:", payload);
          return;
        }
        
        // Store user data in storage first
        console.log("Calling setUser with:", payload);
        try {
          userService.setUser(payload);
        } catch (setUserError) {
          console.error("❌ Error in setUser:", setUserError);
        }
        
        // Immediately verify storage was written
        try {
          const sessionData = sessionStorage.getItem('user');
          const localData = LocalStorage.get('user');
          console.log("✅ Immediate storage check:", {
            sessionStorage: sessionData ? 'HAS DATA' : 'EMPTY',
            localStorage: localData ? 'HAS DATA' : 'EMPTY'
          });
        } catch (checkError) {
          console.error("❌ Error checking storage:", checkError);
        }
        
        // Update state FIRST before any async operations
        state.isAuth = Boolean(payload.accessToken);
        state.userInfo = payload.user;
        state.rememberMe = payload.remember || false;
        
        console.log("✅ State updated:", {
          isAuth: state.isAuth,
          userInfo: state.userInfo,
          rememberMe: state.rememberMe
        });
        
        // Verify after a delay
        setTimeout(() => {
          try {
            const storedUser = userService.getUser();
            const storedToken = TokenService.getAccessToken();
            const sessionData2 = sessionStorage.getItem('user');
            
            console.log("✅ Delayed storage verification:", {
              storedUser: !!storedUser,
              storedToken: !!storedToken,
              sessionStorage: sessionData2 ? 'HAS DATA' : 'EMPTY'
            });
          } catch (verifyError) {
            console.error("❌ Error in delayed verification:", verifyError);
          }
        }, 100);
        
        console.log("=== LOGIN FULFILLED END ===");
      } catch (error) {
        console.error("❌❌❌ ERROR IN LOGIN FULFILLED:", error);
        console.error("❌❌❌ Error message:", error.message);
        console.error("❌❌❌ Error stack:", error.stack);
      }
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      try {
        state.loading = false;
        const error = payload?.error;
        
        console.error("❌ LOGIN REJECTED:", payload);
        console.error("❌ Error object:", error);
        
        // Show error notification for invalid PIN
        if (error?.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.message || "Invalid PIN";
          
          if (status === 401) {
            notification.error({
              message: "Invalid PIN",
              description: "The PIN you entered is incorrect. Please try again.",
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
            description: error?.message || "An unexpected error occurred. Please try again.",
          });
        }
        
        console.error("❌ Full error details:", {
          payload,
          error,
          errorMessage: error?.message,
          errorResponse: error?.response
        });
      } catch (rejectError) {
        console.error("❌❌❌ ERROR IN LOGIN REJECTED HANDLER:", rejectError);
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
      const error = payload?.error;
      
      // Check for network/connection errors
      const isNetworkError = !error?.response && (error?.message === "Network Error" || error?.code === "ERR_NETWORK" || error?.code === "ECONNREFUSED");
      
      if (isNetworkError) {
        notification.error({
          message: "Connection Error",
          description: "Unable to connect to the server. Please make sure the backend server is running and try again.",
        });
      } else if (error?.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || error.message;
        
        if (status === 400) {
          notification.error({
            message: message || "Registration failed",
            description: "Please check your information and try again",
          });
        } else if (status === 403) {
          notification.error({
            message: "reCAPTCHA verification failed",
            description: "Please try again",
          });
        } else {
          notification.error({
            message: "Registration failed",
            description: message || "An error occurred. Please try again.",
          });
        }
      } else {
        notification.error({
          message: "Registration failed",
          description: error?.message || "An unexpected error occurred. Please try again.",
        });
      }
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

export const { SetAuth, RehydrateAuth } = userSlice.actions;

export default userSlice.reducer;
