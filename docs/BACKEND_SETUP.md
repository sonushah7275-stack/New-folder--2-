# TEJOVA — Backend Setup & API Architecture

## 1. Overview

The **TEJOVA Backend** (`Backend/`) is a Node.js RESTful API built on Express and MongoDB. It handles authentication, data models, business controllers, security middleware, health checks, and Cloudinary media processing.

---

## 2. Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` password hashing (salt rounds = 10)
- **Media Upload**: `multer` & Cloudinary v2 SDK (`cloudinary`)
- **CORS & Security**: Configured CORS origin whitelist (`CLIENT_URL`, `ADMIN_URL`)

---

## 3. Database Schemas

- **`User`**: Admin & customer accounts (`name`, `email`, `password` hashed, `role` = `USER`/`ADMIN`, `isActive`).
- **`Journal`**: Editorial articles (`title`, `slug`, `excerpt`, `content` HTML, `coverImage` Cloudinary URL, `fontStyle`, `author`, `category`, `status` = `DRAFT`/`PUBLISHED`, `publishedAt`).
- **`Product`**: E-commerce products (`name`, `slug`, `description`, `price`, `compareAtPrice`, `sku`, `stock`, `images`, `category`, `isFeatured`, `isActive`).
- **`Category`**: Product & article categories (`name`, `slug`, `description`, `image`).
- **`Pillar`**: TEJOVA wellness pillars (`name`, `slug`, `tagline`, `description`, `coverImage`).
- **`Contact`**: Contact form submissions (`name`, `email`, `subject`, `message`, `status`).
- **`Newsletter`**: Email subscribers (`email`, `status`, `subscribedAt`).
- **`Setting`**: Site configuration (`siteName`, `tagline`, `supportEmail`, `contactPhone`, `address`, `socialLinks`, `businessHours`).

---

## 4. Middleware Pipeline

1. **`authMiddleware.js` (`protect`)**: Extracts JWT token from Authorization Bearer header or HTTP-only cookies, verifies token signature, and attaches user object to `req.user`.
2. **`authMiddleware.js` (`adminOnly`)**: Verifies that `req.user.role === 'ADMIN'`.
3. **`uploadMiddleware.js`**: Memory storage configuration using Multer for processing multipart image uploads before streaming to Cloudinary.

---

## 5. Health Check Endpoints

- `GET /health`: Basic operational check. Returns `{ success: true, message: "TEJOVA API is running" }`.
- `GET /api/health`: Standard API health check endpoint.

---

## 6. Local Setup & Execution

### Environment Configuration
Create `.env` in `Backend/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tejova
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Commands

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Check syntax
node --check server.js

# Launch local server
npm run dev # or node server.js
```
