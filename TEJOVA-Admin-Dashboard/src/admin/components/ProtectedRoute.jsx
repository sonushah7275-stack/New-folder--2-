import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchAdminProfile } from "../../Redux/slices/adminAuthSlice.js";

/**
 * ProtectedRoute Component
 * Guards admin routes. Validates JWT session with backend /me endpoint
 * and verifies ADMIN role before allowing access.
 */
export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const { admin, isAuthenticated, loading, initialized } = useSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    // Check backend session status if not already initialized
    if (!initialized) {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, initialized]);

  // Show full-screen loading state while validating session with backend
  if (!initialized || (loading && !admin)) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-[#0A2342] border-t-[#D4AF37] rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-xl font-medium text-[#0A2342]">
          Verifying Admin Access...
        </h2>
        <p className="text-xs text-[#B87333] uppercase tracking-widest mt-1">
          TEJOVA Secure Dashboard
        </p>
      </div>
    );
  }

  // Redirect to login if not authenticated or if user is not an ADMIN
  if (!isAuthenticated || !admin || admin.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated ADMIN user -> render protected child routes
  return <Outlet />;
}
