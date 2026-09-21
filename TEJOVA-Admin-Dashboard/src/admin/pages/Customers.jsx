import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import {
  fetchCustomers,
  fetchCustomerById,
  setSelectedCustomer,
} from "../../Redux/slices/customerSlice.js";

export default function Customers() {
  const dispatch = useDispatch();
  const { customers, selectedCustomer, loading, error } = useSelector(
    (state) => state.adminCustomers || state.customers
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers({ role: "USER" }));
  }, [dispatch]);

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(
      (c) =>
        !searchTerm ||
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  const handleOpenDetails = (customer) => {
    dispatch(setSelectedCustomer(customer));
    if (customer._id || customer.id) {
      dispatch(fetchCustomerById(customer._id || customer.id));
    }
    setIsModalOpen(true);
  };

  const tableColumns = [
    { label: "Customer", key: "name" },
    { label: "Contact Info", key: "email" },
    { label: "Location", key: "location" },
    { label: "Orders", key: "totalOrders" },
    { label: "Total Spent", key: "totalSpent" },
    { label: "Joined Date", key: "joinedDate" },
    { label: "Status", key: "status" },
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
              { label: "Customers", path: "/admin/customers" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Customers Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage registered TEJOVA users, purchase histories, and contact records
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, email, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <CircularProgress size={32} style={{ color: "#B87333" }} />
        </div>
      )}

      {/* Customer Table */}
      {!loading && (
        <AdminTable
          columns={tableColumns}
          data={filteredCustomers}
          emptyMessage="No customers found matching your search."
          renderRow={(cust) => (
            <tr
              key={cust._id || cust.id}
              className="hover:bg-[#F5F3EF]/50 transition-colors group"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A2342] text-[#FAF9F6] font-bold text-sm flex items-center justify-center border border-[#B87333]">
                    {cust.avatar || "U"}
                  </div>
                  <div>
                    <div className="font-bold text-[#0A2342] text-sm">
                      {cust.name}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      ID #{cust.id ? String(cust.id).substring(0, 8) : "N/A"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-xs text-[#0A2342] font-semibold">
                  {cust.email}
                </div>
                <div className="text-[11px] text-gray-400">{cust.phone || "N/A"}</div>
              </td>
              <td className="py-3.5 px-4 text-xs font-medium text-gray-600">
                {cust.location || "N/A"}
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-[#0A2342]">
                {cust.totalOrders || 0} orders
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-[#B87333]">
                ${(cust.totalSpent || 0).toFixed(2)}
              </td>
              <td className="py-3.5 px-4 text-xs text-gray-500">
                {cust.joinedDate || "N/A"}
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={cust.status || (cust.isActive ? "Active" : "Inactive")} />
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  type="button"
                  onClick={() => handleOpenDetails(cust)}
                  className="px-3 py-1.5 rounded-xl bg-[#0A2342] hover:bg-[#B87333] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  Profile
                </button>
              </td>
            </tr>
          )}
        />
      )}

      {/* Customer Profile Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? `Customer Profile — ${selectedCustomer.name}` : "Customer Profile"}
        maxWidth="max-w-lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="flex items-center gap-4 bg-[#F5F3EF] p-4 rounded-xl border border-[#B87333]/20">
              <div className="w-14 h-14 rounded-full bg-[#0A2342] text-[#FAF9F6] font-bold text-xl flex items-center justify-center border-2 border-[#B87333]">
                {selectedCustomer.avatar || "U"}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Member since {selectedCustomer.joinedDate || "N/A"}
                </p>
                <div className="mt-1">
                  <StatusBadge status={selectedCustomer.status || (selectedCustomer.isActive ? "Active" : "Inactive")} />
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                <MailOutlinedIcon className="text-gray-400 text-lg" />
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">
                    Email Address
                  </div>
                  <div className="font-semibold text-[#0A2342]">
                    {selectedCustomer.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                <PhoneOutlinedIcon className="text-gray-400 text-lg" />
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">
                    Phone Number
                  </div>
                  <div className="font-semibold text-[#0A2342]">
                    {selectedCustomer.phone || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                <LocationOnOutlinedIcon className="text-gray-400 text-lg" />
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">
                    Primary Address
                  </div>
                  <div className="font-semibold text-[#0A2342]">
                    {selectedCustomer.location || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0A2342]/5 rounded-xl border border-[#0A2342]/10 text-center">
                <div className="text-[10px] font-bold uppercase text-gray-500">
                  Total Purchases
                </div>
                <div className="text-xl font-bold text-[#0A2342] mt-1">
                  {selectedCustomer.totalOrders || 0} Orders
                </div>
              </div>

              <div className="p-3 bg-[#B87333]/5 rounded-xl border border-[#B87333]/20 text-center">
                <div className="text-[10px] font-bold uppercase text-gray-500">
                  Total Spent
                </div>
                <div className="text-xl font-bold text-[#B87333] mt-1">
                  ${(selectedCustomer.totalSpent || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0A2342] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}