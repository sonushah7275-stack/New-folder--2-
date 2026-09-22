# TEJOVA — System Architecture

---

## 1. Architecture Overview
TEJOVA is built on a modern decoupled client-server architecture consisting of three distinct codebases:
1. **Backend API (`Backend/`):** Express.js REST API using Node.js ES Modules, Mongoose for MongoDB data modeling, and Cloudinary SDK for media management.
2. **Public Frontend (`TEJOVA/`):** React 19 single-page application built with Vite, styled with Tailwind CSS v4 and Framer Motion, utilizing Redux Toolkit and Axios.
3. **Admin Dashboard (`TEJOVA-Admin-Dashboard/`):** Dedicated React 19 single-page administration interface built with Vite, styled with Material UI (MUI v9) and Emotion, utilizing Redux Toolkit and Axios.

```
+------------------------+      +------------------------------+
| TEJOVA Public Frontend |      | TEJOVA Admin Dashboard       |
| (React 19 + Vite)      |      | (React 19 + MUI + Vite)      |
+-----------+------------+      +--------------+---------------+
            |                                  |
            | Axios (withCredentials: true)    | Axios (withCredentials: true)
            v                                  v
+--------------------------------------------------------------+
|                     TEJOVA Backend API                       |
|                 (Node.js + Express + JWT)                    |
+-------+----------------------+-----------------------+-------+
        |                      |                       |
        v                      v                       v
+---------------+      +---------------+       +---------------+
| MongoDB Atlas |      |  Cloudinary   |       | HTTP-Only     |
| (Database)    |      | (Media Storage|       | Cookie Engine |
+---------------+      +---------------+       +---------------+
```

---

## 2. Complete Project Structure
```
TEJOVA-Root/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── DESIGN.md
│   ├── TASKS.md
│   └── MEMORY.md
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── contactController.js
│   │   ├── contentController.js
│   │   ├── journalController.js
│   │   ├── mediaController.js
│   │   ├── newsletterController.js
│   │   ├── orderController.js
│   │   ├── pillarController.js
│   │   ├── productController.js
│   │   ├── settingsController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── ContactMessage.js
│   │   ├── Content.js
│   │   ├── Journal.js
│   │   ├── Media.js
│   │   ├── NewsletterSubscriber.js
│   │   ├── Order.js
│   │   ├── Pillar.js
│   │   ├── Product.js
│   │   ├── Settings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── contentRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── mediaRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── pillarRoutes.js
│   │   ├── productRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── DataInitializeService.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
├── TEJOVA/                         # Public Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── journal/
│   │   │   ├── layout/
│   │   │   └── products/
│   │   ├── config/
│   │   │   └── api.js              # Central Axios instance
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── ArticleDetailPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── JournalPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   └── ProductsPage.jsx
│   │   ├── Redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── categorySlice.js
│   │   │   │   ├── contactSlice.js
│   │   │   │   ├── contentSlice.js
│   │   │   │   ├── journalSlice.js
│   │   │   │   ├── newsletterSlice.js
│   │   │   │   ├── pillarSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   └── settingsSlice.js
│   │   │   └── store.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── TEJOVA-Admin-Dashboard/        # Admin Dashboard Frontend
    ├── src/
    │   ├── admin/
    │   │   ├── components/
    │   │   └── pages/
    │   │       ├── AdminLoginPage.jsx
    │   │       ├── Categories.jsx
    │   │       ├── Content.jsx
    │   │       ├── Customers.jsx
    │   │       ├── DashboardPage.jsx
    │   │       ├── Journals.jsx
    │   │       ├── Media.jsx
    │   │       ├── NewsLetter.jsx
    │   │       ├── Orders.jsx
    │   │       ├── Pillars.jsx
    │   │       ├── Products.jsx
    │   │       └── Settings.jsx
    │   ├── config/
    │   │   └── api.js              # Central Axios instance
    │   ├── Redux/
    │   │   ├── slices/
    │   │   └── store.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 3. Backend Architecture
- **Framework:** Express.js on Node.js runtime.
- **Module System:** ES Modules (`"type": "module"` in `package.json`).
- **Database Mapping:** Mongoose 8.x for MongoDB Atlas.
- **Middleware Pipeline:**
  1. CORS Origin Normalization (`cors(corsOptions)`)
  2. JSON Body Parser (`express.json()`)
  3. URL Encoded Parser (`express.urlencoded()`)
  4. Cookie Parser (`cookieParser()`)
  5. Route Handlers (`/api/...`)
  6. 404 Route Handler (`notFoundHandler`)
  7. Global Centralized Error Handler (`errorHandler`)

---

## 4. Public Frontend Architecture
- **Build Tool:** Vite 8.x
- **UI Framework:** React 19
- **Styling Engine:** Tailwind CSS v4, Emotion, Framer Motion
- **Iconography:** Lucide React (`lucide-react`)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **HTTP Client:** Centralized Axios instance (`src/config/api.js`)
- **Routing:** React Router v7 (`react-router-dom`)

---

## 5. Admin Dashboard Architecture
- **Build Tool:** Vite 8.x
- **UI Framework:** React 19
- **Component Library:** Material UI v9 (`@mui/material`, `@mui/icons-material`, `@emotion/styled`)
- **State Management:** Redux Toolkit with dedicated admin slices (`adminProductSlice`, `adminOrderSlice`, etc.)
- **HTTP Client:** Centralized Axios instance with `withCredentials: true`

---

## 6. Request / Response Flow
```
User Action / Page Load
         │
         ▼
