import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import { initialPillars } from "../data/pillarsData";

export default function Pillars() {
  const [pillars, setPillars] = useState(initialPillars);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    status: "Active",
    order: 1,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80",
    metrics: "0 Articles • 0 Products",
  });

  const handleOpenModal = (pillar = null) => {
    if (pillar) {
      setEditingPillar(pillar);
      setFormData({
        title: pillar.title,
        subtitle: pillar.subtitle,
        description: pillar.description,
        status: pillar.status,
        order: pillar.order,
        image: pillar.image,
        metrics: pillar.metrics,
      });
    } else {
      setEditingPillar(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        status: "Active",
        order: pillars.length + 1,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80",
        metrics: "0 Articles • 0 Products",
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePillar = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingPillar) {
      setPillars((prev) =>
        prev.map((p) => (p.id === editingPillar.id ? { ...p, ...formData } : p))
      );
    } else {
      const newPillar = {
        id: Date.now(),
        ...formData,
      };
      setPillars((prev) => [...prev, newPillar]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePillar = (id) => {
    if (window.confirm("Are you sure you want to delete this pillar?")) {
      setPillars((prev) => prev.filter((p) => p.id !== id));
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

      {/* Pillars Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
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
                    onClick={() => handleDeletePillar(pillar.id)}
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

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
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
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {editingPillar ? "Save Changes" : "Create Pillar"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}