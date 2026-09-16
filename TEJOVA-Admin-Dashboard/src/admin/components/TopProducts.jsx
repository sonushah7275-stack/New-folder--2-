import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { topProducts } from "../data/dashboardData";

export default function TopProducts() {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBE6DC] shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[#1F1F1F]">
          Top Products
        </h2>
        <button
          type="button"
          className="text-xs md:text-sm font-medium text-[#1F4D3B] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowForwardIcon className="text-xs" />
        </button>
      </div>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F7F3E9] border border-[#E7E1D3] overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="hidden text-xs font-bold text-[#1F4D3B]">
                {product.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 text-xs md:text-sm font-medium">
                <span className="text-[#1F1F1F] font-semibold truncate">
                  {product.name}
                </span>
                <span className="text-[#687280] text-xs font-normal">
                  {product.percentage}%
                </span>
              </div>

              <div className="text-[11px] md:text-xs text-[#687280] mb-1.5">
                <span className="font-semibold text-[#1F1F1F]">
                  {product.price}
                </span>{" "}
                • {product.salesCount}
              </div>

              <div className="w-full h-1.5 bg-[#F0EBE1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1F4D3B] rounded-full transition-all duration-300"
                  style={{ width: `${product.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
