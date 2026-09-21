import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { topProducts } from "../data/dashboardData";

export default function TopProducts({ products = topProducts }) {
  const displayProducts = products || [];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#B87333]/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[#0A2342]">
          Top Products
        </h2>
        <Link
          to="/admin/products"
          className="text-xs md:text-sm font-semibold text-[#B87333] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowForwardIcon className="text-xs" />
        </Link>
      </div>

      <div className="space-y-4">
        {displayProducts.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center font-medium">
            No top products data available.
          </p>
        ) : (
          displayProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] border border-[#B87333]/30 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="hidden text-xs font-bold text-[#0A2342]">
                {product.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 text-xs md:text-sm font-medium">
                <span className="text-[#0A2342] font-semibold truncate">
                  {product.name}
                </span>
                <span className="text-gray-500 text-xs font-normal">
                  {product.percentage}%
                </span>
              </div>

              <div className="text-[11px] md:text-xs text-gray-500 mb-1.5">
                <span className="font-bold text-[#0A2342]">
                  {product.price}
                </span>{" "}
                • {product.salesCount}
              </div>

              <div className="w-full h-1.5 bg-[#F5F3EF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A2342] rounded-full transition-all duration-300"
                  style={{ width: `${product.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
