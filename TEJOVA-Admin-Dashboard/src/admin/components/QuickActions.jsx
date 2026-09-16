import React from "react";
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
  const actions = [
    { id: 1, label: "Add Product", icon: "add_product" },
    { id: 2, label: "Create Journal Article", icon: "create_journal" },
    { id: 3, label: "Add Category", icon: "add_category" },
    { id: 4, label: "View Orders", icon: "view_orders" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBE6DC] shadow-2xs">
      <h2 className="text-lg md:text-xl font-bold text-[#1F1F1F] mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => {
          const IconComponent = quickActionIcons[act.icon] || AddIcon;
          return (
            <button
              key={act.id}
              type="button"
              className="flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#E7E1D3] bg-[#FDFBF7] hover:bg-[#1F4D3B] text-[#1F4D3B] hover:text-white transition-all duration-200 cursor-pointer text-xs md:text-sm font-semibold group shadow-2xs"
            >
              <IconComponent className="text-lg text-[#1F4D3B] group-hover:text-white transition-colors" />
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
