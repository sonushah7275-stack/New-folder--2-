import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Register user account
 * POST /api/auth/register
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("tejova_user_token", token);
      }
      return response.data?.user || response.data;
    } catch (error) {
      localStorage.removeItem("tejova_user_token");
      const message =
        error.response?.data?.message || "Registration failed. Please check your inputs.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("tejova_user_token", token);
      }
      return response.data?.user || response.data;
    } catch (error) {
      localStorage.removeItem("tejova_user_token");
      const message =
        error.response?.data?.message || "Invalid email or password.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch authenticated current user profile via HTTP-only cookie or Bearer token
 * GET /api/auth/me
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data?.user || response.data;
    } catch (error) {
      localStorage.removeItem("tejova_user_token");
      return rejectWithValue(null);
    }
  }
);

/**
 * Logout user by clearing HTTP-only cookie and local token
 * POST /api/auth/logout
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem("tejova_user_token");
    }
    return true;
  }
);

/**
 * Forgot password request
 * POST /api/auth/forgot-password
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data?.message || "OTP code sent to your email!";
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to process forgot password request.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Verify OTP code
 * POST /api/auth/verify-otp
 */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data?.message || "OTP verified successfully!";
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid or expired OTP code.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecking: true,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = "Account registered successfully!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = "Logged in successfully!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authChecking = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.authChecking = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.authChecking = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = "Logged out successfully.";
      })
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
