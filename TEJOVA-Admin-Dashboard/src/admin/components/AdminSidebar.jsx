import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";
import MailIcon from "@mui/icons-material/Mail";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const iconMap = {
  Dashboard: DashboardIcon,
  Inventory2: Inventory2Icon,
  Category: CategoryIcon,
  ShoppingBag: ShoppingBagIcon,
  People: PeopleIcon,
  MenuBook: MenuBookIcon,
  BarChart: BarChartIcon,
  Mail: MailIcon,
  PermMedia: PermMediaIcon,
  EditNote: EditNoteIcon,
  Settings: SettingsIcon,
};

const mainNavItems = [
  { name: "Dashboard", icon: "Dashboard", path: "/admin" },
  { name: "Products", icon: "Inventory2", path: "/admin/products" },
  { name: "Categories", icon: "Category", path: "/admin/categories" },
  { name: "Orders", icon: "ShoppingBag", path: "/admin/orders" },
  { name: "Customers", icon: "People", path: "/admin/customers" },
  { name: "Journal", icon: "MenuBook", path: "/admin/journal" },
  { name: "Pillars", icon: "BarChart", path: "/admin/pillars" },
  { name: "Newsletter", icon: "Mail", path: "/admin/newsletter" },
  { name: "Media", icon: "PermMedia", path: "/admin/media" },
];

const secondaryNavItems = [
  { name: "Content", icon: "EditNote", path: "/admin/content" },
  { name: "Settings", icon: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar({ onItemClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isNavItemActive = (itemPath) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    navigate("/admin", { replace: true });
  };

  const renderNavItem = (item) => {
    const IconComponent = iconMap[item.icon];
    const active = isNavItemActive(item.path);

    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={handleItemClick}
        className={`
          group
          flex
          items-center
          gap-3.5
          px-4
          py-1.5
          rounded-lg
          text-sm
          font-medium
          transition-all
          duration-150
          ${
            active
              ? "bg-[#B87333] text-[#FAF9F6] shadow-md font-semibold"
              : "text-gray-300 hover:bg-[#B87333]/20 hover:text-[#FAF9F6]"
          }
        `}
      >
        {IconComponent && (
          <IconComponent
            className={`
              text-[20px]
              transition-colors
              ${active ? "text-[#FAF9F6]" : "text-gray-400 group-hover:text-[#FAF9F6]"}
            `}
          />
        )}
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-60 min-h-screen bg-[#0A2342] text-[#FAF9F6] flex flex-col justify-between select-none shadow-xl border-r border-[#0A2342]">
      {/* Top Branding & Nav */}
      <div>
        <div className="pt-5 pb-5 px-6 flex flex-col items-start border-b border-white/10">
          <h1 className="text-xl font-serif tracking-[0.22em] font-bold text-[#FAF9F6]">
            TEJOVA
          </h1>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-[#B87333] uppercase mt-0.5">
            ADMIN CONSOLE
          </span>
          <span className="text-[9px] tracking-[0.18em] text-gray-400 uppercase font-light mt-2 pt-2 border-t border-white/10 w-full">
            EXPAND YOUR LIGHT
          </span>
        </div>

        <nav className="p-3 space-y-1">
          {mainNavItems.map(renderNavItem)}

          <div className="my-3 border-t border-white/10 mx-2" />

          {secondaryNavItems.map(renderNavItem)}
        </nav>
      </div>

      {/* Profile & Logout */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#081B33]">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B87333] text-[#FAF9F6] flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#FAF9F6] leading-tight">
                Admin
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">
                Administrator
              </span>
            </div>
          </div>
          <KeyboardArrowDownIcon className="text-gray-400 text-sm" />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-2
            rounded-lg
            text-sm
            text-gray-300
            hover:bg-[#B87333]/20
            hover:text-[#FAF9F6]
            transition-colors
            cursor-pointer
          "
        >
          <LogoutIcon className="text-[18px] text-gray-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
