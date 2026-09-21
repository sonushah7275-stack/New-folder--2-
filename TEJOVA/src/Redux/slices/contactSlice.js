import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Submit contact message
 * POST /api/contact
 */
export const submitContactMessage = createAsyncThunk(
  "contact/submitContactMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/contact", formData);
      return response.data?.message || "Your message has been sent successfully!";
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit contact message. Please try again.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  loading: false,
  successMessage: null,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearContactStatus: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactMessage.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(submitContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(submitContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactStatus } = contactSlice.actions;
export default contactSlice.reducer;
