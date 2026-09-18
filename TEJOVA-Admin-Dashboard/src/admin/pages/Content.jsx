import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import AdminBreadcrumb from "../components/AdminBreadcrumb";
import { initialSiteContent } from "../data/contentData";

export default function Content() {
  const [content, setContent] = useState(initialSiteContent);
  const [activeTab, setActiveTab] = useState("hero");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { id: "hero", label: "Homepage Hero" },
    { id: "about", label: "About Philosophy" },
    { id: "vitality", label: "Vitality Section" },
    { id: "announcement", label: "Announcement Bar" },
    { id: "footer", label: "Footer Info" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
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
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <SaveIcon className="text-lg" />
          <span>{saveSuccess ? "Saved!" : "Save Changes"}</span>
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

      {/* Content Form Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#B87333]/20 shadow-sm max-w-4xl space-y-6">
        {saveSuccess && (
          <div className="p-3 bg-[#2D5A4A]/10 border border-[#2D5A4A]/30 text-[#2D5A4A] text-xs font-bold rounded-xl">
            ✨ Content changes updated locally in state!
          </div>
        )}

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
                  value={content.hero.headline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, headline: e.target.value },
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
                  value={content.hero.subheadline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subheadline: e.target.value },
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
                    value={content.hero.primaryCtaText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, primaryCtaText: e.target.value },
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
                    value={content.hero.secondaryCtaText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
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
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
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
                  value={content.about.story}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, story: e.target.value },
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
                  value={content.about.quote}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, quote: e.target.value },
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
                  value={content.vitalitySection.heading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vitalitySection: {
                        ...content.vitalitySection,
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
                  value={content.vitalitySection.badgeText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vitalitySection: {
                        ...content.vitalitySection,
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
                  value={content.hero.announcementBar}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
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
                  value={content.footer.copyrightText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: {
                        ...content.footer,
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
                  value={content.footer.supportEmail}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: {
                        ...content.footer,
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
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Save Section Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}