import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLoginPage from "./admin/pages/AdminLoginPage";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

import DashboardPage from "./admin/pages/DashboardPage";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import Orders from "./admin/pages/Orders";
import Customers from "./admin/pages/Customers";
import Journals from "./admin/pages/Journals";
import Pillars from "./admin/pages/Pillars";
import NewsLetter from "./admin/pages/NewsLetter";
import Media from "./admin/pages/Media";
import Content from "./admin/pages/Content";
import Settings from "./admin/pages/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public Admin Login Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Main Navigation */}
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="journal" element={<Journals />} />
          <Route path="pillars" element={<Pillars />} />
          <Route path="newsletter" element={<NewsLetter />} />
          <Route path="media" element={<Media />} />

          {/* Secondary Navigation */}
          <Route path="content" element={<Content />} />
          <Route path="settings" element={<Settings />} />

          {/* Unknown nested admin route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      {/* Root → Admin Dashboard */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Global unknown route */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
