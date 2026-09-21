import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Helper to format raw backend NewsletterSubscriber objects for UI consumption
 */
const formatSubscriberForUI = (sub) => {
  if (!sub) return null;

  const dateFormatted = sub.subscribedAt
    ? new Date(sub.subscribedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : sub.createdAt
    ? new Date(sub.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return {
    _id: sub._id,
    id: sub._id,
    email: sub.email,
    name: sub.name || "Subscriber",
    date: dateFormatted,
    source: "Website Opt-in",
    status: sub.isSubscribed ? "Subscribed" : "Unsubscribed",
    isSubscribed: Boolean(sub.isSubscribed),
    subscribedAt: sub.subscribedAt,
    unsubscribedAt: sub.unsubscribedAt,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
  };
};

/**
 * Fetch all newsletter subscribers (Admin view)
 * GET /api/newsletter
 */
export const fetchSubscribers = createAsyncThunk(
  "newsletter/fetchSubscribers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/newsletter", {
        params: { page: 1, limit: 100, ...params },
      });
      const rawList = response.data?.data || [];
      const formatted = rawList.map(formatSubscriberForUI);

      return {
        subscribers: formatted,
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch newsletter subscribers.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a newsletter subscriber
 * DELETE /api/newsletter/:id
 */
export const deleteSubscriber = createAsyncThunk(
  "newsletter/deleteSubscriber",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/newsletter/${id}`);
      dispatch(fetchSubscribers());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete subscriber record.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  subscribers: [],
  pagination: null,
  loading: false,
  mutationLoading: false,
  error: null,
  successMessage: null,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSubscribers
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.subscribers;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteSubscriber
      .addCase(deleteSubscriber.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteSubscriber.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Subscriber removed successfully!";
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNewsletterStatus } = newsletterSlice.actions;
export default newsletterSlice.reducer;
