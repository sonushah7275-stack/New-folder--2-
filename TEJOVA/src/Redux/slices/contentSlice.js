import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch active public CMS content blocks
 * GET /api/content
 */
export const fetchPublicContent = createAsyncThunk(
  "content/fetchPublicContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/content");
      const blocks = response.data?.data || [];
      const contentMap = {};
      blocks.forEach((block) => {
        if (block && block.key) {
          contentMap[block.key.toUpperCase()] = block;
        }
      });
      return { blocks, contentMap };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load site content blocks.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  blocks: [],
  contentMap: {},
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    clearContentErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicContent.fulfilled, (state, action) => {
        state.loading = false;
        state.blocks = action.payload.blocks;
        state.contentMap = action.payload.contentMap;
        state.error = null;
      })
      .addCase(fetchPublicContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContentErrors } = contentSlice.actions;
export default contentSlice.reducer;