Redux Thunk Dispatch (e.g., fetchProducts())
         │
         ▼
Central Axios Instance (`config/api.js`)
 ├── Appends baseURL (`http://localhost:5000/api` or Production URL)
 └── Sends HTTP Request + Automatic `token` Cookie (`withCredentials: true`)
         │
         ▼
Express Server (`Backend/server.js`)
 ├── CORS Middleware checks Origin
 ├── `authMiddleware.protect` extracts JWT from `req.cookies.token` or Bearer header
 ├── `authMiddleware.adminOnly` checks `req.user.role === 'ADMIN'` (if required)
 └── Controller executes Mongoose Query / Cloudinary Action
         │
         ▼
JSON Response Payload returned (`{ success: true, ... }`)
         │
         ▼
Redux Reducer updates State -> React Component Rerenders
```

---

## 7. Authentication Architecture
- **Strategy:** JSON Web Token (JWT) issued upon successful authentication.
- **Cookie Transport:** Token stored in `HTTP-only`, `SameSite: Lax` (or `None` with `Secure: true` in production) cookie named `token`.
- **Token Payload:** Contains User ID (`{ id: user._id }`).
- **Token Expiry:** Configurable (default 30 days).

---

## 8. Authorization Architecture
- **Role Model:** User model contains `role` property: `"USER"` or `"ADMIN"`.
- **Middleware Guards:**
  - `protect`: Decodes JWT from cookie/header, loads user from database, attaches to `req.user`. Returns `401 Unauthorized` if invalid/missing.
  - `adminOnly`: Verifies `req.user.role === "ADMIN"`. Returns `403 Forbidden` if non-admin user attempts access.

---

## 9. JWT + HTTP-Only Cookie Architecture
```
Login Request (POST /api/auth/login)
  │
  ├── Controller verifies email & bcrypt password match
  ├── Calls `generateTokenAndSetCookie(res, user._id)`
  │     └── `res.cookie('token', token, { httpOnly: true, secure: isProd, sameSite: 'lax' })`
  └── Controller returns JSON: `{ success: true, message: '...', user: { id, name, email, role } }`
        (Zero token string in response body!)
```
- **XSS Protection:** Client-side JavaScript cannot access `document.cookie` or store tokens in `localStorage`.
- **CSRF Consideration:** Protected via `SameSite` cookie policy and CORS origin restrictions.

---

## 10. Redux Architecture
Each application maintains a single Redux store configured via Redux Toolkit's `configureStore`:
- **Thunks:** Created with `createAsyncThunk` for asynchronous API interactions.
- **Slices:**
  - Public Frontend: `authSlice`, `productSlice`, `categorySlice`, `journalSlice`, `pillarSlice`, `contactSlice`, `newsletterSlice`, `contentSlice`, `settingsSlice`.
  - Admin Dashboard: `adminAuthSlice`, `adminProductSlice`, `adminCategorySlice`, `adminOrderSlice`, `adminCustomerSlice`, `adminJournalSlice`, `adminPillarsSlice`, `adminMediaSlice`, `adminContentSlice`, `adminNewsletterSlice`, `adminContactSlice`, `adminSettingsSlice`.

---

## 11. Axios Architecture
Central configuration in both frontends (`src/config/api.js`):
```javascript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

---

