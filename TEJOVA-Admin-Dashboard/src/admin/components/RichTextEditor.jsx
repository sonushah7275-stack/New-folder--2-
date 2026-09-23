import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import ImageIcon from "@mui/icons-material/Image";
import PaletteIcon from "@mui/icons-material/Palette";
import HighlightIcon from "@mui/icons-material/Highlight";
import CircularProgress from "@mui/material/CircularProgress";

import api from "../../config/api.js";

// TEJOVA Color Palette
const TEJOVA_COLORS = [
  { name: "Midnight Blue", value: "#0A2342" },
  { name: "Copper", value: "#B87333" },
  { name: "Gold", value: "#D4AF37" },
  { name: "Deep Green", value: "#1F4D3B" },
  { name: "Sage", value: "#668F6B" },
  { name: "Earth Brown", value: "#886F4F" },
  { name: "Dark Text", value: "#1A1A1A" },
  { name: "Muted Text", value: "#666666" },
];

export default function RichTextEditor({ content = "", onChange, placeholder = "Write your article content..." }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [captionInput, setCaptionInput] = useState("");
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [showCaptionModal, setShowCaptionModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-gray-200 shadow-sm mx-auto block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#B87333] underline hover:text-[#0A2342] transition-colors font-medium",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Synchronize initial or external content changes
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHTML = editor.getHTML();
      if (content !== currentHTML && (content === "" || !editor.isFocused)) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // Handle inline image selection and upload to Cloudinary journal/content folder
  const handleInlineImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please select a valid image file (JPG, JPEG, PNG, WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      setImageError("Image size exceeds 5MB limit. Please select a smaller file.");
      return;
    }

    setImageError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "journal/content");

      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data?.data?.url || response.data?.data?.secureUrl;
      if (imageUrl) {
        setPendingImageUrl(imageUrl);
        setCaptionInput("");
        setShowCaptionModal(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Inline image upload failed.";
      setImageError(msg);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const confirmInsertImage = () => {
    if (!pendingImageUrl) return;

    const caption = captionInput.trim();
    if (caption) {
      // Insert image with figure & caption wrapper or title attribute
      editor
        .chain()
        .focus()
        .insertContent(
          `<figure class="my-6 text-center"><img src="${pendingImageUrl}" alt="${caption}" title="${caption}" class="rounded-lg max-w-full mx-auto shadow-xs border border-gray-200" /><figcaption class="text-xs text-gray-500 font-serif italic mt-2">${caption}</figcaption></figure><p></p>`
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setImage({ src: pendingImageUrl })
        .run();
    }

    setShowCaptionModal(false);
    setPendingImageUrl("");
    setCaptionInput("");
  };

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="border border-[#0A2342]/30 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Editor Toolbar */}
      <div className="p-2.5 bg-[#FAF9F6] border-b border-[#0A2342]/15 flex flex-wrap items-center gap-1.5 text-xs text-[#0A2342]">
        {/* Headings Dropdown */}
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : editor.isActive("heading", { level: 4 })
              ? "h4"
              : "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
            else if (val === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          className="px-2 py-1 border border-[#0A2342]/20 rounded-lg bg-white text-[#0A2342] font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#B87333]"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text Styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bold") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Bold"
        >
          <FormatBoldIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("italic") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Italic"
        >
          <FormatItalicIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("underline") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Underline"
        >
          <FormatUnderlinedIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("strike") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Strikethrough"
        >
          <StrikethroughSIcon fontSize="small" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer"
            title="Text Color"
          >
            <PaletteIcon fontSize="small" />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 flex gap-1.5 w-max">
              {TEJOVA_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="text-[10px] text-gray-500 hover:text-black font-semibold px-1"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Highlight Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer"
            title="Highlight Color"
          >
            <HighlightIcon fontSize="small" />
          </button>

          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 flex gap-1.5 w-max">
              {TEJOVA_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: c.value }).run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
                className="text-[10px] text-gray-500 hover:text-black font-semibold px-1"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "left" }) ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Align Left"
        >
          <FormatAlignLeftIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "center" }) ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Align Center"
        >
          <FormatAlignCenterIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "right" }) ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Align Right"
        >
          <FormatAlignRightIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "justify" }) ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Justify"
        >
          <FormatAlignJustifyIcon fontSize="small" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bulletList") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Bullet List"
        >
          <FormatListBulletedIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("orderedList") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Numbered List"
        >
          <FormatListNumberedIcon fontSize="small" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("blockquote") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Blockquote"
        >
          <FormatQuoteIcon fontSize="small" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={handleSetLink}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("link") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
          }`}
          title="Insert Hyperlink"
        >
          <InsertLinkIcon fontSize="small" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-red-600 cursor-pointer"
            title="Remove Link"
          >
            <LinkOffIcon fontSize="small" />
          </button>
        )}

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Inline Image Upload */}
        <label className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer">
          {uploadingImage ? (
            <CircularProgress size={16} style={{ color: "#B87333" }} />
          ) : (
            <ImageIcon fontSize="small" />
          )}
          <span className="text-[11px] font-bold">Add Image</span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInlineImageSelect}
            className="hidden"
            disabled={uploadingImage}
          />
        </label>
      </div>

      {/* Upload Error Banner */}
      {imageError && (
        <div className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold border-b border-red-100 flex items-center justify-between">
          <span>⚠️ {imageError}</span>
          <button type="button" onClick={() => setImageError(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="p-4 min-h-[260px] max-h-[500px] overflow-y-auto prose prose-sm max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      {/* Optional Caption Modal */}
      {showCaptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-[#0A2342] uppercase tracking-wider">
              Insert Inline Image Caption
            </h3>

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={pendingImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2342] mb-1">
                Image Caption (Optional)
              </label>
              <input
                type="text"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="e.g. Morning sunlight through the TEJOVA space..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCaptionModal(false);
                  setPendingImageUrl("");
                  setCaptionInput("");
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInsertImage}
                className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
