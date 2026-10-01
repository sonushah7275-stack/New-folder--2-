# TEJOVA — Public Frontend Setup Guide

## 1. Overview

The **TEJOVA Public Frontend** (`TEJOVA/`) is a high-performance, responsive React application built with Vite. It serves the brand's e-commerce catalog, wellness pillars, and editorial journal stories.

---

## 2. Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 8.3
- **Language**: JavaScript (JSX) — strictly no TypeScript
- **Styling**: Tailwind CSS v4 with brand theme variable tokens
- **Icons**: Lucide React
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **Routing**: React Router v6
- **HTTP Client**: Axios with centralized API configuration
- **Sanitization**: DOMPurify for secure HTML article rendering

---

## 3. Brand Styling & Theme Tokens

Tailwind CSS custom tokens are declared in `TEJOVA/src/index.css`:

```css
@theme {
  --font-serif: "DM Serif Display", "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;

  --color-tejova-midnight: #0A2342;
  --color-tejova-copper: #B87333;
  --color-tejova-gold: #D4AF37;
  --color-tejova-cream: #F5F3EF;
  --color-tejova-offwhite: #FAF9F6;
  --color-tejova-green: #3B6347;
}
```

Google Fonts imported in `TEJOVA/index.html`:
- `Cormorant Garamond` (Weights 400, 500, 600, 700, Italic)
- `DM Serif Display` (Regular & Italic)
- `DM Sans` (Weights 400, 500, 700)
- `Inter` (Weights 300, 400, 500, 600, 700)
- `Share Tech Mono` (Regular)
- `Rokkitt` (Weights 400, 600, 700)

---

## 4. Redux Store Slices

The store is defined in `TEJOVA/src/Redux/store.js` and manages:
- `authSlice.js`: User registration, login, session (`/api/auth/me`), and logout.
- `productSlice.js`: E-commerce catalog fetching, filtering, and single product view.
- `journalSlice.js`: Public journal articles listing and slug-based article detail lookup.

---

## 5. Local Development Setup

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Environment Configuration
Create a `.env` file in the `TEJOVA/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation & Launch Commands

```bash
# Navigate to public frontend folder
cd TEJOVA

# Install dependencies
npm install

# Start local development server (Vite)
npm run dev
```

The application will launch locally at `http://localhost:5173`.

---

## 6. Production Build

To build the static production assets:

```bash
npm run build
```

This compiles optimized bundles to `TEJOVA/dist/` ready for hosting on Render or static CDNs.
