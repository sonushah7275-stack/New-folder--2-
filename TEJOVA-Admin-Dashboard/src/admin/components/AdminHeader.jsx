import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function AdminHeader({ onMenuToggle }) {
  const [searchValue, setSearchValue] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
    if (profileOpen) setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F3EF]/95 backdrop-blur-md border-b-2 border-[#B87333] px-4 md:px-8 py-3 flex items-center justify-between transition-all shadow-xs">
      {/* Left: Mobile Drawer Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#0A2342] hover:bg-[#B87333]/10 transition-colors cursor-pointer focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <MenuIcon className="text-2xl" />
        </button>
      </div>

      {/* Right: Search bar & User controls */}
      <div className="flex items-center gap-3 md:gap-5 ml-auto relative">
        {/* Search Input */}
        <div className="relative w-40 sm:w-64 md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-white border border-[#0A2342]/20 rounded-full text-[#0A2342] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-[#B87333] shadow-2xs transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative p-2 rounded-full text-[#0A2342] hover:bg-[#B87333]/15 transition-colors cursor-pointer focus:outline-none"
              aria-label="Notifications"
            >
              <NotificationsNoneIcon className="text-xl md:text-2xl" />
              {/* Copper Notification Badge with subtle pulse animation */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#B87333] rounded-full ring-2 ring-[#F5F3EF] animate-pulse" />
            </button>

            {notificationsOpen && (
              <NotificationDropdown onClose={() => setNotificationsOpen(false)} />
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            className="p-2 rounded-full text-[#0A2342] hover:bg-[#B87333]/15 transition-colors cursor-pointer focus:outline-none"
            aria-label="Help"
          >
            <HelpOutlineIcon className="text-xl md:text-2xl" />
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="relative border-l border-[#B87333]/30 pl-2">
          <button
            type="button"
            onClick={toggleProfile}
            className="hidden sm:flex items-center gap-2.5 p-1 rounded-full hover:bg-[#B87333]/10 transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0A2342] text-[#FAF9F6] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#B87333]">
              A
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#0A2342]">Admin</span>
              <span className="text-[10px] text-gray-500">Administrator</span>
            </div>
            <KeyboardArrowDownIcon className="text-[#0A2342] text-sm" />
          </button>

          {profileOpen && (
            <ProfileDropdown onClose={() => setProfileOpen(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
