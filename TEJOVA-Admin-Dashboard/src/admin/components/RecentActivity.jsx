import React from "react";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { recentActivity } from "../data/dashboardData";

const activityIconMap = {
  product: Inventory2Icon,
  customer: PersonIcon,
  order: ShoppingBagIcon,
  journal: MenuBookIcon,
};

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBE6DC] shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg md:text-xl font-bold text-[#1F1F1F]">
          Recent Activity
        </h2>
        <button
          type="button"
          className="text-xs md:text-sm font-medium text-[#1F4D3B] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowForwardIcon className="text-xs" />
        </button>
      </div>

      <div className="relative pl-3 pr-1 py-1 space-y-6">
        <div className="absolute left-[27px] top-4 bottom-6 w-0.5 bg-[#F0EBE1] -z-0" />

        {recentActivity.map((item) => {
          const IconComponent = activityIconMap[item.type] || Inventory2Icon;
          return (
            <div key={item.id} className="relative z-10 flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-[#F7F3E9] border border-[#E7E1D3] text-[#1F4D3B] flex items-center justify-center shrink-0 group-hover:bg-[#1F4D3B] group-hover:text-white transition-all duration-200">
                <IconComponent className="text-sm" />
              </div>

              <div className="flex-1 text-xs md:text-sm">
                <div className="font-semibold text-[#1F1F1F] leading-tight">
                  {item.title}
                </div>
                <div className="text-[#1F4D3B] font-medium mt-0.5">
                  {item.description}
                </div>
                <div className="text-[#687280] text-[11px] mt-1 font-normal">
                  {item.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
