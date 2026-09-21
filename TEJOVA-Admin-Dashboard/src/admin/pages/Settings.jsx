import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import TuneIcon from "@mui/icons-material/Tune";
import PaletteIcon from "@mui/icons-material/Palette";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import {
  fetchSettings,
  updateSettings,
  clearSettingsStatus,
  initialSettingsState,
} from "../../Redux/slices/settingsSlice.js";

export default function Settings() {
  const dispatch = useDispatch();
  const { settings, loading, saveLoading, error, successMessage } = useSelector(
    (state) => state.settings || state.adminSettings || {}
  );

  const [activeTab, setActiveTab] = useState("general");
  const [formSettings, setFormSettings] = useState(initialSettingsState);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearSettingsStatus());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const navTabs = [
    { id: "general", label: "General Settings", icon: TuneIcon },
    { id: "appearance", label: "Appearance & Brand", icon: PaletteIcon },
    { id: "notifications", label: "Notifications & Alerts", icon: NotificationsActiveIcon },
    { id: "account", label: "Account & Security", icon: PersonIcon },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings(formSettings));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Settings", path: "/admin/settings" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Admin Settings & Configuration
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure website metadata, design system preferences, and admin accounts
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => dispatch(fetchSettings())}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
            title="Refresh settings from database"
          >
            <RefreshIcon className={`text-base ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveLoading || loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <SaveIcon className="text-lg" />
            <span>{saveLoading ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Alerts / Error feedback */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={() => dispatch(clearSettingsStatus())}
            className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>✨ {successMessage}</span>
          <button
            type="button"
            onClick={() => dispatch(clearSettingsStatus())}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Nav Pills */}
        <div className="lg:col-span-3 bg-white p-2.5 rounded-2xl border border-[#B87333]/20 shadow-sm h-fit space-y-1">
          {navTabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0A2342] text-white shadow-2xs"
                    : "text-gray-600 hover:bg-[#F5F3EF]"
                }`}
              >
                <IconComp className={`text-lg ${isActive ? "text-[#D4AF37]" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="lg:col-span-9 bg-white p-6 rounded-2xl border border-[#B87333]/20 shadow-sm space-y-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshIcon className="text-3xl text-[#B87333] animate-spin mx-auto" />
              <p className="text-xs font-medium text-gray-500">Loading system configuration...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                    General Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Website Name
                      </label>
                      <input
                        type="text"
                        value={formSettings.general?.siteName || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            general: { ...formSettings.general, siteName: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={formSettings.general?.tagline || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            general: { ...formSettings.general, tagline: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={formSettings.general?.supportEmail || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            general: {
                              ...formSettings.general,
                              supportEmail: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={formSettings.general?.contactPhone || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            general: {
                              ...formSettings.general,
                              contactPhone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                      Store Address
                    </label>
                    <input
                      type="text"
                      value={formSettings.general?.address || ""}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          general: { ...formSettings.general, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                    Design System Color Palette Tokens
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#0A2342] text-[#FAF9F6] rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold uppercase text-gray-300">
                        Midnight Blue
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#0A2342</p>
                    </div>

                    <div className="p-3 bg-[#B87333] text-[#FAF9F6] rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold uppercase text-gray-200">
                        Copper Accent
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#B87333</p>
                    </div>

                    <div className="p-3 bg-[#D4AF37] text-white rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold uppercase text-[#0A2342]">
                        Gold Action
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#D4AF37</p>
                    </div>

                    <div className="p-3 bg-[#F5F3EF] text-[#0A2342] rounded-xl border border-gray-300">
                      <p className="text-[10px] font-bold uppercase text-gray-500">
                        Cream Background
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#F5F3EF</p>
                    </div>

                    <div className="p-3 bg-[#FAF9F6] text-[#0A2342] rounded-xl border border-gray-300">
                      <p className="text-[10px] font-bold uppercase text-gray-500">
                        Off White Light
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#FAF9F6</p>
                    </div>

                    <div className="p-3 bg-[#2D5A4A] text-white rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold uppercase text-gray-200">
                        Forest Green Chart
                      </p>
                      <p className="font-mono text-xs font-bold mt-1">#2D5A4A</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                    Notifications & Thresholds
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-[#F5F3EF] rounded-xl cursor-pointer">
                      <span className="text-xs font-bold text-[#0A2342]">
                        Receive Instant Order Alerts
                      </span>
                      <input
                        type="checkbox"
                        checked={formSettings.notifications?.orderAlerts ?? true}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            notifications: {
                              ...formSettings.notifications,
                              orderAlerts: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 accent-[#B87333]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-[#F5F3EF] rounded-xl cursor-pointer">
                      <span className="text-xs font-bold text-[#0A2342]">
                        Receive New Customer Sign-Up Notifications
                      </span>
                      <input
                        type="checkbox"
                        checked={formSettings.notifications?.newCustomerAlerts ?? true}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            notifications: {
                              ...formSettings.notifications,
                              newCustomerAlerts: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 accent-[#B87333]"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                    Admin Profile Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Admin Name
                      </label>
                      <input
                        type="text"
                        value={formSettings.account?.adminName || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            account: {
                              ...formSettings.account,
                              adminName: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={formSettings.account?.adminEmail || ""}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            account: {
                              ...formSettings.account,
                              adminEmail: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saveLoading || loading}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <SaveIcon className="text-base" />
                  <span>{saveLoading ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}