import React from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const quickActionIcons = {
  add_product: AddIcon,
  create_journal: ArticleIcon,
  add_category: CreateNewFolderIcon,
  view_orders: ShoppingBagIcon,
};

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { id: 1, label: "Add Product", icon: "add_product", path: "/admin/products" },
    { id: 2, label: "Create Article", icon: "create_journal", path: "/admin/journal" },
    { id: 3, label: "Add Category", icon: "add_category", path: "/admin/categories" },
    { id: 4, label: "View Orders", icon: "view_orders", path: "/admin/orders" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#B87333]/20 shadow-sm">
      <h2 className="text-lg md:text-xl font-bold text-[#0A2342] mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => {
          const IconComponent = quickActionIcons[act.icon] || AddIcon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => navigate(act.path)}
              className="flex items-center justify-start gap-2.5 px-3.5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white transition-all duration-200 cursor-pointer text-xs md:text-sm font-semibold shadow-sm hover:shadow-md group"
            >
              <IconComponent className="text-lg text-white" />
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
