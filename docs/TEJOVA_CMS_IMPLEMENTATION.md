# TEJOVA FULL CMS IMPLEMENTATION GUIDE
**Document Version**: 2.0  
**Status**: 100% Complete & Verified  
**Author**: Advanced AI Pair Programmer

---

## 1. CMS Architecture & Database Design

The TEJOVA public website has been converted into a fully dynamic CMS-driven system controlled from the Admin Panel without code changes.

### Data Model Hierarchy
```
Page (slug, title, subtitle, hero, seo, isPublished)
 └── Sections [] (sectionId, type, title, subtitle, kicker, content, media, cta, items [], settings, order, isVisible)
      ├── Section Types: hero, entry_sequence, blog_entry_photos, brand_philosophy, brand_story, philosophy, four_pillars, protocol_cards, cta, highlight_box, gallery, video, rich_content, text_image
      └── Items [] (id, kicker, title, subtitle, description, image, video, link, tag, order, isVisible)
```

### Models & Schema Updates
1. **`Backend/models/Page.js`**: Created structured Page & Section schema supporting hero metadata, section reordering, rich text content, media assets, and sub-card arrays (e.g. Daily Protocols, Entry Sequence words, Blog 4 Entry Photos).
2. **`Backend/models/Media.js`**: Extended `resourceType` field (`'image' | 'video'`) and updated upload handling for Cloudinary `resource_type: "auto"`.

---

## 2. API Endpoints Reference

| Endpoint | Method | Protection | Description |
|---|---|---|---|
| `/api/pages` | GET | Public / Admin | List all registered CMS pages |
| `/api/pages/:slug` | GET | Public / Admin | Get page by slug (e.g. `home`, `vitality`, `nourishment`, `lifestyle`, `longevity`, `blog`, `about`, `contact`) |
| `/api/pages/:slug` | PUT | Admin Only | Create/Update complete page details & sections |
| `/api/pages/:slug/sections` | POST | Admin Only | Add a new section to page |
| `/api/pages/:slug/sections/reorder` | PUT | Admin Only | Reorder sections array |
| `/api/pages/:slug/sections/:sectionId` | PUT | Admin Only | Update specific section by sectionId |
| `/api/pages/:slug/sections/:sectionId` | DELETE | Admin Only | Delete section by sectionId |
| `/api/media/upload` | POST | Admin Only | Upload image or MP4/WEBM/MOV video to Cloudinary |

---

## 3. Admin Panel Capabilities & New Features

### 3.1 Public Website CMS Manager (`/admin/pages`)
* **Page Selector Tabs**: Home, Vitality, Nourishment, Lifestyle, Longevity, Blog, About Us, Contact Us.
* **Hero Editor**: Edit Title (H1), Subtitle kicker, Description, Hero Media URL, Resource Type (Image/Video), CTA Button Text & Link.
* **Entry Sequence Words Controls (`entry_sequence`)**:
  * Add, edit text, delete, reorder, and toggle visibility of words in the animated homepage entry intro (e.g., `TEJOVA`, `Vitality`, `Nourishment`, `Lifestyle`, `Longevity`, `Expand Your Light`).
* **Blog 4 Entry Photos Editor (`blog_entry_photos`)**:
  * Upload/select 4 entry photos, set titles/captions, replace, remove, and toggle visibility. Renders with slow, subtle framing animation on the public Blog index page (`/blog`).
* **Section Manager**:
  * Add, edit, delete, and reorder sections using Move Up / Move Down controls.
  * Toggle section visibility on/off.
  * Edit H2 title, subtitle/kicker, rich body content via Tiptap editor, media URL, and CTA link.
* **Sub-Card / Ritual Card Manager**:
  * Full editing for lists (e.g., Vitality Daily Protocols: *Sovereign Asana & Alignment*, *Sovereign Box Breathing*, *Conscious Alignment & Recovery*, *Functional Peak Resistance*).

---

## 4. Public Page CMS Binding & Dynamic Behavior

All public pages fetch and render live database content from Redux `state.content.pagesMap`:

1. **`HomePage.jsx` & Children**:
   - `Hero.jsx`: Reads `pagesMap.home.hero` (title, subtitle, description, CTA text, CTA link, media URL).
   - `BrandIntro.jsx`: Reads `pagesMap.home` section `brand_philosophy` (title, subtitle, content HTML, CTA, media URL, badge).
   - `PillarSection.jsx`: Reads `pagesMap.home` section `four_pillars` (section heading, subtitle, description, items).
   - `EntryExperience.jsx`: Reads `pagesMap.home` section `entry_sequence` (word items array).
2. **`VitalityPage.jsx`**:
   - Reads `pagesMap.vitality.hero` and section `protocol_cards` for the 4 Daily Protocol cards (*Sovereign Asana & Alignment*, *Sovereign Box Breathing*, *Conscious Alignment & Recovery*, *Functional Peak Resistance*).
3. **`NourishmentPage.jsx`**:
   - Reads `pagesMap.nourishment.hero`, section `quote` (*The Nourishment Ethos*), and section `cards` (*4 Pillars of Elemental Nourishment*).
4. **`LifestylePage.jsx`**:
   - Reads `pagesMap.lifestyle.hero` and section `rich_content` (*Mindful Architecture for Daily Operations*).
5. **`LongevityPage.jsx`**:
   - Reads `pagesMap.longevity.hero` and section `rich_content` (*Cellular Restoration & Bio-Energetic Resilience*).
6. **`JournalPage.jsx`**:
   - Reads `pagesMap.blog.hero` and section `blog_entry_photos` rendering 4 entry photos with a slow, elegant framing animation (scale 1.0 to 1.08 over 18s-30s smooth transition).
7. **`AboutPage.jsx` & `ContactPage.jsx`**:
   - Reads `pagesMap.about.hero` and `pagesMap.contact.hero` dynamically.

---

## 5. Rich Text Editor & Media Upgrades

1. **Inline Video Player Node Extension**:
   - Client can insert live running videos inline within text (MP4, WEBM, MOV).
   - Renders as an HTML5 video player on public website with `controls`, `autoplay`, `muted`, `loop`, and `poster` attributes.
2. **Highlight Box Block Extension**:
   - Reusable Highlight Box block with customizable background, border, text color, and alignment options.
3. **Typography Defaults**:
   - Headings (H1/H2/H3): Cormorant Garamond
   - Body & Descriptions: DM Sans
4. **Table Controls & Movement**:
   - Grid table insertion (2x2 to 5x5), add/delete rows and columns, table alignment.

---

## 6. How the Client Controls Content

1. Log into Admin Dashboard (`/admin/login`).
2. Navigate to **Pages (CMS)** in sidebar.
3. Select desired page tab (e.g. `Home`, `Vitality`, or `Blog`).
4. Update any headline, paragraph text, image URL, video asset, entry sequence word, or blog entry photo.
5. Click **Publish Page Changes** — updates immediately save to database and reflect live on the public website.

