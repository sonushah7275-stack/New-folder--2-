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
  {
    name: "Dashboard",
    icon: "Dashboard",
    path: "/admin",
  },
  {
    name: "Products",
    icon: "Inventory2",
    path: "/admin/products",
  },
  {
    name: "Categories",
    icon: "Category",
    path: "/admin/categories",
  },
  {
    name: "Orders",
    icon: "ShoppingBag",
    path: "/admin/orders",
  },
  {
    name: "Customers",
    icon: "People",
    path: "/admin/customers",
  },
  {
    name: "Journal",
    icon: "MenuBook",
    path: "/admin/journal",
  },
  {
    name: "Pillars",
    icon: "BarChart",
    path: "/admin/pillars",
  },
  {
    name: "Newsletter",
    icon: "Mail",
    path: "/admin/newsletter",
  },
  {
    name: "Media",
    icon: "PermMedia",
    path: "/admin/media",
  },
];

const secondaryNavItems = [
  {
    name: "Content",
    icon: "EditNote",
    path: "/admin/content",
  },
  {
    name: "Settings",
    icon: "Settings",
    path: "/admin/settings",
  },
];

export default function AdminSidebar({ onItemClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // ACTIVE MENU
  // ==========================================
  const isNavItemActive = (itemPath) => {
    // Dashboard should only be active on /admin
    if (itemPath === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }

    // Other menu items
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  // ==========================================
  // NAVIGATION CLICK
  // ==========================================
  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Remove authentication
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("sellerJwt");

    // Close sidebar if mobile
    if (onItemClick) {
      onItemClick();
    }

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  // ==========================================
  // RENDER NAV ITEM
  // ==========================================
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
              ? "bg-[#91B19D] text-[#143B2C] shadow-sm"
              : "text-gray-200 hover:bg-[#285D49] hover:text-white"
          }
        `}
      >
        {IconComponent && (
          <IconComponent
            className={`
              text-[20px]
              transition-colors
              ${
                active
                  ? "text-[#143B2C]"
                  : "text-gray-300 group-hover:text-white"
              }
            `}
          />
        )}

        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-60 min-h-screen bg-[#1F4D3B] text-white flex flex-col justify-between select-none shadow-md">
      {/* ==========================================
          TOP SECTION
      ========================================== */}
      <div>
        {/* Branding */}
        <div className="pt-4 pb-5 px-6 flex flex-col items-start border-b border-[#2C614D]">
          <h1 className="text-xl font-serif tracking-[0.22em] font-semibold text-white">
            TEJOVA
          </h1>

          <span className="text-[10px] tracking-[0.25em] font-semibold text-[#A2C2AE] uppercase mt-0.5">
            ADMIN CONSOLE
          </span>

          <span className="text-[9px] tracking-[0.18em] text-gray-300 uppercase font-light mt-2 pt-2 border-t border-[#2C614D] w-full">
            EXPAND YOUR LIGHT
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {mainNavItems.map(renderNavItem)}

          <div className="my-3 border-t border-[#2C614D] mx-2" />

          {secondaryNavItems.map(renderNavItem)}
        </nav>
      </div>

      {/* ==========================================
          BOTTOM SECTION
      ========================================== */}
      <div className="p-3 border-t border-[#2C614D] space-y-2">
        {/* Admin Profile */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#183E30] border border-[#275947]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8CAAA0] text-[#143B2C] flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">
                Admin
              </span>

              <span className="text-[10px] text-gray-300 leading-tight">
                Administrator
              </span>
            </div>
          </div>

          <KeyboardArrowDownIcon className="text-gray-300 text-sm cursor-pointer hover:text-white" />
        </div>

        {/* Logout */}
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
            text-gray-200
            hover:bg-[#285D49]
            hover:text-white
            transition-colors
            cursor-pointer
          "
        >
          <LogoutIcon className="text-[18px] text-gray-300" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
