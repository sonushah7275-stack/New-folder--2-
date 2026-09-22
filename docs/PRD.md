# TEJOVA — Product Requirements Document (PRD)

---

## 1. Product Overview
**TEJOVA** is a luxury botanical wellness and longevity brand platform offering premium plant-based health formulations, holistic vitality insights, editorial journal publications, and lifestyle guidance. The platform consists of a public-facing e-commerce/brand frontend, a dedicated administrator management dashboard, and a unified Node.js/Express backend API backed by MongoDB and Cloudinary.

---

## 2. Brand Identity
- **Name:** TEJOVA
- **Aesthetic:** Minimalist, botanical, elevated luxury, calm earthy elegance
- **Core Pillars:** Vitality, Longevity, Pure Nourishment, Holistic Lifestyle
- **Tone of Voice:** Authoritative, inspiring, serene, scientifically grounded yet deeply natural

---

## 3. Tagline
> *"Holistic Wellness, Longevity & Pure Botanical Nourishment"*

---

## 4. Product Vision
To establish TEJOVA as a premier digital sanctuary for botanical wellness—connecting consumers with premium formulations, curated lifestyle editorial content, and seamlessly managed operations through a modern, secure, and performant web platform.

---

## 5. Target Audience
- **Health & Longevity Enthusiasts:** Individuals seeking high-potency botanical supplements and science-backed wellness routines.
- **Conscious Consumers:** Buyers looking for transparently sourced, sustainable, and refined plant-based lifestyle products.
- **Brand Admirers:** Readers interested in articles on mindfulness, longevity, nutrition, and natural living.

---

## 6. Core Objectives
1. **Elevated Brand Presence:** Deliver an immersive, beautifully styled public web experience.
2. **Robust Content Delivery:** Manage dynamic botanical products, categories, journal articles, and wellness pillars via an intuitive CMS.
3. **Secure User Authentication:** Provide seamless user registration, login, and session persistence using secure HTTP-only cookies.
4. **Comprehensive Operations Control:** Enable administrators to manage inventory, customer data, orders, media library, and site settings.
5. **High Security & Compliance:** Protect user credentials, eliminate client-side token exposure, and isolate admin privileges.

---

## 7. Phase 1–3 Scope (Completed)
- **Phase 1:** Foundation setup, Redux Toolkit, Axios centralization, password hashing.
- **Phase 2:** Admin authentication, JWT cookies, role-based protection (`ADMIN`).
- **Phase 3A:** Admin Dashboard statistics and analytics overview.
- **Phase 3B:** Product and Category CRUD management with Cloudinary integration.
- **Phase 3C:** Orders backend APIs and Admin Orders management.
- **Phase 3D:** Customer user management and account controls.
- **Phase 3E:** Journal articles and Wellness Pillars CRUD engine.
- **Phase 3F:** Newsletter subscription and Contact Message handling.
- **Phase 3G:** Cloudinary Media Manager and dynamic CMS Content blocks.
- **Phase 3H:** System Configuration & Singleton Settings integration.
- **Phase 3I:** Public Frontend API integration (Products, Categories, Journal, Pillars, CMS, Contact, Newsletter, Settings).
- **Phase 3I-B:** Public User Registration simplification, Login, Profile (`/account`), Session persistence (`GET /api/auth/me`), and Logout.
- **Phase 3J:** Project Documentation System & AI Context Setup.

---

## 8. Public Website Features (Currently Implemented)
- **Home Experience:** Hero section, brand intro, wellness pillar grid, featured products, latest journal entries, dynamic CTA, and newsletter signup.
- **Navigation Header:** Logo, pillar links, navigation items, mobile responsive drawer, dynamic user profile indicator / login link.
- **Footer:** Brand mission statement, newsletter subscription form, pillar links, company links, social media channels, copyright notice.
- **Pillar Pages:** Dedicated pages for *Vitality*, *Longevity*, *Nourishment*, and *Lifestyle*.
- **About Page:** Brand story, philosophy, sourcing commitments, and botanical standards.
- **Product Catalog:** Product listing with category filtering, search input, price range display, and dynamic detail view (`/products/:slug`).
- **Journal Editorial:** Article grid, category tags, author metadata, read time estimation, and single article view (`/journal/:slug`).
- **Contact Page:** Interactive contact form connected to backend API (`POST /api/contact`), office/support information, inquiry submission states.
- **Newsletter Subscription:** Footer and inline subscription inputs connected to backend API (`POST /api/newsletter/subscribe`).

---

