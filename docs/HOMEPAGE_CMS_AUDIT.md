# TEJOVA — Complete Homepage CMS Audit Report

**Date**: 2026-11-20  
**Status**: Comprehensive Baseline Audit Completed  
**Scope**: Public Frontend (`TEJOVA`), Admin Dashboard (`TEJOVA-Admin-Dashboard`), Backend API (`Backend`)

---

## 1. Executive Summary

This audit assesses the entire public homepage of the TEJOVA wellness platform to identify every hardcoded element, partially integrated CMS section, missing admin controls, and database schema gaps.

The objective is to achieve **100% CMS manageability** for every homepage section through the Admin Dashboard, enabling non-technical administrators to edit text, headings, descriptions, buttons, links, media assets (via Cloudinary), toggle section visibility, add/remove/reorder cards, and manage published states without code deployments.

---

## 2. Homepage Component Hierarchy & Section Inventory

On the public website (`TEJOVA`), the homepage is rendered by `src/pages/HomePage.jsx` wrapped inside `src/App.jsx` with global `Header` and `Footer`.

The complete inventory of sections encountered on or directly connected to the Homepage is:

| Section # | Component / Region | Component File | Current Status Classification |
|---|---|---|---|
| 1 | Announcement Bar | `src/components/layout/Header.jsx` | **Missing CMS Functionality** (defined in legacy admin content, never rendered in public Header) |
| 2 | Header / Navigation | `src/components/layout/Header.jsx` | **Partially CMS Managed** (site settings partially wired; nav links hardcoded) |
| 3 | Entry Experience (Intro) | `src/components/home/EntryExperience.jsx` | **Fully CMS Managed** (`pagesMap.home.sections.entry_sequence`) |
| 4 | Hero Banner | `src/components/home/Hero.jsx` | **Partially CMS Managed** (main title/desc bound, secondary CTA & feature bullets hardcoded) |
| 5 | Brand Introduction | `src/components/home/BrandIntro.jsx` | **Partially CMS Managed** (body & media bound, floating quote badge hardcoded) |
| 6 | Brand Story | `src/components/home/BrandStory.jsx` | **Partially CMS Managed** (aliases `BrandIntro`) |
| 7 | Wellness Pillars | `src/components/home/PillarSection.jsx` | **Partially CMS Managed** (items bound, but visibility toggle disabled fallback causes forced rendering) |
| 8 | Vitality Section | `src/components/home/VitalitySection.jsx` | **Completely Hardcoded** (kicker, title, subtitle, paragraph, CTA, corner badge hardcoded; only mediaUrl read from section) |
| 9 | Nourishment Section | `src/components/home/NourishmentSection.jsx` | **Completely Hardcoded** (kicker, title, subtitle, paragraph, CTA, badge hardcoded; only mediaUrl read from section) |
| 10 | Lifestyle Section | `src/components/home/LifestyleSection.jsx` | **Completely Hardcoded** (kicker, title, subtitle, paragraph, CTA hardcoded; only mediaUrl read from section) |
| 11 | Longevity Section | `src/components/home/LongevitySection.jsx` | **Completely Hardcoded** (no CMS slice connected, no image, 100% static JSX) |
| 12 | Featured Products Showcase | `src/components/home/ProductSection.jsx` | **Partially CMS Managed** (products fetched via product API; headings, copy, CTA, limits hardcoded; no section visibility) |
| 13 | Journal / Blog Showcase | `src/components/home/JournalSection.jsx` | **Partially CMS Managed** (articles fetched via journal API; headings, copy, CTA, limits hardcoded; no section visibility) |
| 14 | Call to Action (CTA) Banner | `src/components/home/CTASection.jsx` | **Completely Hardcoded** (background, headline, description, button text & link 100% static) |
| 15 | Newsletter Subscription | `src/components/layout/Footer.jsx` | **Partially CMS Managed** (API connected to `/newsletter/subscribe`; description hardcoded) |
| 16 | Footer | `src/components/layout/Footer.jsx` | **Partially CMS Managed** (settings slice connected for brand/social; descriptions & columns hardcoded) |

---

## 3. Section-by-Section Detailed Audit

