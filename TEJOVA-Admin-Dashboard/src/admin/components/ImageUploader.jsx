import React, { useState, useRef } from "react";
import api from "../../config/api.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

export default function ImageUploader({
  label = "Image Asset",
  imageUrl = "",
  resourceType = "image",
  onImageChange,
  folder = "content",
  allowVideo = false,
  helperText = "Upload high-res PNG, JPG, WebP, or SVG (or MP4 video where supported).",
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setSuccessNotice(false);
    setImgError(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.data) {
        const uploadedUrl = response.data.data.secureUrl || response.data.data.url;
        const uploadedType = response.data.data.resourceType || (file.type.startsWith("video/") ? "video" : "image");
        if (onImageChange) {
          onImageChange(uploadedUrl, uploadedType);
        }
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      } else {
        setUploadError(response.data?.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      const errMsg = err.response?.data?.message || "Failed to upload file to Cloudinary.";
      setUploadError(errMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    if (onImageChange) {
      onImageChange("", "image");
    }
    setImgError(false);
  };

  const isVideo = resourceType === "video" || (imageUrl && (imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm")));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Preview Box */}
        <div className="relative w-24 h-24 rounded-xl border border-gray-200 bg-[#FAF9F6] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
          {imageUrl && !imgError ? (
            isVideo ? (
              <video
                src={imageUrl}
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={imageUrl}
                alt="Preview"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
              {imgError ? (
                <BrokenImageIcon fontSize="small" className="text-amber-500" />
              ) : (
                <CloudUploadIcon fontSize="small" />
              )}
              <span className="text-[10px] mt-1 font-medium">
                {imgError ? "Invalid URL" : "No Media"}
              </span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <CircularProgress size={20} style={{ color: "#D4AF37" }} />
            </div>
          )}
        </div>

        {/* Controls & URL input */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrl || ""}
              onChange={(e) => {
                setImgError(false);
                if (onImageChange) onImageChange(e.target.value, resourceType);
              }}
              placeholder="Paste media URL or upload below..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#B87333] focus:outline-none bg-white"
            />

            {imageUrl && (
              <button
                type="button"
                onClick={handleClear}
                title="Remove image"
                className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer shrink-0"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={allowVideo ? "image/*,video/mp4,video/webm" : "image/*"}
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-[#0A2342] hover:bg-[#B87333] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUploadIcon fontSize="inherit" />
              <span>{uploading ? "Uploading to Cloudinary..." : imageUrl ? "Replace Media" : "Upload to Cloudinary"}</span>
            </button>

            {successNotice && (
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                <CheckCircleIcon fontSize="inherit" /> Uploaded!
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-500 font-sans">
            {helperText}
          </p>

          {uploadError && (
            <p className="text-xs text-red-600 font-semibold">
              ⚠️ {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
