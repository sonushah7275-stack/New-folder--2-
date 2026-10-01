# TEJOVA — REST API Documentation

This document describes the active RESTful API endpoints available in the TEJOVA production backend.

Base URL: `https://new-folder-2-backend.onrender.com/api`

---

## 1. System Health

### `GET /health` & `GET /api/health`
- **Purpose**: System liveness check.
- **Auth**: Public
- **Response**:
  ```json
  {
    "success": true,
    "message": "TEJOVA API is running",
    "timestamp": "2026-09-24T08:59:12.772Z"
  }
  ```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Purpose**: Register a new customer account.
- **Auth**: Public
- **Body**: `{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "SecretPassword123" }`
- **Response**: `{ "success": true, "token": "jwt...", "user": { "_id": "...", "name": "Jane Doe", "email": "..." } }`

### `POST /api/auth/login`
- **Purpose**: Customer login.
- **Auth**: Public
- **Body**: `{ "email": "jane@example.com", "password": "SecretPassword123" }`
- **Response**: `{ "success": true, "token": "jwt...", "user": { ... } }`

### `POST /api/auth/admin-login`
- **Purpose**: Admin Console login.
- **Auth**: Public
- **Body**: `{ "email": "admin@tejova.com", "password": "..." }`
- **Response**: `{ "success": true, "token": "jwt...", "user": { "role": "ADMIN", ... } }`

### `GET /api/auth/me`
- **Purpose**: Retrieve current logged-in user profile.
- **Auth**: Bearer Token or Cookie
- **Response**: `{ "success": true, "data": { ... } }`

---

## 3. Journal / Editorial (`/api/journal`)

### `GET /api/journal`
- **Purpose**: Fetch public journal articles list (or all articles for admin when `?all=true`).
- **Auth**: Public (`all=true` requires Admin auth)
- **Params**: `page`, `limit`, `category`, `search`
- **Response**: `{ "success": true, "data": [ ... ], "pagination": { ... } }`

### `GET /api/journal/:slug`
- **Purpose**: Fetch single journal article by slug.
- **Auth**: Public
- **Response**: `{ "success": true, "data": { "title": "...", "content": "<p>...</p>", "fontStyle": "serif-old-style", ... } }`

### `POST /api/journal`
- **Purpose**: Create a new journal article.
- **Auth**: Admin Bearer Token
- **Body**: `{ "title": "...", "content": "<p>...</p>", "category": "Mindfulness", "fontStyle": "serif-old-style", "coverImage": "https://...", "status": "PUBLISHED" }`
- **Response**: `{ "success": true, "data": { ... } }`

### `PUT /api/journal/:id`
- **Purpose**: Update existing article.
- **Auth**: Admin Bearer Token
- **Body**: `{ "title": "...", "content": "...", "fontStyle": "...", "coverImage": "..." }`
- **Response**: `{ "success": true, "data": { ... } }`

### `DELETE /api/journal/:id`
- **Purpose**: Delete article.
- **Auth**: Admin Bearer Token
- **Response**: `{ "success": true, "message": "Article deleted successfully" }`

---

## 4. Products Catalog (`/api/products`)

### `GET /api/products`
- **Purpose**: List active products.
- **Auth**: Public
- **Response**: `{ "success": true, "data": [ ... ] }`

### `POST /api/products`
- **Purpose**: Create product.
- **Auth**: Admin Bearer Token
- **Response**: `{ "success": true, "data": { ... } }`

### `PUT /api/products/:id` & `DELETE /api/products/:id`
- **Purpose**: Modify or remove product.
- **Auth**: Admin Bearer Token

---

## 5. Media Upload (`/api/media`)

### `POST /api/media/upload`
- **Purpose**: Upload image file directly to Cloudinary.
- **Auth**: Admin Bearer Token
- **Form-Data**: `file` (Binary image file), `folder` (e.g. `journal/content`, `pillars`, `products`)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "TEJOVA/journal/content/sample"
    }
  }
  ```

---

## 6. Pillars & Settings (`/api/pillars`, `/api/settings`)

### `GET /api/pillars`
- **Purpose**: Fetch TEJOVA wellness pillars list.
- **Auth**: Public

### `GET /api/settings/public`
- **Purpose**: Fetch public site settings (site name, support contact, hours).
- **Auth**: Public
