import React from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecentActivity from "../components/RecentActivity";
import RecentOrders from "../components/RecentOrders";
import TopProducts from "../components/TopProducts";
import QuickActions from "../components/QuickActions";

import { dashboardStats } from "../data/dashboardData";

export default function DashboardPage() {
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
          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#B87333]/30 text-xs sm:text-sm font-semibold text-[#0A2342] hover:bg-[#F5F3EF] shadow-2xs transition-colors cursor-pointer"
          >
            <CalendarTodayIcon className="text-sm text-gray-500" />
            <span>This Month</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <FileDownloadIcon className="text-sm" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Revenue & Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
        <div className="xl:col-span-8">
          <RevenueChart />
        </div>
        <div className="xl:col-span-4">
          <RecentActivity />
        </div>
      </div>

      {/* Orders & Top Products Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
        <div className="xl:col-span-8">
          <RecentOrders />
        </div>
        <div className="xl:col-span-4 space-y-5 md:space-y-6">
          <TopProducts />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
