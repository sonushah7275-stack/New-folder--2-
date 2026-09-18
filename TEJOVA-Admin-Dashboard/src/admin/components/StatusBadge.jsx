import React from "react";

const badgeStyles = {
  // Product / Category / General Statuses
  Active: "bg-[#2D5A4A]/10 text-[#2D5A4A] border border-[#2D5A4A]/30",
  Draft: "bg-gray-100 text-gray-700 border border-gray-300",
  "Out of Stock": "bg-red-50 text-red-700 border border-red-200",
  Inactive: "bg-gray-100 text-gray-600 border border-gray-300",

  // Order Statuses
  Completed: "bg-[#2D5A4A]/15 text-[#2D5A4A] border border-[#2D5A4A]/40",
  Processing: "bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/40",
  Pending: "bg-[#D4AF37]/20 text-[#8B7114] border border-[#D4AF37]/50",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
  Refunded: "bg-purple-50 text-purple-700 border border-purple-200",

  // Journal / Content Statuses
  Published: "bg-[#2D5A4A]/15 text-[#2D5A4A] border border-[#2D5A4A]/30",
  Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",

  // Newsletter Statuses
  Subscribed: "bg-[#2D5A4A]/15 text-[#2D5A4A] border border-[#2D5A4A]/30",
  Unsubscribed: "bg-gray-100 text-gray-600 border border-gray-300",

  // Payment Statuses
  Paid: "bg-[#2D5A4A]/15 text-[#2D5A4A] border border-[#2D5A4A]/30",
};

export default function StatusBadge({ status, className = "" }) {
  const style = badgeStyles[status] || "bg-gray-100 text-gray-800 border border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}
    >
      {status}
    </span>
  );
}
