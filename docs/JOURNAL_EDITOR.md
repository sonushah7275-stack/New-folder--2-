# TEJOVA — Journal Rich Text Editor Specification

## 1. Overview

The TEJOVA Admin Journal Editor (`TEJOVA-Admin-Dashboard/src/admin/components/RichTextEditor.jsx`) is built on top of Tiptap (`@tiptap/react`) to provide Microsoft Word-like rich text content editing for editorial articles.

---

## 2. Supported Article Font Styles & Public Replacements

The author can apply font styles to **any selected text range** in the editor toolbar.

| Font Style Label | Tiptap `FontFamily` Mark Specification | Public Font Source / Replacement Note |
| :--- | :--- | :--- |
| **Serif Old Style** | `'DM Serif Display', 'Cormorant Garamond', Georgia, serif` | Google Fonts (`DM Serif Display` / `Cormorant Garamond`) |
| **Technology Variable** | `'Share Tech Mono', monospace` | **Public Replacement**: Uses Google Font `Share Tech Mono` (Original client asset was unavailable) |
| **Feeling Vintage** | `'Cormorant Garamond', Georgia, serif` (Italic) | Google Fonts (`Cormorant Garamond` Italic) |
| **Feeling Sincere** | `'Inter', system-ui, sans-serif` | Google Fonts (`Inter`) |
| **Feeling Rugged** | `'Rokkitt', serif` (Weight 600) | **Public Replacement**: Uses Google Font `Rokkitt` (Original client asset was unavailable) |
| **DM Sans Regular 400**| `'DM Sans', sans-serif` (Weight 400) | Google Fonts (`DM Sans`, weight 400) |

> **Note**: As documented during Phase 3L, `Share Tech Mono` and `Rokkitt` are official public Google Font replacements for *Technology Variable* and *Feeling Rugged* respectively, as original font binary files were not supplied by the client.

---

## 3. Formatting Features & Toolbar Controls

### 3.1 Selection-Based Formatting
- **Font Style Selector**: Applies inline `font-family`, `font-weight`, and `font-style` styles to selected text (`<span style="font-family: 'Share Tech Mono', monospace">`).
- **Font Size**: Selectable range (`10px`, `11px`, `12px`, `14px`, `16px`, `18px`, `20px`, `24px`, `28px`, `32px`, `36px`, `48px`).
- **Text Formatting**: Bold (`Ctrl+B`), Italic (`Ctrl+I`), Underline (`Ctrl+U`), Strikethrough.
- **Text Color**: Palette picker (Midnight Blue `#0A2342`, Copper `#B87333`, Gold `#D4AF37`, Cream `#FAF9F6`, Deep Green `#1F4D3B`, Sage `#668F6B`, Earth Brown `#886F4F`, Dark Text `#1A1A1A`).
- **Text Highlight**: Background color picker across TEJOVA palette.
- **Alignment**: Left, Center, Right, Justify.

### 3.2 Block & Structure Formatting
- **Highlight Box (`HighlightBox`)**:
  - Custom Tiptap block node rendering `<aside class="tejova-highlight-box" data-type="highlight-box">`.
  - Visible **Box Color ▾** popover allows selecting background & border color presets:
    - Cream (`#FAF9F6` bg, `#B87333` border)
    - Gold (`#FFFBEB` bg, `#D4AF37` border)
    - Copper (`#FDF8F3` bg, `#B87333` border)
    - Sage (`#F4F7F4` bg, `#668F6B` border)
    - Deep Green (`#1F4D3B` bg, `#D4AF37` border, white text)
    - Midnight Blue (`#0A2342` bg, `#D4AF37` border, white text)
- **Horizontal Line (`CustomHorizontalRule`)**:
  - Inserts `<hr style="border: none; border-top: 2px solid ${color}; margin: 2rem 0; opacity: 1;" data-color="${color}">`.
  - Visible **Line Color ▾** popover permits changing divider line color.
- **Line Height (`LineHeight`)**: Selectable line spacing (`1.0`, `1.15`, `1.25`, `1.5`, `1.75`, `2.0`).
- **Headings**: Paragraph (`<p>`), Heading 1 (`<h1>`), Heading 2 (`<h2>`), Heading 3 (`<h3>`), Heading 4 (`<h4>`).
- **Lists**: Bullet List (`<ul>`), Numbered List (`<ol>`).
- **Blockquote**: Quote container (`<blockquote>`).
- **Links**: Insert/Edit Hyperlink (`<a>`) and Remove Link.
- **Inline Image Upload**: Cloudinary direct upload into `journal/content` folder with optional figure caption modal.

---

## 4. Public Rendering & DOMPurify Security Whitelist

On the public Article Detail page (`TEJOVA/src/pages/ArticleDetailPage.jsx`), article HTML content is sanitized using DOMPurify with the following explicit whitelist configuration:

```javascript
DOMPurify.sanitize(article.content || "", {
  ADD_TAGS: ["span", "aside", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "hr"],
  ADD_ATTR: ["target", "rel", "style", "colspan", "rowspan", "src", "alt", "title", "class", "data-color", "data-bg-color", "data-border-color", "data-type"],
  ALLOWED_STYLE_PROPERTIES: [
    "color",
    "background-color",
    "font-family",
    "font-weight",
    "font-style",
    "font-size",
    "line-height",
    "text-align",
    "border",
    "border-top",
    "border-left",
    "border-color",
    "border-top-color",
    "border-left-color",
    "margin",
    "opacity",
  ],
});
```

This guarantees that all custom font families, highlight box background colors, and horizontal divider line colors render faithfully without compromising site security.
