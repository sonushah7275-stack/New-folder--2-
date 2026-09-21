import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch journal articles list with optional tag, search, and pagination
 * GET /api/journal
 */
export const fetchArticles = createAsyncThunk(
  "journal/fetchArticles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/journal", { params });
      return {
        articles: response.data?.data || [],
        count: response.data?.count || 0,
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        pages: response.data?.pages || 1,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load journal articles.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single journal article by slug
 * GET /api/journal/:slug
 */
export const fetchArticleBySlug = createAsyncThunk(
  "journal/fetchArticleBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/journal/${slug}`);
      return response.data?.data || null;
    } catch (error) {
      const message =
        error.response?.data?.message || "Journal article not found.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  articles: [],
  selectedArticle: null,
  count: 0,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    clearJournalErrors: (state) => {
      state.error = null;
      state.detailError = null;
    },
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.count = action.payload.count;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchArticleBySlug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedArticle = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedArticle = action.payload;
        state.detailError = null;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearJournalErrors, clearSelectedArticle } = journalSlice.actions;
export default journalSlice.reducer;
