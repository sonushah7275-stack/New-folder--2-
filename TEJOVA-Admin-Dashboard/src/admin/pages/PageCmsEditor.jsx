import React, { useState, useEffect } from "react";
import api from "../../config/api.js";
import RichTextEditor from "../components/RichTextEditor.jsx";

import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PAGES_LIST = [
  { slug: "home", label: "Home Page" },
  { slug: "vitality", label: "Vitality Page" },
  { slug: "nourishment", label: "Nourishment Page" },
  { slug: "lifestyle", label: "Lifestyle Page" },
  { slug: "longevity", label: "Longevity Page" },
  { slug: "blog", label: "Blog Page" },
  { slug: "about", label: "About Us Page" },
  { slug: "contact", label: "Contact Us Page" },
];

const SECTION_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "entry_sequence", label: "Entry Sequence Words (Intro)" },
  { value: "blog_entry_photos", label: "Blog 4 Entry Photos (Slow Animation)" },
  { value: "brand_philosophy", label: "Brand Philosophy Block" },
  { value: "brand_story", label: "Brand Story Block" },
  { value: "philosophy", label: "Philosophy Block" },
  { value: "four_pillars", label: "Four Pillars Grid" },
  { value: "protocol_cards", label: "Protocol Cards Grid (Daily Rituals)" },
  { value: "cta", label: "Call to Action Block" },
  { value: "highlight_box", label: "Highlight Box Block" },
  { value: "cards", label: "Feature Cards Grid" },
  { value: "quote", label: "Quote Block" },
  { value: "video", label: "Video Player Block" },
  { value: "rich_content", label: "Rich Text Content Block" },
];

