# TEJOVA — Admin Dashboard Setup & Architecture

## 1. Overview

The **TEJOVA Admin Dashboard** (`TEJOVA-Admin-Dashboard/`) is a dedicated control console for platform administrators to manage journal articles, e-commerce products, content categories, wellness pillars, customer contact inquiries, newsletter subscribers, and site settings.

---

## 2. Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 8.3
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS v4 & `@mui/icons-material`
- **Rich Text Editor**: Tiptap Editor (`@tiptap/react`, `@tiptap/starter-kit`, custom extensions)
- **State Management**: Redux Toolkit (`authSlice`, `journalSlice`, `productSlice`, `pillarSlice`, `categorySlice`, `settingSlice`)
- **HTTP Client**: Axios with Bearer token header authorization

---

## 3. Administrative Modules & Capabilities

| Module | Route / Component | Primary Responsibilities |
| :--- | :--- | :--- |
| **Admin Auth** | `/login` (`AdminLoginPage`) | Admin authentication, JWT token storage, protected route access |
| **Journal Editor** | `/journals` (`Journals.jsx`) | Create, edit, delete, publish articles with rich text formatting, font styles, highlight box, divider lines, and Cloudinary image upload |
| **Products Manager** | `/products` (`Products.jsx`) | Product CRUD, image upload, price, SKU, inventory, categories |
| **Categories Manager** | `/categories` (`Categories.jsx`) | Product & article category CRUD |
| **Pillars Manager** | `/pillars` (`Pillars.jsx`) | Vitality, Nourishment, Lifestyle, Longevity pillar management with cover image upload |
| **Subscribers** | `/subscribers` (`Subscribers.jsx`) | View newsletter subscription list |
| **Contact Inquiries** | `/contacts` (`Contacts.jsx`) | Review user contact form submissions |
| **Settings** | `/settings` (`Settings.jsx`) | Site name, tagline, support contact details, business hours |

---

## 4. Admin Authentication Architecture

1. **Login Flow**: Admin submits credentials via `POST /api/auth/admin-login`.
2. **Token Storage**: On success, the API returns a JWT token which is stored in `localStorage.setItem('adminToken', token)` and Redux auth state.
3. **Axios Interceptor**: `TEJOVA-Admin-Dashboard/src/config/api.js` automatically attaches the token to every outgoing request:
   ```javascript
   config.headers.Authorization = `Bearer ${token}`;
   ```
4. **Protected Guard**: Navigation routes are wrapped in an `AdminProtectedRoute` component that verifies token existence and role before rendering.

---

## 5. Local Setup & Production Build

### Environment Configuration
Create a `.env` file in `TEJOVA-Admin-Dashboard/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Commands

```bash
# Navigate to admin folder
cd TEJOVA-Admin-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Production build compiles static files to `TEJOVA-Admin-Dashboard/dist/`.