## 9. User Authentication Features (Currently Implemented)
- **Registration Flow (`/register`):**
  - Fields: **Full Name**, **Email**, **Password** (Minimum 6 characters).
  - Explicitly **NO** Confirm Password, Mobile/Phone number, OTP verification during registration, Username, or Role selector.
  - Automatically assigns role `USER`.
  - Sets HTTP-only authentication cookie upon registration.
- **Login Flow (`/login`):**
  - Fields: **Email**, **Password**.
  - Validates credentials against bcrypt password hash.
  - Sets HTTP-only `token` cookie. Zero JWT string returned in JSON response.
- **Logout Flow:**
  - Triggers `POST /api/auth/logout`.
  - Clears server-side authentication cookie and resets client Redux auth state.
- **Session Persistence (`App.jsx`):**
  - Automatically fetches authenticated session via `GET /api/auth/me` on startup.

---

## 10. User Account / Profile Features (Currently Implemented)
- **Protected Account Route (`/account`):**
  - Guarded by `ProtectedRoute.jsx`.
  - Displays authenticated user details: Full Name, Email, Account Role (`USER`), Active Status.
  - Provides quick Sign Out functionality.
  - Zero sensitive hashes, tokens, or credentials displayed or stored in local storage.

---

## 11. Product Features (Currently Implemented)
- **Product Schema:** Title, Slug, Subtitle, Description, Price, Compare Price, Category reference, Inventory Stock, Images array, Featured flag, Active status, Specifications/Ingredients array.
- **Public API:** Public list (`GET /api/products`), lookup by slug (`GET /api/products/slug/:slug`), lookup by ID (`GET /api/products/:id`).
- **Admin Management:** Full CRUD capabilities (`POST`, `PATCH`, `DELETE`) with Cloudinary image upload.

---

## 12. Journal Features (Currently Implemented)
- **Journal Schema:** Title, Slug, Excerpt, Content (HTML/Markdown), Category, Cover Image (`coverImage`), Article Font Style (`fontStyle`), Author, Read Time, Published Date, Featured flag, Tags array.
- **Article Font Style Options:** `tejova-editorial` (default), `modern-editorial`, `classic-serif`, `clean-sans`.
- **Cover Image Upload:** Direct Cloudinary uploader integrated into Admin Journal modal (`folder: "journal"`, accepts JPG, PNG, WEBP up to 5MB) replacing static URL text inputs.
- **Public API:** Public listing (`GET /api/journal`), lookup by slug (`GET /api/journal/:slug`).
- **Admin Management:** Full CRUD operations in Admin Dashboard (`/admin/journals`) with live cover image preview and font style selector.

---

## 13. Pillar Features (Currently Implemented)
- **Pillars:** 4 core brand pillars—*Vitality*, *Longevity*, *Nourishment*, *Lifestyle*.
- **Pillar Schema:** Title, Slug, Description, Hero Image, Icon, Sub-items, Display Order, Active status.
- **Public API:** List pillars (`GET /api/pillars`), lookup by ID/Slug (`GET /api/pillars/:idOrSlug`).
- **Admin Management:** Full CRUD operations in Admin Dashboard (`/admin/pillars`).

---

## 14. CMS Features (Currently Implemented)
- **Dynamic Content Blocks:** Key-value CMS engine allowing admins to edit hero headers, promo banners, tagline text, and brand intros without code deployments.
- **Public API:** List blocks (`GET /api/content`), fetch by key (`GET /api/content/:key`).
- **Admin Management:** Dedicated CMS management interface (`/admin/content`).

---

## 15. Newsletter Features (Currently Implemented)
- **Public Subscription:** `POST /api/newsletter/subscribe` (Validates email, prevents duplicates).
- **Public Unsubscribe:** `POST /api/newsletter/unsubscribe`.
- **Admin Management:** View subscriber list, subscription source, date subscribed, and remove subscribers (`/admin/newsletter`).

---

## 16. Contact Features (Currently Implemented)
- **Public Submission:** `POST /api/contact` (Captures Name, Email, Subject, Message).
- **Admin Management:** View messages, filter by status (*New*, *Read*, *Replied*, *Archived*), update status, delete messages (`/admin/contact`).

---

