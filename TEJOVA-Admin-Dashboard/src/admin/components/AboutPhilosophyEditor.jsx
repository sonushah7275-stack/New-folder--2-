import React, { useState, useEffect } from "react";
import api from "../../config/api.js";
import RichTextEditor from "./RichTextEditor.jsx";
import AdminBreadcrumb from "./AdminBreadcrumb.jsx";

import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PreviewIcon from "@mui/icons-material/Preview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaptopIcon from "@mui/icons-material/Laptop";
import TabletIcon from "@mui/icons-material/Tablet";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const DEFAULT_PHILOSOPHY = {
  leftColumn: {
    label: "THE PHILOSOPHY",
    heading: "Expand Your Light",
    paragraph1:
      '"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.',
    paragraph2:
      "Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.",
  },
  rightColumn: {
    label: "STANDARDS OF PURITY",
    heading: "About Tejova",
    highlightedTitle: "The Architecture of Biological Sovereignty",
    description:
      "For the Driven Professionals, energy is the ultimate currency. You architect organizations, drive market growth, and lead with relentless precision—but the true mark of elite leadership is absolute command over your own biology.",
  },
  isVisible: true,
};

export default function AboutPhilosophyEditor({
  sectionData,
  onChange,
  onSaveParent,
  isPagePublished = true,
}) {
  const [loading, setLoading] = useState(!sectionData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [leftLabel, setLeftLabel] = useState(DEFAULT_PHILOSOPHY.leftColumn.label);
  const [leftHeading, setLeftHeading] = useState(DEFAULT_PHILOSOPHY.leftColumn.heading);
  const [leftParagraph1, setLeftParagraph1] = useState(DEFAULT_PHILOSOPHY.leftColumn.paragraph1);
  const [leftParagraph2, setLeftParagraph2] = useState(DEFAULT_PHILOSOPHY.leftColumn.paragraph2);

  const [rightLabel, setRightLabel] = useState(DEFAULT_PHILOSOPHY.rightColumn.label);
  const [rightHeading, setRightHeading] = useState(DEFAULT_PHILOSOPHY.rightColumn.heading);
  const [rightHighlightedTitle, setRightHighlightedTitle] = useState(DEFAULT_PHILOSOPHY.rightColumn.highlightedTitle);
  const [rightDescription, setRightDescription] = useState(DEFAULT_PHILOSOPHY.rightColumn.description);

  const [isVisible, setIsVisible] = useState(true);

  // Live Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  // Load section data either from props or fetch directly from API
  useEffect(() => {
    if (sectionData) {
      applySectionData(sectionData);
      setLoading(false);
    } else {
      fetchAboutPhilosophySection();
    }
  }, [sectionData]);

  const applySectionData = (data) => {
    if (!data) return;

    const left = data.leftColumn || data.content?.leftColumn || {};
    const right = data.rightColumn || data.content?.rightColumn || {};

    setLeftLabel(left.label || data.subtitle || DEFAULT_PHILOSOPHY.leftColumn.label);
    setLeftHeading(left.heading || data.title || DEFAULT_PHILOSOPHY.leftColumn.heading);

    const p1 =
      left.paragraph1 ||
      (Array.isArray(left.paragraphs) && left.paragraphs[0]) ||
      DEFAULT_PHILOSOPHY.leftColumn.paragraph1;
    const p2 =
      left.paragraph2 ||
      (Array.isArray(left.paragraphs) && left.paragraphs[1]) ||
      DEFAULT_PHILOSOPHY.leftColumn.paragraph2;

    setLeftParagraph1(p1);
    setLeftParagraph2(p2);

    setRightLabel(right.label || DEFAULT_PHILOSOPHY.rightColumn.label);
    setRightHeading(right.heading || DEFAULT_PHILOSOPHY.rightColumn.heading);
    setRightHighlightedTitle(right.highlightedTitle || DEFAULT_PHILOSOPHY.rightColumn.highlightedTitle);
    setRightDescription(right.description || DEFAULT_PHILOSOPHY.rightColumn.description);

    setIsVisible(data.isVisible !== false);
  };

  const fetchAboutPhilosophySection = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);
    try {
      const response = await api.get("/pages/about?adminView=true");
      if (response.data?.success && response.data?.data) {
        const sections = response.data.data.sections || [];
        const philosophySec = sections.find(
          (s) =>
            s.sectionId === "sec_about_philosophy" ||
            s.type === "philosophy" ||
            s.type === "brand_philosophy"
        );
        if (philosophySec) {
          applySectionData(philosophySec);
        } else {
          // Initialize with default values
          applySectionData(DEFAULT_PHILOSOPHY);
        }
      }
    } catch (err) {
      console.error("Failed to load about philosophy section:", err);
      setErrorMessage("Failed to load About Philosophy CMS content.");
    } finally {
      setLoading(false);
    }
  };

  // Build the unified section payload
  const buildSectionPayload = (visibleState = isVisible) => {
    return {
      sectionId: "sec_about_philosophy",
      type: "brand_philosophy",
      title: leftHeading,
      subtitle: leftLabel,
      kicker: "THE PHILOSOPHY",
      leftColumn: {
        label: leftLabel,
        heading: leftHeading,
        paragraphs: [leftParagraph1, leftParagraph2],
        paragraph1: leftParagraph1,
        paragraph2: leftParagraph2,
      },
      rightColumn: {
        label: rightLabel,
        heading: rightHeading,
        highlightedTitle: rightHighlightedTitle,
        description: rightDescription,
      },
      content: {
        leftColumn: {
          label: leftLabel,
          heading: leftHeading,
          paragraphs: [leftParagraph1, leftParagraph2],
        },
        rightColumn: {
          label: rightLabel,
          heading: rightHeading,
          highlightedTitle: rightHighlightedTitle,
          description: rightDescription,
        },
      },
      isVisible: visibleState,
      order: 0,
    };
  };

  // Sync changes to parent if callback provided
  const notifyChange = (updatedPartial = {}) => {
    if (onChange) {
      const payload = {
        ...buildSectionPayload(),
        ...updatedPartial,
      };
      onChange(payload);
    }
  };

  const handleSave = async (customVisibleState) => {
    const targetVisible = customVisibleState !== undefined ? customVisibleState : isVisible;
    setSaving(true);
    setMessage(null);
    setErrorMessage(null);

    const payload = buildSectionPayload(targetVisible);

    try {
      // 1. Direct section update via existing endpoint
      const response = await api.put("/pages/about/sections/sec_about_philosophy", payload);
      if (response.data?.success) {
        setMessage("Philosophy Section saved and published successfully!");
        if (onChange) {
          onChange(payload);
        }
        if (onSaveParent) {
          onSaveParent();
        }
      }
    } catch (err) {
      // If section not found on existing doc, fallback to upserting through page
      try {
        const pageRes = await api.get("/pages/about?adminView=true");
        if (pageRes.data?.success && pageRes.data?.data) {
          const currentPage = pageRes.data.data;
          const existingSections = currentPage.sections || [];
          const index = existingSections.findIndex(
            (s) =>
              s.sectionId === "sec_about_philosophy" ||
              s.type === "philosophy" ||
              s.type === "brand_philosophy"
          );

          let updatedSections = [...existingSections];
          if (index !== -1) {
            updatedSections[index] = { ...updatedSections[index], ...payload };
          } else {
            updatedSections.unshift(payload);
          }

          const saveRes = await api.put("/pages/about", {
            ...currentPage,
            sections: updatedSections,
          });

          if (saveRes.data?.success) {
            setMessage("Philosophy Section saved and published successfully!");
            if (onChange) onChange(payload);
            if (onSaveParent) onSaveParent();
          }
        }
      } catch (saveErr) {
        const errorMsg =
          saveErr.response?.data?.message || err.response?.data?.message || "Failed to save Philosophy section.";
        setErrorMessage(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Reset all Philosophy Section fields to original TEJOVA default content?")) {
      applySectionData(DEFAULT_PHILOSOPHY);
      notifyChange(DEFAULT_PHILOSOPHY);
      setMessage("Restored default TEJOVA content. Click 'Save Changes' to commit to database.");
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-gray-200 p-8">
        <CircularProgress style={{ color: "#B87333" }} />
        <p className="text-xs text-gray-500 font-semibold">
          Loading About Page Philosophy Section CMS...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Section Navigation */}
      <AdminBreadcrumb
        items={[
          { label: "CMS", path: "/admin/pages" },
          { label: "Pages", path: "/admin/pages" },
          { label: "About Page", path: "/admin/pages?page=about" },
          { label: "Philosophy Section" },
        ]}
      />

      {/* Main Section Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B87333]/15 text-[#B87333] tracking-widest uppercase">
                Two-Column Architecture
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  isVisible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {isVisible ? <VisibilityIcon style={{ fontSize: 12 }} /> : <VisibilityOffIcon style={{ fontSize: 12 }} />}
                <span>{isVisible ? "Section Visible" : "Section Hidden"}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isPagePublished
                    ? "bg-[#0A2342] text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isPagePublished ? "Published" : "Draft"}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#0A2342] tracking-wide">
              About Page — Philosophy Section CMS
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Edit <strong>THE PHILOSOPHY</strong> (Left Column) and <strong>STANDARDS OF PURITY</strong> (Right Card) dynamically on the public About page.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Preview Button */}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#0A2342] border border-gray-300 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Preview dynamic section layout"
            >
              <PreviewIcon fontSize="small" className="text-[#B87333]" />
              <span>Live Preview</span>
            </button>

            {/* View Live Public Site */}
            <a
              href="http://localhost:3000/about"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#0A2342] border border-gray-300 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
              title="Open public website About page"
            >
              <OpenInNewIcon fontSize="small" className="text-gray-500" />
              <span>Open Public Site</span>
            </a>

            {/* Visibility Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !isVisible;
                setIsVisible(nextVal);
                notifyChange({ isVisible: nextVal });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isVisible
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {isVisible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              <span>{isVisible ? "Visible" : "Hidden"}</span>
            </button>

            {/* Save & Publish Changes Button */}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2 bg-[#B87333] hover:bg-[#A00000] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <CircularProgress size={16} style={{ color: "#ffffff" }} />
              ) : (
                <SaveIcon fontSize="small" />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fadeIn">
            <CheckCircleIcon fontSize="small" className="text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fadeIn">
            <ErrorIcon fontSize="small" className="text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Two-Column Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ================= LEFT COLUMN EDITOR ================= */}
          <div className="bg-[#FAF9F6] border border-[#0A2342]/15 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#0A2342]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0A2342] text-white text-xs font-bold flex items-center justify-center">
                  L
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0A2342] uppercase tracking-wider">
                    Left Column: The Philosophy
                  </h3>
                  <p className="text-[11px] text-gray-500">Editorial brand origin & core narrative</p>
                </div>
              </div>
            </div>

            {/* Left Column: Section Label */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Section Label (Kicker / Uppercase)
              </label>
              <input
                type="text"
                value={leftLabel}
                onChange={(e) => {
                  setLeftLabel(e.target.value);
                  notifyChange({
                    leftColumn: {
                      label: e.target.value,
                      heading: leftHeading,
                      paragraphs: [leftParagraph1, leftParagraph2],
                      paragraph1: leftParagraph1,
                      paragraph2: leftParagraph2,
                    },
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#B87333] tracking-widest focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                placeholder="e.g. THE PHILOSOPHY"
              />
            </div>

            {/* Left Column: Main Heading */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Main Heading (H2 Serif)
              </label>
              <input
                type="text"
                value={leftHeading}
                onChange={(e) => {
                  setLeftHeading(e.target.value);
                  notifyChange({
                    leftColumn: {
                      label: leftLabel,
                      heading: e.target.value,
                      paragraphs: [leftParagraph1, leftParagraph2],
                      paragraph1: leftParagraph1,
                      paragraph2: leftParagraph2,
                    },
                    title: e.target.value,
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl font-serif text-base font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                placeholder="e.g. Expand Your Light"
              />
            </div>

            {/* Left Column: First Paragraph */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                First Paragraph (Lead Copy / Etymology)
              </label>
              <p className="text-[11px] text-gray-500 mb-2">
                Explains Sanskrit roots "Tej" and "Ova" with formatting support.
              </p>
              <RichTextEditor
                content={leftParagraph1}
                minHeight="140px"
                onChange={(html) => {
                  setLeftParagraph1(html);
                  notifyChange({
                    leftColumn: {
                      label: leftLabel,
                      heading: leftHeading,
                      paragraphs: [html, leftParagraph2],
                      paragraph1: html,
                      paragraph2: leftParagraph2,
                    },
                  });
                }}
                placeholder="Enter first paragraph text..."
              />
            </div>

            {/* Left Column: Second Paragraph */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Second Paragraph (Mission & Rituals)
              </label>
              <p className="text-[11px] text-gray-500 mb-2">
                Nurturing light for self, loved ones, and the world.
              </p>
              <RichTextEditor
                content={leftParagraph2}
                minHeight="140px"
                onChange={(html) => {
                  setLeftParagraph2(html);
                  notifyChange({
                    leftColumn: {
                      label: leftLabel,
                      heading: leftHeading,
                      paragraphs: [leftParagraph1, html],
                      paragraph1: leftParagraph1,
                      paragraph2: html,
                    },
                  });
                }}
                placeholder="Enter second paragraph text..."
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN EDITOR ================= */}
          <div className="bg-[#FAF9F6] border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/25 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#B87333]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#B87333] text-white text-xs font-bold flex items-center justify-center">
                  R
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0A2342] uppercase tracking-wider">
                    Right Column: Standards of Purity Card
                  </h3>
                  <p className="text-[11px] text-gray-500">Highlighted executive leadership callout</p>
                </div>
              </div>
            </div>

            {/* Right Column: Section Label */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Card Section Label (Kicker / Uppercase)
              </label>
              <input
                type="text"
                value={rightLabel}
                onChange={(e) => {
                  setRightLabel(e.target.value);
                  notifyChange({
                    rightColumn: {
                      label: e.target.value,
                      heading: rightHeading,
                      highlightedTitle: rightHighlightedTitle,
                      description: rightDescription,
                    },
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#B87333] tracking-widest focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                placeholder="e.g. STANDARDS OF PURITY"
              />
            </div>

            {/* Right Column: Card Heading */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Card Heading (H3 Serif)
              </label>
              <input
                type="text"
                value={rightHeading}
                onChange={(e) => {
                  setRightHeading(e.target.value);
                  notifyChange({
                    rightColumn: {
                      label: rightLabel,
                      heading: e.target.value,
                      highlightedTitle: rightHighlightedTitle,
                      description: rightDescription,
                    },
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl font-serif text-base font-bold text-[#0A2342] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                placeholder="e.g. About Tejova"
              />
            </div>

            {/* Right Column: Highlighted Title */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Highlighted Title (Gold / Accent Callout)
              </label>
              <input
                type="text"
                value={rightHighlightedTitle}
                onChange={(e) => {
                  setRightHighlightedTitle(e.target.value);
                  notifyChange({
                    rightColumn: {
                      label: rightLabel,
                      heading: rightHeading,
                      highlightedTitle: e.target.value,
                      description: rightDescription,
                    },
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl font-serif text-sm font-semibold text-[#B87333] focus:ring-1 focus:ring-[#B87333] focus:outline-none"
                placeholder="e.g. The Architecture of Biological Sovereignty"
              />
            </div>

            {/* Right Column: Description */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase tracking-wider mb-1.5">
                Description (Rich Text Copy)
              </label>
              <p className="text-[11px] text-gray-500 mb-2">
                Executive messaging on biological command and elite leadership.
              </p>
              <RichTextEditor
                content={rightDescription}
                minHeight="140px"
                onChange={(html) => {
                  setRightDescription(html);
                  notifyChange({
                    rightColumn: {
                      label: rightLabel,
                      heading: rightHeading,
                      highlightedTitle: rightHighlightedTitle,
                      description: html,
                    },
                  });
                }}
                placeholder="Enter right card description copy..."
              />
            </div>
          </div>

        </div>

        {/* Section Settings & Bottom Action Controls */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF9F6] p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => {
                  setIsVisible(e.target.checked);
                  notifyChange({ isVisible: e.target.checked });
                }}
                className="w-4 h-4 rounded text-[#B87333] focus:ring-[#B87333] cursor-pointer"
              />
              <span className="text-xs font-bold text-[#0A2342]">
                Enable Philosophy Section Visibility on Public Website
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Reset Defaults Button */}
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Restore standard TEJOVA defaults"
            >
              <RestartAltIcon fontSize="small" />
              <span>Reset Defaults</span>
            </button>

            {/* Save Changes Button */}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 bg-[#B87333] hover:bg-[#A00000] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <CircularProgress size={16} style={{ color: "#ffffff" }} />
              ) : (
                <SaveIcon fontSize="small" />
              )}
              <span>{saving ? "Saving Changes..." : "Save Philosophy Section"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIVE PREVIEW MODAL ================= */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="bg-[#FAF9F6] w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-[#0A2342] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-sm font-bold tracking-widest text-[#D4AF37]">
                  TEJOVA PHILOSOPHY LIVE PREVIEW
                </span>
                <span className="text-[11px] text-gray-300 hidden sm:inline">
                  (Simulating Public About Page Rendering)
                </span>
              </div>

              {/* Device Selector Controls */}
              <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                    previewDevice === "desktop"
                      ? "bg-[#B87333] text-white font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                  title="Desktop View (1200px)"
                >
                  <LaptopIcon style={{ fontSize: 16 }} />
                  <span className="hidden md:inline text-[10px]">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                    previewDevice === "tablet"
                      ? "bg-[#B87333] text-white font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                  title="Tablet View (768px)"
                >
                  <TabletIcon style={{ fontSize: 16 }} />
                  <span className="hidden md:inline text-[10px]">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                    previewDevice === "mobile"
                      ? "bg-[#B87333] text-white font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                  title="Mobile View (375px)"
                >
                  <SmartphoneIcon style={{ fontSize: 16 }} />
                  <span className="hidden md:inline text-[10px]">Mobile</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Preview Simulation Container */}
            <div className="flex-1 overflow-y-auto bg-gray-200 p-4 sm:p-8 flex justify-center items-start">
              <div
                className={`bg-[#FAF9F6] shadow-2xl transition-all duration-300 min-h-full overflow-hidden text-[#0A2342] ${
                  previewDevice === "desktop"
                    ? "w-full max-w-5xl"
                    : previewDevice === "tablet"
                    ? "w-[768px]"
                    : "w-[375px]"
                }`}
              >
                {/* Simulated Public Philosophy Section */}
                <div className="py-16 sm:py-20 px-6 sm:px-12 border-y border-[#B87333]/30 bg-[#FAF9F6]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    
                    {/* Left Column Preview */}
                    <div className="lg:col-span-6 space-y-6">
                      <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
                        {leftLabel || "THE PHILOSOPHY"}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#0A2342] leading-tight font-medium">
                        {leftHeading || "Expand Your Light"}
                      </h2>
                      <div
                        className="text-base sm:text-lg text-[#0A2342]/85 font-light leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: leftParagraph1 }}
                      />
                      {leftParagraph2 && (
                        <div
                          className="text-sm sm:text-base text-[#0A2342]/75 font-light leading-relaxed space-y-4"
                          dangerouslySetInnerHTML={{ __html: leftParagraph2 }}
                        />
                      )}
                    </div>

                    {/* Right Column Preview */}
                    <div className="lg:col-span-6">
                      <div className="bg-[#FAF9F6] p-8 md:p-10 rounded-xs border-l-4 border-l-[#B87333] border-y border-r border-[#B87333]/20 shadow-xs space-y-6">
                        <span className="text-xs uppercase tracking-widest text-[#B87333] font-semibold block">
                          {rightLabel || "STANDARDS OF PURITY"}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-[#0A2342] font-medium leading-snug">
                          {rightHeading || "About Tejova"}
                        </h3>
                        {rightHighlightedTitle && (
                          <h4 className="font-serif text-lg sm:text-xl text-[#B87333] font-semibold leading-relaxed">
                            {rightHighlightedTitle}
                          </h4>
                        )}
                        <div
                          className="space-y-4 text-sm sm:text-base text-[#0A2342]/80 font-light leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: rightDescription }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
              <span>
                Visibility Status:{" "}
                <strong className={isVisible ? "text-emerald-600" : "text-amber-600"}>
                  {isVisible ? "Active (Visible to Visitors)" : "Disabled (Hidden)"}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-1.5 bg-[#0A2342] text-white rounded-lg font-bold hover:bg-[#B87333] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
