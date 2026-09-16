import React, { useState } from "react";
import { revenueData } from "../data/dashboardData";

export default function RevenueChart() {
  const [activeFilter, setActiveFilter] = useState("30 Days");
  const [activePoint, setActivePoint] = useState(null);

  const filters = ["7 Days", "30 Days", "3 Months", "12 Months"];

  const svgWidth = 650;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = 50;

  const pointsData = revenueData.map((d, i) => {
    const x =
      paddingX + (i / (revenueData.length - 1)) * (svgWidth - 2 * paddingX);
    const revY = svgHeight - paddingY - (d.revenue / maxVal) * (svgHeight - 2 * paddingY);
    const ordY = svgHeight - paddingY - (d.orders / maxVal) * (svgHeight - 2 * paddingY);
    return { ...d, x, revY, ordY };
  });

  const createBezierPath = (points, keyY) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0][keyY]}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1[keyY] + (p2[keyY] - p0[keyY]) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2[keyY] - (p3[keyY] - p1[keyY]) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(
        1
      )} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2[keyY].toFixed(1)}`;
    }
    return path;
  };

  const revenuePath = createBezierPath(pointsData, "revY");
  const ordersPath = createBezierPath(pointsData, "ordY");

  const yTicks = [
    { label: "$50k", val: 50 },
    { label: "$40k", val: 40 },
    { label: "$30k", val: 30 },
    { label: "$20k", val: 20 },
    { label: "$10k", val: 10 },
    { label: "$0", val: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBE6DC] shadow-2xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#1F1F1F]">
            Revenue Overview
          </h2>
          <p className="text-xs md:text-sm text-[#687280] mt-0.5">
            Track your revenue and order performance
          </p>
        </div>

        <div className="flex items-center bg-[#F7F3E9] p-1 rounded-xl border border-[#E7E1D3] self-start sm:self-auto">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1F4D3B] text-white shadow-2xs"
                    : "text-[#687280] hover:text-[#1F1F1F]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6 mb-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1F4D3B]" />
          <span className="text-[#1F1F1F]">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#668F6B]" />
          <span className="text-[#1F1F1F]">Orders</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {yTicks.map((tick) => {
            const yPos =
              svgHeight - paddingY - (tick.val / maxVal) * (svgHeight - 2 * paddingY);
            return (
              <g key={tick.label}>
                <line
                  x1={paddingX}
                  y1={yPos}
                  x2={svgWidth - paddingX}
                  y2={yPos}
                  stroke="#F0EBE1"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[11px] fill-[#687280] font-medium"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {pointsData.map((pt) => (
            <text
              key={pt.month}
              x={pt.x}
              y={svgHeight - 8}
              textAnchor="middle"
              className="text-[11px] fill-[#687280] font-medium"
            >
              {pt.month}
            </text>
          ))}

          <path
            d={revenuePath}
            fill="none"
            stroke="#1F4D3B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={ordersPath}
            fill="none"
            stroke="#668F6B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pointsData.map((pt, idx) => (
            <g
              key={pt.month}
              className="cursor-pointer"
              onMouseEnter={() => setActivePoint(idx)}
              onMouseLeave={() => setActivePoint(null)}
            >
              {activePoint === idx && (
                <line
                  x1={pt.x}
                  y1={paddingY}
                  x2={pt.x}
                  y2={svgHeight - paddingY}
                  stroke="#1F4D3B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="opacity-40"
                />
              )}

              <circle
                cx={pt.x}
                cy={pt.revY}
                r={activePoint === idx ? "6" : "4"}
                fill="#1F4D3B"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-150"
              />

              <circle
                cx={pt.x}
                cy={pt.ordY}
                r={activePoint === idx ? "5" : "3.5"}
                fill="#668F6B"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="transition-all duration-150"
              />
            </g>
          ))}
        </svg>

        {activePoint !== null && (
          <div
            className="absolute z-10 bg-[#1F4D3B] text-white text-xs py-1.5 px-3 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all"
            style={{
              left: `${(pointsData[activePoint].x / svgWidth) * 100}%`,
              top: `${(pointsData[activePoint].revY / svgHeight) * 100 - 4}%`,
            }}
          >
            <div className="font-bold border-b border-[#387059] pb-0.5 mb-1 text-center">
              {pointsData[activePoint].month}
            </div>
            <div className="flex justify-between gap-3 text-[11px]">
              <span>Revenue:</span>
              <span className="font-semibold">${pointsData[activePoint].revenue}k</span>
            </div>
            <div className="flex justify-between gap-3 text-[11px] text-[#A8D1B6]">
              <span>Orders:</span>
              <span className="font-semibold">{pointsData[activePoint].orders * 35}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
