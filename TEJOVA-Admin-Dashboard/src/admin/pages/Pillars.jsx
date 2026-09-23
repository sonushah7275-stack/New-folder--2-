import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import {
  fetchPillars,
  createPillar,
  updatePillar,
  deletePillar,
  uploadPillarImage,
} from "../../Redux/slices/pillarSlice.js";

export default function Pillars() {
  const dispatch = useDispatch();
  const { pillars, loading, mutationLoading, error } = useSelector(
    (state) => state.adminPillar || state.pillar
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [imageError, setImageError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    status: "Active",
    order: 1,
    image: "",
    metrics: "Brand Pillar",
  });

  useEffect(() => {
    dispatch(fetchPillars());
  }, [dispatch]);

  const handleOpenModal = (pillar = null) => {
    setImageError(null);
    if (pillar) {
      setEditingPillar(pillar);
      setFormData({
        title: pillar.title || pillar.name || "",
        subtitle: pillar.subtitle || "",
        description: pillar.description || "",
        status: pillar.status || (pillar.isActive !== false ? "Active" : "Draft"),
        order: pillar.order || 1,
        image: pillar.image || "",
        metrics: pillar.metrics || "Brand Pillar",
      });
    } else {
      setEditingPillar(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        status: "Active",
        order: (pillars || []).length + 1,
        image: "",
        metrics: "Brand Pillar",
      });
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      setImageError("Image size must be 5 MB or less.");
      return;
    }

    setImageError(null);
    setUploadingCover(true);

    try {
      const imageUrl = await dispatch(uploadPillarImage(file)).unwrap();
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (err) {
      setImageError(err || "Image upload failed. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageError(null);
  };

  const handleSavePillar = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) return;
    if (uploadingCover) return;

    if (!formData.image) {
      setImageError("Please upload a cover image.");
      return;
    }

    if (editingPillar) {
      const targetId = editingPillar._id || editingPillar.id;
      dispatch(updatePillar({ id: targetId, data: formData })).then((res) => {
        if (!res.error) setIsModalOpen(false);
      });
    } else {
      dispatch(createPillar(formData)).then((res) => {
        if (!res.error) setIsModalOpen(false);
      });
    }
  };

  const handleDeletePillar = (id) => {
    if (window.confirm("Are you sure you want to delete this pillar?")) {
      dispatch(deletePillar(id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Pillars", path: "/admin/pillars" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            TEJOVA Wellness Pillars
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage foundational brand pillars that structure your products and journal
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <AddIcon className="text-lg" />
          <span>Add Pillar</span>
        </button>
      </div>

      {/* Error Banner */}
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

      {/* Pillars Grid Layout */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(pillars || []).map((pillar) => (
            <div
              key={pillar._id || pillar.id}
              className="bg-white rounded-2xl border border-[#B87333]/20 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              {/* Top Image Preview & Badge */}
              <div className="relative h-44 w-full bg-[#0A2342] overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/90 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#0A2342] text-[#D4AF37] text-xs font-bold flex items-center justify-center border border-[#B87333]">
                    0{pillar.order}
                  </span>
                  <StatusBadge status={pillar.status} />
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-xl font-bold text-[#FAF9F6]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-medium line-clamp-1">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              {/* Description & Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2342]">
                    <AutoAwesomeIcon className="text-sm text-[#B87333]" />
                    <span>{pillar.metrics}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(pillar)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-[#B87333] hover:bg-[#B87333]/10 transition-colors cursor-pointer"
                      title="Edit Pillar"
                    >
                      <EditIcon className="text-lg" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePillar(pillar._id || pillar.id)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Pillar"
                    >
                      <DeleteOutlinedIcon className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Pillar Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPillar ? "Edit Pillar" : "Add Wellness Pillar"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSavePillar} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Pillar Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Mindful Living"
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Subtitle Tagline
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="e.g. Cultivating intentional presence"
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Display Order Index
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Full pillar philosophy and scope..."
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Cover Image *
            </label>

            {formData.image ? (
              <div className="border border-[#B87333]/30 rounded-xl p-3 bg-[#FAF9F6]">
                <div className="relative aspect-[16/9] w-full max-h-48 rounded-lg overflow-hidden border border-gray-200 mb-3 bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Pillar cover preview"
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
                    ✓ Image uploaded
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
                    <p className="text-xs font-semibold text-[#0A2342] mt-2">
                      Uploading image to Cloudinary...
                    </p>
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon className="text-3xl text-[#B87333] group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-bold text-[#0A2342]">
                      Upload Cover Image
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1">
                      JPG, JPEG, PNG, WEBP • Max 5MB
                    </span>
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
              <p className="text-xs text-red-600 font-medium mt-1.5">
                ⚠️ {imageError}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutationLoading}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {editingPillar ? "Save Changes" : "Create Pillar"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}