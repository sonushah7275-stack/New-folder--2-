import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Fetch all customer users with optional search and role filtering
 * GET /api/users?role=USER
 */
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/users", {
        params: { role: "USER", ...params },
      });
      return {
        customers: response.data?.data || [],
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch customers list.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch a single customer user by ID
 * GET /api/users/:id
 */
export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch customer profile.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  customers: [],
  selectedCustomer: null,
  pagination: null,
  loading: false,
  mutationLoading: false,
  error: null,
  successMessage: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomerStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCustomers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCustomerById
      .addCase(fetchCustomerById.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerStatus, setSelectedCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
