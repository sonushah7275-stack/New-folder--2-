import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-[#B87333]/30 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn`}
      >
        {/* Header with Midnight Blue #0A2342 */}
        <div className="bg-[#0A2342] text-[#FAF9F6] px-6 py-4 flex items-center justify-between border-b border-[#B87333]/30">
          <h2 className="text-lg font-serif font-bold tracking-wide">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <CloseIcon className="text-xl" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-[#0A2342]">
          {children}
        </div>
      </div>
    </div>
  );
}
