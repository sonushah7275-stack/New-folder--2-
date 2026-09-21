import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

export const initialSettingsState = {
  general: {
    siteName: "TEJOVA",
    tagline: "Premium Pure Wellness & Sustainable Living",
    supportEmail: "support@tejova.com",
    contactPhone: "+91 98765 43210",
    address: "123 Wellness Way, Green Park, New Delhi, India",
  },
  appearance: {
    theme: "light",
    primaryColor: "#1B4D3E",
    accentColor: "#D4AF37",
    fontFamily: "Inter",
  },
  notifications: {
    orderAlerts: true,
    newCustomerAlerts: true,
    lowStockAlerts: true,
    emailNotifications: true,
  },
  account: {
    adminName: "Tejova Admin",
    adminEmail: "tejova61@gmail.com",
  },
  businessHours: {
    mondayToFriday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
  socialLinks: {
    facebook: "https://facebook.com/tejova",
    instagram: "https://instagram.com/tejova",
    twitter: "https://twitter.com/tejova",
    pinterest: "https://pinterest.com/tejova",
  },
  maintenanceMode: false,
};

/**
 * Fetch Admin Settings
 * GET /api/settings
 */
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings");
      return response.data?.data || initialSettingsState;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch settings from server.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update Admin Settings
 * PATCH /api/settings
 */
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settingsPayload, { rejectWithValue }) => {
    try {
      const response = await api.patch("/settings", settingsPayload);
      return response.data?.data || settingsPayload;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update system settings.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  settings: initialSettingsState,
  loading: false,
  saveLoading: false,
  error: null,
  successMessage: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettingsStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    updateLocalSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = {
          ...initialSettingsState,
          ...action.payload,
          general: { ...initialSettingsState.general, ...(action.payload?.general || {}) },
          appearance: { ...initialSettingsState.appearance, ...(action.payload?.appearance || {}) },
          notifications: { ...initialSettingsState.notifications, ...(action.payload?.notifications || {}) },
          account: {
            adminName: action.payload?.updatedBy?.name || initialSettingsState.account.adminName,
            adminEmail: action.payload?.updatedBy?.email || initialSettingsState.account.adminEmail,
          },
        };
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.saveLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.settings = {
          ...state.settings,
          ...action.payload,
          general: { ...state.settings.general, ...(action.payload?.general || {}) },
          appearance: { ...state.settings.appearance, ...(action.payload?.appearance || {}) },
          notifications: { ...state.settings.notifications, ...(action.payload?.notifications || {}) },
          account: {
            adminName: action.payload?.updatedBy?.name || state.settings.account?.adminName,
            adminEmail: action.payload?.updatedBy?.email || state.settings.account?.adminEmail,
          },
        };
        state.successMessage = "Settings saved successfully to MongoDB!";
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingsStatus, updateLocalSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