### 3.1 Announcement Bar
- **Classification**: Missing CMS Functionality
- **Current State**: The legacy `Content.jsx` admin page contained an "Announcement Bar" tab writing to `/api/content` with key `ANNOUNCEMENT`. However, `Header.jsx` and `HomePage.jsx` never read or render this announcement bar.
- **Required Remediation**: Add dynamic Announcement Bar support at the top of the public `Header.jsx` with toggle visibility, text, highlight color, and optional link.

### 3.2 Header / Navigation
- **Classification**: Partially CMS Managed
- **Current State**: Brand logo text "Tejova" and tagline "Expand Your Light" are static strings in `Header.jsx`. Navigation links are loaded from static `src/data/navigation.js`.
- **Required Remediation**: Bind brand name and tagline to `publicSettings` from `settingsSlice`. Allow admin to control optional header announcement.

### 3.3 Entry Experience (Intro)
- **Classification**: Fully CMS Managed
- **Current State**: Reads `pagesMap.home.sections` for `type === 'entry_sequence'`. Admin can edit title, kicker, image, order, and toggle visibility. Has sensible default fallbacks.
- **Required Remediation**: Maintain existing architecture and preserve smooth transitions.

### 3.4 Hero Banner
- **Classification**: Partially CMS Managed
- **Current State**: Reads `pagesMap.home.hero` for title, subtitle kicker, description, primary CTA text/link, and media URL. However:
  - Secondary CTA ("Discover TEJOVA", `/about`) is hardcoded.
  - 3 feature badges ("100% Pure Ingredients", "Ancient Wisdom", "Conscious Living") are hardcoded in JSX.
  - Floating badge ("Holistic Wellness", "Pure Vitality & Longevity") is hardcoded.
  - There is no direct image upload button inside the admin editor for the Hero banner.
- **Required Remediation**: Expand Hero CMS schema to support secondary CTA text/link, dynamic feature bullets, floating badge text, and direct Cloudinary image upload.

### 3.5 Brand Introduction & Brand Story
- **Classification**: Partially CMS Managed
- **Current State**: `BrandIntro.jsx` reads `sec_brand_story` or `sec_brand_philosophy`. Title, subtitle, content HTML, CTA text/url, and botanical image are CMS-driven. However:
  - Floating accent box quote: `"Definitive performance built into your daily operations."` is hardcoded.
  - Corner badge text is hardcoded to "PEAK VITALITY" fallback.
- **Required Remediation**: Connect floating quote and accent badge to section `badge` and `items[0].description` / settings.

### 3.6 Wellness Pillars (`four_pillars`)
- **Classification**: Partially CMS Managed
- **Current State**: Reads `sec_four_pillars` and renders 4 cards. However:
  - If `isVisible === false`, the section still renders because the component falls back to static pillars instead of respecting the visibility toggle.
  - Card fields (title, tagline, description, image, link) are editable, but admin lacks a direct image upload button in the card list editor.
- **Required Remediation**: Fix `isVisible === false` handling so the section unpublishes cleanly. Add direct Cloudinary image upload for pillar cards.

### 3.7 Vitality Section
- **Classification**: Completely Hardcoded
- **Current State**:
  - Kicker: "Pillar 01" (hardcoded).
  - Heading: "Vitality" (hardcoded).
  - Subtitle: "Natural Energy. True Wellbeing." (hardcoded).
  - Paragraph description: (hardcoded).
  - CTA Button: "Explore Vitality", `/vitality` (hardcoded).
  - Corner badge: "Biological Architecture", "Indoor Yoga & Mindful Movement" (hardcoded).
  - Only `mediaUrl` reads from `sec?.media?.url`.
  - Does not disappear if `isVisible === false`.
- **Required Remediation**: Fully bind all text, badges, buttons, URLs, and media to CMS section `sec_vitality`.

### 3.8 Nourishment Section
- **Classification**: Completely Hardcoded
- **Current State**:
  - Kicker: "Pillar 02" (hardcoded).
  - Heading: "Nourishment" (hardcoded).
  - Subtitle: "Real Food. Lasting Health." (hardcoded).
  - Paragraph description: (hardcoded).
  - CTA Button: "Explore Nourishment", `/nourishment` (hardcoded).
  - Accent badge: "Conscious Food", "Microbiome & metabolic balance" (hardcoded).
  - Only `mediaUrl` reads from `sec?.media?.url`.
  - Does not disappear if `isVisible === false`.
