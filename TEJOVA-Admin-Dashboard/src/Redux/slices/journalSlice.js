import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Format raw backend Journal object for UI consumption
 */
const formatJournalForUI = (art) => {
  if (!art) return null;

  const uiStatus = art.status === "PUBLISHED" ? "Published" : "Draft";
  const authorName = typeof art.author === "object" ? art.author?.name || "Editorial Team" : art.author || "Editorial Team";
  const dateFormatted = art.publishedAt
    ? new Date(art.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return {
    _id: art._id,
    id: art._id,
    title: art.title,
    slug: art.slug,
    category: art.category || "Mindfulness",
    author: authorName,
    excerpt: art.excerpt || "",
    content: art.content || "",
    coverImage: art.coverImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    fontStyle: art.fontStyle || "tejova-editorial",
    status: uiStatus,
    rawStatus: art.status,
    publishedDate: dateFormatted,
    isFeatured: Boolean(art.isFeatured),
    tags: art.tags || [],
    createdAt: art.createdAt,
    updatedAt: art.updatedAt,
  };
};

/**
 * Fetch all journal articles (Admin view with status/search filtering)
 * GET /api/journal?all=true
 */
export const fetchJournals = createAsyncThunk(
  "journal/fetchJournals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/journal", {
        params: { all: true, page: 1, limit: 100, ...params },
      });
      const rawArticles = response.data?.data || [];
      const formatted = rawArticles.map(formatJournalForUI);

      return {
        articles: formatted,
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch journal articles.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single journal article by slug
 * GET /api/journal/:slug
 */
export const fetchJournalBySlug = createAsyncThunk(
  "journal/fetchJournalBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/journal/${slug}`);
      return formatJournalForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch article details.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new journal article
 * POST /api/journal
 */
export const createJournal = createAsyncThunk(
  "journal/createJournal",
  async (articleData, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        title: articleData.title,
        slug: articleData.slug,
        category: articleData.category,
        excerpt: articleData.excerpt,
        content: articleData.content,
        coverImage: articleData.coverImage,
        fontStyle: articleData.fontStyle || "tejova-editorial",
        status: articleData.status === "Published" ? "PUBLISHED" : "DRAFT",
        isFeatured: Boolean(articleData.isFeatured),
      };

      const response = await api.post("/journal", payload);
      dispatch(fetchJournals());
      return formatJournalForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create journal article.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update an existing journal article
 * PATCH /api/journal/:id
 */
export const updateJournal = createAsyncThunk(
  "journal/updateJournal",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const payload = { ...data };
      if (payload.status) {
        payload.status = payload.status === "Published" ? "PUBLISHED" : "DRAFT";
      }

      const response = await api.patch(`/journal/${id}`, payload);
      dispatch(fetchJournals());
      return formatJournalForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update journal article.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a journal article
 * DELETE /api/journal/:id
 */
export const deleteJournal = createAsyncThunk(
  "journal/deleteJournal",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/journal/${id}`);
      dispatch(fetchJournals());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete article.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Upload cover image to Cloudinary via backend media API
 * POST /api/media/upload
 */
export const uploadJournalImage = createAsyncThunk(
  "journal/uploadJournalImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "journal");

      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data?.data?.url || response.data?.data?.secureUrl;
    } catch (error) {
      const message =
        error.response?.data?.message || "Journal image upload failed.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  articles: [],
  selectedArticle: null,
  pagination: null,
  loading: false,
  mutationLoading: false,
  uploadingImage: false,
  error: null,
  successMessage: null,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    clearJournalStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedArticle: (state, action) => {
      state.selectedArticle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJournals
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchJournalBySlug
      .addCase(fetchJournalBySlug.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalBySlug.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(fetchJournalBySlug.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // createJournal
      .addCase(createJournal.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createJournal.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Journal article created successfully!";
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updateJournal
      .addCase(updateJournal.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateJournal.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Journal article updated successfully!";
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // deleteJournal
      .addCase(deleteJournal.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteJournal.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Journal article deleted successfully!";
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // uploadJournalImage
      .addCase(uploadJournalImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadJournalImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadJournalImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload;
      });
  },
});

export const { clearJournalStatus, setSelectedArticle } = journalSlice.actions;
export default journalSlice.reducer;
