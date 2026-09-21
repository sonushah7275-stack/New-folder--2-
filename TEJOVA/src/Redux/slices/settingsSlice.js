import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch public-safe website configuration
 * GET /api/settings/public
 */
export const fetchPublicSettings = createAsyncThunk(
  "settings/fetchPublicSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings/public");
      return response.data?.data || {};
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load public configuration.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  publicSettings: {
    siteName: "TEJOVA",
    tagline: "Pure Wellness & Sustainable Living",
    supportEmail: "support@tejova.com",
    contactPhone: "+91 98765 43210",
    address: "123 Wellness Way, Green Park, New Delhi, India",
    socialLinks: {
      facebook: "https://facebook.com/tejova",
      instagram: "https://instagram.com/tejova",
      twitter: "https://twitter.com/tejova",
      pinterest: "https://pinterest.com/tejova",
    },
    businessHours: {
      mondayToFriday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    maintenanceMode: false,
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.publicSettings = {
          ...state.publicSettings,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(fetchPublicSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
