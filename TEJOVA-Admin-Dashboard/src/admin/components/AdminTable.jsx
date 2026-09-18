import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function AdminTable({
  columns = [],
  data = [],
  renderRow,
  keyExtractor = (item, idx) => item.id || idx,
  emptyMessage = "No items found",
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#B87333]/20 shadow-sm overflow-hidden">
      {/* Table Scrollable Container */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Header with Midnight Blue #0A2342 */}
          <thead className="bg-[#0A2342] text-[#FAF9F6]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#F5F3EF]">
            {data.length > 0 ? (
              data.map((item, idx) => renderRow(item, idx))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="bg-[#FAF9F6] px-4 py-3 border-t border-[#B87333]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div>
          Showing <span className="font-semibold text-[#0A2342]">1</span> to{" "}
          <span className="font-semibold text-[#0A2342]">{data.length}</span> of{" "}
          <span className="font-semibold text-[#0A2342]">{data.length}</span> results
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            aria-label="Previous Page"
          >
            <ChevronLeftIcon className="text-sm" />
          </button>
          <span className="px-3 py-1 rounded-lg bg-[#0A2342] text-white font-semibold">
            1
          </span>
          <button
            type="button"
            disabled
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            aria-label="Next Page"
          >
            <ChevronRightIcon className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
