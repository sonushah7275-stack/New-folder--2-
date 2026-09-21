import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { VitalityPage } from "../pages/VitalityPage";
import { NourishmentPage } from "../pages/NourishmentPage";
import { LifestylePage } from "../pages/LifestylePage";
import { LongevityPage } from "../pages/LongevityPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { JournalPage } from "../pages/JournalPage";
import { ArticleDetailPage } from "../pages/ArticleDetailPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { VerifyOtpPage } from "../pages/auth/VerifyOtpPage";
import { AccountPage } from "../pages/AccountPage";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/vitality" element={<VitalityPage />} />
      <Route path="/nourishment" element={<NourishmentPage />} />
      <Route path="/lifestyle" element={<LifestylePage />} />
      <Route path="/longevity" element={<LongevityPage />} />

      {/* Products */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />

      {/* Journal */}
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/journal/:slug" element={<ArticleDetailPage />} />

      {/* Other pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Authentication & Account */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
