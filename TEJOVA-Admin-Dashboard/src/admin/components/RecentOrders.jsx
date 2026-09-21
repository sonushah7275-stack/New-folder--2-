import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StatusBadge from "./StatusBadge";
import { recentOrders } from "../data/dashboardData";

export default function RecentOrders({ orders = recentOrders }) {
  const displayOrders = orders || [];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#B87333]/20 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg md:text-xl font-bold text-[#0A2342]">
          Recent Orders
        </h2>
        <Link
          to="/admin/orders"
          className="text-xs md:text-sm font-semibold text-[#B87333] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowForwardIcon className="text-xs" />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#0A2342] text-[#FAF9F6] text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 rounded-l-lg">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Products</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F3EF] text-xs md:text-sm">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500 font-medium">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#F5F3EF]/50 transition-colors group"
              >
                <td className="py-3.5 px-3 font-semibold text-[#0A2342]">
                  {order.id}
                </td>
                <td className="py-3.5 px-3 font-medium text-[#0A2342]">
                  {order.customer}
                </td>
                <td className="py-3.5 px-3 text-gray-500">{order.date}</td>
                <td className="py-3.5 px-3 text-[#0A2342] font-medium">
                  {order.product}
                </td>
                <td className="py-3.5 px-3 font-bold text-[#0A2342]">
                  {order.amount}
                </td>
                <td className="py-3.5 px-3 text-gray-500">{order.payment}</td>
                <td className="py-3.5 px-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to="/admin/orders"
                      className="text-xs font-semibold text-[#B87333] hover:underline cursor-pointer"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-[#0A2342] p-1 rounded-full cursor-pointer"
                      aria-label="More Options"
                    >
                      <MoreVertIcon className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
