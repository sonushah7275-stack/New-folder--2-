import React, { useState, useEffect } from "react";
import { useEditor, EditorContent, Extension, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
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
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import TableChartIcon from "@mui/icons-material/TableChart";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CircularProgress from "@mui/material/CircularProgress";

import api from "../../config/api.js";

// Whitelisted Font Sizes
export const FONT_SIZES = [
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
];

// Whitelisted Line Heights
export const ALLOWED_LINE_HEIGHTS = ["1.0", "1.15", "1.25", "1.5", "1.75", "2.0"];

// Custom Tiptap Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const size = element.style.fontSize?.replace(/['"]+/g, "");
              return FONT_SIZES.includes(size) ? size : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize || !FONT_SIZES.includes(attributes.fontSize)) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          if (!FONT_SIZES.includes(fontSize)) return false;
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

// Custom Tiptap Line Height Extension
const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["paragraph", "heading", "blockquote", "listItem"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight || !ALLOWED_LINE_HEIGHTS.includes(attributes.lineHeight)) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain, state }) => {
          if (!ALLOWED_LINE_HEIGHTS.includes(lineHeight)) return false;
          const { selection, tr } = state;
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
              });
            }
          });
          return chain().focus().run();
        },
      unsetLineHeight:
        () =>
        ({ chain, state }) => {
          const { selection, tr } = state;
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const { lineHeight, ...restAttrs } = node.attrs;
              tr.setNodeMarkup(pos, undefined, restAttrs);
            }
          });
          return chain().focus().run();
        },
    };
  },
});

// Custom Tiptap Horizontal Rule Node with Color Attribute
const CustomHorizontalRule = Node.create({
  name: "horizontalRule",
  group: "block",
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      color: {
        default: "#B87333",
        parseHTML: (element) => {
          return (
            element.style.borderColor ||
            element.style.borderTopColor ||
            element.getAttribute("data-color") ||
            "#B87333"
          );
        },
        renderHTML: (attributes) => {
          const color = attributes.color || "#B87333";
          return {
            style: `border: none; border-top: 2px solid ${color}; margin: 2rem 0; opacity: 1;`,
            "data-color": color,
          };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setHorizontalRule:
        (options = {}) =>
        ({ chain }) => {
          const color = options.color || "#B87333";
          return chain().insertContent({ type: this.name, attrs: { color } }).run();
        },
    };
  },
});

// TEJOVA Color Palette
const TEJOVA_COLORS = [
  { name: "Midnight Blue", value: "#0A2342" },
  { name: "Copper", value: "#B87333" },
  { name: "Gold", value: "#D4AF37" },
  { name: "Cream", value: "#FAF9F6" },
  { name: "Deep Green", value: "#1F4D3B" },
  { name: "Sage", value: "#668F6B" },
  { name: "Earth Brown", value: "#886F4F" },
  { name: "Dark Text", value: "#1A1A1A" },
];

