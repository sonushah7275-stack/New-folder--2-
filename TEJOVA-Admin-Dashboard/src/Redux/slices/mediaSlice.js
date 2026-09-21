import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Format raw backend Media asset for UI consumption in Media.jsx
 */
const formatMediaForUI = (item) => {
  if (!item) return null;

  const folderName = item.folder
    ? item.folder.charAt(0).toUpperCase() + item.folder.slice(1)
    : "Products";

  const sizeFormatted = item.size
    ? item.size > 1024 * 1024
      ? `${(item.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(item.size / 1024)} KB`
    : "N/A";

  const dateFormatted = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Just now";

  return {
    _id: item._id,
    id: item._id,
    publicId: item.publicId,
    name: item.fileName || "media-asset",
    type: item.mimeType || item.resourceType || "image/jpeg",
    size: sizeFormatted,
    dimensions: "Original Aspect Ratio",
    uploadedDate: dateFormatted,
    url: item.url || item.secureUrl,
    category: folderName,
    folder: item.folder,
    alt: item.alt || "",
    createdAt: item.createdAt,
  };
};

/**
 * Fetch all media assets metadata
 * GET /api/media
 */
export const fetchMedia = createAsyncThunk(
  "media/fetchMedia",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/media", {
        params: { page: 1, limit: 100, ...params },
      });
      const rawList = response.data?.data || [];
      const formatted = rawList.map(formatMediaForUI);

      return {
        media: formatted,
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch media assets.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Upload a media file via Cloudinary backend endpoint
 * POST /api/media/upload
 */
export const uploadMedia = createAsyncThunk(
  "media/uploadMedia",
  async ({ file, folder = "general", alt = "" }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (alt) formData.append("alt", alt);

      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(fetchMedia());
      return formatMediaForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Media upload failed.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a media asset from Cloudinary and DB
 * DELETE /api/media?publicId=...
 */
export const deleteMedia = createAsyncThunk(
  "media/deleteMedia",
  async (publicId, { rejectWithValue, dispatch }) => {
    try {
      await api.delete("/media", {
        params: { publicId },
      });
      dispatch(fetchMedia());
      return publicId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete media asset.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  media: [],
  selectedMedia: null,
  pagination: null,
  loading: false,
  uploadLoading: false,
  deleteLoading: false,
  error: null,
  successMessage: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    clearMediaStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedMedia: (state, action) => {
      state.selectedMedia = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMedia
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload.media;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // uploadMedia
      .addCase(uploadMedia.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadMedia.fulfilled, (state) => {
        state.uploadLoading = false;
        state.successMessage = "Asset uploaded successfully!";
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })
      // deleteMedia
      .addCase(deleteMedia.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteMedia.fulfilled, (state) => {
        state.deleteLoading = false;
        state.successMessage = "Asset deleted successfully!";
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMediaStatus, setSelectedMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
