import React from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    navigate("/admin");
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#B87333]/30 overflow-hidden z-50 animate-fadeIn">
      <div className="p-4 bg-[#0A2342] text-[#FAF9F6] border-b border-white/10">
        <p className="text-sm font-semibold">Admin</p>
        <p className="text-xs text-gray-300">admin@tejova.com</p>
        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#B87333] text-white uppercase tracking-wider">
          Super Administrator
        </span>
      </div>

      <div className="p-1.5 space-y-1">
        <button
          type="button"
          onClick={() => handleNavigate("/admin/settings")}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#0A2342] hover:bg-[#F5F3EF] rounded-lg transition-colors cursor-pointer"
        >
          <PersonOutlinedIcon className="text-sm text-[#B87333]" />
          <span>Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/admin/settings")}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#0A2342] hover:bg-[#F5F3EF] rounded-lg transition-colors cursor-pointer"
        >
          <SettingsOutlinedIcon className="text-sm text-[#B87333]" />
          <span>Admin Settings</span>
        </button>

        <div className="my-1 border-t border-gray-100" />

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogoutIcon className="text-sm" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
