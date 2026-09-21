import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";
import { fetchCurrentUser } from "./Redux/slices/authSlice";

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Hide header and footer on auth pages for standalone split layout
  const isAuthPage = ["/login", "/register", "/forgot-password", "/verify-otp"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <div className="flex-grow">
        <AppRoutes />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
