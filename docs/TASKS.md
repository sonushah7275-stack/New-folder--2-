# TEJOVA — Master Task Tracker

This document tracks the verified completion status of project development phases, currently pending tasks for deployment, and planned future feature roadmaps.

---

## COMPLETED PHASES

### Phase 1 — Foundation & State Architecture
- [x] Redux Toolkit integration across frontend applications.
- [x] React Redux store configuration.
- [x] Axios HTTP client setup with centralized configuration (`src/config/api.js`).
- [x] Backend password hashing with `bcryptjs` (salt rounds = 10).
- [x] Express middleware setup (`cors`, `json`, `urlencoded`, `cookieParser`).

### Phase 2 — Admin Authentication & Security
- [x] Admin Login and Logout functionality.
- [x] JWT token generation and HTTP-only cookie issuing (`generateTokenAndSetCookie`).
- [x] Role-based access control (`protect` and `adminOnly` middleware).
- [x] Protected Admin routes in backend and dashboard UI.

### Phase 3A — Admin Dashboard Statistics
- [x] Dashboard statistics backend API (`GET /api/admin/stats`).
- [x] Aggregated metrics calculation (Revenue, Orders, Products, Customers).
- [x] Redux integration (`adminDashboardSlice.js`).
- [x] Stat cards, revenue chart, and recent orders UI in Admin Dashboard.

### Phase 3B — Products & Categories Management
- [x] Mongoose models for `Product` and `Category`.
- [x] Product CRUD APIs (`GET`, `POST`, `PATCH`, `DELETE`).
- [x] Category CRUD APIs (`GET`, `POST`, `PATCH`, `DELETE`).
- [x] Cloudinary image upload integration for products and categories.
- [x] Redux slices for products and categories.
- [x] Admin product and category management views.