## 12. MongoDB Architecture
Mongoose Models in `Backend/models/`:
- `User`: `name`, `email`, `password` (hashed, `select: false`), `role` (`"USER"` | `"ADMIN"`), `isActive`, `lastLogin`.
- `Product`: `title`, `slug`, `subtitle`, `description`, `price`, `comparePrice`, `category`, `stock`, `images`, `isFeatured`, `isActive`, `tags`.
- `Category`: `name`, `slug`, `description`, `image`, `isActive`.
- `Journal`: `title`, `slug`, `excerpt`, `content`, `category`, `coverImage`, `fontStyle` (`"tejova-editorial"`|`"modern-editorial"`|`"classic-serif"`|`"clean-sans"`), `author`, `readTime`, `publishedAt`, `isFeatured`, `tags`.
- `Pillar`: `title`, `slug`, `description`, `heroImage`, `icon`, `items`, `order`, `isActive`.
- `Order`: `orderNumber`, `user`, `items`, `totalAmount`, `status` (`"Pending"`|`"Processing"`|`"Shipped"`|`"Delivered"`|`"Cancelled"`), `shippingAddress`, `paymentStatus`.
- `ContactMessage`: `name`, `email`, `subject`, `message`, `status` (`"New"`|`"Read"`|`"Replied"`|`"Archived"`).
- `NewsletterSubscriber`: `email`, `isSubscribed`, `subscribedAt`.
- `Media`: `name`, `url`, `publicId`, `format`, `size`, `width`, `height`.
- `Content`: `key`, `title`, `section`, `content`, `image`, `isActive`.
- `Settings`: Singleton configuration (`siteName`, `tagline`, `contactEmail`, `supportPhone`, `socialLinks`, `maintenanceMode`, `currency`).

---

## 13. Cloudinary Architecture
- Memory Storage via Multer: Files parsed into memory buffer without writing to local disk.
- Cloudinary Upload API: Directly uploaded from memory buffer to Cloudinary folder (`tejova/products`, `tejova/media`, etc.).
- Delete API: `cloudinary.v2.uploader.destroy(publicId)` removes assets permanently.

---

## 14. Media Architecture
- Admin users upload files via `/api/media/upload`.
- Express processes request using `uploadSingleImage("file")` middleware.
- Asset details saved to MongoDB `Media` collection.
- Frontend components render images using Cloudinary CDN URLs.

---

## 15. CMS Architecture
- Allows dynamic content updating without code changes.
- Content blocks queried by string key (e.g. `home_hero`, `brand_story`).
- Admin edits text, titles, or imagery via `/admin/content`.

---

## 16. Settings Architecture
- Singleton pattern: System automatically creates initial settings document if none exists.
- Public route `GET /api/settings/public` strips sensitive backend configurations.
- Admin route `GET /api/settings` and `PATCH /api/settings` allow updating site metadata.

---

## 17–22. Domain Feature Architectures
- **Product Architecture:** Supports filtering by category ID/slug, search term regex, and stock status.
- **Journal Architecture:** Published articles ordered by `publishedAt` date descending.
- **Pillars Architecture:** Fixed set of 4 core brand pillars with display order sorting.
- **Newsletter Architecture:** Enforces lowercase unique email constraints.
- **Contact Architecture:** Public submission with status workflow for admin responses.
- **User Account Architecture:** Public registration enforces name, email, password; session maintained via `/api/auth/me`.

---

## 23. API Endpoint Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Guest | Register new user account |
| `POST` | `/api/auth/login` | Public | Guest | Authenticate user & set HTTP-only cookie |
| `POST` | `/api/auth/logout` | Public | Guest/User | Clear authentication cookie |
| `GET` | `/api/auth/me` | Protected | User/Admin | Get current authenticated user details |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/admin/stats` | Protected | Admin | Fetch system analytics & dashboard stats |
| `GET` | `/api/admin/dashboard` | Protected | Admin | Admin authorization sanity check |

### User Management (`/api/users`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/users` | Protected | Admin | List all registered users |
| `GET` | `/api/users/:id` | Protected | Admin | Get user detail by ID |
| `PATCH` | `/api/users/:id` | Protected | Admin | Update user details or active status |
| `DELETE` | `/api/users/:id` | Protected | Admin | Delete user account |

### Products (`/api/products`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/products` | Public | Guest | List active products (supports category & search) |
| `GET` | `/api/products/slug/:slug` | Public | Guest | Get single product by slug |
| `GET` | `/api/products/:id` | Public | Guest | Get single product by ID |
| `POST` | `/api/products` | Protected | Admin | Create product |
| `PATCH` | `/api/products/:id` | Protected | Admin | Update product |
| `DELETE` | `/api/products/:id` | Protected | Admin | Delete product |

### Categories (`/api/categories`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/categories` | Public | Guest | List all active product categories |
| `GET` | `/api/categories/:idOrSlug` | Public | Guest | Get category by ID or slug |
| `POST` | `/api/categories` | Protected | Admin | Create category |
| `PATCH` | `/api/categories/:id` | Protected | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Protected | Admin | Delete category |

