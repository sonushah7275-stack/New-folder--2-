import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch active wellness pillars list
 * GET /api/pillars
 */
export const fetchPillars = createAsyncThunk(
  "pillar/fetchPillars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pillars");
      return response.data?.data || [];
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load wellness pillars.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single pillar by slug
 * GET /api/pillars/:slug
 */
export const fetchPillarBySlug = createAsyncThunk(
  "pillar/fetchPillarBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pillars/${slug}`);
      return response.data?.data || null;
    } catch (error) {
      const message =
        error.response?.data?.message || "Wellness pillar not found.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  pillars: [],
  selectedPillar: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const pillarSlice = createSlice({
  name: "pillar",
  initialState,
  reducers: {
    clearPillarErrors: (state) => {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPillars
      .addCase(fetchPillars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPillars.fulfilled, (state, action) => {
        state.loading = false;
        state.pillars = action.payload;
        state.error = null;
      })
      .addCase(fetchPillars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPillarBySlug
      .addCase(fetchPillarBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedPillar = null;
      })
      .addCase(fetchPillarBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedPillar = action.payload;
        state.detailError = null;
      })
      .addCase(fetchPillarBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearPillarErrors } = pillarSlice.actions;
export default pillarSlice.reducer;
