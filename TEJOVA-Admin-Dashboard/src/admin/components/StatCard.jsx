import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";

const iconComponents = {
  TrendingUp: TrendingUpIcon,
  ShoppingBag: ShoppingBagIcon,
  Inventory2: Inventory2Icon,
  People: PeopleIcon,
};

function MiniSparkline({ points = [], color = "#1F4D3B" }) {
  if (!points || points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const svgPoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={svgPoints}
      />
    </svg>
  );
}

export default function StatCard({ stat }) {
  const { title, value, change, comparison, icon, sparkline } = stat;
  const IconComponent = iconComponents[icon] || TrendingUpIcon;

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#EBE6DC] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EBF2EE] text-[#1F4D3B] flex items-center justify-center">
            <IconComponent className="text-lg" />
          </div>
          <span className="text-xs md:text-sm font-semibold text-[#687280]">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between mt-3 mb-2">
        <h3 className="text-2xl md:text-[28px] font-bold text-[#1F1F1F] tracking-tight leading-none">
          {value}
        </h3>
        <div className="mb-1">
          <MiniSparkline points={sparkline} color="#1F4D3B" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-[#1F4D3B] flex items-center">
          ↑ {change}
        </span>
        <span className="text-[#687280] font-normal">{comparison}</span>
      </div>
    </div>
  );
}
