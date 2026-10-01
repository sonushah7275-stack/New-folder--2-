# TEJOVA CMS COMPREHENSIVE AUDIT REPORT
**Document Version**: 1.0  
**Status**: Completed  
**Target Systems**: Backend API, Public Frontend (`TEJOVA`), Admin Dashboard (`TEJOVA-Admin-Dashboard`)

---

## 1. Executive Summary

This audit evaluates the current TEJOVA codebase across all public pages, backend models, API routes, media handling, and the Admin Dashboard. The objective is to convert all hardcoded content, headings, media assets, protocol cards, and layout blocks into a maintainable, schema-driven CMS architecture controlled directly via the Admin Panel without code edits.

---

## 2. Page-by-Page & Section-by-Section Audit

### 2.1 Homepage (`/`)
* **Hero Section**:
  * *Status*: PARTIALLY DYNAMIC / HARDCODED
  * *Hardcoded Elements*: Hero title, subtitle, CTA text ("Discover Protocol"), CTA URL, fallback image/video asset.
  * *Missing Admin Control*: Dynamic hero image/video background picker, headline text, subtitle text, primary/secondary CTA configuration.
* **Brand Philosophy Section**:
  * *Status*: HARDCODED
  * *Hardcoded Elements*: Heading ("Beyond Wellness. A Sovereign Lifestyle."), Body text, CTA text ("Discover Our Protocol →"), Floating accent box copy ("PEAK VITALITY — Definitive performance built into your daily operations."), side image.
  * *Missing Admin Control*: Full text editing, floating accent box toggle and text, image replacement.
* **Brand Story Section**:
  * *Status*: HARDCODED
  * *Hardcoded Elements*: Story title, multi-paragraph editorial copy, image gallery layout, section visibility.
  * *Missing Admin Control*: Section title, story rich text, gallery media picker, visibility toggle.
* **Philosophy Section**:
  * *Status*: HARDCODED
  * *Hardcoded Elements*: Main heading, core principles, bullet points, featured imagery, highlight box styling.
  * *Missing Admin Control*: Bullet list editing, imagery selector, highlight box styling controls.
* **Four Pillars Section**:
  * *Status*: PARTIALLY DYNAMIC
  * *Hardcoded Elements*: Hardcoded fallback text for Vitality, Nourishment, Lifestyle, Longevity; section kicker; subtitle. Products were previously mixed into pillars.
  * *Missing Admin Control*: Kicker, subtitle, per-pillar image/video, per-pillar CTA link, ordering, visibility. Products removed from pillar grid per PDF spec.

---

### 2.2 Pillar Pages

#### 1. Vitality (`/vitality`)
* **Hero & Philosophy**: Hardcoded kicker ("VITALITY"), heading, body, hero media.
* **Daily Protocols Section ("Sovereign Rituals")**:
  * *Status*: HARDCODED
  * *Required 4 Dynamic Cards (PDF Spec)*:
    1. **Yoga**: 20 MINS | *Sovereign Asana & Alignment* | Cultivate continuous physical growth and vital heat through 12 dynamic cycles of Surya Namaskar.
    2. **Breath**: 10 MINS | *Sovereign Box Breathing* | Command your nervous system using a precise 4-4-4-4 rhythm: inhale, hold, exhale, and hold for four seconds each.
    3. **Health**: DAILY | *Conscious Alignment & Recovery* | Honor your biology through mindful, awareness-based eating and daily grounding practices like earthing.
    4. **Fitness**: 30 MINS | *Functional Peak Resistance* | Engineer your physical endurance with 30 minutes of focused daily resistance training.
  * *Missing Admin Control*: Full CRUD for ritual cards, kicker, title, duration/frequency badge, description, image, optional video, ordering, visibility.

#### 2. Nourishment (`/nourishment`)
* **Status**: HARDCODED
* **Hardcoded Content**:
  * Kicker: `NOURISHMENT`
  * Heading: `Conscious Fuel. Cellular Command.`
  * Body: `Nourishment is the intentional mastery of your biological ecosystem. Through plant-aligned dietary protocols and mindful eating rhythms, we eliminate systemic inflammation, heal the gut, and fuel your body for peak-impact performance.`
  * CTA: `Explore Nourishment Protocol →`
* **Missing Admin Control**: Kicker, heading, rich body text, CTA text & link, background image/video, quotes, highlight boxes.

#### 3. Lifestyle (`/lifestyle`)
* **Status**: HARDCODED
* **Hardcoded Content**: Kicker, heading, editorial text, routine cards, imagery.
* **Missing Admin Control**: Hero section, lifestyle pillars/cards, rich text blocks, media media player support.