### Journal (`/api/journal`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/journal` | Public | Guest | List published journal articles |
| `GET` | `/api/journal/:slug` | Public | Guest | Get journal article detail by slug |
| `POST` | `/api/journal` | Protected | Admin | Create journal article |
| `PATCH` | `/api/journal/:id` | Protected | Admin | Update journal article |
| `DELETE` | `/api/journal/:id` | Protected | Admin | Delete journal article |

### Pillars (`/api/pillars`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/pillars` | Public | Guest | List brand wellness pillars |
| `GET` | `/api/pillars/:idOrSlug` | Public | Guest | Get pillar by ID or slug |
| `POST` | `/api/pillars` | Protected | Admin | Create pillar |
| `PATCH` | `/api/pillars/:id` | Protected | Admin | Update pillar |
| `DELETE` | `/api/pillars/:id` | Protected | Admin | Delete pillar |

### Contact (`/api/contact`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `POST` | `/api/contact` | Public | Guest | Submit contact message |
| `GET` | `/api/contact` | Protected | Admin | List received contact messages |
| `GET` | `/api/contact/:id` | Protected | Admin | Get message detail by ID |
| `PATCH` | `/api/contact/:id` | Protected | Admin | Update contact message status |
| `DELETE` | `/api/contact/:id` | Protected | Admin | Delete contact message |

### Newsletter (`/api/newsletter`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `POST` | `/api/newsletter/subscribe` | Public | Guest | Subscribe email address |
| `POST` | `/api/newsletter/unsubscribe` | Public | Guest | Unsubscribe email address |
| `GET` | `/api/newsletter` | Protected | Admin | List all newsletter subscribers |
| `DELETE` | `/api/newsletter/:id` | Protected | Admin | Delete subscriber |

### CMS Content (`/api/content`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/content` | Public | Guest | List all content blocks |
| `GET` | `/api/content/:key` | Public | Guest | Get single content block by key |
| `POST` | `/api/content` | Protected | Admin | Create content block |
| `PATCH` | `/api/content/:id` | Protected | Admin | Update content block |
| `DELETE` | `/api/content/:id` | Protected | Admin | Delete content block |

### Media Management (`/api/media`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/media` | Protected | Admin | List uploaded media assets |
| `POST` | `/api/media/upload` | Protected | Admin | Upload image file to Cloudinary |
| `DELETE` | `/api/media/delete` | Protected | Admin | Delete media asset from Cloudinary & DB |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/orders` | Protected | Admin | List all customer orders |
| `GET` | `/api/orders/:id` | Protected | Admin | Get order detail by ID |
| `PATCH` | `/api/orders/:id/status` | Protected | Admin | Update order status |

### Settings (`/api/settings`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| `GET` | `/api/settings/public` | Public | Guest | Get safe public site settings |
| `GET` | `/api/settings` | Protected | Admin | Get full system settings |
| `PATCH` | `/api/settings` | Protected | Admin | Update system settings |

---

## 24. Environment Variables Reference
Backend Environment Variables (`Backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tejova
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Public Frontend Environment Variables (`TEJOVA/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

Admin Dashboard Environment Variables (`TEJOVA-Admin-Dashboard/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 25. Security Architecture
- **Bcrypt Hashing:** Passwords hashed with salt factor 10.
- **HTTP-Only Cookies:** Auth token stored exclusively in HTTP-only cookies.
- **No Token Storage:** Zero tokens stored in `localStorage`, `sessionStorage`, or window global variables.
- **Role Isolation:** API routes protected by dual middleware (`protect` + `adminOnly`).
- **CORS Protection:** Express checks request headers against whitelist of authorized domains.

---

## 26. Deployment Architecture
- **Backend:** Node.js Web Service hosted on Render.
- **Database:** MongoDB Atlas Cluster.
- **Media CDN:** Cloudinary.
- **Public Frontend:** Web Service / Static Site hosted on Render (`https://new-folder-2-tejova.onrender.com/`).
- **Admin Dashboard:** Web Service / Static Site hosted on Render (`https://tejova-admin-dashboard.onrender.com/`).

---

## 27. Data Flow
- Standardized REST JSON API data format across all entities.
- Responses follow structure: `{ success: boolean, message?: string, data?: object }`.

---

## 28. Error Handling
- **404 Handler (`middleware/notFoundHandler.js`):** Intercepts unmatched routes and returns standard JSON 404 response.
- **Global Error Handler (`middleware/errorHandler.js`):** Formats uncaught exceptions into clean JSON responses `{ success: false, message: error.message }`.

---

## 29. Current Limitations
- Real-time checkout and payment gateway webhooks are not implemented in the current API version.
- Transactional email dispatch requires configuring an SMTP transport provider (e.g. Nodemailer/SendGrid) in a future phase.
