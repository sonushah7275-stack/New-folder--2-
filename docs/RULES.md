# TEJOVA — Development Rules

This document serves as the **mandatory rulebook** for all human developers and AI coding agents working on the TEJOVA codebase. Adherence to these rules is strictly required for all future maintenance, feature development, and bug fixes.

---

## 1. General Rules
- **Inspect Before Modifying:** Always inspect the existing implementation using source viewing and search tools before writing new code. Never make assumptions about variable names, schemas, or file locations.
- **Reuse Existing Architecture:** Always reuse existing models, routes, Redux slices, Axios instances, and UI components before creating new ones.
- **No Duplicate Systems:** Do NOT introduce second authentication systems, secondary Axios instances, or redundant state stores.
- **Do Not Rewrite Working Code:** Preserved, tested, and approved features must not be rewritten without explicit user instruction.

---

## 2. Language Rules
- **JavaScript Only (`.js`):** All Node.js backend files and frontend configuration logic must be written in standard JavaScript.
- **JSX Only (`.jsx`):** All React components must use JSX syntax.
- **NO TypeScript (`.ts` / `.tsx`):** Do NOT introduce TypeScript or `.ts` / `.tsx` files anywhere in the project.

---

## 3. Frontend Rules
- **Frameworks:** React 19 + Vite.
- **State Management:** Use existing Redux Toolkit store and slices.
- **HTTP Requests:** Always use the centralized Axios instance at `src/config/api.js` (`withCredentials: true`). Do NOT instantiate raw `axios` calls with hardcoded URLs.
- **UI Preservation:** Complete layout, colors, typography, spacing, responsive behavior, and animations must be preserved unless explicit design changes are requested.

---

## 4. Admin Rules
- **Isolated Admin Experience:** Admin login and dashboard functionality must remain separate from the public user experience.
- **Role Verification:** Admin endpoints must enforce both `protect` and `adminOnly` middleware guards.
- **Authorization Errors:** Handle `403 Forbidden` and `401 Unauthorized` cleanly in the Admin UI by redirecting to `/admin/login`.

---

## 5. Backend Rules
- **Framework:** Express.js with Node.js ES Modules (`import`/`export`).
- **Data Modeling:** Mongoose models in `Backend/models/`.
- **Middleware Usage:** Pass errors to the centralized `next(error)` handler to maintain consistent JSON error responses.
- **Controllers:** Write async controller functions wrapped in `try...catch` blocks calling `next(error)`.

---

## 6. Security Rules
- **Never Expose Secrets:**
  - JWT Secret
  - MongoDB URI
  - Cloudinary API Secret & Key
  - SMTP Credentials
  - Payment Keys / API Tokens
- **No Plaintext Passwords:** Passwords must be hashed using `bcryptjs` with salt rounds = 10 prior to database save.
- **Zero Token String in JSON:** Authentication APIs must set JWTs in HTTP-only cookies (`res.cookie(...)`) and omit raw token strings from response bodies.
- **Zero Token in Local Storage:** Never store JWT tokens in `localStorage`, `sessionStorage`, or window global objects.

---

## 7. API Rules
- **Endpoint Reuse:** Consult `docs/ARCHITECTURE.md` before adding endpoints to prevent duplicate URL routes.
- **Response Structure:** Standardize controller responses:
  - Success: `res.status(200|201).json({ success: true, message?: string, ...data })`
  - Error: `res.status(4xx|5xx).json({ success: false, message: string })`
- **Slug Lookup:** Public endpoints for single resources (products, categories, articles) must support lookup by human-readable `slug`.

---

## 8. Redux Rules
- **Slice Reuse:** Utilize existing slices in `Redux/slices/`.
- **Thunk Error Handling:** Always return `rejectWithValue(errorMessage)` in `createAsyncThunk` error blocks so components can display clean user feedback.
- **Naming Conventions:** Follow established action and slice naming conventions (`fetchProducts`, `loginUser`, `registerUser`, `updateOrderStatus`).

---

## 9. UI Rules
- **No Unapproved Redesigns:** Do not change colors, fonts, or structural layouts without explicit user approval.
- **Responsive Integrity:** Test components across Mobile (`< 640px`), Tablet (`640px – 1024px`), and Desktop (`> 1024px`).
- **Loading & Error States:** Always display clean visual loading indicators (spinners/skeletons) and clear error alert states.

---

## 10. Database Rules
- **NEVER** drop the production database or collections.
- **NEVER** casually run `User.deleteMany({})` or delete production customer data.
- **NEVER** overwrite existing seed data without backing up or confirming environment targets.

---

## 11. Deployment Rules
- **Environment Isolation:** Keep development configuration separate from production.
- **Secrets Management:** Use environment variables (`process.env` on server, `import.meta.env` on frontend) for all credentials and URLs.
- **No Hardcoded URLs:** Never hardcode `http://localhost:5000` or production Render URLs directly inside component files.

---

## 12. AI Agent Workflow Rules
AI agents modifying this codebase must adhere to the following 5-step loop:

1. **AUDIT:** Inspect existing source code, schemas, and routes thoroughly.
2. **PLAN:** Formulate a detailed, non-destructive implementation plan before modifying files.
3. **IMPLEMENT:** Execute precise edits maintaining JavaScript/JSX syntax and existing patterns.
4. **TEST:** Run syntax validation (`node --check server.js`) and build verification (`npm run build`).
5. **REPORT:** Provide clean, truthful summaries of changes made and verification status.

*Never claim a task is completed without running empirical verification!*
