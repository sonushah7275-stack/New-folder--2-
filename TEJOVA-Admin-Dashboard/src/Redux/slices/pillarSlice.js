import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Format raw backend Pillar object for UI consumption
 */
const formatPillarForUI = (pillar) => {
  if (!pillar) return null;

  return {
    _id: pillar._id,
    id: pillar._id,
    name: pillar.name,
    slug: pillar.slug,
    title: pillar.name,
    subtitle: pillar.title || pillar.name,
    description: pillar.description || "",
    content: pillar.content || "",
    image: pillar.image || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80",
    order: pillar.sortOrder || 1,
    status: pillar.isActive !== false ? "Active" : "Draft",
    isActive: pillar.isActive !== false,
    metrics: "Brand Pillar",
    createdAt: pillar.createdAt,
    updatedAt: pillar.updatedAt,
  };
};

/**
 * Fetch all pillars (Admin view)
 * GET /api/pillars?all=true
 */
export const fetchPillars = createAsyncThunk(
  "pillar/fetchPillars",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/pillars", {
        params: { all: true, ...params },
      });
      const rawPillars = response.data?.data || [];
      return rawPillars.map(formatPillarForUI);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch wellness pillars.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single pillar by ID or slug
 * GET /api/pillars/:idOrSlug
 */
export const fetchPillarById = createAsyncThunk(
  "pillar/fetchPillarById",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pillars/${idOrSlug}`);
      return formatPillarForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch pillar details.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new pillar
 * POST /api/pillars
 */
export const createPillar = createAsyncThunk(
  "pillar/createPillar",
  async (pillarData, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        name: pillarData.title || pillarData.name,
        title: pillarData.subtitle || pillarData.title,
        description: pillarData.description,
        image: pillarData.image,
        content: pillarData.content || "",
        sortOrder: pillarData.order !== undefined ? Number(pillarData.order) : 1,
        isActive: pillarData.status === "Active",
      };

      const response = await api.post("/pillars", payload);
      dispatch(fetchPillars());
      return formatPillarForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create pillar.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update an existing pillar
 * PATCH /api/pillars/:id
 */
export const updatePillar = createAsyncThunk(
  "pillar/updatePillar",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const payload = {};
      if (data.title !== undefined) payload.name = data.title;
      if (data.subtitle !== undefined) payload.title = data.subtitle;
      if (data.description !== undefined) payload.description = data.description;
      if (data.image !== undefined) payload.image = data.image;
      if (data.order !== undefined) payload.sortOrder = Number(data.order);
      if (data.status !== undefined) payload.isActive = data.status === "Active";

      const response = await api.patch(`/pillars/${id}`, payload);
      dispatch(fetchPillars());
      return formatPillarForUI(response.data?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update pillar.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a pillar
 * DELETE /api/pillars/:id
 */
export const deletePillar = createAsyncThunk(
  "pillar/deletePillar",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/pillars/${id}`);
      dispatch(fetchPillars());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete pillar.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Upload pillar cover image to Cloudinary via backend media API
 * POST /api/media/upload
 */
export const uploadPillarImage = createAsyncThunk(
  "pillar/uploadPillarImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pillars");

      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data?.data?.url || response.data?.data?.secureUrl;
    } catch (error) {
      const message =
        error.response?.data?.message || "Pillar image upload failed.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  pillars: [],
  selectedPillar: null,
  loading: false,
  mutationLoading: false,
  uploadingImage: false,
  error: null,
  successMessage: null,
};

const pillarSlice = createSlice({
  name: "pillar",
  initialState,
  reducers: {
    clearPillarStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedPillar: (state, action) => {
      state.selectedPillar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPillars
      .addCase(fetchPillars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPillars.fulfilled, (state, action) => {
        state.loading = false;
        state.pillars = action.payload;
        state.error = null;
      })
      .addCase(fetchPillars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPillarById
      .addCase(fetchPillarById.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(fetchPillarById.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedPillar = action.payload;
      })
      .addCase(fetchPillarById.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // createPillar
      .addCase(createPillar.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPillar.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Pillar created successfully!";
      })
      .addCase(createPillar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updatePillar
      .addCase(updatePillar.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePillar.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Pillar updated successfully!";
      })
      .addCase(updatePillar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // deletePillar
      .addCase(deletePillar.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deletePillar.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Pillar deleted successfully!";
      })
      .addCase(deletePillar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // uploadPillarImage
      .addCase(uploadPillarImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadPillarImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadPillarImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload;
      });
  },
});

export const { clearPillarStatus, setSelectedPillar } = pillarSlice.actions;
export default pillarSlice.reducer;
