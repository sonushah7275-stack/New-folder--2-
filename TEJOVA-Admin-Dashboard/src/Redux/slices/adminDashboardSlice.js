import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Async Thunk: Fetch Admin Dashboard Statistics
 * GET /api/admin/stats
 */
export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchDashboardStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/stats", { params });
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load dashboard statistics.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard statistics.";
      });
  },
});

export const { clearDashboardError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
