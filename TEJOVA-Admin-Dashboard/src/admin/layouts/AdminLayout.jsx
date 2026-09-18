import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex text-[#0A2342] font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-30 w-60">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileDrawer}
          />

          <div className="relative z-10 w-60 max-w-[80vw] h-full bg-[#0A2342] flex flex-col shadow-2xl">
            <button
              type="button"
              onClick={closeMobileDrawer}
              className="absolute top-4 right-3 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Navigation Menu"
            >
              <CloseIcon className="text-xl" />
            </button>
            <AdminSidebar onItemClick={closeMobileDrawer} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0 min-h-screen">
        <AdminHeader onMenuToggle={toggleMobileDrawer} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
