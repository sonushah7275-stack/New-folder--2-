import React from "react";
import { Link } from "react-router-dom";

export default function AdminBreadcrumb({ items = [] }) {
  const defaultItems = [
    { label: "Admin", path: "/" },
    { label: "Dashboard", path: "/" },
  ];

  const breadcrumbs = items.length > 0 ? items : defaultItems;

  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm text-[#687280] font-medium mb-1">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={item.label}>
            {index > 0 && <span className="text-gray-400">/</span>}
            {isLast ? (
              <span className="text-[#1F1F1F] font-semibold">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-[#1F4D3B] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