export default function PageCmsEditor() {
  const [activeSlug, setActiveSlug] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [pageData, setPageData] = useState({
    slug: "home",
    title: "",
    subtitle: "",
    hero: {
      title: "",
      subtitle: "",
      description: "",
      mediaUrl: "",
      resourceType: "image",
      ctaText: "",
      ctaLink: "",
    },
    sections: [],
    isPublished: true,
  });

  useEffect(() => {
    fetchPage(activeSlug);
  }, [activeSlug]);

  const fetchPage = async (slug) => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);
    try {
      const response = await api.get(`/pages/${slug}`);
      if (response.data?.success && response.data?.data) {
        setPageData(response.data.data);
      }
    } catch (err) {
      console.error(`Failed to load page '${slug}':`, err);
      setErrorMessage(`Failed to load page details for '${slug}'.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async () => {
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);
    try {
      const response = await api.put(`/pages/${activeSlug}`, pageData);
      if (response.data?.success) {
        setMessage(`Page '${activeSlug}' saved and published successfully!`);
        if (response.data.data) {
          setPageData(response.data.data);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save page changes.";
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleAddSection = (type = "rich_content") => {
    const newSec = {
      sectionId: `sec_${Date.now()}`,
      type,
      title: `New ${type.replace("_", " ")} Section`,
      subtitle: "",
      kicker: "",
      content: "",
      media: { url: "", resourceType: "image", alt: "" },
      cta: { text: "", url: "" },
      items: [],
      order: pageData.sections ? pageData.sections.length : 0,
      isVisible: true,
    };

    setPageData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSec],
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setPageData((prev) => {
      const updated = [...(prev.sections || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, sections: updated };
    });
  };

  const handleSectionMediaChange = (index, field, value) => {
    setPageData((prev) => {
      const updated = [...(prev.sections || [])];
      updated[index] = {
        ...updated[index],
        media: {
          ...(updated[index].media || {}),
          [field]: value,
        },
      };
      return { ...prev, sections: updated };
    });
  };

  const handleDeleteSection = (index) => {
    setPageData((prev) => {
      const updated = (prev.sections || []).filter((_, i) => i !== index);
      return { ...prev, sections: updated };
    });
  };

  const handleMoveSection = (index, direction) => {
    setPageData((prev) => {
      const sections = [...(prev.sections || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= sections.length) return prev;

      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;

      return {
        ...prev,
        sections: sections.map((sec, idx) => ({ ...sec, order: idx })),
      };
    });
  };

  const handleAddItem = (sectionIndex) => {
    setPageData((prev) => {
      const updatedSections = [...(prev.sections || [])];
      const targetSection = { ...updatedSections[sectionIndex] };
      const currentItems = [...(targetSection.items || [])];

      currentItems.push({
        id: `item_${Date.now()}`,
        kicker: "10 MINS",
        title: "New Item Title",
        subtitle: "",
        description: "Enter item description here...",
        image: "",
        link: "",
        order: currentItems.length,
        isVisible: true,
      });

      targetSection.items = currentItems;
      updatedSections[sectionIndex] = targetSection;
      return { ...prev, sections: updatedSections };
    });
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    setPageData((prev) => {
      const updatedSections = [...(prev.sections || [])];
      const targetSection = { ...updatedSections[sectionIndex] };
      const currentItems = [...(targetSection.items || [])];

      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        [field]: value,
      };

      targetSection.items = currentItems;
      updatedSections[sectionIndex] = targetSection;
      return { ...prev, sections: updatedSections };
    });
  };

  const handleDeleteItem = (sectionIndex, itemIndex) => {
    setPageData((prev) => {
      const updatedSections = [...(prev.sections || [])];
      const targetSection = { ...updatedSections[sectionIndex] };
      targetSection.items = (targetSection.items || []).filter((_, i) => i !== itemIndex);
      updatedSections[sectionIndex] = targetSection;
      return { ...prev, sections: updatedSections };
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0A2342] tracking-wide">
            Public Website CMS Manager
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Edit text, headings, hero banners, protocol cards, and layout sections live on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSavePage}
          disabled={saving || loading}
          className="px-5 py-2.5 bg-[#B87333] hover:bg-[#A00000] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <CircularProgress size={16} style={{ color: "#ffffff" }} />
          ) : (
            <SaveIcon fontSize="small" />
          )}
          <span>{saving ? "Saving Changes..." : "Publish Page Changes"}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircleIcon fontSize="small" className="text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <ErrorIcon fontSize="small" className="text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Page Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {PAGES_LIST.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActiveSlug(p.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSlug === p.slug
                ? "bg-[#0A2342] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <CircularProgress style={{ color: "#B87333" }} />
          <p className="text-xs text-gray-500 font-semibold">Loading CMS content for '{activeSlug}'...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Page Meta & Hero Section Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-serif font-bold text-[#0A2342] uppercase tracking-wider">
                Hero Section ({activeSlug.toUpperCase()})
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pageData.isPublished !== false}
                  onChange={(e) => setPageData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-xs font-bold text-gray-700">Page Published</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Page Meta Title</label>
                <input
                  type="text"
                  value={pageData.title || ""}
                  onChange={(e) => setPageData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="e.g. Vitality — TEJOVA"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Subtitle Kicker</label>
                <input
                  type="text"
                  value={pageData.hero?.subtitle || ""}
                  onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="e.g. TEJOVA — VITALITY PROTOCOL"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Hero H1 Heading</label>
                <input
                  type="text"
                  value={pageData.hero?.title || ""}
                  onChange={(e) => handleHeroChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-serif text-sm font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="e.g. Master Your Sovereignty. Unleash Your Vitality."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={pageData.hero?.description || ""}
                  onChange={(e) => handleHeroChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="Enter hero paragraph copy..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Image / Video URL</label>
                <input
                  type="text"
                  value={pageData.hero?.mediaUrl || ""}
                  onChange={(e) => handleHeroChange("mediaUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Media Type</label>
                <select
                  value={pageData.hero?.resourceType || "image"}
                  onChange={(e) => handleHeroChange("resourceType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                >
                  <option value="image">Image Asset</option>
                  <option value="video">Video Player</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero CTA Button Text</label>
                <input
                  type="text"
                  value={pageData.hero?.ctaText || ""}
                  onChange={(e) => handleHeroChange("ctaText", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="e.g. Begin Your Journey →"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero CTA Button URL</label>
                <input
                  type="text"
                  value={pageData.hero?.ctaLink || ""}
                  onChange={(e) => handleHeroChange("ctaLink", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                  placeholder="e.g. /vitality"
                />
              </div>
            </div>
          </div>

          {/* Page Sections List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-[#0A2342] tracking-wide">
                Dynamic Page Sections ({(pageData.sections || []).length})
              </h2>

              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSection(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-2 bg-[#0A2342] text-white rounded-xl text-xs font-bold cursor-pointer focus:outline-none"
                >
                  <option value="">+ Add Section...</option>
                  {SECTION_TYPES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(pageData.sections || []).map((sec, secIdx) => (
              <div
                key={sec.sectionId || secIdx}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6"
              >
                {/* Section Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0A2342] text-white text-xs font-bold flex items-center justify-center">
                      {secIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#0A2342] uppercase tracking-wider">
                      {sec.type?.replace("_", " ")} — {sec.title || "Untitled Section"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, "up")}
                      disabled={secIdx === 0}
                      className="p-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, "down")}
                      disabled={secIdx === (pageData.sections || []).length - 1}
                      className="p-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSectionChange(secIdx, "isVisible", !sec.isVisible)}
                      className={`p-1 rounded-lg border text-xs cursor-pointer ${
                        sec.isVisible !== false
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                      title="Toggle Visibility"
                    >
                      {sec.isVisible !== false ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(secIdx)}
                      className="p-1 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 cursor-pointer"
                      title="Delete Section"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>

                {/* Section Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Section Title (H2 Heading)</label>
                    <input
                      type="text"
                      value={sec.title || ""}
                      onChange={(e) => handleSectionChange(secIdx, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl font-serif text-sm font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subtitle / Kicker</label>
                    <input
                      type="text"
                      value={sec.subtitle || sec.kicker || ""}
                      onChange={(e) => handleSectionChange(secIdx, "subtitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Section Rich Content Body</label>
                    <RichTextEditor
                      content={sec.content || ""}
                      onChange={(html) => handleSectionChange(secIdx, "content", html)}
                      placeholder="Write section body copy..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Section Media Asset URL</label>
                    <input
                      type="text"
                      value={sec.media?.url || ""}
                      onChange={(e) => handleSectionMediaChange(secIdx, "url", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Section Media Type</label>
                    <select
                      value={sec.media?.resourceType || "image"}
                      onChange={(e) => handleSectionMediaChange(secIdx, "resourceType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video Player</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={sec.cta?.text || ""}
                      onChange={(e) =>
                        handleSectionChange(secIdx, "cta", { ...(sec.cta || {}), text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">CTA Button URL</label>
                    <input
                      type="text"
                      value={sec.cta?.url || ""}
                      onChange={(e) =>
                        handleSectionChange(secIdx, "cta", { ...(sec.cta || {}), url: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sub-Items / Ritual Cards (For protocol_cards, four_pillars, cards, philosophy) */}
                {(sec.type === "protocol_cards" ||
                  sec.type === "four_pillars" ||
                  sec.type === "cards" ||
                  sec.type === "philosophy" ||
                  sec.type === "entry_sequence" ||
                  sec.type === "blog_entry_photos") && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider">
                        Section Sub-Cards / Rituals ({(sec.items || []).length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleAddItem(secIdx)}
                        className="px-3 py-1.5 bg-[#B87333] text-white rounded-xl text-xs font-bold hover:bg-[#A00000] cursor-pointer"
                      >
                        + Add Card / Ritual
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(sec.items || []).map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          className="p-4 bg-[#FAF9F6] border border-gray-200 rounded-xl space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-[#0A2342]">Card #{itemIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(secIdx, itemIdx)}
                              className="text-red-600 font-bold hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Time Kicker / Badge</label>
                            <input
                              type="text"
                              value={item.kicker || item.tag || ""}
                              onChange={(e) => handleItemChange(secIdx, itemIdx, "kicker", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                              placeholder="e.g. 20 MINS or Yoga"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Card Title</label>
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => handleItemChange(secIdx, itemIdx, "title", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-serif font-bold text-[#0A2342]"
                              placeholder="e.g. Sovereign Asana & Alignment"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={item.description || ""}
                              onChange={(e) => handleItemChange(secIdx, itemIdx, "description", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                              placeholder="Enter protocol details..."
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Image / Media URL</label>
                            <input
                              type="text"
                              value={item.image || ""}
                              onChange={(e) => handleItemChange(secIdx, itemIdx, "image", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
