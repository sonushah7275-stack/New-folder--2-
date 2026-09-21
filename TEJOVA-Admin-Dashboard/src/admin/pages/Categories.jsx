import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";

import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoryStatus,
} from "../../Redux/slices/adminCategorySlice.js";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading, mutationLoading, error, successMessage } =
    useSelector((state) => state.adminCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearCategoryStatus());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.slug || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleOpenModal = (category = null) => {
    dispatch(clearCategoryStatus());
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        status: category.isActive ? "Active" : "Inactive",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      isActive: formData.status === "Active",
    };

    let resultAction;
    if (editingCategory) {
      resultAction = await dispatch(
        updateCategory({ id: editingCategory._id, data: payload })
      );
    } else {
      resultAction = await dispatch(createCategory(payload));
    }

    if (
      createCategory.fulfilled.match(resultAction) ||
      updateCategory.fulfilled.match(resultAction)
    ) {
      setIsModalOpen(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const tableColumns = [
    { label: "Category", key: "name" },
    { label: "Slug", key: "slug" },
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
              { label: "Categories", path: "/admin/categories" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize TEJOVA product collections and wellness taxonomy
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <AddIcon className="text-lg" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs md:text-sm animate-fadeIn">
          <CheckCircleOutlinedIcon className="text-emerald-600 text-lg" />
          <span>{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800 text-xs md:text-sm animate-fadeIn">
          <ErrorOutlinedIcon className="text-red-500 text-lg" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category name or slug..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>
      </div>

      {/* Table View */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 font-medium">
          <div className="w-10 h-10 border-4 border-[#0A2342] border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-3" />
          Loading TEJOVA categories...
        </div>
      ) : (
        <AdminTable
          columns={tableColumns}
          data={filteredCategories}
          emptyMessage="No categories found matching your query."
          renderRow={(category) => {
            const catId = category._id || category.id;
            const isCategoryActive = category.isActive ?? (category.status === "Active");
            const statusLabel = isCategoryActive ? "Active" : "Inactive";

            return (
              <tr
                key={catId}
                className="hover:bg-[#F5F3EF]/50 transition-colors group"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A2342]/10 text-[#0A2342] flex items-center justify-center shrink-0">
                      <CategoryIcon className="text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0A2342] text-sm">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                        {category.description || "No description provided"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-gray-600">
                  /{category.slug}
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={statusLabel} />
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(category)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-[#B87333] hover:bg-[#B87333]/10 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <EditIcon className="text-lg" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(catId)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <DeleteOutlinedIcon className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}

      {/* Add / Edit Category Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="e.g. Aromatherapy"
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Slug URL
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. aromatherapy"
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
              <option value="Inactive">Inactive</option>
            </select>
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
              placeholder="Category overview and collection notes..."
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
              disabled={mutationLoading}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {mutationLoading ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}