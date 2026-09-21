import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

/**
 * Helper to transform raw Mongoose Order objects to match the UI component structure expected by Orders.jsx
 */
const formatOrderForUI = (order) => {
  if (!order) return null;

  const rawStatus = order.orderStatus || "PENDING";
  let uiStatus = "Pending";
  if (rawStatus === "DELIVERED") uiStatus = "Completed";
  else if (rawStatus === "PROCESSING") uiStatus = "Processing";
  else if (rawStatus === "CONFIRMED") uiStatus = "Processing";
  else if (rawStatus === "SHIPPED") uiStatus = "Processing";
  else if (rawStatus === "CANCELLED") uiStatus = "Cancelled";
  else if (rawStatus === "PENDING") uiStatus = "Pending";
  else {
    uiStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  }

  const rawPayment = order.paymentStatus || "PENDING";
  const uiPaymentStatus =
    rawPayment.charAt(0).toUpperCase() + rawPayment.slice(1).toLowerCase();

  const formattedItems = (order.items || []).map((item) => ({
    name: item.name || item.product?.name || "Product Item",
    qty: item.quantity || item.qty || 1,
    price: item.price || 0,
    subtotal: item.subtotal || (item.price || 0) * (item.quantity || item.qty || 1),
  }));

  const addr = order.shippingAddress || {};
  const formattedAddress = [
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state ? `${addr.state} ${addr.postalCode || ""}`.trim() : addr.postalCode,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");

  const productSummary = formattedItems
    .map((item) => `${item.name} x ${item.qty}`)
    .join(", ");

  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return {
    _id: order._id,
    id: order.orderNumber || order._id,
    orderNumber: order.orderNumber,
    customer: addr.fullName || order.user?.name || "Customer",
    email: order.user?.email || "N/A",
    phone: addr.phone || "N/A",
    date: dateFormatted,
    productSummary: productSummary || "N/A",
    itemsCount: formattedItems.reduce((acc, i) => acc + i.qty, 0),
    subtotal: order.subtotal || 0,
    shippingCost: order.shippingAmount || 0,
    tax: order.taxAmount || 0,
    total: order.totalAmount || 0,
    paymentStatus: uiPaymentStatus,
    paymentMethod: order.paymentMethod || "Credit Card",
    status: uiStatus,
    rawOrderStatus: rawStatus,
    shippingAddress: formattedAddress || "N/A",
    items: formattedItems,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

/**
 * Fetch all orders (Admin view with search & filtering)
 * GET /api/orders
 */
export const fetchOrders = createAsyncThunk(
  "adminOrders/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders", { params });
      const rawOrders = response.data?.data || [];
      const formattedOrders = rawOrders.map(formatOrderForUI);

      return {
        orders: formattedOrders,
        rawOrders: rawOrders,
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch orders.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch a single order by ID
 * GET /api/orders/:id
 */
export const fetchOrderById = createAsyncThunk(
  "adminOrders/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      const rawOrder = response.data?.data;
      return formatOrderForUI(rawOrder);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch order details.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, orderStatus, paymentStatus }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, {
        orderStatus,
        paymentStatus,
      });

      const updatedRaw = response.data?.data;
      const formatted = formatOrderForUI(updatedRaw);

      // Refresh overall order list
      dispatch(fetchOrders());

      return formatted;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update order status.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  pagination: null,
  loading: false,
  mutationLoading: false,
  error: null,
  successMessage: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearOrderStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.selectedOrder = action.payload;
        state.successMessage = "Order status updated successfully!";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderStatus, setSelectedOrder } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