- **Required Remediation**: Fully bind all text, badges, buttons, URLs, and media to CMS section `sec_nourishment`.

### 3.9 Lifestyle Section
- **Classification**: Completely Hardcoded
- **Current State**:
  - Kicker: "Pillar 03" (hardcoded).
  - Heading: "Lifestyle" (hardcoded).
  - Subtitle: "Awareness. Growth. Potential." (hardcoded).
  - Paragraph description: (hardcoded).
  - CTA Button: "Explore Lifestyle", `/lifestyle` (hardcoded).
  - Only `mediaUrl` reads from `sec?.media?.url`.
  - Does not disappear if `isVisible === false`.
- **Required Remediation**: Fully bind all text, buttons, URLs, and media to CMS section `sec_lifestyle`.

### 3.10 Longevity Section
- **Classification**: Completely Hardcoded
- **Current State**:
  - Zero Redux connection.
  - Kicker: "Pillar 04" (hardcoded).
  - Heading: "Longevity" (hardcoded).
  - Subtitle: "Longer Life. Deeper Wellbeing." (hardcoded).
  - Paragraph description: (hardcoded).
  - CTA Button: "Explore Longevity", `/longevity` (hardcoded).
  - Missing right-side imagery that exists in the other 3 pillar sections.
- **Required Remediation**: Connect to `pagesMap.home` section `sec_longevity`. Render kicker, title, subtitle, description, CTA text/link, and add responsive media imagery with Framer Motion animations.

### 3.11 Featured Products Showcase
- **Classification**: Partially CMS Managed
- **Current State**:
  - Fetches products from database (`/api/products?limit=4`).
  - Subtitle: "Featured Formulations" (hardcoded).
  - Heading: "Our Products" (hardcoded).
  - Description: (hardcoded).
  - Button: "Explore All Formulations", `/products` (hardcoded).
  - No visibility toggle; cannot be reordered or disabled from CMS.
- **Required Remediation**: Connect section metadata to `sec_products` in `pagesMap.home`. Admin can edit heading, subtitle, description, CTA text/URL, product limit, or hide section.

### 3.12 Journal / Blog Showcase
- **Classification**: Partially CMS Managed
- **Current State**:
  - Fetches articles from database (`/api/journal?limit=3`).
  - Subtitle: "Editorial & Philosophy" (hardcoded).
  - Heading: "From Our Journal" (hardcoded).
  - Description: (hardcoded).
  - Button: "View All Articles", `/journal` (hardcoded).
  - No visibility toggle; cannot be reordered or disabled from CMS.
- **Required Remediation**: Connect section metadata to `sec_journal` in `pagesMap.home`. Admin can edit heading, subtitle, description, CTA text/URL, article limit, or hide section.

### 3.13 Call to Action (CTA) Banner
- **Classification**: Completely Hardcoded
- **Current State**:
  - Background image: `sunriseMountains` SVG (hardcoded).
  - Kicker: "Embrace Your Potential" (hardcoded).
  - Headline: "Your best years are ahead of you." (hardcoded).
  - Description: (hardcoded).
  - Button: "Begin Your Journey", `/products` (hardcoded).
  - Zero CMS connection; cannot be edited or disabled.
- **Required Remediation**: Connect to `sec_cta` in `pagesMap.home`. Allow admin to edit headline, subtitle kicker, body copy, CTA text/link, upload background media, or disable the banner.

### 3.14 Newsletter Subscription
- **Classification**: Partially CMS Managed
- **Current State**: Submits to `/api/newsletter/subscribe`. Heading uses tagline from Settings, but description paragraph is hardcoded in `Footer.jsx`.
- **Required Remediation**: Allow admin to customize newsletter heading, subtitle, and disclaimer text via CMS/Settings.

### 3.15 Footer
- **Classification**: Partially CMS Managed
- **Current State**: Reads brand name, tagline, official emails, address, and social links from Settings. Brand description paragraph is hardcoded in `Footer.jsx`.
- **Required Remediation**: Allow editing of brand description paragraph and copyright statement via CMS.

---

## 4. Admin Dashboard Audit

