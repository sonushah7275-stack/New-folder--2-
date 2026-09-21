import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/common/Button";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { logoutUser } from "../Redux/slices/authSlice";

export const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <SectionHeading
          subtitle="Client Membership"
          title="Account Profile"
          description="Manage your TEJOVA profile details, biological wellness preferences, and active membership session."
        />

        <div className="bg-[#FAF9F6] p-6 sm:p-10 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-xs space-y-8">
          {/* Header Badge */}
          <div className="flex items-center space-x-4 border-b border-[#B87333]/20 pb-6">
            <div className="w-16 h-16 rounded-full bg-[#0A2342] text-[#D4AF37] font-serif text-2xl flex items-center justify-center shrink-0 shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2342]">{user?.name || "Valued Client"}</h2>
              <p className="text-xs uppercase tracking-widest text-[#B87333] font-semibold">
                TEJOVA Conscious Member
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1 bg-[#F5F3EF] p-4 rounded-xs border border-[#B87333]/20">
              <div className="flex items-center space-x-2 text-xs text-[#B87333] font-semibold uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-medium text-[#0A2342] pt-1">{user?.name || "N/A"}</p>
            </div>

            <div className="space-y-1 bg-[#F5F3EF] p-4 rounded-xs border border-[#B87333]/20">
              <div className="flex items-center space-x-2 text-xs text-[#B87333] font-semibold uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-medium text-[#0A2342] pt-1 truncate">{user?.email || "N/A"}</p>
            </div>

            <div className="space-y-1 bg-[#F5F3EF] p-4 rounded-xs border border-[#B87333]/20">
              <div className="flex items-center space-x-2 text-xs text-[#B87333] font-semibold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Account Type</span>
              </div>
              <p className="text-sm font-medium text-[#0A2342] pt-1 uppercase">{user?.role || "CUSTOMER"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#B87333]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button to="/products" variant="secondary" size="md">
              Explore Botanical Collection
            </Button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AccountPage;