## 17. Admin Dashboard Features (Currently Implemented)
- **Separate Web Application:** Standalone Vite + React application (`TEJOVA-Admin-Dashboard`).
- **Authentication:** Dedicated login screen (`/admin/login`), role verification (`ADMIN` role required).
- **Dashboard Overview (`/admin`):** High-level statistics cards (Total Revenue, Total Orders, Total Products, Total Customers), revenue performance chart, recent activity feed, top products list.
- **Catalog Management:** Products page (`/admin/products`), Categories page (`/admin/categories`).
- **Order Management:** Orders page (`/admin/orders`) with status updating (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
- **Customer Management:** Customers page (`/admin/customers`) with account search and deactivation.
- **Content Management:** Journals (`/admin/journals`), Pillars (`/admin/pillars`), CMS Blocks (`/admin/content`).
- **Communications:** Contact Messages (`/admin/contact`), Newsletter Subscribers (`/admin/newsletter`).
- **Media Library:** Cloudinary asset browser and direct file upload tool (`/admin/media`).
- **System Settings:** System configuration panel (`/admin/settings`).

---

## 18. Media Management (Currently Implemented)
- **Cloudinary Integration:** Backend routes (`/api/media/upload`, `/api/media`) using Multer memory storage and Cloudinary SDK v2.
- **Asset Metadata:** Stores URL, Public ID, width, height, format, file size, and upload timestamp in MongoDB `Media` collection.
- **Deletion:** Deletes image asset from Cloudinary servers and database record simultaneously.

---

## 19. Settings Management (Currently Implemented)
- **Singleton Model:** Single `Settings` document in MongoDB.
- **Configuration Fields:** Site Name, Tagline, Support Email, Contact Phone, Social Links (Instagram, Facebook, Twitter, LinkedIn), Maintenance Mode flag, Currency symbol, Order Notice text.
- **Public Safe API:** `GET /api/settings/public` exposes safe brand metadata to the public frontend.
- **Admin Protected API:** `GET /api/settings` and `PATCH /api/settings` for full configuration.

---

## 20. Future / Planned Features (NOT IMPLEMENTED YET)
> [!IMPORTANT]
> The following features are PLANNED for future releases and are **NOT** present in the current codebase:
- **E-Commerce Shopping Cart & Checkout:** Persistent shopping cart state, shipping calculation, tax computation, checkout form.
- **Payment Gateway Integration:** Stripe, Razorpay, or PayPal API integration for real-time payment processing.
- **Customer Order History:** Displaying personal past orders inside `/account`.
- **Interactive Workshops & Online Courses:** Video streaming, registration, and module tracking.
- **Personalized Consultation Booking:** Appointment scheduling calendar and practitioner consultation booking.
- **Automated Transactional Emails:** Sending order confirmation and password reset emails via SMTP (Nodemailer / SendGrid).

---

## 21. Non-Goals
- Building a multi-vendor marketplace.
- Supporting native mobile apps (iOS/Android) in the current phase.
- Supporting physical POS terminal integrations.

---

## 22. Functional Requirements
- **FR-01:** Users must be able to register using Name, Email, and Password only.
- **FR-02:** User authentication must utilize HTTP-only cookies without exposing JWT tokens in client JS or `localStorage`.
- **FR-03:** Administrators must have access to CRUD actions for products, categories, articles, pillars, orders, customers, media, and settings.
- **FR-04:** Public API endpoints must be accessible without authentication for read operations (products, articles, pillars, public settings).
- **FR-05:** Admin APIs must enforce both token authentication (`protect`) and admin role verification (`adminOnly`).

---

## 23. Non-Functional Requirements
- **Performance:** Initial page load under 1.5s; API response time under 200ms.
- **Usability:** Clean luxury botanical aesthetic with accessible typography and touch targets.
- **Reliability:** Graceful error handling for missing backend connection or API network errors.
- **Maintainability:** Pure JavaScript/JSX code without TypeScript, following modular component structures.

---

## 24. Security Requirements
- All passwords hashed using `bcryptjs` with salt rounds = 10.
- JWT secret stored strictly in server environment variables.
- Authentication cookies configured with `httpOnly: true`, `sameSite: "lax"` (or `"none"` for cross-domain HTTPS), and `secure: true` in production.
- Zero token strings returned in login/register JSON payloads.
- Zero secrets committed to version control.

---

## 25. Responsive Requirements
- Full responsiveness across three primary breakpoints:
  - Mobile: `< 640px`
  - Tablet: `640px – 1024px`
  - Desktop: `> 1024px`

---

## 26. Production Requirements
- Backend hosted on Render platform with Node.js runtime.
- Database hosted on MongoDB Atlas.
- Media assets hosted on Cloudinary CDN.
- Frontends deployed on Render or static web hosting platforms with environment variable injection.