### 4.1 Existing Modules
1. `PageCmsEditor.jsx` (`/admin/pages`):
   - Supports selecting from a dropdown of 13 pages.
   - For `home`, it allows editing the Hero and arbitrary dynamic sections.
   - **Gaps**:
     - Image inputs are plain text URL fields. Admin cannot click "Upload Image" to upload to Cloudinary.
     - Does not provide dedicated sections for Vitality, Nourishment, Lifestyle, Longevity, Featured Products, Journal Showcase, CTA Banner, or Announcement Bar.
     - No Live Preview mechanism.
     - No Draft vs Publish workflow.
2. `Content.jsx` (`/admin/content`):
   - Legacy key-value editor reading and writing to `/api/content`.
   - Disconnected from the `Page` model used by `HomePage.jsx`.
3. `Media.jsx` (`/admin/media`):
   - Cloudinary media library works for uploading and viewing assets, but is not embedded into page/section editors.

### 4.2 Navigation Architecture
- Sidebar currently lists "Pages (CMS)" and "Content".
- To streamline the admin experience, we will provide a dedicated **Homepage CMS** module in the sidebar (`/admin/homepage-cms` or integrated tab) featuring an intuitive **Section Overview**, quick access to each homepage section, direct image uploads, draft saving, live preview, and instant publishing.

---

## 5. Backend & Database Audit

### 5.1 MongoDB Models
- `Backend/models/Page.js`:
  - Contains `slug`, `title`, `subtitle`, `hero`, `sections`, `seo`, `isPublished`.
  - `pageSectionSchema` includes `sectionId`, `type`, `title`, `subtitle`, `kicker`, `content`, `badge`, `media`, `cta`, `items`, `settings`, `order`, `isVisible`.
  - Extensible and capable of handling all homepage sections without destructive changes.
- `Backend/services/CmsMigrationService.js`:
  - Currently seeds only 5 sections for `home` (`entry_sequence`, `brand_philosophy`, `brand_story`, `philosophy`, `four_pillars`).
  - Must be updated to seed and migrate all 12+ homepage sections with verified production defaults.

### 5.2 API Routes & Security
- `GET /api/pages/:slug`: Currently returns all sections regardless of `isVisible`.
  - **Security / Data Rule**: When requested publicly (non-admin), `getPageBySlug` must filter out sections where `isVisible === false`.
- `PUT /api/pages/:slug`: Protected by `protect` and `adminOnly`. Updates and persists changes.
- `POST /api/media/upload`: Protected by `protect` and `adminOnly`. Uploads files to Cloudinary and returns secure URL.

---

## 6. Implementation Action Plan

1. **Backend Extension**:
   - Update `CmsMigrationService.js` to seed full default data for all homepage sections (`sec_announcement`, `hero`, `sec_entry_sequence`, `sec_brand_story`, `sec_four_pillars`, `sec_vitality`, `sec_nourishment`, `sec_lifestyle`, `sec_longevity`, `sec_products`, `sec_journal`, `sec_cta`).
   - Enhance `pageController.js` to filter unpublished/hidden sections for public callers while allowing preview for admins.
2. **Admin Dashboard Implementation**:
   - Create a dedicated **Homepage CMS** management experience with section-by-section editing, reordering, direct Cloudinary image upload, toggle visibility, draft saving, and live preview.
   - Update Admin Sidebar navigation with a prominent "Homepage CMS" link.
3. **Public Homepage Integration**:
   - Update `HomePage.jsx` to dynamically render active sections according to their configured `order`.
   - Wire dynamic CMS data, images, buttons, and badges into:
     - `Hero.jsx`
     - `BrandIntro.jsx`
     - `PillarSection.jsx`
     - `VitalitySection.jsx`
     - `NourishmentSection.jsx`
     - `LifestyleSection.jsx`
     - `LongevitySection.jsx`
     - `ProductSection.jsx`
     - `JournalSection.jsx`
     - `CTASection.jsx`
     - `Header.jsx` (Announcement Bar)
   - Preserve all Framer Motion animations, responsive layouts, and fallback states.
4. **Testing, Verification & Documentation**:
   - Run complete end-to-end automated tests verifying data flow from Admin -> API -> MongoDB -> Public Frontend.
   - Write `docs/HOMEPAGE_CMS_IMPLEMENTATION.md`.
