import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

/**
 * Format relative time string (e.g. "10 minutes ago", "2 hours ago")
 */
function formatTimeAgo(date) {
  if (!date) return "Recently";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/**
 * Get Admin Dashboard Statistics
 * GET /api/admin/stats
 * Protected: Admin Only
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const period = req.query.period || "month";

    // 1. Total Products Count
    const totalProductsCount = await Product.countDocuments();

    // 2. Total Customers Count (role === "USER")
    const totalCustomersCount = await User.countDocuments({ role: "USER" });

    // 3. Total Orders Count
    const totalOrdersCount = await Order.countDocuments();

    // 4. Total Revenue (sum of totalAmount for paid non-cancelled orders)
    const revenueAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          orderStatus: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenueVal = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // 5. Stat Cards Formatting
    const stats = [
      {
        id: "revenue",
        title: "Revenue",
        value: `$${totalRevenueVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        change: "+0.0%",
        comparison: "vs last month",
        trend: "up",
        icon: "TrendingUp",
        sparkline: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, totalRevenueVal || 10],
      },
      {
        id: "orders",
        title: "Orders",
        value: totalOrdersCount.toLocaleString("en-US"),
        change: "+0.0%",
        comparison: "vs last month",
        trend: "up",
        icon: "ShoppingBag",
        sparkline: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, totalOrdersCount || 5],
      },
      {
        id: "products",
        title: "Products",
        value: totalProductsCount.toLocaleString("en-US"),
        change: `+${totalProductsCount}`,
        comparison: "total in catalog",
        trend: "up",
        icon: "Inventory2",
        sparkline: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, totalProductsCount || 3],
      },
      {
        id: "customers",
        title: "Customers",
        value: totalCustomersCount.toLocaleString("en-US"),
        change: `+${totalCustomersCount}`,
        comparison: "registered accounts",
        trend: "up",
        icon: "People",
        sparkline: [0, 1, 2, 3, 5, 8, 12, 15, 18, 22, 25, totalCustomersCount || 2],
      },
    ];

    // 6. Monthly Revenue Chart Data (Jan - Dec)
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const currentYear = new Date().getFullYear();

    const monthlyOrdersAgg = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$paymentStatus", "PAID"] }, { $ne: ["$orderStatus", "CANCELLED"] }] },
                "$totalAmount",
                0,
              ],
            },
          },
          orders: { $sum: 1 },
        },
      },
    ]);

    const revenueMap = {};
    monthlyOrdersAgg.forEach((item) => {
      revenueMap[item._id] = {
        revenue: Math.round(item.revenue / 1000) || 0, // In thousands for chart
        orders: item.orders,
      };
    });

    const revenueChart = monthNames.map((month, index) => {
      const monthNum = index + 1;
      const monthData = revenueMap[monthNum] || { revenue: 0, orders: 0 };
      return {
        month,
        revenue: monthData.revenue,
        orders: monthData.orders,
      };
    });

    // 7. Recent Orders (Latest 5)
    const rawRecentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOrders = rawRecentOrders.map((order) => {
      const firstItem = order.items?.[0];
      const itemText = firstItem
        ? order.items.length > 1
          ? `${firstItem.name} +${order.items.length - 1} more`
          : firstItem.name
        : "Order Items";

      const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const formattedStatus =
        order.orderStatus === "DELIVERED"
          ? "Completed"
          : order.orderStatus.charAt(0) + order.orderStatus.slice(1).toLowerCase();

      return {
        id: order.orderNumber || `#TJ-${order._id.toString().slice(-5).toUpperCase()}`,
        customer: order.shippingAddress?.fullName || order.user?.name || "Guest",
        date: formattedDate,
        product: itemText,
        amount: `$${order.totalAmount.toFixed(2)}`,
        payment: order.paymentStatus === "PAID" ? "Paid" : "Pending",
        status: formattedStatus,
      };
    });

    // 8. Top Products (By Order Item Sales or Catalog Fallback)
    const topProductsAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: "CANCELLED" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          price: { $first: "$items.price" },
          salesCountNum: { $sum: "$items.quantity" },
        },
      },
      { $sort: { salesCountNum: -1 } },
      { $limit: 4 },
    ]);

    let topProducts = [];

    if (topProductsAgg.length > 0) {
      const maxSales = topProductsAgg[0].salesCountNum || 1;
      topProducts = await Promise.all(
        topProductsAgg.map(async (item, idx) => {
          const productDoc = await Product.findById(item._id).select("images price");
          const imgUrl =
            productDoc?.images?.[0]?.url ||
            (typeof productDoc?.images?.[0] === "string" ? productDoc.images[0] : "");

          return {
            id: item._id || idx + 1,
            name: item.name,
            price: `$${item.price || productDoc?.price || 0}`,
            salesCount: `${item.salesCountNum} sales`,
            percentage: Math.round((item.salesCountNum / maxSales) * 100),
            image: imgUrl || "",
          };
        })
      );
    } else {
      // Catalog fallback if no order items exist yet
      const fallbackProducts = await Product.find({ isActive: true }).limit(4);
      topProducts = fallbackProducts.map((p, idx) => ({
        id: p._id,
        name: p.name,
        price: `$${p.price}`,
        salesCount: "0 sales",
        percentage: 0,
        image: p.images?.[0]?.url || (typeof p.images?.[0] === "string" ? p.images[0] : ""),
      }));
    }

    // 9. Recent Activity Stream
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(2);
    const recentUsers = await User.find({ role: "USER" }).sort({ createdAt: -1 }).limit(2);
    const recentOrdersForActivity = await Order.find().sort({ createdAt: -1 }).limit(2);

    const activities = [];

    recentProducts.forEach((p) => {
      activities.push({
        id: `p-${p._id}`,
        title: "New product added",
        description: p.name,
        timestamp: formatTimeAgo(p.createdAt),
        createdAt: p.createdAt,
        type: "product",
      });
    });

    recentUsers.forEach((u) => {
      activities.push({
        id: `u-${u._id}`,
        title: "New customer registered",
        description: u.name,
        timestamp: formatTimeAgo(u.createdAt),
        createdAt: u.createdAt,
        type: "customer",
      });
    });

    recentOrdersForActivity.forEach((o) => {
      activities.push({
        id: `o-${o._id}`,
        title: "New order placed",
        description: o.orderNumber || `#TJ-${o._id.toString().slice(-5).toUpperCase()}`,
        timestamp: formatTimeAgo(o.createdAt),
        createdAt: o.createdAt,
        type: "order",
      });
    });

    // Sort combined activities newest first
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentActivity = activities.slice(0, 4);

    return res.status(200).json({
      success: true,
      data: {
        stats,
        revenueChart,
        recentOrders,
        topProducts,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
