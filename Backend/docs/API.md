# TEJOVA Backend API Documentation

Welcome to the TEJOVA Backend API Documentation. This document details all available RESTful API endpoints, request methods, authentication & authorization requirements, payloads, query parameters, and response formats.

---

## Base URL
- **Local Development:** `http://localhost:5000`
- **Production API:** `https://tejova-backend.onrender.com` (or configured server host)

---

## Authentication & Security
- **Authentication Method:** HTTP-only JWT Cookie named `token`, or `Authorization: Bearer <token>` header.
- **Roles Supported:** `USER` (Customer), `ADMIN` (Administrator).

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "user": {
      "id": "60d5ec49f1a2c80015f8e9a1",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER"
    }
  }
  ```

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "user": {
      "id": "60d5ec49f1a2c80015f8e9a1",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER",
      "isActive": true,
      "lastLogin": "2026-09-19T10:00:00.000Z"
    }
  }
  ```

### 1.3 Logout User
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Auth:** Public / Authenticated
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logout successful."
  }
  ```

### 1.4 Get Current Authenticated User
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Auth:** Protected (`USER` / `ADMIN`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "60d5ec49f1a2c80015f8e9a1",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER",
      "isActive": true,
      "lastLogin": "2026-09-19T10:00:00.000Z",
      "createdAt": "2026-09-19T09:00:00.000Z"
    }
  }
  ```

---

## 2. Admin User Management APIs (`/api/users`)

### 2.1 Get All Users
- **Method:** `GET`
- **Endpoint:** `/api/users`
- **Auth:** Protected (`ADMIN` only)
- **Query Params:** `?page=1&limit=10&search=john&role=USER&isActive=true`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

### 2.2 Get User By ID
- **Method:** `GET`
- **Endpoint:** `/api/users/:id`
- **Auth:** Protected (`ADMIN` only)

### 2.3 Update User
- **Method:** `PATCH`
- **Endpoint:** `/api/users/:id`
- **Auth:** Protected (`ADMIN` only)

### 2.4 Delete User
- **Method:** `DELETE`
- **Endpoint:** `/api/users/:id`
- **Auth:** Protected (`ADMIN` only)

---

## 3. Product APIs (`/api/products`)

### 3.1 Get Products (Public)
- **Method:** `GET`
- **Endpoint:** `/api/products`
- **Auth:** Public
- **Query Params:** `?page=1&limit=10&search=vitality&category=...&featured=true&sort=price-asc`

### 3.2 Get Product By Slug (Public)
- **Method:** `GET`
- **Endpoint:** `/api/products/slug/:slug`

### 3.3 Get Product By ID (Public)
- **Method:** `GET`
- **Endpoint:** `/api/products/:id`

### 3.4 Create Product (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/products`
- **Auth:** Protected (`ADMIN` only)

### 3.5 Update / Delete Product (Admin Only)
- `PATCH /api/products/:id` — Update product details
- `DELETE /api/products/:id` — Delete product

---

## 4. Category APIs (`/api/categories`)

### 4.1 Get Categories (Public)
- `GET /api/categories`
- `GET /api/categories/:idOrSlug`

### 4.2 Manage Categories (Admin Only)
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

---

## 5. Journal APIs (`/api/journal`)

### 5.1 Get Articles (Public)
- `GET /api/journal`
- `GET /api/journal/:slug`

### 5.2 Manage Articles (Admin Only)
- `POST /api/journal`
- `PATCH /api/journal/:id`
- `DELETE /api/journal/:id`

---

## 6. Wellness Pillars APIs (`/api/pillars`)

### 6.1 Get Pillars (Public)
- `GET /api/pillars`
- `GET /api/pillars/:idOrSlug`

### 6.2 Manage Pillars (Admin Only)
- `POST /api/pillars`
- `PATCH /api/pillars/:id`
- `DELETE /api/pillars/:id`

---

## 7. Contact Inquiries APIs (`/api/contact`)

### 7.1 Submit Contact Form (Public)
- `POST /api/contact`

### 7.2 Manage Contact Messages (Admin Only)
- `GET /api/contact`
- `GET /api/contact/:id`
- `PATCH /api/contact/:id`
- `DELETE /api/contact/:id`

---

## 8. Newsletter APIs (`/api/newsletter`)

### 8.1 Subscribe / Unsubscribe (Public)
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`

### 8.2 Manage Subscribers (Admin Only)
- `GET /api/newsletter`
- `DELETE /api/newsletter/:id`

---

## 9. CMS Content APIs (`/api/content`)

### 9.1 Get Content Blocks (Public)
- `GET /api/content`
- `GET /api/content/:key`

### 9.2 Manage Content Blocks (Admin Only)
- `POST /api/content`
- `PATCH /api/content/:id`
- `DELETE /api/content/:id`

---

## 10. Media Upload & Cloudinary APIs (`/api/media`)

### 10.1 Upload Media (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/media/upload`
- **Auth:** Protected (`ADMIN` only)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `file` (Image binary), `folder` (optional: `products`, `journal`, `pillars`, `content`, `general`)
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully.",
    "data": {
      "id": "60d5ec49f1a2c80015f8e9b5",
      "url": "https://res.cloudinary.com/demo/image/upload/v12345678/TEJOVA/products/sample.jpg",
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/v12345678/TEJOVA/products/sample.jpg",
      "publicId": "TEJOVA/products/sample",
      "fileName": "sample.jpg",
      "folder": "products"
    }
  }
  ```

### 10.2 Delete Media (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/media/delete` or `/api/media`
- **Auth:** Protected (`ADMIN` only)
- **Request Body:** `{ "publicId": "TEJOVA/products/sample" }`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Image deleted successfully."
  }
  ```

### 10.3 List Media Assets (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/media`
- **Auth:** Protected (`ADMIN` only)
- **Query Params:** `?page=1&limit=12&folder=products&search=banner`

---

## 11. Pending Modules
- **Orders & E-Commerce:** `ORDERS — FUTURE E-COMMERCE PHASE` (Reserved for Razorpay checkout integration)
