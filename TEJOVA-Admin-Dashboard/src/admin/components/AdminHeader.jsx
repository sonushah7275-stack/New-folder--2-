import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function AdminHeader({ onMenuToggle }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-20 bg-[#F7F3E9]/90 backdrop-blur-md border-b border-[#E7E1D3] px-4 md:px-8 py-3 flex items-center justify-between transition-all">
      {/* Left section: Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#1F4D3B] hover:bg-[#EAE4D7] transition-colors cursor-pointer focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <MenuIcon className="text-2xl" />
        </button>
      </div>

      {/* Right section: Search bar & User controls */}
      <div className="flex items-center gap-3 md:gap-5 ml-auto">
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64 md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-white border border-[#E1DBCF] rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1F4D3B] focus:border-[#1F4D3B] shadow-2xs transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications Button */}
          <button
            type="button"
            className="relative p-2 rounded-full text-gray-600 hover:bg-[#EAE4D7] hover:text-[#1F4D3B] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <NotificationsNoneIcon className="text-xl md:text-2xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#F7F3E9]" />
          </button>

          {/* Help Button */}
          <button
            type="button"
            className="p-2 rounded-full text-gray-600 hover:bg-[#EAE4D7] hover:text-[#1F4D3B] transition-colors cursor-pointer"
            aria-label="Help"
          >
            <HelpOutlineIcon className="text-xl md:text-2xl" />
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E1DBCF]">
          <div className="w-8 h-8 rounded-full bg-[#1F4D3B] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
            A
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1F1F1F]">Admin</span>
            <span className="text-[10px] text-[#687280]">Administrator</span>
          </div>
          <KeyboardArrowDownIcon className="text-gray-500 text-sm cursor-pointer hover:text-[#1F4D3B]" />
        </div>
      </div>
    </header>
  );
}
