import React from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const staticNotifications = [
  {
    id: 1,
    title: "New order received #TJ-10284",
    time: "10 minutes ago",
    unread: true,
    type: "order",
  },
  {
    id: 2,
    title: "New customer registered: Emma Wilson",
    time: "32 minutes ago",
    unread: true,
    type: "customer",
  },
  {
    id: 3,
    title: "Low stock alert: Restore & Renew Oil",
    time: "2 hours ago",
    unread: false,
    type: "stock",
  },
  {
    id: 4,
    title: "Monthly Revenue goal reached! 🎉",
    time: "1 day ago",
    unread: false,
    type: "order",
  },
];

const iconMap = {
  order: ShoppingBagIcon,
  customer: PersonAddIcon,
  stock: WarningAmberIcon,
};

export default function NotificationDropdown({ onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#B87333]/30 overflow-hidden z-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#0A2342] text-[#FAF9F6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Notifications</span>
          <span className="bg-[#B87333] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            2 New
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <DoneAllIcon className="text-sm" /> Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {staticNotifications.map((notif) => {
          const IconComp = iconMap[notif.type] || ShoppingBagIcon;
          return (
            <div
              key={notif.id}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#F5F3EF]/60 transition-colors cursor-pointer ${
                notif.unread ? "bg-[#B87333]/5" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#0A2342]/10 text-[#0A2342] flex items-center justify-center shrink-0 mt-0.5">
                <IconComp className="text-sm text-[#0A2342]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#0A2342]">
                  {notif.title}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {notif.time}
                </div>
              </div>
              {notif.unread && (
                <span className="w-2 h-2 rounded-full bg-[#B87333] shrink-0 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#FAF9F6] text-center border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-[#B87333] hover:underline cursor-pointer"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
}
