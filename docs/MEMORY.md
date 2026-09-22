# TEJOVA — Project Memory

This document contains long-term architectural memory, foundational design decisions, critical implementation context, and mandatory instructions for future AI coding agents working on the TEJOVA codebase.

---

## 1. Project Identity
- **Project Name:** TEJOVA
- **Tagline:** *"Holistic Wellness, Longevity & Pure Botanical Nourishment"*
- **Project Purpose:** Premium botanical wellness platform offering science-backed plant formulations, longevity insight editorial journals, brand pillar education, and centralized administration.

---

## 2. Current Architecture
- **Backend:** Node.js + Express.js API using ES Modules (`"type": "module"`).
- **Public Frontend:** React 19 + Vite single-page web app styled with Tailwind CSS v4 and Framer Motion.
- **Admin Dashboard:** Independent React 19 + Vite dashboard styled with Material UI (MUI v9) and Emotion.
- **Database:** MongoDB Atlas accessed via Mongoose 8.x ODM.
- **Media Engine:** Cloudinary integration using backend Multer memory storage.
- **Authentication:** JWT tokens stored strictly in HTTP-only cookies (`token`).
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`).
- **HTTP Client:** Centralized Axios instance (`src/config/api.js`) configured with `withCredentials: true`.

---

## 3. Important Architectural Decisions (DO NOT ALTER CASUALLY)
1. **JavaScript / JSX Only:** The entire project uses pure JavaScript (`.js`) and JSX (`.jsx`). Do NOT introduce TypeScript (`.ts` / `.tsx`).
2. **Decoupled Architecture:** Keep `Backend/`, `TEJOVA/` (public frontend), and `TEJOVA-Admin-Dashboard/` (admin frontend) as separate, isolated workspaces.
3. **HTTP-Only Cookies:** Auth tokens must ALWAYS be issued as HTTP-only cookies. Do NOT return token strings in API JSON responses or store them in `localStorage`.
4. **Separate Admin Dashboard:** Admin functionality must be isolated in `TEJOVA-Admin-Dashboard` and protected by both `protect` and `adminOnly` backend middleware.
5. **No Token in Redux / LocalStorage:** LocalStorage is purged of auth tokens. Redux holds user metadata (`name`, `email`, `role`) for UI rendering only.
6. **Central Axios Instance:** All network requests in both frontends MUST go through `src/config/api.js`.
7. **Approved UI Preservation:** The layout, colors, typography, and responsive animations of the public frontend and admin dashboard are customer-approved. Do NOT redesign without explicit authorization.

---

## 4. Authentication Memory
- **Public Registration Form:**
  - Mandatory Fields: **Full Name**, **Email**, **Password** (minimum 6 characters).
  - Explicit Constraints: **NO** Confirm Password field, **NO** mobile/phone number field, **NO** OTP requirement during normal registration, **NO** username field, **NO** role selector.
  - Role Assignment: Backend automatically assigns `role = "USER"`.
- **User Login:** Accepts Email + Password. Sets HTTP-only cookie.
- **Session Retrieval (`GET /api/auth/me`):** Dispatched on app load (`App.jsx`) to re-hydrate `authSlice` state from HTTP-only cookie.
- **Logout (`POST /api/auth/logout`):** Clears server-side authentication cookie and clears local Redux state.
- **Protected User Route:** `/account` page renders authenticated user information (Name, Email, Account Type).

---

## 5. API Memory (Primary Endpoint Groups)
- `/api/auth`: User registration, login, logout, session query.
- `/api/admin`: Analytics statistics (`/stats`), authorization test (`/dashboard`).
- `/api/users`: Admin customer account management (`GET`, `PATCH`, `DELETE`).
- `/api/products`: Public product queries (`/`, `/slug/:slug`, `/:id`) & Admin product CRUD.
- `/api/categories`: Public category listing & Admin category CRUD.
- `/api/journal`: Public article list and single view (`/:slug`) & Admin journal CRUD (supports `fontStyle` options: `tejova-editorial`, `modern-editorial`, `classic-serif`, `clean-sans` and Cloudinary `coverImage` upload).
- `/api/pillars`: Public brand pillars & Admin pillar CRUD.
- `/api/contact`: Public message submission (`POST /`) & Admin message inbox.
- `/api/newsletter`: Public subscribe/unsubscribe & Admin subscriber list.
- `/api/content`: Public CMS block fetching (`/:key`) & Admin CMS editor.
- `/api/media`: Admin Cloudinary file upload (`/upload`) and asset deletion (`/delete`).
- `/api/orders`: Admin order management (`GET`, `PATCH /:id/status`).
- `/api/settings`: Safe public settings (`/public`) & Admin full configuration (`GET`, `PATCH`).

---

## 6. UI & Design System Memory
- **Base Canvas:** Ivory / Cream (`#F5F3EF`).
- **Text & Headers:** Midnight Blue (`#0A2342`) and Dark Midnight (`#071930`).
- **Accents:** Copper (`#B87333`), Gold (`#D4AF37`), and Botanical Green (`#3B6347`).
- **Typography:** Serif (`DM Serif Display` / `Cormorant Garamond`) for headings; Sans-serif (`Inter`) for body copy.
- **Buttons:** Gold primary button (`.tejova-btn-primary`), midnight outline secondary button (`.tejova-btn-secondary`).

---

## 7. Deployment Memory
- **Public Frontend Known URL:** `https://new-folder-2-tejova.onrender.com/`
- **Admin Dashboard Known URL:** `https://tejova-admin-dashboard.onrender.com/`
- **Backend API URL:** `Backend production URL: VERIFY BEFORE DEPLOYMENT` (Verify configured host in environment settings prior to launch).

---

## 8. Current Implementation Status
- **Phase 1 – Phase 3I-B:** Fully completed and verified.
- **Auth Security Final Check:** Passed. Token exposure removed, local storage cleaned, zero build errors.
- **Phase 3J:** Documentation and AI context setup completed.
- **Phase 4:** Production deployment preparation is pending.

---

## 9. Known Risks & Considerations
- **CORS in Production:** Ensure `CLIENT_URL` and `ADMIN_URL` environment variables on Render include exact frontend domains (without trailing slashes).
- **HTTPS Cookie Settings:** In production (`NODE_ENV === "production"`), HTTP-only cookies require `secure: true` and `sameSite: "none"` if frontends and backend reside on different subdomains/hosts.
- **Render Cold Starts:** Free-tier Render web services sleep after inactivity; initial request may take 30–50 seconds to respond.

---

## 10. AI Agent Instructions for Future Coding Sessions
When initiating any future development, debugging, or deployment task on TEJOVA, future AI agents MUST follow these instructions:

1. **Read `docs/MEMORY.md`** (this document) to understand core architecture and decisions.
2. **Read `docs/RULES.md`** to review strict development and coding guidelines.
3. **Read `docs/ARCHITECTURE.md`** to inspect backend endpoints, models, and data flows.
4. **Read `docs/TASKS.md`** to check current completion status and pending tasks.
5. **Inspect Source Code:** Always inspect the actual source code using viewing/search tools before changing any file.
6. **Source Code Primacy:** Never assume documentation is newer than the codebase. Source code is the ultimate source of truth.
7. **Keep Documentation Updated:** Update `docs/TASKS.md` and `docs/MEMORY.md` whenever major architectural changes occur.
