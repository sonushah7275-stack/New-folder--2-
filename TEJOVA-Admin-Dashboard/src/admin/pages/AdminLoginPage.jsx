import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin, clearError } from "../../Redux/slices/adminAuthSlice.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    // If already authenticated as Admin, redirect to dashboard
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear leftover errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(clearError());
    const resultAction = await dispatch(
      adminLogin({ email: email.trim(), password })
    );

    if (adminLogin.fulfilled.match(resultAction)) {
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#B87333]/20 overflow-hidden transition-all">
        
        {/* Top Header Card */}
        <div className="bg-[#0A2342] text-[#FAF9F6] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B87333]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-xl pointer-events-none" />

          <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-2xl border border-[#B87333]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <LockOutlinedIcon className="text-3xl" />
          </div>

          <h1 className="font-serif text-3xl font-semibold tracking-wide text-white">
            TEJOVA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] mt-1 font-medium">
            Admin Portal Access
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#0A2342]">Sign In to Dashboard</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your credentials to access the administrative panel.
            </p>
          </div>

          {/* Backend Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-fadeIn">
              <ErrorOutlinedIcon className="text-lg shrink-0 mt-0.5 text-red-500" />
              <p className="text-xs font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-2">
                Email Address
              </label>
              <div className="relative">
                <EmailOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (localErrors.email) setLocalErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="admin@tejova.com"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 bg-[#F5F3EF] border rounded-xl text-sm text-[#0A2342] placeholder-gray-400 focus:outline-none transition-all ${
                    localErrors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-[#B87333]/30 focus:border-[#0A2342] focus:ring-2 focus:ring-[#0A2342]/10"
                  }`}
                />
              </div>
              {localErrors.email && (
                <p className="text-xs text-red-600 font-light mt-1 pl-1">
                  {localErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2342] mb-2">
                Password
              </label>
              <div className="relative">
                <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localErrors.password) setLocalErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full pl-10 pr-10 py-3 bg-[#F5F3EF] border rounded-xl text-sm text-[#0A2342] placeholder-gray-400 focus:outline-none transition-all ${
                    localErrors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-[#B87333]/30 focus:border-[#0A2342] focus:ring-2 focus:ring-[#0A2342]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2342] focus:outline-none transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon className="text-lg" />
                  ) : (
                    <VisibilityOutlinedIcon className="text-lg" />
                  )}
                </button>
              </div>
              {localErrors.password && (
                <p className="text-xs text-red-600 font-light mt-1 pl-1">
                  {localErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                loading
                  ? "bg-[#0A2342]/70 text-white cursor-not-allowed"
                  : "bg-[#0A2342] text-white hover:bg-[#B87333] hover:shadow-lg active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-light">
              Protected administrative area. Authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
