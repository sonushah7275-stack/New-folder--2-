import Order from "../models/Order.js";

/**
 * GET /api/orders
 * Get all orders for Admin view (with optional search, status filtering, and pagination)
 * Access: Private/Admin
 */
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search = "", status } = req.query;

    const query = {};

    // Filter by order status if provided and not "All"
    if (status && status !== "All") {
      const normalizedStatus = status.toUpperCase();
      if (normalizedStatus === "COMPLETED") {
        query.orderStatus = "DELIVERED";
      } else if (["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(normalizedStatus)) {
        query.orderStatus = normalizedStatus;
      }
    }

    // Search by orderNumber
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber) || 1,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Get single order details by ID or orderNumber
 * Access: Private/Admin
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order) {
      order = await Order.findOne({ orderNumber: id })
        .populate("user", "name email")
        .populate("items.product", "name price images");
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/status or PATCH /api/orders/:id
 * Update order status and/or payment status
 * Access: Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, status, paymentStatus } = req.body;

    let order = await Order.findById(id);
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const inputStatus = orderStatus || status;

    if (inputStatus) {
      let targetStatus = inputStatus.toUpperCase();
      if (targetStatus === "COMPLETED") {
        targetStatus = "DELIVERED";
      }

      const validOrderStatuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      if (!validOrderStatuses.includes(targetStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid order status '${inputStatus}'. Valid options: ${validOrderStatuses.join(
            ", "
          )}`,
        });
      }

      order.orderStatus = targetStatus;
    }

    if (paymentStatus) {
      const targetPayment = paymentStatus.toUpperCase();
      const validPaymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

      if (!validPaymentStatuses.includes(targetPayment)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status '${paymentStatus}'. Valid options: ${validPaymentStatuses.join(
            ", "
          )}`,
        });
      }

      order.paymentStatus = targetPayment;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
