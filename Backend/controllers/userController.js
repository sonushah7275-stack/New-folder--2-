import mongoose from "mongoose";
import User from "../models/User.js";
import Order from "../models/Order.js";

/**
 * Get all users with pagination, search, and filtering
 * GET /api/users
 * Protected: Admin Only
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    const { search, role, isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["USER", "ADMIN"].includes(role.toUpperCase())) {
      query.role = role.toUpperCase();
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Aggregate order statistics (total orders & total spent) for each user
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    const orderStatsMap = {};
    orderStats.forEach((stat) => {
      if (stat._id) {
        orderStatsMap[stat._id.toString()] = {
          totalOrders: stat.totalOrders || 0,
          totalSpent: stat.totalSpent || 0,
        };
      }
    });

    // Retrieve latest order shipping info per user for phone & location snapshot
    const userIds = users.map((u) => u._id);
    const latestOrders = await Order.find({ user: { $in: userIds } })
      .sort({ createdAt: -1 });

    const userAddressMap = {};
    latestOrders.forEach((order) => {
      const uId = order.user?.toString();
      if (uId && !userAddressMap[uId] && order.shippingAddress) {
        const addr = order.shippingAddress;
        const locStr = [addr.city, addr.state].filter(Boolean).join(", ") || addr.country || "N/A";
        userAddressMap[uId] = {
          phone: addr.phone || "N/A",
          location: locStr,
        };
      }
    });

    // Format safe customer profiles for Admin response
    const formattedUsers = users.map((user) => {
      const uId = user._id.toString();
      const stats = orderStatsMap[uId] || { totalOrders: 0, totalSpent: 0 };
      const addrInfo = userAddressMap[uId] || { phone: "N/A", location: "N/A" };

      return {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        status: user.isActive ? "Active" : "Inactive",
        avatar: user.name ? user.name.charAt(0).toUpperCase() : "U",
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        phone: addrInfo.phone,
        location: addrInfo.location,
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * GET /api/users/:id
 * Protected: Admin Only
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const latestOrder = orders[0];

    const phone = latestOrder?.shippingAddress?.phone || "N/A";
    const locStr = latestOrder?.shippingAddress
      ? [latestOrder.shippingAddress.city, latestOrder.shippingAddress.state].filter(Boolean).join(", ") || latestOrder.shippingAddress.country
      : "N/A";

    const formattedUser = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      status: user.isActive ? "Active" : "Inactive",
      avatar: user.name ? user.name.charAt(0).toUpperCase() : "U",
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      phone,
      location: locStr,
      totalOrders,
      totalSpent,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role or status by Admin
 * PATCH /api/users/:id
 * Protected: Admin Only
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name) user.name = name.trim();
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
      user.email = normalizedEmail;
    }

    if (role && ["USER", "ADMIN"].includes(role.toUpperCase())) {
      user.role = role.toUpperCase();
    }

    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 * DELETE /api/users/:id
 * Protected: Admin Only
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admins cannot delete their own account.",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
