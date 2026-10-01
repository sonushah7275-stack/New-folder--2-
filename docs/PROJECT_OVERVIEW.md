# TEJOVA — Project Overview

## 1. Executive Summary

**TEJOVA** ("Expand Your Light") is a premium, modern, nature-inspired wellness, lifestyle, and conscious-living platform. The system consists of a public-facing e-commerce & editorial website, a dedicated administrative dashboard, and a robust RESTful API backend backed by MongoDB and Cloudinary media storage.

The platform has undergone complete development, testing, and production deployment. The current production release is frozen and verified at Git commit `665004ee`.

---

## 2. Platform Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       TEJOVA Public Frontend            │
                               │  (https://new-folder-2-tejova.onrender) │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────┐  HTTP / REST  ┌────────────────────────────────────────┐
│        TEJOVA Admin Dashboard          ├──────────────►│         TEJOVA Backend API             │
│ (https://tejova-admin-dashboard.onrender)│              │  (https://new-folder-2-backend.onrender)│
└────────────────────────────────────────┘              └───────────┬─────────────────┬──────────┘
                                                                    │                 │
                                                                    ▼                 ▼
                                                            ┌───────────────┐ ┌───────────────┐
                                                            │ MongoDB Atlas │ │  Cloudinary   │
                                                            │   Database    │ │ Media Storage │
                                                            └───────────────┘ └───────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1 Public Frontend (`TEJOVA/`)
- **Framework**: React 18 with Vite build tooling.
- **Styling**: Tailwind CSS with custom editorial brand tokens (`#0A2342` Midnight Blue, `#B87333` Copper, `#D4AF37` Gold, `#FAF9F6` Off-White).
- **State Management**: Redux Toolkit for global user auth, product catalogs, and journal state.
- **Key Views**: Homepage, Vitality, Nourishment, Lifestyle, Longevity, Products catalog, Product Detail, Journal Editorial, Article Detail, About, Contact, Login, Register.

### 3.2 Admin Dashboard (`TEJOVA-Admin-Dashboard/`)
- **Framework**: React 18 with Vite.
- **Authentication**: Bearer Token / JWT authentication with protected route guards.
- **Key Modules**: Dashboard Analytics, Journal Article Manager with Tiptap Editor, Products Manager, Categories Manager, Pillars Manager, Newsletter Subscribers, Contact Inquiries, Content Pages, and System Settings.

### 3.3 Backend API (`Backend/`)
- **Runtime**: Node.js & Express RESTful API.
- **Database**: MongoDB with Mongoose ODM models (`User`, `Product`, `Category`, `Journal`, `Pillar`, `Setting`, `Contact`, `Newsletter`).
- **Media Upload**: Multer + Cloudinary SDK for direct cloud image uploads.
- **Authentication**: `bcryptjs` password hashing + JWT tokens.

---

## 4. Production Deployment URLs

- **Public Frontend**: [https://new-folder-2-tejova.onrender.com/](https://new-folder-2-tejova.onrender.com/)
- **Admin Dashboard**: [https://tejova-admin-dashboard.onrender.com/](https://tejova-admin-dashboard.onrender.com/)
- **Backend API**: [https://new-folder-2-backend.onrender.com/](https://new-folder-2-backend.onrender.com/)
- **Health Check**: [https://new-folder-2-backend.onrender.com/health](https://new-folder-2-backend.onrender.com/health)

---

## 5. Repository Directory Structure

```
New folder (2)/
├── Backend/                    # Node.js & Express REST API
│   ├── config/                 # DB & Cloudinary configuration
│   ├── controllers/            # Route business logic handlers
│   ├── middleware/             # Auth & upload middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route definitions
│   ├── services/               # Cloudinary & email services
│   └── server.js               # Application entry point
├── TEJOVA/                     # Public Frontend React App
│   ├── public/                 # Static assets & favicons
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   ├── pages/              # Route view pages
│   │   ├── Redux/              # Redux slices & store
│   │   └── index.css           # Tailwind theme styles
│   └── index.html              # HTML template & Google Fonts
├── TEJOVA-Admin-Dashboard/     # Admin Management Console
│   ├── src/
│   │   ├── admin/components/  # Tiptap RichTextEditor & UI elements
│   │   ├── admin/pages/       # Admin management views
│   │   └── Redux/             # Admin Redux slices
│   └── index.html              # HTML template & Google Fonts
└── docs/                       # Project Documentation & Guides
```
