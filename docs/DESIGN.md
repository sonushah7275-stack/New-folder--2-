# TEJOVA — Design System

---

## 1. Brand Identity & Vision
The TEJOVA design language is crafted to evoke luxury botanical sophistication, calm editorial serenity, and timeless scientific longevity. Inspired by luxury apothecaries and high-end wellness journals, the visual experience uses high-contrast typography, warm cream canvas backgrounds, deep midnight blue, copper accents, and botanical greens.

---

## 2. Logo & Brand Assets
- **Primary Logo:** `logo.jpeg` located in `TEJOVA/src/assets/logo.jpeg`.
- **Botanical Mark:** `brand-botanical.svg`.
- **Usage:**
  - Standard Header: Left-aligned or centered brand mark with clean letter-spacing.
  - Mobile Menu Header: Compact logo emblem.
  - Footer: Integrated with brand tagline and copyright notice.

---

## 3. Tagline
> *"Holistic Wellness, Longevity & Pure Botanical Nourishment"*

---

## 4. Color System (Active Palette)

### Brand Palette (Defined in `TEJOVA/src/index.css`)

| Color Token | Hex Code | Purpose |
|---|---|---|
| `--color-tejova-midnight` | `#0A2342` | Primary text, dark buttons, luxury midnight background |
| `--color-tejova-midnight-dark` | `#071930` | Deep midnight dark sections, footers, hover overlays |
| `--color-tejova-copper` | `#B87333` | Primary copper accents, borders, section dividers, hover highlights |
| `--color-tejova-copper-light` | `#D48C48` | Secondary copper highlights, badge outlines |
| `--color-tejova-gold` | `#D4AF37` | Primary action buttons (`.tejova-btn-primary`), gold accents |
| `--color-tejova-cream` | `#F5F3EF` | Main application background (Ivory/Cream canvas) |
| `--color-tejova-offwhite` | `#FAF9F6` | Card backgrounds, input field backgrounds |
| `--color-tejova-green` | `#3B6347` | Botanical green accents, natural pillar highlights |
| `--color-tejova-gray` | `#5C6B73` | Muted body copy, timestamps, caption metadata |

---

## 5. Typography

### Primary Font Families
- **Serif (Headings):** `'DM Serif Display', 'Cormorant Garamond', Georgia, serif` (`.font-serif-heading`)
- **Sans-Serif (Body & UI):** `'Inter', system-ui, -apple-system, sans-serif` (`.font-sans-body`)

---

## 6. Heading Scale
- **H1 (Display / Hero):** `font-serif`, `text-4xl` to `text-6xl`, `font-normal`, `leading-tight`, `color: #0A2342`
- **H2 (Section Titles):** `font-serif`, `text-3xl` to `text-4xl`, `tracking-tight`, `color: #0A2342`
- **H3 (Card Headings):** `font-serif`, `text-xl` to `text-2xl`, `font-normal`
- **H4 (Subheadings):** `font-sans`, `text-lg`, `font-semibold`, `uppercase`, `tracking-wider`

---

## 7. Body Text
- **Body Standard:** `font-sans`, `text-base` (16px), `line-height: 1.6`, `color: #0A2342` or `#5C6B73`
- **Body Small:** `font-sans`, `text-sm` (14px), `color: #5C6B73`
- **Caption / Meta:** `font-sans`, `text-xs` (12px), `uppercase`, `tracking-widest`, `color: #B87333`

---

## 8. Buttons & Actions

### Primary Button (`.tejova-btn-primary`)
- **Background:** `#D4AF37` (Gold)
- **Text Color:** `#0A2342` (Midnight Blue)
- **Hover State:** Background shifts to `#B87333` (Copper), `transform: translateY(-1px)`
- **Border Radius:** Minimal (rounded-none or `rounded-sm`) for luxury editorial look.

### Secondary Button (`.tejova-btn-secondary`)
- **Border:** `1px solid #0A2342`
- **Text Color:** `#0A2342`
- **Background:** Transparent
- **Hover State:** Background shifts to `#0A2342`, text shifts to `#F5F3EF`

### Light Button (`.tejova-btn-light`)
- **Background:** `#FAF9F6`
- **Border:** `1px solid #B87333`
- **Text Color:** `#0A2342`

---

