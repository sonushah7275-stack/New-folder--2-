import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Format raw backend ContactMessage object for UI consumption
 */
const formatContactMessageForUI = (msg) => {
  if (!msg) return null;

  const dateFormatted = msg.createdAt
    ? new Date(msg.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return {
    _id: msg._id,
    id: msg._id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone || "N/A",
    subject: msg.subject || "General Inquiry",
    message: msg.message,
    status: msg.status || "NEW",
    isRead: msg.status !== "NEW",
    date: dateFormatted,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  };
};

/**
 * Fetch all contact messages (Admin view)
 * GET /api/contact
 */
export const fetchMessages = createAsyncThunk(
  "contact/fetchMessages",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact", {
        params: { page: 1, limit: 100, ...params },
      });
      const rawMessages = response.data?.data || [];
      const formatted = rawMessages.map(formatContactMessageForUI);

      return {
        messages: formatted,
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch contact messages.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch a single contact message by ID
 * GET /api/contact/:id
 */
export const fetchMessageById = createAsyncThunk(
  "contact/fetchMessageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/${id}`);
      return formatContactMessageForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch contact message.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update contact message status (e.g. NEW, READ, REPLIED, ARCHIVED)
 * PATCH /api/contact/:id
 */
export const updateMessageStatus = createAsyncThunk(
  "contact/updateMessageStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/contact/${id}`, { status });
      dispatch(fetchMessages());
      return formatContactMessageForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update message status.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a contact message
 * DELETE /api/contact/:id
 */
export const deleteMessage = createAsyncThunk(
  "contact/deleteMessage",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/contact/${id}`);
      dispatch(fetchMessages());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete contact message.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  messages: [],
  selectedMessage: null,
  pagination: null,
  loading: false,
  mutationLoading: false,
  error: null,
  successMessage: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearContactStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedMessage: (state, action) => {
      state.selectedMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMessageById
      .addCase(fetchMessageById.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedMessage = action.payload;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updateMessageStatus
      .addCase(updateMessageStatus.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(updateMessageStatus.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedMessage = action.payload;
      })
      .addCase(updateMessageStatus.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // deleteMessage
      .addCase(deleteMessage.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteMessage.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Message deleted successfully!";
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactStatus, setSelectedMessage } = contactSlice.actions;
export default contactSlice.reducer;
