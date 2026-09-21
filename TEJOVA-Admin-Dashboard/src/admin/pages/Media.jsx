import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CircularProgress from "@mui/material/CircularProgress";

import AdminBreadcrumb from "../components/AdminBreadcrumb";
import AdminModal from "../components/AdminModal";
import {
  fetchMedia,
  uploadMedia,
  deleteMedia,
} from "../../Redux/slices/mediaSlice.js";

export default function Media() {
  const dispatch = useDispatch();
  const { media, loading, uploadLoading, deleteLoading, error } = useSelector(
    (state) => state.adminMedia || state.media
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFile, setSelectedFile] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const categories = ["All", "Products", "Journal", "Pillars", "General"];

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  const filteredFiles = useMemo(() => {
    return (media || []).filter((f) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (f.folder && f.folder.toLowerCase() === selectedCategory.toLowerCase()) ||
        (f.category && f.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        !searchTerm ||
        (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.type && f.type.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [media, selectedCategory, searchTerm]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const targetFolder =
      selectedCategory !== "All" ? selectedCategory.toLowerCase() : "products";

    dispatch(uploadMedia({ file, folder: targetFolder }));
  };

  const handleDeleteFile = (publicId) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      dispatch(deleteMedia(publicId)).then((res) => {
        if (!res.error) setSelectedFile(null);
      });
    }
  };

  const handleCopyUrl = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Media", path: "/admin/media" },
            ]}
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2342]">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Store, view, and organize product photography and brand assets
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto">
          {uploadLoading ? (
            <CircularProgress size={18} style={{ color: "#ffffff" }} />
          ) : (
            <CloudUploadIcon className="text-lg" />
          )}
          <span>{uploadLoading ? "Uploading..." : "Upload Asset"}</span>
          <input
            type="file"
            accept="image/*,.pdf"
            disabled={uploadLoading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#B87333]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search filenames..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-[#0A2342]/20 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
          />
        </div>

        {/* Categories & View Switcher */}
        <div className="flex items-center justify-between gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#0A2342] text-white"
                    : "text-gray-600 hover:bg-[#F5F3EF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#F5F3EF] p-1 rounded-xl border border-[#B87333]/20 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-[#0A2342] text-white" : "text-gray-600"
              }`}
              title="Grid View"
            >
              <GridViewIcon className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-[#0A2342] text-white" : "text-gray-600"
              }`}
              title="List View"
            >
              <ViewListIcon className="text-sm" />
            </button>
          </div>
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

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file._id || file.id}
              onClick={() => setSelectedFile(file)}
              className="group bg-white rounded-2xl border border-[#B87333]/20 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="h-32 bg-[#F5F3EF] relative flex items-center justify-center overflow-hidden">
                {file.type && file.type.includes("image") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <InsertDriveFileIcon className="text-4xl text-gray-400" />
                )}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A2342]/80 text-[#FAF9F6]">
                  {file.category}
                </span>
              </div>

              <div className="p-3">
                <p className="text-xs font-bold text-[#0A2342] truncate">
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>{file.size}</span>
                  <span>{file.uploadedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-[#B87333]/20 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A2342] text-[#FAF9F6]">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3EF]">
              {filteredFiles.map((file) => (
                <tr key={file._id || file.id} className="hover:bg-[#F5F3EF]/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F3EF] overflow-hidden flex items-center justify-center shrink-0">
                        {file.type && file.type.includes("image") ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <InsertDriveFileIcon className="text-lg text-gray-500" />
                        )}
                      </div>
                      <span className="font-bold text-[#0A2342]">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-600">
                    {file.category}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{file.size}</td>
                  <td className="py-3 px-4 text-gray-500">{file.dimensions}</td>
                  <td className="py-3 px-4 text-gray-500">{file.uploadedDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      className="px-3 py-1 rounded-lg bg-[#0A2342] text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Preview Modal */}
      <AdminModal
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        title={selectedFile ? selectedFile.name : "Asset Preview"}
        maxWidth="max-w-xl"
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="h-64 bg-[#0A2342]/5 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
              {selectedFile.type && selectedFile.type.includes("image") ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <InsertDriveFileIcon className="text-6xl text-gray-400" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F5F3EF] p-4 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[10px]">
                  File Name
                </span>
                <span className="font-semibold text-[#0A2342]">
                  {selectedFile.name}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[10px]">
                  Category
                </span>
                <span className="font-semibold text-[#0A2342]">
                  {selectedFile.category}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[10px]">
                  File Size & Type
                </span>
                <span className="font-semibold text-[#0A2342]">
                  {selectedFile.size} • {selectedFile.type}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[10px]">
                  Uploaded Date
                </span>
                <span className="font-semibold text-[#0A2342]">
                  {selectedFile.uploadedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(selectedFile.url)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <ContentCopyIcon className="text-sm" />
                <span>{copyFeedback ? "URL Copied!" : "Copy Asset URL"}</span>
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDeleteFile(selectedFile.publicId || selectedFile._id)}
                className="p-2 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50"
                title="Delete Asset"
              >
                <DeleteOutlinedIcon className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}