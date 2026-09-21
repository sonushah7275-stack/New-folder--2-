import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import AdminBreadcrumb from "../components/AdminBreadcrumb";
import {
  fetchContent,
  updateContentSection,
  updateLocalContentState,
} from "../../Redux/slices/contentSlice.js";

export default function Content() {
  const dispatch = useDispatch();
  const { siteContent, loading, saveLoading, error, successMessage } = useSelector(
    (state) => state.adminContent || state.content
  );

  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const tabs = [
    { id: "hero", label: "Homepage Hero" },
    { id: "about", label: "About Philosophy" },
    { id: "vitality", label: "Vitality Section" },
    { id: "announcement", label: "Announcement Bar" },
    { id: "footer", label: "Footer Info" },
  ];

  const handleSave = (e) => {
    if (e) e.preventDefault();

    if (activeTab === "hero") {
      dispatch(
        updateContentSection({
          key: "HERO",
          section: "homepage",
          title: siteContent.hero?.headline || "Homepage Hero",
          content: siteContent.hero,
        })
      );
    } else if (activeTab === "about") {
      dispatch(
        updateContentSection({
          key: "ABOUT",
          section: "homepage",
          title: siteContent.about?.title || "The TEJOVA Philosophy",
          content: siteContent.about,
        })
      );
    } else if (activeTab === "vitality") {
      dispatch(
        updateContentSection({
          key: "VITALITY_SECTION",
          section: "homepage",
          title: siteContent.vitalitySection?.heading || "Vitality & Restoration",
          content: siteContent.vitalitySection,
        })
      );
    } else if (activeTab === "announcement") {
      dispatch(
        updateContentSection({
          key: "ANNOUNCEMENT",
          section: "header",
          title: "Top Announcement Bar",
          content: siteContent.hero?.announcementBar || "",
        })
      );
    } else if (activeTab === "footer") {
      dispatch(
        updateContentSection({
          key: "FOOTER",
          section: "footer",
          title: "Footer Information",
          content: siteContent.footer,
        })
      );
    }
  };

  const handleStateChange = (updatedContent) => {
    dispatch(updateLocalContentState(updatedContent));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Content", path: "/admin/content" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Content Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Edit live frontend headings, announcement banners, and brand stories
          </p>
        </div>

        <button
          type="button"
          disabled={saveLoading}
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {saveLoading ? (
            <CircularProgress size={18} style={{ color: "#ffffff" }} />
          ) : (
            <SaveIcon className="text-lg" />
          )}
          <span>{saveLoading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-[#B87333]/20 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#0A2342] text-white shadow-2xs"
                : "text-gray-600 hover:bg-[#F5F3EF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-[#2D5A4A]/10 border border-[#2D5A4A]/30 text-[#2D5A4A] text-xs font-bold rounded-xl">
          ✨ {successMessage}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <CircularProgress size={32} style={{ color: "#B87333" }} />
        </div>
      )}

      {/* Content Form Box */}
      {!loading && (
        <div className="bg-white rounded-2xl p-6 border border-[#B87333]/20 shadow-sm max-w-4xl space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            {activeTab === "hero" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                  Homepage Hero Section
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.headline || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        hero: { ...siteContent.hero, headline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Subheadline Description
                  </label>
                  <textarea
                    rows="3"
                    value={siteContent.hero?.subheadline || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        hero: { ...siteContent.hero, subheadline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero?.primaryCtaText || ""}
                      onChange={(e) =>
                        handleStateChange({
                          ...siteContent,
                          hero: { ...siteContent.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero?.secondaryCtaText || ""}
                      onChange={(e) =>
                        handleStateChange({
                          ...siteContent,
                          hero: {
                            ...siteContent.hero,
                            secondaryCtaText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                  About & Philosophy Section
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.title || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        about: { ...siteContent.about, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Brand Story
                  </label>
                  <textarea
                    rows="4"
                    value={siteContent.about?.story || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        about: { ...siteContent.about, story: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Featured Founder Quote
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.quote || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        about: { ...siteContent.about, quote: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>
              </div>
            )}

            {activeTab === "vitality" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                  Vitality & Organic Collection Section
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={siteContent.vitalitySection?.heading || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        vitalitySection: {
                          ...siteContent.vitalitySection,
                          heading: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Badge Accent Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.vitalitySection?.badgeText || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        vitalitySection: {
                          ...siteContent.vitalitySection,
                          badgeText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>
              </div>
            )}

            {activeTab === "announcement" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                  Top Announcement Bar
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.announcementBar || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        hero: {
                          ...siteContent.hero,
                          announcementBar: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>
              </div>
            )}

            {activeTab === "footer" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#0A2342] border-b border-gray-100 pb-2">
                  Footer Information
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={siteContent.footer?.copyrightText || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        footer: {
                          ...siteContent.footer,
                          copyrightText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                    Support Email
                  </label>
                  <input
                    type="text"
                    value={siteContent.footer?.supportEmail || ""}
                    onChange={(e) =>
                      handleStateChange({
                        ...siteContent,
                        footer: {
                          ...siteContent.footer,
                          supportEmail: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {saveLoading ? "Saving..." : "Save Section Content"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}