export default function RichTextEditor({ content = "", onChange, placeholder = "Write your article content..." }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showHrColorPicker, setShowHrColorPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [selectedHrColor, setSelectedHrColor] = useState("#B87333");
  const [captionInput, setCaptionInput] = useState("");
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [, setSelectionUpdateCounter] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      LineHeight,
      CustomHorizontalRule,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-gray-200 shadow-xs mx-auto block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#B87333] underline hover:text-[#0A2342] transition-colors font-medium",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-[#0A2342]/20 my-4 w-full text-xs font-sans shadow-xs rounded-lg overflow-hidden",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-[#0A2342]/15 hover:bg-[#FAF9F6]/50 transition-colors",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-[#FAF9F6] border border-[#0A2342]/20 px-3 py-2 text-left font-serif font-bold text-[#0A2342]",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-[#0A2342]/15 px-3 py-2 text-[#0A2342]",
        },
      }),
    ],
    content: content || "",
    onSelectionUpdate: () => {
      setSelectionUpdateCounter((prev) => prev + 1);
    },
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

  const handleInsertTable = (cols, rows) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const handleInsertHr = (color) => {
    const targetColor = color || selectedHrColor || "#B87333";
    if (editor.isActive("horizontalRule")) {
      editor.chain().focus().updateAttributes("horizontalRule", { color: targetColor }).run();
    } else {
      editor.chain().focus().setHorizontalRule({ color: targetColor }).run();
    }
    setShowHrColorPicker(false);
  };

  // Get active formatting attributes
  const activeFontSize = editor.getAttributes("textStyle").fontSize || "";
  const activeLineHeight =
    editor.getAttributes("paragraph").lineHeight ||
    editor.getAttributes("heading").lineHeight ||
    editor.getAttributes("blockquote").lineHeight ||
    "";

  return (
    <div className="border border-[#0A2342]/30 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Editor Main Toolbar */}
      <div className="p-2.5 bg-[#FAF9F6] border-b border-[#0A2342]/15 flex flex-wrap items-center gap-1.5 text-xs text-[#0A2342]">
        {/* GROUP 1: HISTORY */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-[#0A2342] cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <UndoIcon fontSize="small" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-[#0A2342] cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <RedoIcon fontSize="small" />
          </button>
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 2: TYPOGRAPHY (FONT SIZE, LINE HEIGHT, HEADINGS) */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Selector */}
          <select
            value={activeFontSize}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(val).run();
              }
            }}
            className="px-2 py-1 border border-[#0A2342]/20 rounded-lg bg-white text-[#0A2342] font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#B87333]"
            title="Font Size"
          >
            <option value="">Size (Default)</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Line Height Selector */}
          <select
            value={activeLineHeight}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                editor.chain().focus().unsetLineHeight().run();
              } else {
                editor.chain().focus().setLineHeight(val).run();
              }
            }}
            className="px-2 py-1 border border-[#0A2342]/20 rounded-lg bg-white text-[#0A2342] font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#B87333]"
            title="Line Height"
          >
            <option value="">Line Height (Default)</option>
            {ALLOWED_LINE_HEIGHTS.map((lh) => (
              <option key={lh} value={lh}>
                Line Height: {lh}
              </option>
            ))}
          </select>

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
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 3: TEXT FORMATTING */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("bold") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
            }`}
            title="Bold (Ctrl+B)"
          >
            <FormatBoldIcon fontSize="small" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("italic") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
            }`}
            title="Italic (Ctrl+I)"
          >
            <FormatItalicIcon fontSize="small" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("underline") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
            }`}
            title="Underline (Ctrl+U)"
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
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 4: COLOR */}
        <div className="flex items-center gap-0.5">
          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
                setShowTablePicker(false);
                setShowHrColorPicker(false);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer"
              title="Text Color"
            >
              <PaletteIcon fontSize="small" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 flex gap-1.5 w-max">
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

          {/* Highlight Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
                setShowTablePicker(false);
                setShowHrColorPicker(false);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer"
              title="Highlight Color"
            >
              <HighlightIcon fontSize="small" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 flex gap-1.5 w-max">
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
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 5: ALIGNMENT */}
        <div className="flex items-center gap-0.5">
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
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 6: LISTS */}
        <div className="flex items-center gap-0.5">
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
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 7: BLOCKS (BLOCKQUOTE & HORIZONTAL LINE WITH COLOR) */}
        <div className="flex items-center gap-1">
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

          {/* Horizontal Line Button + Color Picker Popover */}
          <div className="relative flex items-center bg-white rounded-lg border border-gray-300 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => handleInsertHr(selectedHrColor)}
              className="px-2 py-1 hover:bg-gray-100 text-[#0A2342] font-semibold text-xs cursor-pointer flex items-center gap-1"
              title="Insert Horizontal Line (<hr>)"
            >
              <HorizontalRuleIcon fontSize="small" style={{ color: selectedHrColor }} />
              <span>Divider</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowHrColorPicker(!showHrColorPicker);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
                setShowTablePicker(false);
              }}
              className="px-2 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-100 border-l border-gray-200 cursor-pointer flex items-center gap-1"
              title="Line Color"
            >
              <span
                className="w-3 h-3 rounded-full border border-gray-400 inline-block"
                style={{ backgroundColor: selectedHrColor }}
              />
              <span>Color ▾</span>
            </button>

            {showHrColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 flex gap-1.5 w-max">
                {TEJOVA_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setSelectedHrColor(c.value);
                      handleInsertHr(c.value);
                    }}
                    className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: c.value }}
                    title={`Apply ${c.name} (${c.value})`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* GROUP 8: INSERT (LINK, IMAGE, TABLE) */}
        <div className="flex items-center gap-1">
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

          {/* Inline Image */}
          <label className="p-1.5 rounded-lg hover:bg-gray-200 text-[#0A2342] flex items-center gap-1 cursor-pointer">
            {uploadingImage ? (
              <CircularProgress size={16} style={{ color: "#B87333" }} />
            ) : (
              <ImageIcon fontSize="small" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleInlineImageSelect}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>

          {/* Insert Table Grid Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTablePicker(!showTablePicker);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
                setShowHrColorPicker(false);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                editor.isActive("table") ? "bg-[#0A2342] text-white" : "hover:bg-gray-200 text-[#0A2342]"
              }`}
              title="Insert Table"
            >
              <TableChartIcon fontSize="small" />
              <span className="text-[11px] font-bold">Table</span>
            </button>

            {showTablePicker && (
              <div className="absolute top-full right-0 mt-1 p-3 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-48 space-y-2">
                <div className="text-[11px] font-bold text-[#0A2342] uppercase tracking-wider">
                  Select Table Grid
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {[
                    { label: "2 × 2", cols: 2, rows: 2 },
                    { label: "2 × 3", cols: 2, rows: 3 },
                    { label: "3 × 3", cols: 3, rows: 3 },
                    { label: "3 × 4", cols: 3, rows: 4 },
                    { label: "4 × 4", cols: 4, rows: 4 },
                    { label: "4 × 5", cols: 4, rows: 5 },
                    { label: "5 × 5", cols: 5, rows: 5 },
                  ].map((grid) => (
                    <button
                      key={grid.label}
                      type="button"
                      onClick={() => handleInsertTable(grid.cols, grid.rows)}
                      className="px-2 py-1 bg-[#FAF9F6] hover:bg-[#B87333] hover:text-white border border-gray-200 rounded-lg text-gray-700 font-semibold transition-colors text-center cursor-pointer"
                    >
                      {grid.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contextual Table Action Toolbar (Shown when cursor is inside a table) */}
      {editor.isActive("table") && (
        <div className="px-3 py-1.5 bg-[#0A2342] text-white text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider mr-1">
              Table Tools:
            </span>

            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium transition-colors"
            >
              + Row Before
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium transition-colors"
            >
              + Row After
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-0.5 bg-red-500/30 hover:bg-red-500/50 text-red-200 rounded text-[11px] font-medium transition-colors"
            >
              Delete Row
            </button>

            <span className="text-white/30">|</span>

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium transition-colors"
            >
              + Col Before
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium transition-colors"
            >
              + Col After
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-0.5 bg-red-500/30 hover:bg-red-500/50 text-red-200 rounded text-[11px] font-medium transition-colors"
            >
              Delete Col
            </button>

            <span className="text-white/30">|</span>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className="px-2 py-0.5 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50 text-[#D4AF37] rounded text-[11px] font-bold transition-colors"
            >
              Toggle Header
            </button>
          </div>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition-colors"
          >
            <DeleteSweepIcon fontSize="inherit" /> Delete Table
          </button>
        </div>
      )}

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
