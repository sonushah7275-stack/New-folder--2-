import React, { useState, useEffect, useMemo } from "react";
import api from "../../config/api.js";
import ImageUploader from "../components/ImageUploader.jsx";
import AdminBreadcrumb from "../components/AdminBreadcrumb.jsx";

import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaptopIcon from "@mui/icons-material/Laptop";
import TabletIcon from "@mui/icons-material/Tablet";

const HOMEPAGE_TABS = [
  { id: "overview", label: "Section Overview & Order" },
  { id: "announcement", label: "Announcement Bar" },
  { id: "hero", label: "Hero Banner" },
  { id: "entry_sequence", label: "Entry Experience (Intro)" },
  { id: "brand_story", label: "Brand Story" },
  { id: "four_pillars", label: "Wellness Pillars" },
  { id: "vitality", label: "Vitality Section" },
  { id: "nourishment", label: "Nourishment Section" },
  { id: "lifestyle", label: "Lifestyle Section" },
  { id: "longevity", label: "Longevity Section" },
  { id: "products", label: "Featured Products" },
  { id: "journal", label: "Journal Showcase" },
  { id: "cta", label: "CTA Banner" },
];

export default function HomepageCms() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // desktop | tablet | mobile

  // Complete Homepage Data State
  const [pageData, setPageData] = useState({
    slug: "home",
    title: "Home — TEJOVA",
    subtitle: "Expand Your Light. Sovereign Performance Living.",
    hero: {
      title: "Master Your Sovereignty. Unleash Your Vitality.",
      subtitle: "TEJOVA — CONSCIOUS LIVING",
      description:
        "Elevate your daily harmony with pure, natural vitality and conscious wellness rituals. Rooted in ancient wisdom, refined for modern living.",
      mediaUrl:
        "https://res.cloudinary.com/dyqdgujiq/image/upload/v1794188197/TEJOVA/products/oem6zcgywdd0qaniukju.jpg",
      resourceType: "image",
      ctaText: "Begin Your Journey",
      ctaLink: "/products",
      secondaryCtaText: "Discover TEJOVA",
      secondaryCtaLink: "/about",
      floatingBadgeTitle: "Holistic Wellness",
      floatingBadgeSubtitle: "Pure Vitality & Longevity",
      features: [
        "100% Pure Ingredients",
        "Ancient Wisdom",
        "Conscious Living",
      ],
      isVisible: true,
    },
    sections: [],
    isPublished: true,
  });

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);
    try {
      const response = await api.get("/pages/home?adminView=true");
      if (response.data?.success && response.data?.data) {
        setPageData(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load homepage CMS data:", err);
      setErrorMessage("Failed to load homepage CMS data from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publishStatus = true) => {
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);

    const payload = {
      ...pageData,
      isPublished: publishStatus,
    };

    try {
      const response = await api.put("/pages/home", payload);
      if (response.data?.success) {
        setMessage(
          publishStatus
            ? "🎉 Homepage published live! Changes are visible on the public website."
            : "💾 Homepage saved as draft (unpublished)."
        );
        if (response.data.data) {
          setPageData(response.data.data);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save homepage changes.";
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  // Helper to find section by ID or type
  const getSection = (typeOrId) => {
    return (
      pageData.sections?.find(
        (s) => s.sectionId === typeOrId || s.type === typeOrId
      ) || null
    );
  };

  // Helper to update specific section
  const updateSection = (typeOrId, updates) => {
    setPageData((prev) => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex(
        (s) => s.sectionId === typeOrId || s.type === typeOrId
      );

      if (index !== -1) {
        sections[index] = { ...sections[index], ...updates };
      } else {
        // Section did not exist yet, add it
        sections.push({
          sectionId: `sec_${typeOrId}`,
          type: typeOrId,
          title: "",
          subtitle: "",
          kicker: "",
          content: "",
          media: { url: "", resourceType: "image" },
          cta: { text: "", url: "" },
          items: [],
          order: sections.length,
          isVisible: true,
          ...updates,
        });
      }
      return { ...prev, sections };
    });
  };

  // Reorder sections
  const moveSection = (index, direction) => {
    setPageData((prev) => {
      const sections = [...(prev.sections || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;

      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;

      return {
        ...prev,
        sections: sections.map((s, idx) => ({ ...s, order: idx })),
      };
    });
  };

  // Toggle section visibility
  const toggleSectionVisibility = (index) => {
    setPageData((prev) => {
      const sections = [...(prev.sections || [])];
      sections[index] = {
        ...sections[index],
        isVisible: sections[index].isVisible === false,
      };
      return { ...prev, sections };
    });
  };

  // Sorted sections list for overview
  const sortedSections = useMemo(() => {
    return [...(pageData.sections || [])].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  }, [pageData.sections]);

  // Section reference helpers
  const announcementSec = getSection("announcement") || getSection("sec_announcement");
  const brandSec = getSection("brand_story") || getSection("sec_brand_story") || getSection("brand_philosophy");
  const pillarsSec = getSection("four_pillars") || getSection("sec_four_pillars");
  const vitalitySec = getSection("vitality") || getSection("sec_vitality");
  const nourishmentSec = getSection("nourishment") || getSection("sec_nourishment");
  const lifestyleSec = getSection("lifestyle") || getSection("sec_lifestyle");
  const longevitySec = getSection("longevity") || getSection("sec_longevity");
  const productsSec = getSection("products") || getSection("sec_products");
  const journalSec = getSection("journal") || getSection("sec_journal");
  const ctaSec = getSection("cta") || getSection("sec_cta");
  const entrySeqSec = getSection("entry_sequence") || getSection("sec_entry_sequence");

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn select-none">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Homepage CMS", path: "/admin/homepage-cms" },
            ]}
          />
          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342] tracking-wide">
              Homepage CMS Architecture
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                pageData.isPublished !== false
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              {pageData.isPublished !== false ? "Live & Published" : "Draft (Unpublished)"}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Manage every public homepage heading, text block, Cloudinary image, CTA link, and section display order.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-[#0A2342] border border-gray-300 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PreviewIcon fontSize="small" className="text-[#B87333]" />
            <span>Live Preview</span>
          </button>

          {/* Save as Draft Button */}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving || loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <SaveIcon fontSize="small" className="text-gray-600" />
            <span>Save Draft</span>
          </button>

          {/* Publish Live Button */}
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-[#B87333] hover:bg-[#8B4513] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <CircularProgress size={16} style={{ color: "#ffffff" }} />
            ) : (
              <PublishIcon fontSize="small" />
            )}
            <span>{saving ? "Publishing Changes..." : "Publish Live Homepage"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircleIcon fontSize="small" className="text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <ErrorIcon fontSize="small" className="text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-none">
        {HOMEPAGE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#0A2342] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <CircularProgress style={{ color: "#B87333" }} />
          <p className="text-xs text-gray-500 font-semibold">
            Loading homepage CMS configuration...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: SECTION OVERVIEW & ORDERING */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                      Homepage Sections Architecture ({sortedSections.length} Sections)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Change section order, toggle visibility, and quickly jump to customize each section.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium">
                      Active Sections:{" "}
                      <strong className="text-[#0A2342]">
                        {sortedSections.filter((s) => s.isVisible !== false).length} / {sortedSections.length}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Section Cards List */}
                <div className="space-y-3">
                  {sortedSections.map((sec, idx) => (
                    <div
                      key={sec.sectionId || idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                        sec.isVisible !== false
                          ? "bg-[#FAF9F6] border-gray-200 hover:border-[#B87333]/40"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <span className="w-6 h-6 rounded-full bg-[#0A2342] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-[#0A2342]">
                              {sec.title || sec.sectionId}
                            </span>
                            <span className="text-[10px] font-mono uppercase bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                              {sec.type}
                            </span>
                          </div>
                          {sec.subtitle && (
                            <p className="text-xs text-gray-500 italic">
                              {sec.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          title="Move section up"
                          className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === sortedSections.length - 1}
                          title="Move section down"
                          className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                            sec.isVisible !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                          }`}
                        >
                          {sec.isVisible !== false ? (
                            <>
                              <VisibilityIcon fontSize="inherit" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <VisibilityOffIcon fontSize="inherit" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const matchedTab = HOMEPAGE_TABS.find(
                              (t) => t.id === sec.type || t.id === sec.sectionId
                            );
                            if (matchedTab) {
                              setActiveTab(matchedTab.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0A2342] text-white hover:bg-[#B87333] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Edit Content &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENT BAR */}
          {activeTab === "announcement" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Top Announcement Bar
                  </h2>
                  <p className="text-xs text-gray-500">
                    Appears above the navigation header across the website.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("announcement", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Enable Announcement Bar
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={announcementSec?.badge || ""}
                    onChange={(e) =>
                      updateSection("announcement", { badge: e.target.value })
                    }
                    placeholder="e.g. FREE SHIPPING"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">CTA Action Link</label>
                  <input
                    type="text"
                    value={announcementSec?.cta?.url || ""}
                    onChange={(e) =>
                      updateSection("announcement", {
                        cta: { ...(announcementSec?.cta || {}), url: e.target.value },
                      })
                    }
                    placeholder="e.g. /products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Announcement Message</label>
                  <input
                    type="text"
                    value={announcementSec?.content || ""}
                    onChange={(e) =>
                      updateSection("announcement", { content: e.target.value })
                    }
                    placeholder="Complimentary nationwide delivery on sovereign formulations over ₹999."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-medium focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={announcementSec?.cta?.text || ""}
                    onChange={(e) =>
                      updateSection("announcement", {
                        cta: { ...(announcementSec?.cta || {}), text: e.target.value },
                      })
                    }
                    placeholder="e.g. Explore Formulations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HERO BANNER */}
          {activeTab === "hero" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Homepage Hero Banner
                  </h2>
                  <p className="text-xs text-gray-500">
                    Primary headline, kicker badge, description, CTAs, and featured imagery.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageData.hero?.isVisible !== false}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, isVisible: e.target.checked },
                      }))
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Hero Section Visible</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle Kicker</label>
                  <input
                    type="text"
                    value={pageData.hero?.subtitle || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: e.target.value },
                      }))
                    }
                    placeholder="TEJOVA — CONSCIOUS LIVING"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hero Media Type</label>
                  <select
                    value={pageData.hero?.resourceType || "image"}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, resourceType: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none bg-white"
                  >
                    <option value="image">Static Image</option>
                    <option value="video">HTML5 Video Player</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Headline H1</label>
                  <input
                    type="text"
                    value={pageData.hero?.title || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, title: e.target.value },
                      }))
                    }
                    placeholder="Master Your Sovereignty. Unleash Your Vitality."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-serif text-sm font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Supporting Copy / Description</label>
                  <textarea
                    rows={3}
                    value={pageData.hero?.description || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, description: e.target.value },
                      }))
                    }
                    placeholder="Elevate your daily harmony with pure, natural vitality..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Hero Visual Asset (Cloudinary)"
                    imageUrl={pageData.hero?.mediaUrl}
                    resourceType={pageData.hero?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          mediaUrl: url,
                          resourceType: type || prev.hero.resourceType,
                        },
                      }))
                    }
                  />
                </div>

                {/* Primary & Secondary CTA */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={pageData.hero?.ctaText || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, ctaText: e.target.value },
                      }))
                    }
                    placeholder="Begin Your Journey"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary CTA URL</label>
                  <input
                    type="text"
                    value={pageData.hero?.ctaLink || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, ctaLink: e.target.value },
                      }))
                    }
                    placeholder="/products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={pageData.hero?.secondaryCtaText || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryCtaText: e.target.value },
                      }))
                    }
                    placeholder="Discover TEJOVA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Secondary CTA URL</label>
                  <input
                    type="text"
                    value={pageData.hero?.secondaryCtaLink || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryCtaLink: e.target.value },
                      }))
                    }
                    placeholder="/about"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                {/* Floating Overlay Badge on Hero */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Floating Badge Kicker</label>
                  <input
                    type="text"
                    value={pageData.hero?.floatingBadgeTitle || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, floatingBadgeTitle: e.target.value },
                      }))
                    }
                    placeholder="Holistic Wellness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Floating Badge Title</label>
                  <input
                    type="text"
                    value={pageData.hero?.floatingBadgeSubtitle || ""}
                    onChange={(e) =>
                      setPageData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, floatingBadgeSubtitle: e.target.value },
                      }))
                    }
                    placeholder="Pure Vitality & Longevity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENTRY EXPERIENCE (INTRO SEQUENCE) */}
          {activeTab === "entry_sequence" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Entry Experience (Animated Intro Slides)
                  </h2>
                  <p className="text-xs text-gray-500">
                    The fullscreen animated word sequence displayed on first visit.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const currentItems = [...(entrySeqSec?.items || [])];
                    currentItems.push({
                      id: `seq_${Date.now()}`,
                      title: "New Word",
                      kicker: "CONSCIOUS LIVING",
                      image: "",
                      order: currentItems.length,
                      isVisible: true,
                    });
                    updateSection("entry_sequence", { items: currentItems });
                  }}
                  className="px-3 py-1.5 bg-[#0A2342] text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <AddIcon fontSize="inherit" /> Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {(entrySeqSec?.items || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-gray-200 bg-[#FAF9F6] space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-xs text-[#0A2342]">
                        Slide #{idx + 1}: {item.title || "Untitled"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const items = [...(entrySeqSec?.items || [])];
                            items[idx].isVisible = items[idx].isVisible === false;
                            updateSection("entry_sequence", { items });
                          }}
                          className="text-xs text-gray-600 hover:text-[#B87333] cursor-pointer"
                        >
                          {item.isVisible !== false ? "Visible" : "Hidden"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const items = (entrySeqSec?.items || []).filter(
                              (_, i) => i !== idx
                            );
                            updateSection("entry_sequence", { items });
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Title Word</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const items = [...(entrySeqSec?.items || [])];
                            items[idx].title = e.target.value;
                            updateSection("entry_sequence", { items });
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                        <input
                          type="text"
                          value={item.kicker || ""}
                          onChange={(e) => {
                            const items = [...(entrySeqSec?.items || [])];
                            items[idx].kicker = e.target.value;
                            updateSection("entry_sequence", { items });
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="Background Image"
                          imageUrl={item.image}
                          folder="content"
                          onImageChange={(url) => {
                            const items = [...(entrySeqSec?.items || [])];
                            items[idx].image = url;
                            updateSection("entry_sequence", { items });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BRAND STORY */}
          {activeTab === "brand_story" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Brand Story & Philosophy Block
                  </h2>
                  <p className="text-xs text-gray-500">
                    Editorial story, botanical visual, and floating quote badge.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("brand_story", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle Kicker</label>
                  <input
                    type="text"
                    value={brandSec?.subtitle || brandSec?.kicker || ""}
                    onChange={(e) =>
                      updateSection("brand_story", { subtitle: e.target.value })
                    }
                    placeholder="OUR BRAND STORY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Accent</label>
                  <input
                    type="text"
                    value={brandSec?.badge || ""}
                    onChange={(e) =>
                      updateSection("brand_story", { badge: e.target.value })
                    }
                    placeholder="PEAK VITALITY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={brandSec?.title || ""}
                    onChange={(e) =>
                      updateSection("brand_story", { title: e.target.value })
                    }
                    placeholder="We Believe Peak Vitality Should Build Your Life, Not Cost It."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-serif text-sm font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Editorial Content (HTML supported)</label>
                  <textarea
                    rows={4}
                    value={brandSec?.content || ""}
                    onChange={(e) =>
                      updateSection("brand_story", { content: e.target.value })
                    }
                    placeholder="<p>Tejova promises a higher standard of existence where longevity is built into your daily operations...</p>"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Botanical Composition Image (Cloudinary)"
                    imageUrl={brandSec?.media?.url || brandSec?.mediaUrl}
                    folder="content"
                    onImageChange={(url) =>
                      updateSection("brand_story", {
                        media: { ...(brandSec?.media || {}), url },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Floating Quote Text</label>
                  <input
                    type="text"
                    value={
                      brandSec?.items?.[0]?.description ||
                      brandSec?.items?.[0]?.title ||
                      "Definitive performance built into your daily operations."
                    }
                    onChange={(e) => {
                      const items = [...(brandSec?.items || [])];
                      if (items.length === 0) {
                        items.push({ id: "quote_1", description: e.target.value });
                      } else {
                        items[0] = { ...items[0], description: e.target.value };
                      }
                      updateSection("brand_story", { items });
                    }}
                    placeholder="Definitive performance built into your daily operations."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text & Link</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={brandSec?.cta?.text || ""}
                      onChange={(e) =>
                        updateSection("brand_story", {
                          cta: { ...(brandSec?.cta || {}), text: e.target.value },
                        })
                      }
                      placeholder="Discover Our Protocol →"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={brandSec?.cta?.url || ""}
                      onChange={(e) =>
                        updateSection("brand_story", {
                          cta: { ...(brandSec?.cta || {}), url: e.target.value },
                        })
                      }
                      placeholder="/vitality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WELLNESS PILLARS */}
          {activeTab === "four_pillars" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Built Upon Four Pillars Grid
                  </h2>
                  <p className="text-xs text-gray-500">
                    The 4 foundation pillars: Vitality, Nourishment, Lifestyle, Longevity.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pillarsSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("four_pillars", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle Kicker</label>
                  <input
                    type="text"
                    value={pillarsSec?.subtitle || ""}
                    onChange={(e) =>
                      updateSection("four_pillars", { subtitle: e.target.value })
                    }
                    placeholder="A COMPLETE APPROACH"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={pillarsSec?.title || ""}
                    onChange={(e) =>
                      updateSection("four_pillars", { title: e.target.value })
                    }
                    placeholder="Built Upon Four Pillars"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={pillarsSec?.content || ""}
                    onChange={(e) =>
                      updateSection("four_pillars", { content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              {/* 4 Cards Manager */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-sm text-[#0A2342] uppercase tracking-wider">
                  Pillar Cards ({(pillarsSec?.items || []).length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(pillarsSec?.items || []).map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="p-4 rounded-xl border border-gray-200 bg-[#FAF9F6] space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="font-bold text-xs text-[#0A2342]">
                          Pillar #{idx + 1}: {card.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].isVisible = items[idx].isVisible === false;
                              updateSection("four_pillars", { items });
                            }}
                            className="text-xs text-gray-600 hover:text-[#B87333] cursor-pointer"
                          >
                            {card.isVisible !== false ? "Visible" : "Hidden"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                          <input
                            type="text"
                            value={card.kicker || ""}
                            onChange={(e) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].kicker = e.target.value;
                              updateSection("four_pillars", { items });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={card.title || ""}
                            onChange={(e) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].title = e.target.value;
                              updateSection("four_pillars", { items });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Subtitle / Tagline</label>
                          <input
                            type="text"
                            value={card.subtitle || ""}
                            onChange={(e) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].subtitle = e.target.value;
                              updateSection("four_pillars", { items });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={card.description || ""}
                            onChange={(e) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].description = e.target.value;
                              updateSection("four_pillars", { items });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Page Link</label>
                          <input
                            type="text"
                            value={card.link || ""}
                            onChange={(e) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].link = e.target.value;
                              updateSection("four_pillars", { items });
                            }}
                            placeholder="/vitality"
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div className="col-span-2">
                          <ImageUploader
                            label="Card Image Asset"
                            imageUrl={card.image}
                            folder="pillars"
                            onImageChange={(url) => {
                              const items = [...(pillarsSec?.items || [])];
                              items[idx].image = url;
                              updateSection("four_pillars", { items });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VITALITY SECTION */}
          {activeTab === "vitality" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Vitality Section (Pillar 01)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Indoor yoga practice and biological architecture story.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vitalitySec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("vitality", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={vitalitySec?.kicker || "Pillar 01"}
                    onChange={(e) =>
                      updateSection("vitality", { kicker: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={vitalitySec?.title || "Vitality"}
                    onChange={(e) =>
                      updateSection("vitality", { title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={vitalitySec?.subtitle || "Natural Energy. True Wellbeing."}
                    onChange={(e) =>
                      updateSection("vitality", { subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Corner Badge (e.g. Title | Subtitle)</label>
                  <input
                    type="text"
                    value={vitalitySec?.badge || "Biological Architecture | Indoor Yoga & Mindful Movement"}
                    onChange={(e) =>
                      updateSection("vitality", { badge: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={vitalitySec?.content || ""}
                    onChange={(e) =>
                      updateSection("vitality", { content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Vitality Studio Visual Asset"
                    imageUrl={vitalitySec?.media?.url}
                    resourceType={vitalitySec?.media?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      updateSection("vitality", {
                        media: { ...(vitalitySec?.media || {}), url, resourceType: type },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={vitalitySec?.cta?.text || "Explore Vitality"}
                    onChange={(e) =>
                      updateSection("vitality", {
                        cta: { ...(vitalitySec?.cta || {}), text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={vitalitySec?.cta?.url || "/vitality"}
                    onChange={(e) =>
                      updateSection("vitality", {
                        cta: { ...(vitalitySec?.cta || {}), url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOURISHMENT SECTION */}
          {activeTab === "nourishment" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Nourishment Section (Pillar 02)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Whole foods and natural cellular nutrition showcase.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nourishmentSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("nourishment", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={nourishmentSec?.kicker || "Pillar 02"}
                    onChange={(e) =>
                      updateSection("nourishment", { kicker: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={nourishmentSec?.title || "Nourishment"}
                    onChange={(e) =>
                      updateSection("nourishment", { title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={nourishmentSec?.subtitle || "Real Food. Lasting Health."}
                    onChange={(e) =>
                      updateSection("nourishment", { subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Corner Badge</label>
                  <input
                    type="text"
                    value={nourishmentSec?.badge || "Conscious Food | Microbiome & metabolic balance"}
                    onChange={(e) =>
                      updateSection("nourishment", { badge: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={nourishmentSec?.content || ""}
                    onChange={(e) =>
                      updateSection("nourishment", { content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Nourishment Visual Asset"
                    imageUrl={nourishmentSec?.media?.url}
                    resourceType={nourishmentSec?.media?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      updateSection("nourishment", {
                        media: { ...(nourishmentSec?.media || {}), url, resourceType: type },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={nourishmentSec?.cta?.text || "Explore Nourishment"}
                    onChange={(e) =>
                      updateSection("nourishment", {
                        cta: { ...(nourishmentSec?.cta || {}), text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={nourishmentSec?.cta?.url || "/nourishment"}
                    onChange={(e) =>
                      updateSection("nourishment", {
                        cta: { ...(nourishmentSec?.cta || {}), url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: LIFESTYLE SECTION */}
          {activeTab === "lifestyle" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Lifestyle Section (Pillar 03)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Mindfulness, awareness, and restorative living.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lifestyleSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("lifestyle", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={lifestyleSec?.kicker || "Pillar 03"}
                    onChange={(e) =>
                      updateSection("lifestyle", { kicker: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={lifestyleSec?.title || "Lifestyle"}
                    onChange={(e) =>
                      updateSection("lifestyle", { title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={lifestyleSec?.subtitle || "Awareness. Growth. Potential."}
                    onChange={(e) =>
                      updateSection("lifestyle", { subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Corner Badge</label>
                  <input
                    type="text"
                    value={lifestyleSec?.badge || "Sovereign Mind | Restorative Circadian Rhythms"}
                    onChange={(e) =>
                      updateSection("lifestyle", { badge: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={lifestyleSec?.content || ""}
                    onChange={(e) =>
                      updateSection("lifestyle", { content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Lifestyle Meditation Visual Asset"
                    imageUrl={lifestyleSec?.media?.url}
                    resourceType={lifestyleSec?.media?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      updateSection("lifestyle", {
                        media: { ...(lifestyleSec?.media || {}), url, resourceType: type },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={lifestyleSec?.cta?.text || "Explore Lifestyle"}
                    onChange={(e) =>
                      updateSection("lifestyle", {
                        cta: { ...(lifestyleSec?.cta || {}), text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={lifestyleSec?.cta?.url || "/lifestyle"}
                    onChange={(e) =>
                      updateSection("lifestyle", {
                        cta: { ...(lifestyleSec?.cta || {}), url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: LONGEVITY SECTION */}
          {activeTab === "longevity" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Longevity Section (Pillar 04)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Cellular health, bio-energetic resilience, and inner vitality.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={longevitySec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("longevity", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={longevitySec?.kicker || "Pillar 04"}
                    onChange={(e) =>
                      updateSection("longevity", { kicker: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={longevitySec?.title || "Longevity"}
                    onChange={(e) =>
                      updateSection("longevity", { title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={longevitySec?.subtitle || "Longer Life. Deeper Wellbeing."}
                    onChange={(e) =>
                      updateSection("longevity", { subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Corner Badge</label>
                  <input
                    type="text"
                    value={longevitySec?.badge || "Cellular Renewal | Bio-Energetic Resilience"}
                    onChange={(e) =>
                      updateSection("longevity", { badge: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={longevitySec?.content || ""}
                    onChange={(e) =>
                      updateSection("longevity", { content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Longevity Nature Visual Asset"
                    imageUrl={longevitySec?.media?.url}
                    resourceType={longevitySec?.media?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      updateSection("longevity", {
                        media: { ...(longevitySec?.media || {}), url, resourceType: type },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={longevitySec?.cta?.text || "Explore Longevity"}
                    onChange={(e) =>
                      updateSection("longevity", {
                        cta: { ...(longevitySec?.cta || {}), text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={longevitySec?.cta?.url || "/longevity"}
                    onChange={(e) =>
                      updateSection("longevity", {
                        cta: { ...(longevitySec?.cta || {}), url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: FEATURED PRODUCTS */}
          {activeTab === "products" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Featured Products Showcase Block
                  </h2>
                  <p className="text-xs text-gray-500">
                    Controls section titles, descriptions, and CTA button. Individual product cards sync from Products management.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productsSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("products", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle Kicker</label>
                  <input
                    type="text"
                    value={productsSec?.subtitle || productsSec?.kicker || ""}
                    onChange={(e) =>
                      updateSection("products", { subtitle: e.target.value })
                    }
                    placeholder="Featured Formulations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={productsSec?.title || ""}
                    onChange={(e) =>
                      updateSection("products", { title: e.target.value })
                    }
                    placeholder="Our Products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={productsSec?.content || ""}
                    onChange={(e) =>
                      updateSection("products", { content: e.target.value })
                    }
                    placeholder="Ethically harvested, scientifically formulated botanicals for a healthier, more vibrant life."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={productsSec?.cta?.text || ""}
                    onChange={(e) =>
                      updateSection("products", {
                        cta: { ...(productsSec?.cta || {}), text: e.target.value },
                      })
                    }
                    placeholder="Explore All Formulations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={productsSec?.cta?.url || ""}
                    onChange={(e) =>
                      updateSection("products", {
                        cta: { ...(productsSec?.cta || {}), url: e.target.value },
                      })
                    }
                    placeholder="/products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Products Display Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={productsSec?.settings?.limit || 4}
                    onChange={(e) =>
                      updateSection("products", {
                        settings: { ...(productsSec?.settings || {}), limit: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: JOURNAL / BLOG SHOWCASE */}
          {activeTab === "journal" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Journal / Editorial Showcase Block
                  </h2>
                  <p className="text-xs text-gray-500">
                    Controls section titles, descriptions, and CTA button. Individual articles sync from Blog management.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={journalSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("journal", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Section Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subtitle Kicker</label>
                  <input
                    type="text"
                    value={journalSec?.subtitle || journalSec?.kicker || ""}
                    onChange={(e) =>
                      updateSection("journal", { subtitle: e.target.value })
                    }
                    placeholder="Editorial & Philosophy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Heading</label>
                  <input
                    type="text"
                    value={journalSec?.title || ""}
                    onChange={(e) =>
                      updateSection("journal", { title: e.target.value })
                    }
                    placeholder="From Our Journal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={journalSec?.content || ""}
                    onChange={(e) =>
                      updateSection("journal", { content: e.target.value })
                    }
                    placeholder="Insights, research, and reflections for a more conscious, vibrant life."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={journalSec?.cta?.text || ""}
                    onChange={(e) =>
                      updateSection("journal", {
                        cta: { ...(journalSec?.cta || {}), text: e.target.value },
                      })
                    }
                    placeholder="View All Articles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={journalSec?.cta?.url || ""}
                    onChange={(e) =>
                      updateSection("journal", {
                        cta: { ...(journalSec?.cta || {}), url: e.target.value },
                      })
                    }
                    placeholder="/journal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Articles Display Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={journalSec?.settings?.limit || 3}
                    onChange={(e) =>
                      updateSection("journal", {
                        settings: { ...(journalSec?.settings || {}), limit: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: CALL TO ACTION (CTA) BANNER */}
          {activeTab === "cta" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                    Full-Width Call to Action (CTA) Banner
                  </h2>
                  <p className="text-xs text-gray-500">
                    Closing high-impact banner inviting visitors to begin their sovereignty journey.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ctaSec?.isVisible !== false}
                    onChange={(e) =>
                      updateSection("cta", { isVisible: e.target.checked })
                    }
                    className="rounded text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-xs font-bold text-gray-700">Banner Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kicker</label>
                  <input
                    type="text"
                    value={ctaSec?.kicker || ctaSec?.subtitle || ""}
                    onChange={(e) =>
                      updateSection("cta", { kicker: e.target.value })
                    }
                    placeholder="Embrace Your Potential"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={ctaSec?.title || ""}
                    onChange={(e) =>
                      updateSection("cta", { title: e.target.value })
                    }
                    placeholder="Your best years are ahead of you."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-serif text-sm font-bold text-[#0A2342]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Body Text</label>
                  <textarea
                    rows={3}
                    value={ctaSec?.content || ""}
                    onChange={(e) =>
                      updateSection("cta", { content: e.target.value })
                    }
                    placeholder="Explore TEJOVA and take the first step on your journey toward natural vitality..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Background Media (Cloudinary)"
                    imageUrl={ctaSec?.media?.url}
                    resourceType={ctaSec?.media?.resourceType}
                    folder="content"
                    allowVideo={true}
                    onImageChange={(url, type) =>
                      updateSection("cta", {
                        media: { ...(ctaSec?.media || {}), url, resourceType: type },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={ctaSec?.cta?.text || ""}
                    onChange={(e) =>
                      updateSection("cta", {
                        cta: { ...(ctaSec?.cta || {}), text: e.target.value },
                      })
                    }
                    placeholder="Begin Your Journey"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={ctaSec?.cta?.url || ""}
                    onChange={(e) =>
                      updateSection("cta", {
                        cta: { ...(ctaSec?.cta || {}), url: e.target.value },
                      })
                    }
                    placeholder="/products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="bg-[#FAF9F6] w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
            {/* Modal Header Bar */}
            <div className="px-6 py-3.5 bg-[#0A2342] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-sm font-bold tracking-widest text-[#D4AF37]">
                  TEJOVA LIVE HOMEPAGE PREVIEW
                </span>
                <span className="text-[11px] text-gray-300 hidden sm:inline">
                  (Simulating Public Homepage Rendering)
                </span>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-[#D4AF37] text-[#0A2342]"
                      : "text-white/80 hover:text-white"
                  }`}
                  title="Desktop View"
                >
                  <LaptopIcon fontSize="small" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === "tablet"
                      ? "bg-[#D4AF37] text-[#0A2342]"
                      : "text-white/80 hover:text-white"
                  }`}
                  title="Tablet View"
                >
                  <TabletIcon fontSize="small" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-[#D4AF37] text-[#0A2342]"
                      : "text-white/80 hover:text-white"
                  }`}
                  title="Mobile View"
                >
                  <SmartphoneIcon fontSize="small" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Preview Simulation Container */}
            <div className="flex-1 overflow-y-auto bg-gray-200 p-4 flex justify-center items-start">
              <div
                className={`bg-[#F5F3EF] shadow-2xl transition-all duration-300 min-h-full overflow-hidden text-[#0A2342] ${
                  previewDevice === "desktop"
                    ? "w-full max-w-5xl rounded-2xl"
                    : previewDevice === "tablet"
                    ? "w-[768px] rounded-2xl"
                    : "w-[390px] rounded-3xl"
                }`}
              >
                {/* Simulated Announcement */}
                {announcementSec && announcementSec.isVisible !== false && announcementSec.content && (
                  <div className="bg-[#B87333] text-white text-[11px] py-1.5 px-3 text-center flex items-center justify-center gap-2">
                    {announcementSec.badge && (
                      <span className="bg-[#D4AF37] text-[#0A2342] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        {announcementSec.badge}
                      </span>
                    )}
                    <span>{announcementSec.content}</span>
                  </div>
                )}

                {/* Simulated Nav */}
                <div className="px-6 py-4 border-b border-[#B87333]/20 flex items-center justify-between bg-[#F5F3EF]/95">
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-lg tracking-widest font-bold uppercase">
                      Tejova
                    </span>
                    <span className="text-[8px] tracking-[0.25em] text-[#B87333] uppercase">
                      Expand Your Light
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                    Preview Mode
                  </span>
                </div>

                {/* Simulated Hero */}
                {pageData.hero?.isVisible !== false && (
                  <div className="p-6 md:p-10 border-b border-[#B87333]/20 bg-[#F5F3EF]">
                    <div className="max-w-xl space-y-3">
                      <span className="text-xs uppercase tracking-widest text-[#B87333] font-bold block">
                        {pageData.hero?.subtitle}
                      </span>
                      <h1 className="font-serif text-2xl md:text-4xl font-bold leading-tight text-[#0A2342]">
                        {pageData.hero?.title}
                      </h1>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {pageData.hero?.description}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="px-4 py-2 bg-[#D4AF37] text-[#0A2342] font-bold text-xs rounded-full">
                          {pageData.hero?.ctaText || "Begin Journey"}
                        </span>
                        {pageData.hero?.secondaryCtaText && (
                          <span className="px-4 py-2 border border-[#B87333] text-[#0A2342] font-semibold text-xs rounded-full">
                            {pageData.hero?.secondaryCtaText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Sections in Active Order */}
                {sortedSections
                  .filter(
                    (s) =>
                      s.isVisible !== false &&
                      s.type !== "announcement" &&
                      s.type !== "entry_sequence"
                  )
                  .map((sec, idx) => (
                    <div
                      key={sec.sectionId || idx}
                      className="p-6 md:p-10 border-b border-[#B87333]/20 bg-[#FAF9F6] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B87333]">
                          {sec.kicker || sec.subtitle || sec.type.toUpperCase()}
                        </span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                          {sec.type}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-[#0A2342]">
                        {sec.title}
                      </h2>
                      {sec.content && (
                        <div
                          className="text-xs md:text-sm text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: sec.content }}
                        />
                      )}
                      {sec.cta?.text && (
                        <span className="inline-block mt-2 text-xs font-bold text-[#B87333]">
                          {sec.cta.text} &rarr;
                        </span>
                      )}
                    </div>
                  ))}

                {/* Footer preview note */}
                <div className="p-6 bg-[#0A2342] text-white text-center text-xs">
                  <p className="font-serif tracking-widest uppercase">TEJOVA</p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    &copy; {new Date().getFullYear()} TEJOVA. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
