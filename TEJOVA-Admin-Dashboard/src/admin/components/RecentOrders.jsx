import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { recentOrders } from "../data/dashboardData";

const statusStyles = {
  Completed: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
  Processing: "bg-[#FEF7E0] text-[#B06000] border border-[#FDE293]",
  Pending: "bg-[#FFF4E5] text-[#B25900] border border-[#FFD8B4]",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBE6DC] shadow-2xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg md:text-xl font-bold text-[#1F1F1F]">
          Recent Orders
        </h2>
        <button
          type="button"
          className="text-xs md:text-sm font-medium text-[#1F4D3B] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowForwardIcon className="text-xs" />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#F0EBE1] text-[11px] md:text-xs font-semibold uppercase tracking-wider text-[#687280]">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Products</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F3E9] text-xs md:text-sm">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#FDFBF7] transition-colors group"
              >
                <td className="py-3.5 px-3 font-semibold text-[#1F1F1F]">
                  {order.id}
                </td>
                <td className="py-3.5 px-3 font-medium text-[#1F1F1F]">
                  {order.customer}
                </td>
                <td className="py-3.5 px-3 text-[#687280]">{order.date}</td>
                <td className="py-3.5 px-3 text-[#1F1F1F] font-medium">
                  {order.product}
                </td>
                <td className="py-3.5 px-3 font-semibold text-[#1F1F1F]">
                  {order.amount}
                </td>
                <td className="py-3.5 px-3 text-[#687280]">{order.payment}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#1F4D3B] hover:underline cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
                      aria-label="More Options"
                    >
                      <MoreVertIcon className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