## 9. Forms & Inputs
- **Input Background:** `#FAF9F6` (Off-white)
- **Input Border:** `1px solid rgba(184, 115, 51, 0.3)` (Copper tint)
- **Focus Ring:** `outline-none`, border transitions to `#B87333` (Copper)
- **Padding:** `px-4 py-3`
- **Error State:** Border shifts to `#D32F2F` (Soft Red) with text error caption below.

---

## 10. Cards & Glassmorphism
- **Standard Card:** Background `#FAF9F6`, `border: 1px solid rgba(184, 115, 51, 0.2)`
- **Glassmorphism Overlay (`.tejova-glass`):**
  - `background: rgba(245, 243, 239, 0.90)`
  - `backdrop-filter: blur(12px)`
  - `border: 1px solid rgba(184, 115, 51, 0.2)`
- **Image Zoom Effect Container (`.img-zoom-container`):**
  - Smooth image zoom on hover: `transform: scale(1.04)` over `0.7s cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 11. Navigation & Header
- **Background:** Off-white canvas with subtle bottom border (`.tejova-divider`).
- **Links:** Upper-case/capitalized sans-serif text, copper hover transition underline.
- **Account Icon / Status:** Dynamic user greeting (`Hi, {name}`) linking to `/account`.

---

## 12. Footer
- **Background:** `#071930` (Dark Midnight) or `#F5F3EF` with copper top border.
- **Typography:** Contrast ivory copy, copper social icon hover states.

---

## 13–18. Component Design Patterns
- **Product UI:** 3 or 4 column grid on desktop, single column on mobile. Minimal product cards with category pill badge, title, subtitle, price, and view detail CTA.
- **Journal UI:** Editorial 2-column or 3-column layout. Large feature cover images, publication date, author credit, and category tags.
- **Pillar UI:** Full-width sections featuring high-resolution botanical imagery alongside pillar descriptions (*Vitality*, *Longevity*, *Nourishment*, *Lifestyle*).
- **Account Page (`/account`):** Clean, spacious card layout detailing user name, email, and security role.

---

## 19. Admin Dashboard Design System
- **Framework:** Material UI v9 (`@mui/material`).
- **Color Theme:** Dark sidebar (`#071930`), light workspace area (`#F8FAFC`).
- **Navigation:** Persistent left sidebar drawer with icon navigation for *Dashboard*, *Products*, *Categories*, *Orders*, *Customers*, *Journals*, *Pillars*, *Media*, *Content*, *Newsletter*, *Contact*, and *Settings*.
- **Data Tables:** Custom MUI `TableContainer` with striped rows, sorting, pagination, and action icons.

---

## 20. Status Badges (Admin)
- **Active / Published / Delivered:** Soft green pill background (`#E8F5E9`), dark green text (`#2E7D32`).
- **Pending / Processing:** Soft amber pill background (`#FFF8E1`), dark amber text (`#F57F17`).
- **Draft / Inactive / Cancelled:** Soft red/gray pill background (`#FFEBEE`), dark red text (`#C62828`).

---

## 21–26. States & Notifications
- **Loading State:** Minimal gold/copper circular spinner or pulse skeleton.
- **Empty State:** Centered botanical illustration/icon, clear explanation text, and reset action button.
- **Error State:** Subtle red alert box with friendly error explanation and retry action.

---

## 27–30. Responsive Breakpoints
- **Mobile (`< 640px`):** Single column layouts, collapsible burger drawer header, full-width inputs and buttons.
- **Tablet (`640px – 1024px`):** 2-column product/journal grids, fluid padding.
- **Desktop (`> 1024px`):** Full 3 or 4-column grids, fixed top navigation bar, max-width content wrapper (`max-w-7xl mx-auto`).

---

## 31. Animation & Motion
- Page entrance transitions powered by `framer-motion`.
- Micro-interactions: `0.3s cubic-bezier(0.16, 1, 0.3, 1)` transition timing.

---

## 32. Accessibility
- High contrast text ratios adhering to WCAG AA guidelines.
- Alt text attribute enforced across product, journal, and media image elements.
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).

---

## 33. Design Do & Don't Rules
- **DO** use the warm cream `#F5F3EF` as the base canvas for the public site.
- **DO** use DM Serif Display / Cormorant Garamond for main editorial headers.
- **DON'T** introduce harsh pure black (`#000000`) or saturated neon colors.
- **DON'T** use rounded pill buttons on luxury editorial components.
