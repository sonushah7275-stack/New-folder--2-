import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Subscribe email to newsletter
 * POST /api/newsletter/subscribe
 */
export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribeNewsletter",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/newsletter/subscribe", { email });
      return response.data?.message || "Subscribed to newsletter successfully!";
    } catch (error) {
      const message =
        error.response?.data?.message || "Newsletter subscription failed.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  loading: false,
  successMessage: null,
  error: null,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterStatus: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNewsletterStatus } = newsletterSlice.actions;
export default newsletterSlice.reducer;
