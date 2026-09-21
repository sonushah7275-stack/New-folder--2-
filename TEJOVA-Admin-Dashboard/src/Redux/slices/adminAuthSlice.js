import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Async Thunk: Admin Login
 * POST /api/auth/login
 */
export const adminLogin = createAsyncThunk(
  "adminAuth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const user = response.data?.user;

      if (!user) {
        return rejectWithValue("Invalid server response.");
      }

      // Enforce ADMIN role verification
      if (user.role !== "ADMIN") {
        // Logout immediately to clear HTTP-only cookie set by backend
        try {
          await api.post("/auth/logout");
        } catch (_) {}
        return rejectWithValue("Access denied. Admin privileges required.");
      }

      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Fetch Authenticated Admin Profile (/me)
 * GET /api/auth/me
 */
export const fetchAdminProfile = createAsyncThunk(
  "adminAuth/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data?.user;

      if (!user) {
        return rejectWithValue("No user profile returned.");
      }

      if (user.role !== "ADMIN") {
        return rejectWithValue("Access denied. Admin privileges required.");
      }

      return user;
    } catch (error) {
      const message = error.response?.data?.message || "Session invalid or expired.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Admin Logout
 * POST /api/auth/logout
 */
export const adminLogout = createAsyncThunk(
  "adminAuth/adminLogout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // adminLogin
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = action.payload || "Login failed.";
        state.initialized = true;
      })
      // fetchAdminProfile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchAdminProfile.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;
        state.initialized = true;
      })
      // adminLogout
      .addCase(adminLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;
        state.initialized = true;
      })
      .addCase(adminLogout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