### Phase 3C — Orders Integration
- [x] Mongoose model for `Order`.
- [x] Orders backend APIs (`GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`).
- [x] Admin Orders page with status updating (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
- [x] Redux integration for order management.

### Phase 3D — Customers Management
- [x] Customer accounts query API (`GET /api/users`).
- [x] Account detail lookup and active status toggle (`PATCH /api/users/:id`).
- [x] Admin Customers management page with search and pagination.
- [x] Redux integration for customer list.

### Phase 3E — Journal & Pillars Engine
- [x] Mongoose models for `Journal` and `Pillar`.
- [x] Public and admin journal APIs (`/api/journal`).
- [x] Public and admin pillar APIs (`/api/pillars`).
- [x] Admin Journal and Pillar management pages.
- [x] Redux slices for journals and pillars.

### Phase 3F — Newsletter & Contact Handling
- [x] Mongoose models for `NewsletterSubscriber` and `ContactMessage`.
- [x] Public newsletter subscribe/unsubscribe APIs (`/api/newsletter`).
- [x] Public contact message submission API (`POST /api/contact`).
- [x] Admin newsletter subscriber list view (`/admin/newsletter`).
- [x] Admin contact message inbox and status updater (`/admin/contact`).

### Phase 3G — Media Library & Dynamic CMS Content
- [x] Backend Cloudinary media upload/delete controller (`/api/media`).
- [x] Mongoose models for `Media` and `Content`.
- [x] Dynamic CMS content block engine (`/api/content`).
- [x] Admin Media Library page with Cloudinary direct file upload.
- [x] Admin Content Management page for dynamic key-value site copy.

### Phase 3H — Admin Settings Integration
- [x] Singleton `Settings` Mongoose model.
- [x] Admin protected settings APIs (`GET /api/settings`, `PATCH /api/settings`).
- [x] Safe public settings API (`GET /api/settings/public`).
- [x] Redux integration (`settingsSlice.js`).
- [x] Admin Settings form integration with validation.

### Phase 3I — Public Frontend API Integration
- [x] Centralized Axios instance (`TEJOVA/src/config/api.js`) with `withCredentials: true`.
- [x] Public Products page connected to real backend API (`GET /api/products`).
- [x] Public Single Product detail page connected to slug endpoint (`GET /api/products/slug/:slug`).
- [x] Public Journal page connected to real backend API (`GET /api/journal`).
- [x] Public Single Article detail page connected to slug endpoint (`GET /api/journal/:slug`).
- [x] Public Pillar pages (*Vitality*, *Longevity*, *Nourishment*, *Lifestyle*) connected to backend (`GET /api/pillars`).
- [x] Public Contact form connected to backend submission API (`POST /api/contact`).
- [x] Public Newsletter form connected to backend subscription API (`POST /api/newsletter/subscribe`).
- [x] Public site settings fetched from safe backend endpoint (`GET /api/settings/public`).

### Phase 3I-B — Public User Profile, Session & Logout
- [x] Public User Registration simplified to **Name**, **Email**, **Password** ONLY.
- [x] Removed Confirm Password, Phone Number, Username, and Role selector fields.
- [x] User Login connected to backend auth API (`POST /api/auth/login`).
- [x] Session persistence on startup via `GET /api/auth/me` dispatched in `App.jsx`.
- [x] Protected Account profile view (`/account`) displaying name, email, and user role.
- [x] Logout functionality calling `POST /api/auth/logout`, clearing server cookie and Redux state.

### Auth Security Final Check
- [x] Removed raw JWT token string from JSON response payloads of `/api/auth/login` and `/api/auth/register`.
- [x] Removed all `localStorage.setItem("token", ...)` and `localStorage.removeItem("token")` references from `authSlice.js`.
- [x] Verified HTTP-only cookie authentication (`withCredentials: true`).
- [x] Passed backend syntax validation (`node --check server.js`).
- [x] Passed frontend build validation (`npm run build`).

### Phase 3J — Project Documentation System
- [x] Created permanent `docs/` documentation directory at project root.
- [x] Created `docs/PRD.md` (Product Requirements Document).
- [x] Created `docs/ARCHITECTURE.md` (System Architecture & API Reference).
- [x] Created `docs/RULES.md` (Development & AI Rules).
- [x] Created `docs/DESIGN.md` (Design System Specification).
- [x] Created `docs/TASKS.md` (Master Task Tracker).
- [x] Created `docs/MEMORY.md` (Long-Term AI Project Memory).

### Phase 3K — Journal Editor & Full Integration Verification
- [x] Journal Cover Image Upload via backend Cloudinary endpoint (`folder: "journal"`).
- [x] Cover Image preview, file size (<5MB) and type validation, change & remove state controls.
- [x] Controlled Article Font Style dropdown (`tejova-editorial`, `modern-editorial`, `classic-serif`, `clean-sans`).
- [x] `fontStyle` Mongoose schema support & default fallback.
- [x] Public Journal article dynamic typography rendering.
- [x] Full end-to-end integration and security audit passed.

---

## CURRENTLY PENDING (PHASE 4 PREPARATION)

### Production Deployment (Phase 4)
- [ ] Backend production environment configuration verification.
- [ ] MongoDB Atlas production database connection check.
- [ ] Cloudinary production API credentials check.
- [ ] Backend Render deployment verification (`https://tejova-backend.onrender.com` or configured host).
- [ ] Public frontend Render deployment verification (`https://new-folder-2-tejova.onrender.com/`).
- [ ] Admin Dashboard Render deployment verification (`https://tejova-admin-dashboard.onrender.com/`).
- [ ] CORS allowed origins list production review.
- [ ] HTTPS SameSite (`none`) and Secure (`true`) cookie flags verification.
- [ ] Production API integration regression testing.
- [ ] End-to-end security audit on live production environment.
- [ ] Final client handover and documentation delivery.

---

## FUTURE FEATURES (PLANNED / POST-PHASE 4)

> [!NOTE]
> The following items represent prospective enhancements for future development cycles:

- [ ] **E-Commerce Shopping Cart:** Local/Redux persistent cart drawer and cart page.
- [ ] **Checkout System:** Multi-step checkout form with shipping address validation and tax calculation.
- [ ] **Payment Gateway Integration:** Real-time credit card / UPI processing via Stripe or Razorpay APIs.
- [ ] **Customer Order History:** Personal order list and tracking view inside user `/account` page.
- [ ] **Interactive Wellness Workshops:** Registration and live stream hosting for botanical masterclasses.
- [ ] **Online Courses Platform:** Video module tracking and certification for longevity practices.
- [ ] **Personalized Consultation Booking:** Practitioner appointment calendar and consultation scheduling engine.
- [ ] **Automated Transactional Emails:** Sending order invoices, shipping updates, and password resets via Nodemailer / SendGrid SMTP.
