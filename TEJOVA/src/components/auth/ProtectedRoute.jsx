import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecking } = useSelector((state) => state.auth);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs font-medium text-[#0A2342]/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