#### 4. Longevity (`/longevity`)
* **Status**: HARDCODED
* **Hardcoded Content**: Kicker, heading, longevity science copy, anti-aging protocol details, images.
* **Missing Admin Control**: Full dynamic section support via CMS Page schema.

---

### 2.3 Blog / Journal (`/blog` & `/journal`)
* **Status**: PARTIALLY DYNAMIC
* **Label Audit**: Public website displays "Journal" which must be renamed to "Blog" in navigation, headers, and UI while retaining backend `/api/journal` endpoint compatibility.
* **Media & Rich Text Audit**:
  * Tiptap editor lacks inline HTML5 video player integration (`<video>` tags).
  * Lacks customizable Highlight Box (background/border/text colors).
  * Lacks Table alignment controls and block movement (move up/down).
  * Related article images lack resolution optimization, object-fit handling, and proper fallbacks.
  * Four entry photos requirement (PDF) requires animated gallery section support.

---

### 2.4 About & Contact (`/about` & `/contact`)
* **Status**: HARDCODED / PARTIALLY DYNAMIC
* **Missing Admin Control**: Page hero, mission statement, contact details, social links, location copy.

---

## 3. Existing Models & API Audit

| Model | Current Schema / Capability | Audit Finding / Action Plan |
|---|---|---|
| `Content.js` | Key-value store (`key`, `title`, `content`, `image`, `section`) | Too limited for complex sectioned pages. Keep for global settings fallback, create `Page.js` for structured Page + Section CMS. |
| `Pillar.js` | Basic pillar schema (`name`, `slug`, `title`, `description`, `image`, `content`) | Retain for pillar metadata; align with Page CMS schema. |
| `Media.js` | `fileName`, `url`, `publicId`, `resourceType`, `mimeType`, `size`, `folder` | Only handling images in controller upload. Upgrade `uploadMedia` & `cloudinaryHelper` for `resource_type: 'auto'` (Video + Image). |
| `Journal.js` | `title`, `slug`, `content`, `excerpt`, `coverImage`, `category`, `tags`, `isPublished` | Retain schema; enhance rich content rendering and public route mapping (`/blog`). |
| `Product.js` | Ecommerce products | Retain existing model. |
| `Settings.js` | Global site settings | Retain existing model. |

---

## 4. Recommended CMS Architecture (`Page.js`)

```
Page (slug, title, hero, seo, isPublished)
 └── Sections [] (sectionId, type, title, subtitle, content, badge, media, items [], settings, order, isVisible)
      ├── Section Types: hero, brand_philosophy, brand_story, philosophy, four_pillars, protocol_cards, cta, highlight_box, gallery, video, rich_content, text_image
      └── Items [] (id, title, subtitle, description, kicker, icon, image, video, link, tag, order, isVisible)
```

---

## 5. Implementation Roadmap

1. **Phase 1: Backend Architecture & Seeder**:
   - Create `Backend/models/Page.js`.
   - Create `Backend/controllers/pageController.js` and `Backend/routes/pageRoutes.js`.
   - Update `Backend/controllers/mediaController.js` and `Backend/utils/cloudinaryHelper.js` for video support (`resource_type: 'auto'`).
   - Create `Backend/utils/seedCms.js` to seed default content including the 4 Vitality Daily Protocol cards.
   - Mount `/api/pages` in `Backend/server.js`.

2. **Phase 2: Admin Dashboard Enhancements**:
   - Update Tiptap RichTextEditor in `TEJOVA-Admin-Dashboard`:
     - Add `InlineVideo` extension for HTML5 video player.
     - Add Highlight Box block with customizable bg, border, text color, and alignment.
     - Add Block Reordering (Move Up / Move Down) and Table Alignment.
   - Update Admin Sidebar to rename "Journal" to "Blog".
   - Create `PageCmsEditor.jsx` for managing dynamic Page sections.
   - Update Media Library to support video filtering and uploads.

3. **Phase 3: Public Frontend Integration**:
   - Rename public navigation / routing from Journal to Blog (with backward compatibility).
   - Update `HomePage.jsx`, `VitalityPage.jsx`, `NourishmentPage.jsx`, `LifestylePage.jsx`, `LongevityPage.jsx`, `AboutPage.jsx`, `ContactPage.jsx` to fetch and render dynamic CMS sections.
   - Update DOMPurify whitelist to allow `<video>`, `<source>`, inline styles, and class names.
   - Fix Related Article image resolution, object-fit, and fallback rendering.

4. **Phase 4: Verification & Documentation**:
   - Verify complete data flow: Admin UI -> API -> MongoDB -> Public API -> Public Frontend.
   - Create `docs/TEJOVA_CMS_IMPLEMENTATION.md`.
