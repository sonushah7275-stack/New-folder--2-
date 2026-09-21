import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch all categories (Admin view)
 * GET /api/categories?all=true
 */
export const fetchAdminCategories = createAsyncThunk(
  "adminCategories/fetchAdminCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories", { params: { all: true } });
      return response.data?.data || [];
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load categories.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new category
 * POST /api/categories
 */
export const createCategory = createAsyncThunk(
  "adminCategories/createCategory",
  async (categoryData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/categories", categoryData);
      // Refresh list after creation
      dispatch(fetchAdminCategories());
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create category.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update an existing category
 * PATCH /api/categories/:id
 */
export const updateCategory = createAsyncThunk(
  "adminCategories/updateCategory",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/categories/${id}`, data);
      dispatch(fetchAdminCategories());
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update category.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
export const deleteCategory = createAsyncThunk(
  "adminCategories/deleteCategory",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      dispatch(fetchAdminCategories());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete category.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  mutationLoading: false,
  error: null,
  successMessage: null,
};

const adminCategorySlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    clearCategoryStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminCategories
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Category created successfully!";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Category updated successfully!";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Category deleted successfully!";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryStatus } = adminCategorySlice.actions;
export default adminCategorySlice.reducer;
