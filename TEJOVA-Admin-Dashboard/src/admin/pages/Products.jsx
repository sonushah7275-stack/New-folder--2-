import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";

import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  clearProductStatus,
} from "../../Redux/slices/adminProductSlice.js";

import { fetchAdminCategories } from "../../Redux/slices/adminCategorySlice.js";

export default function Products() {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    mutationLoading,
    uploadingImage,
    error,
    successMessage,
  } = useSelector((state) => state.adminProducts);

  const { categories } = useSelector((state) => state.adminCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    comparePrice: "",
    stock: "10",
    status: "Active",
    description: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearProductStatus());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Dynamic Categories options list
  const categoryOptions = useMemo(() => {
    if (!categories || categories.length === 0) return ["Wellness"];
    return categories.map((c) => c.name);
  }, [categories]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((item) => {
      const pName = (item.name || "").toLowerCase();
      const pSku = (item.sku || "").toLowerCase();
      const pCatName = (item.category?.name || item.category || "").toString();
      const pStatusLabel = item.isActive ? "Active" : "Inactive";

      const matchesSearch =
        pName.includes(searchTerm.toLowerCase()) ||
        pSku.includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        pCatName === selectedCategory;

      const matchesStatus =
        selectedStatus === "All Statuses" || pStatusLabel === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Handle Form Open
  const handleOpenModal = (product = null) => {
    dispatch(clearProductStatus());
    if (product) {
      setEditingProduct(product);
      const imgUrl =
        product.images?.[0]?.url ||
        (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
        "";

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category?._id || product.category?.name || product.category || categoryOptions[0],
        price: product.price ?? "",
        comparePrice: product.compareAtPrice ?? "",
        stock: product.stock ?? 0,
        status: product.isActive ? "Active" : "Draft",
        description: product.description || product.shortDescription || "",
        image: imgUrl,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: `TJ-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories?.[0]?._id || categoryOptions[0] || "",
        price: "",
        comparePrice: "",
        stock: "10",
        status: "Active",
        description: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  // Handle Image Upload via Cloudinary
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resultAction = await dispatch(uploadProductImage(file));
    if (uploadProductImage.fulfilled.match(resultAction)) {
      setFormData((prev) => ({ ...prev, image: resultAction.payload }));
    }
  };

  // Handle Form Save
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === "") return;

    // Find category ID if selected value is ObjectId or Category Name
    let matchedCatId = formData.category;
    if (categories && categories.length > 0) {
      const found = categories.find(
        (c) => c._id === formData.category || c.name === formData.category
      );
      if (found) matchedCatId = found._id;
    }

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: matchedCatId || undefined,
      price: Number(formData.price),
      compareAtPrice: formData.comparePrice ? Number(formData.comparePrice) : null,
      stock: Number(formData.stock),
      isActive: formData.status === "Active",
      description: formData.description.trim(),
      shortDescription: formData.description.trim().slice(0, 150),
      images: formData.image ? [{ url: formData.image, alt: formData.name }] : [],
    };

    let resultAction;
    if (editingProduct) {
      resultAction = await dispatch(
        updateProduct({ id: editingProduct._id, data: payload })
      );
    } else {
      resultAction = await dispatch(createProduct(payload));
    }

    if (
      createProduct.fulfilled.match(resultAction) ||
      updateProduct.fulfilled.match(resultAction)
    ) {
      setIsModalOpen(false);
    }
  };

  // Handle Delete
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Table Columns Setup
  const tableColumns = [
    { label: "Product", key: "name" },
    { label: "Category", key: "category" },
    { label: "Price", key: "price" },
    { label: "Stock", key: "stock" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "right" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Products", path: "/admin/products" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Products Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your TEJOVA catalog, stock levels, and active status
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <AddIcon className="text-lg" />
          <span>Add Product</span>
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

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product name or SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <FilterListIcon className="text-gray-400 text-lg hidden sm:block" />

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          >
            <option value="All Categories">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl bg-white text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 font-medium">
          <div className="w-10 h-10 border-4 border-[#0A2342] border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-3" />
          Loading TEJOVA products catalog...
        </div>
      ) : (
        <AdminTable
          columns={tableColumns}
          data={filteredProducts}
          emptyMessage="No products found matching your search."
          renderRow={(product) => {
            const pId = product._id || product.id;
            const imgUrl =
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
              "";
            const categoryName = product.category?.name || product.category || "General";
            const statusLabel = product.isActive ? "Active" : "Inactive";

            return (
              <tr
                key={pId}
                className="hover:bg-[#F5F3EF]/50 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] border border-[#B87333]/30 overflow-hidden shrink-0 flex items-center justify-center text-[#0A2342] font-bold">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        product.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#0A2342] text-sm">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">{product.sku || "N/A"}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                  {categoryName}
                </td>
                <td className="py-3.5 px-4 text-xs font-bold text-[#0A2342]">
                  ${product.price}{" "}
                  {product.compareAtPrice && (
                    <span className="text-gray-400 font-normal line-through ml-1">
                      ${product.compareAtPrice}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                  {product.stock > 0 ? (
                    <span>{product.stock} in stock</span>
                  ) : (
                    <span className="text-red-600 font-bold">0 in stock</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={statusLabel} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(product)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-[#B87333] hover:bg-[#B87333]/10 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <EditIcon className="text-lg" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(pId)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Product"
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

      {/* Product Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Vitality Tonic"
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                SKU Code *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
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
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">Select Category</option>
                )}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="48"
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="45"
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Compare Price */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Compare Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) =>
                  setFormData({ ...formData, comparePrice: e.target.value })
                }
                placeholder="58"
                className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
                Product Status
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

          {/* Description */}
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
              placeholder="Product details and benefits..."
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
            />
          </div>

          {/* Product Image & Cloudinary Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Product Image
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://res.cloudinary.com/..."
                className="flex-1 px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
              <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0A2342] text-white rounded-xl text-xs font-semibold hover:bg-[#B87333] transition-colors cursor-pointer shrink-0">
                <CloudUploadOutlinedIcon className="text-base" />
                <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-[#B87333]/30"
                />
                <span className="text-[11px] text-gray-500 font-mono truncate max-w-xs">
                  {formData.image}
                </span>
              </div>
            )}
          </div>

          {/* Modal Actions */}
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
              disabled={mutationLoading || uploadingImage}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {mutationLoading ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}