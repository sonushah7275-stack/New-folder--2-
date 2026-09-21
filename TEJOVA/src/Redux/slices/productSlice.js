import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch products list with optional category, search, and pagination query filters
 * GET /api/products
 */
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", { params });
      return {
        products: response.data?.data || [],
        count: response.data?.count || 0,
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        pages: response.data?.pages || 1,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load products from server.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single product details by slug
 * GET /api/products/slug/:slug
 */
export const fetchProductBySlug = createAsyncThunk(
  "product/fetchProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/slug/${slug}`);
      return response.data?.data || null;
    } catch (error) {
      const message =
        error.response?.data?.message || "Product not found.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch related products (e.g. by category)
 * GET /api/products
 */
export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelatedProducts",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {
        params: { category: categoryId, limit: 4 },
      });
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue("Failed to load related products.");
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  relatedProducts: [],
  count: 0,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
      state.detailError = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.count = action.payload.count;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductBySlug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
        state.detailError = null;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // fetchRelatedProducts
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      });
  },
});

export const { clearProductErrors, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
