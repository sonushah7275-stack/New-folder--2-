import React from "react";
import { Link } from "react-router-dom";

export default function AdminBreadcrumb({ items = [] }) {
  const defaultItems = [
    { label: "Admin", path: "/admin" },
    { label: "Dashboard", path: "/admin" },
  ];

  const breadcrumbs = items.length > 0 ? items : defaultItems;

  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium mb-1">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={item.label}>
            {index > 0 && <span className="text-gray-400">/</span>}
            {isLast ? (
              <span className="text-[#0A2342] font-semibold">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-[#B87333] transition-colors"
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
