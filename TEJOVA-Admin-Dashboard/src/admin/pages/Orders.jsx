import React, { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import { initialOrders } from "../data/ordersData";

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const tabs = ["All", "Completed", "Processing", "Pending", "Cancelled"];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchTerm]);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      )
    );
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  const tableColumns = [
    { label: "Order ID", key: "id" },
    { label: "Customer", key: "customer" },
    { label: "Date", key: "date" },
    { label: "Products Summary", key: "summary" },
    { label: "Amount", key: "total" },
    { label: "Payment", key: "paymentStatus" },
    { label: "Order Status", key: "status" },
    { label: "Actions", key: "actions", align: "right" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Orders", path: "/admin/orders" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track customer purchases, fulfillment status, and order details
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#0A2342] text-white shadow-2xs"
                  : "text-gray-600 hover:bg-[#F5F3EF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID or customer..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <AdminTable
        columns={tableColumns}
        data={filteredOrders}
        emptyMessage="No orders found matching this filter."
        renderRow={(order) => (
          <tr
            key={order.id}
            className="hover:bg-[#F5F3EF]/50 transition-colors group"
          >
            <td className="py-3.5 px-4 font-bold text-[#0A2342] text-xs md:text-sm">
              {order.id}
            </td>
            <td className="py-3.5 px-4">
              <div className="font-semibold text-[#0A2342] text-xs md:text-sm">
                {order.customer}
              </div>
              <div className="text-[11px] text-gray-400">{order.email}</div>
            </td>
            <td className="py-3.5 px-4 text-xs text-gray-500">{order.date}</td>
            <td className="py-3.5 px-4 text-xs text-[#0A2342] max-w-xs truncate">
              {order.productSummary}
            </td>
            <td className="py-3.5 px-4 text-xs font-bold text-[#0A2342]">
              ${order.total.toFixed(2)}
            </td>
            <td className="py-3.5 px-4 text-xs">
              <StatusBadge status={order.paymentStatus} />
            </td>
            <td className="py-3.5 px-4">
              <StatusBadge status={order.status} />
            </td>
            <td className="py-3.5 px-4 text-right">
              <button
                type="button"
                onClick={() => handleOpenDetails(order)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A2342] hover:bg-[#B87333] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <VisibilityIcon className="text-xs" />
                <span>View</span>
              </button>
            </td>
          </tr>
        )}
      />

      {/* Order Details Modal */}
      <AdminModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedOrder ? `Order Details — ${selectedOrder.id}` : "Order Details"}
        maxWidth="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Customer Info */}
              <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#B87333]/20 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#0A2342] mb-1">
                  <PersonIcon className="text-sm text-[#B87333]" /> Customer
                </div>
                <p className="text-sm font-bold text-[#0A2342]">
                  {selectedOrder.customer}
                </p>
                <p className="text-xs text-gray-600">{selectedOrder.email}</p>
                <p className="text-xs text-gray-600">{selectedOrder.phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#B87333]/20 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#0A2342] mb-1">
                  <LocalShippingIcon className="text-sm text-[#B87333]" /> Shipping
                </div>
                <p className="text-xs text-[#0A2342] font-semibold leading-relaxed">
                  {selectedOrder.shippingAddress}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Placed on: {selectedOrder.date}
                </p>
              </div>

              {/* Payment & Status Control */}
              <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#B87333]/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#0A2342]">
                  <PaymentIcon className="text-sm text-[#B87333]" /> Status
                </div>
                <div className="text-xs text-gray-700 font-medium">
                  {selectedOrder.paymentMethod}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Update Order Status:
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs border border-[#0A2342]/30 rounded-lg bg-white font-semibold text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div>
              <h3 className="text-sm font-bold text-[#0A2342] uppercase tracking-wider mb-2">
                Order Items ({selectedOrder.itemsCount})
              </h3>
              <div className="border border-[#B87333]/20 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A2342] text-[#FAF9F6]">
                    <tr>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-[#0A2342]">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-gray-700">
                          {item.qty}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#0A2342]">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#B87333]/20 max-w-xs ml-auto space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#0A2342]">
                  ${selectedOrder.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-semibold text-[#0A2342]">
                  ${selectedOrder.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span className="font-semibold text-[#0A2342]">
                  ${selectedOrder.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-[#B87333]/30 pt-2 flex justify-between text-sm font-bold text-[#0A2342]">
                <span>Total Amount:</span>
                <span className="text-[#B87333]">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0A2342] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}