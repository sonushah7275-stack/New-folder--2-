import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecentActivity from "../components/RecentActivity";
import RecentOrders from "../components/RecentOrders";
import TopProducts from "../components/TopProducts";
import QuickActions from "../components/QuickActions";

import { fetchDashboardStats } from "../../Redux/slices/adminDashboardSlice";
import { dashboardStats } from "../data/dashboardData";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.adminDashboard);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    dispatch(fetchDashboardStats({ period: selectedPeriod }));
  }, [dispatch, selectedPeriod]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats({ period: selectedPeriod }));
  };

  const currentStats = data?.stats || dashboardStats;
  const currentRevenueChart = data?.revenueChart || [];
  const currentRecentOrders = data?.recentOrders || [];
  const currentTopProducts = data?.topProducts || [];
  const currentRecentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Dashboard", path: "/admin" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2342] tracking-tight mt-1">
            Good morning, Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here's what's happening with TEJOVA today.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-[#B87333]/30 text-gray-600 hover:text-[#0A2342] hover:bg-[#F5F3EF] shadow-2xs transition-colors cursor-pointer"
            title="Refresh Statistics"
          >
            <RefreshIcon className={`text-lg ${loading ? "animate-spin text-[#B87333]" : ""}`} />
          </button>

          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-8 pr-7 py-2 rounded-xl bg-white border border-[#B87333]/30 text-xs sm:text-sm font-semibold text-[#0A2342] hover:bg-[#F5F3EF] shadow-2xs transition-colors cursor-pointer focus:outline-none"
            >
              <option value="7days">7 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <CalendarTodayIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none" />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <FileDownloadIcon className="text-sm" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Backend Error Alert Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <ErrorOutlinedIcon className="text-base text-red-500" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="font-semibold underline hover:text-red-900 cursor-pointer ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {currentStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Revenue & Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
        <div className="xl:col-span-8">
          <RevenueChart data={currentRevenueChart} />
        </div>
        <div className="xl:col-span-4">
          <RecentActivity activities={currentRecentActivity} />
        </div>
      </div>

      {/* Orders & Top Products Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
        <div className="xl:col-span-8">
          <RecentOrders orders={currentRecentOrders} />
        </div>
        <div className="xl:col-span-4 space-y-5 md:space-y-6">
          <TopProducts products={currentTopProducts} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
