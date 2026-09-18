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
    const revY =
      svgHeight - paddingY - (d.revenue / maxVal) * (svgHeight - 2 * paddingY);
    const ordY =
      svgHeight - paddingY - (d.orders / maxVal) * (svgHeight - 2 * paddingY);
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
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#B87333]/20 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#0A2342]">
            Revenue Overview
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Track your revenue and order performance
          </p>
        </div>

        <div className="flex items-center bg-[#F5F3EF] p-1 rounded-xl border border-[#B87333]/30 self-start sm:self-auto">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0A2342] text-white shadow-2xs"
                    : "text-gray-600 hover:text-[#0A2342]"
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
          <span className="w-3 h-3 rounded-full bg-[#0A2342]" />
          <span className="text-[#0A2342] font-semibold">Revenue (#0A2342)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2D5A4A]" />
          <span className="text-[#0A2342] font-semibold">Orders (#2D5A4A)</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {yTicks.map((tick) => {
            const yPos =
              svgHeight -
              paddingY -
              (tick.val / maxVal) * (svgHeight - 2 * paddingY);
            return (
              <g key={tick.label}>
                <line
                  x1={paddingX}
                  y1={yPos}
                  x2={svgWidth - paddingX}
                  y2={yPos}
                  stroke="#F5F3EF"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[11px] fill-gray-400 font-medium"
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
              className="text-[11px] fill-gray-500 font-medium"
            >
              {pt.month}
            </text>
          ))}

          {/* Revenue Path in Midnight Blue #0A2342 */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#0A2342"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Orders Path in Forest Green #2D5A4A */}
          <path
            d={ordersPath}
            fill="none"
            stroke="#2D5A4A"
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
                  stroke="#B87333"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              <circle
                cx={pt.x}
                cy={pt.revY}
                r={activePoint === idx ? "6" : "4"}
                fill="#0A2342"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-150"
              />

              <circle
                cx={pt.x}
                cy={pt.ordY}
                r={activePoint === idx ? "5" : "3.5"}
                fill="#2D5A4A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="transition-all duration-150"
              />
            </g>
          ))}
        </svg>

        {activePoint !== null && (
          <div
            className="absolute z-10 bg-[#0A2342] text-white text-xs py-2 px-3.5 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all border border-[#B87333]"
            style={{
              left: `${(pointsData[activePoint].x / svgWidth) * 100}%`,
              top: `${(pointsData[activePoint].revY / svgHeight) * 100 - 6}%`,
            }}
          >
            <div className="font-bold border-b border-[#B87333]/40 pb-1 mb-1 text-center text-[#FAF9F6]">
              {pointsData[activePoint].month}
            </div>
            <div className="flex justify-between gap-3 text-[11px]">
              <span className="text-gray-300">Revenue:</span>
              <span className="font-bold text-[#D4AF37]">
                ${pointsData[activePoint].revenue}k
              </span>
            </div>
            <div className="flex justify-between gap-3 text-[11px]">
              <span className="text-gray-300">Orders:</span>
              <span className="font-bold text-[#A8D1B6]">
                {pointsData[activePoint].orders * 35}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
