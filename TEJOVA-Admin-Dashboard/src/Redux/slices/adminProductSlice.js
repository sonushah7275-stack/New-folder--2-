import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch all products (Admin view with pagination & search)
 * GET /api/products?all=true
 */
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {
        params: { all: true, page: 1, limit: 100, ...params },
      });
      return {
        products: response.data?.data || [],
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load products.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/products", productData);
      dispatch(fetchAdminProducts());
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create product.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update an existing product
 * PATCH /api/products/:id
 */
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/products/${id}`, data);
      dispatch(fetchAdminProducts());
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update product.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/products/${id}`);
      dispatch(fetchAdminProducts());
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Upload Product Image to Cloudinary via Backend
 * POST /api/media/upload
 */
export const uploadProductImage = createAsyncThunk(
  "adminProducts/uploadProductImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data?.data?.url || response.data?.data?.secureUrl;
    } catch (error) {
      const message =
        error.response?.data?.message || "Image upload failed.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  pagination: null,
  loading: false,
  mutationLoading: false,
  uploadingImage: false,
  error: null,
  successMessage: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearProductStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminProducts
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Product created successfully!";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Product updated successfully!";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.mutationLoading = false;
        state.successMessage = "Product deleted successfully!";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // uploadProductImage
      .addCase(uploadProductImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductStatus } = adminProductSlice.actions;
export default adminProductSlice.reducer;
