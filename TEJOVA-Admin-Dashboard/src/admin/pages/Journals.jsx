import React, { useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import { initialJournalArticles } from "../data/journalData";

export default function Journals() {
  const [articles, setArticles] = useState(initialJournalArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Mindfulness",
    author: "Dr. Maya Lin",
    excerpt: "",
    content: "",
    status: "Draft",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
  });

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesStatus =
        selectedStatus === "All" || art.status === selectedStatus;
      const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [articles, selectedStatus, searchTerm]);

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        slug: article.slug,
        category: article.category,
        author: article.author,
        excerpt: article.excerpt || "",
        content: article.content || "",
        status: article.status,
        coverImage: article.coverImage,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        slug: "",
        category: "Mindfulness",
        author: "Dr. Maya Lin",
        excerpt: "",
        content: "",
        status: "Draft",
        coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveArticle = (targetStatus = null) => {
    if (!formData.title) return;

    const finalStatus = targetStatus || formData.status;
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");

    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? { ...a, ...formData, slug, status: finalStatus }
            : a
        )
      );
    } else {
      const newArt = {
        id: Date.now(),
        ...formData,
        slug,
        status: finalStatus,
        publishedDate: finalStatus === "Published" ? "Sep 18, 2026" : "—",
        readTime: "5 min read",
      };
      setArticles((prev) => [newArt, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
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
          {["All", "Published", "Draft", "Scheduled"].map((st) => (
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

      {/* Table */}
      <AdminTable
        columns={tableColumns}
        data={filteredArticles}
        emptyMessage="No articles found."
        renderRow={(art) => (
          <tr
            key={art.id}
            className="hover:bg-[#F5F3EF]/50 transition-colors group"
          >
            <td className="py-3.5 px-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-10 rounded-lg bg-[#F5F3EF] border border-[#B87333]/30 overflow-hidden shrink-0">
                  <img
                    src={art.coverImage}
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
                  onClick={() => handleDeleteArticle(art.id)}
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

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Article Content Editor Placeholder
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

          <div>
            <label className="block text-xs font-bold text-[#0A2342] uppercase mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="w-full px-3 py-2 text-xs md:text-sm border border-[#0A2342]/30 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
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
                onClick={() => handleSaveArticle("Draft")}
                className="px-4 py-2 rounded-xl border border-[#B87333] text-[#B87333] hover:bg-[#B87333]/10 text-xs font-bold transition-colors cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveArticle("Published")}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
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