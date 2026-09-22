import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import {
  fetchJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  uploadJournalImage,
} from "../../Redux/slices/journalSlice.js";

export default function Journals() {
  const dispatch = useDispatch();
  const { articles, loading, mutationLoading, error } = useSelector(
    (state) => state.adminJournal || state.journal
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [imageError, setImageError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Mindfulness",
    author: "Editorial Team",
    excerpt: "",
    content: "",
    fontStyle: "tejova-editorial",
    status: "Draft",
    coverImage: "",
  });

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const filteredArticles = useMemo(() => {
    return (articles || []).filter((art) => {
      const matchesStatus =
        selectedStatus === "All" || art.status === selectedStatus;
      const matchesSearch =
        !searchTerm ||
        (art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.category && art.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.author && art.author.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  }, [articles, selectedStatus, searchTerm]);

  const handleOpenModal = (article = null) => {
    setImageError(null);
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        category: article.category || "Mindfulness",
        author: article.author || "Editorial Team",
        excerpt: article.excerpt || "",
        content: article.content || "",
        fontStyle: article.fontStyle || "tejova-editorial",
        status: article.status || "Draft",
        coverImage: article.coverImage || "",
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        slug: "",
        category: "Mindfulness",
        author: "Editorial Team",
        excerpt: "",
        content: "",
        fontStyle: "tejova-editorial",
        status: "Draft",
        coverImage: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageError("File size exceeds 5MB limit. Please select a smaller image.");
      return;
    }

    setImageError(null);
    setUploadingCover(true);

    try {
      const imageUrl = await dispatch(uploadJournalImage(file)).unwrap();
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, coverImage: imageUrl }));
      }
    } catch (err) {
      setImageError(err || "Image upload failed. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: "" }));
    setImageError(null);
  };

  const handleSaveArticle = (targetStatus = null) => {
    if (!formData.title || !formData.title.trim()) return;
    if (uploadingCover) return;

    const finalStatus = targetStatus || formData.status;
    if (!formData.coverImage && finalStatus === "Published") {
      setImageError("Please upload a cover image before publishing.");
      return;
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");

    const payload = {
      ...formData,
      slug,
      status: finalStatus,
    };

    if (editingArticle) {
      const targetId = editingArticle._id || editingArticle.id;
      dispatch(updateJournal({ id: targetId, data: payload })).then((res) => {
        if (!res.error) setIsModalOpen(false);
      });
    } else {
      dispatch(createJournal(payload)).then((res) => {
        if (!res.error) setIsModalOpen(false);
      });
    }
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      dispatch(deleteJournal(id));
    }
  };

  const tableColumns = [
    { label: "Article Title", key: "title" },
    { label: "Category", key: "category" },
    { label: "Author", key: "author" },
    { label: "Published Date", key: "publishedDate" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "right" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Journal", path: "/admin/journal" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Journal & Blog Articles
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Publish botanical stories, mindfulness essays, and wellness guides
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <AddIcon className="text-lg" />
          <span>Create Article</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search article title or author..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {["All", "Published", "Draft"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? "bg-[#0A2342] text-white shadow-2xs"
                  : "text-gray-600 hover:bg-[#F5F3EF]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <CircularProgress size={32} style={{ color: "#B87333" }} />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <AdminTable
          columns={tableColumns}
          data={filteredArticles}
          emptyMessage="No articles found."
          renderRow={(art) => (
            <tr
              key={art._id || art.id}
              className="hover:bg-[#F5F3EF]/50 transition-colors group"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-10 rounded-lg bg-[#F5F3EF] border border-[#B87333]/30 overflow-hidden shrink-0">
                    <img
                      src={art.coverImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-[#0A2342] text-xs md:text-sm">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">
                      {art.excerpt}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                {art.category}
              </td>
              <td className="py-3.5 px-4 text-xs text-[#0A2342] font-semibold">
                {art.author}
              </td>
              <td className="py-3.5 px-4 text-xs text-gray-500">
                {art.publishedDate}
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={art.status} />
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(art)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-[#B87333] hover:bg-[#B87333]/10 transition-colors cursor-pointer"
                    title="Edit Article"
                  >
                    <EditIcon className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(art._id || art.id)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <DeleteOutlinedIcon className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {/* Article Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "Edit Article" : "Create Journal Article"}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="e.g. Building Better Daily Rituals"
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              >
                <option value="Mindfulness">Mindfulness</option>
                <option value="Wellness">Wellness</option>
                <option value="Supplements">Supplements</option>
                <option value="Yoga">Yoga</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Short Excerpt / Summary
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="A brief preview shown in journal cards..."
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Cover Image *
            </label>

            {formData.coverImage ? (
              <div className="border border-[#B87333]/30 rounded-xl p-3 bg-[#FAF9F6]">
                <div className="relative aspect-[16/9] w-full max-h-48 rounded-lg overflow-hidden border border-gray-200 mb-3 bg-gray-100">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-semibold">
                      <CircularProgress size={24} style={{ color: "#D4AF37" }} />
                      <span className="mt-2">Uploading image...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ Upload successful
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-lg border border-[#B87333] text-[#B87333] hover:bg-[#B87333]/10 font-bold transition-colors cursor-pointer">
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploadingCover}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={uploadingCover}
                      className="px-2.5 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#B87333]/40 hover:border-[#B87333] rounded-xl p-6 bg-[#FAF9F6] hover:bg-white transition-all flex flex-col items-center justify-center cursor-pointer group text-center">
                {uploadingCover ? (
                  <div className="py-2 text-center">
                    <CircularProgress size={28} style={{ color: "#B87333" }} />
                    <p className="text-xs font-semibold text-[#0A2342] mt-2">Uploading image to Cloudinary...</p>
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon className="text-3xl text-[#B87333] group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-bold text-[#0A2342]">Upload Cover Image</span>
                    <span className="text-[11px] text-gray-500 mt-1">JPG, PNG, WEBP • Max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            )}

            {imageError && (
              <p className="text-xs text-red-600 font-medium mt-1.5">⚠️ {imageError}</p>
            )}
          </div>

          {/* Article Font Style */}
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Article Font Style
            </label>
            <select
              value={formData.fontStyle || "tejova-editorial"}
              onChange={(e) =>
                setFormData({ ...formData, fontStyle: e.target.value })
              }
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            >
              <option value="tejova-editorial">TEJOVA Editorial</option>
              <option value="modern-editorial">Modern Editorial</option>
              <option value="classic-serif">Classic Serif</option>
              <option value="clean-sans">Clean Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Article Content
            </label>
            <textarea
              rows="6"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write or paste your article content here..."
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333] font-sans"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={mutationLoading || uploadingCover}
                onClick={() => handleSaveArticle("Draft")}
                className="px-4 py-2 rounded-xl border border-[#B87333] text-[#B87333] hover:bg-[#B87333]/10 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={mutationLoading || uploadingCover}
                onClick={() => handleSaveArticle("Published")}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}